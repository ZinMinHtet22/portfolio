// Portfolio intake Worker — verification gatekeeper + Telegram relay.
// Routes:
//   POST /verify-email  {email}            → {ok:true} | 422 {ok:false,reason}
//   POST /intake        {all fields + brief + _gotcha}
//     → re-verifies EVERYTHING server-side (never trust the client),
//       moderates all text fields, then:
//     → 200 {ok:true}            accepted → Telegram sendMessage + sendDocument
//     → 422 {ok:false,reason}    rejected → nothing delivered anywhere
//     → 502 {ok:false,reason:"relay"}  Telegram call failed
// CORS: only the production origin + localhost:3000. OPTIONS preflight handled.
// Secrets (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID) live only in Worker secrets.

import { BUDGETS, LENGTH_CAPS, PROJECT_TYPES, TIMELINES, TOTAL_BODY_CAP } from "../../shared/intake/constants";
import { compileBrief, briefFilename } from "../../shared/intake/brief";
import {
  checkEmailLocal,
  checkText,
  checkUrlField,
  emailDomain,
} from "../../shared/intake/validate";
import type { IntakeAnswers, IntakeResponse, VerifyEmailResponse } from "../../shared/intake/types";

const ALLOWED_ORIGINS = new Set([
  "https://jeffery-portfolio.pages.dev",
  "http://localhost:3000",
]);

const DNS_DOH = "https://cloudflare-dns.com/dns-query";

interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(
  body: unknown,
  status: number,
  origin: string | null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}

// ---------- DNS MX verification (§11.3) ----------

interface DohAnswer {
  type: number;
  data: string;
}

async function dohLookup(
  name: string,
  type: "MX" | "A" | "AAAA",
): Promise<{ status: number; answers: DohAnswer[] } | null> {
  try {
    const res = await fetch(
      `${DNS_DOH}?name=${encodeURIComponent(name)}&type=${type}`,
      { headers: { Accept: "application/dns-json" } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      Status: number;
      Answer?: DohAnswer[];
    };
    return { status: data.Status, answers: data.Answer ?? [] };
  } catch {
    return null; // network failure — caller decides (infra error, not a rejection)
  }
}

type MxOutcome = "pass" | "reject" | "infra";

/** Pass rule: ≥1 real MX → pass. Explicit null MX (MX 0 .) → reject.
 *  No MX: A/AAAA exists → pass (SMTP implicit-MX fallback); else reject. */
export async function checkMx(domain: string): Promise<MxOutcome> {
  const mx = await dohLookup(domain, "MX");
  if (!mx) return "infra";
  if (mx.status === 3) return "reject"; // NXDOMAIN
  if (mx.status !== 0) return "infra";

  if (mx.answers.length > 0) {
    // DoH presents MX as "<pref> <exchange>" (e.g. "0 ." or "10 mail.x.com").
    const real = mx.answers.some((a) => {
      const exchange = (a.data ?? "").trim().replace(/^\d+\s+/, "");
      return exchange !== "" && exchange !== ".";
    });
    return real ? "pass" : "reject"; // all null MX → reject
  }

  const a = await dohLookup(domain, "A");
  if (!a) return "infra";
  if (a.status === 3) return "reject";
  if (a.answers.length > 0) return "pass";

  const aaaa = await dohLookup(domain, "AAAA");
  if (!aaaa) return "infra";
  if (aaaa.status === 3) return "reject";
  return aaaa.answers.length > 0 ? "pass" : "reject";
}

// ---------- Telegram (token only from secrets) ----------

async function telegramApi(
  env: Env,
  method: string,
  payload: Record<string, unknown>,
): Promise<boolean> {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, ...payload }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function telegramSendDocument(
  env: Env,
  filename: string,
  brief: string,
  caption: string,
): Promise<boolean> {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  try {
    const fd = new FormData();
    fd.append("chat_id", chatId);
    fd.append("document", new Blob([brief], { type: "text/markdown" }), filename);
    fd.append("caption", caption);
    const res = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
      method: "POST",
      body: fd,
    });
    return res.ok;
  } catch {
    return false;
  }
}

function leadMessage(a: IntakeAnswers): string {
  const details = a.project_details.trim().replace(/\s+/g, " ");
  const excerpt = details.length > 240 ? `${details.slice(0, 240)}…` : details;
  return [
    "🆕 New project lead",
    "",
    `Type: ${a.project_type}`,
    `Budget: ${a.budget}`,
    `Timeline: ${a.timeline}`,
    `Name: ${a.name}`,
    `Email: ${a.email}`,
    "",
    `Details: ${excerpt}`,
  ].join("\n");
}

// ---------- Handlers ----------

async function handleVerifyEmail(
  body: unknown,
  origin: string | null,
): Promise<Response> {
  const email = typeof (body as { email?: unknown })?.email === "string"
    ? ((body as { email: string }).email ?? "").trim()
    : "";

  if (!email) {
    return json({ ok: false, reason: "syntax" } satisfies VerifyEmailResponse, 422, origin);
  }

  const local = checkEmailLocal(email);
  if (!local.ok) {
    return json({ ok: false, reason: local.reason } satisfies VerifyEmailResponse, 422, origin);
  }

  const mx = await checkMx(emailDomain(email));
  if (mx === "reject") {
    return json({ ok: false, reason: "no_mx" } satisfies VerifyEmailResponse, 422, origin);
  }
  if (mx === "infra") {
    // Infrastructure failure is NOT a rejection — 5xx lets the frontend
    // fall back gracefully instead of re-asking forever.
    return json({ ok: false, reason: "no_mx" }, 502, origin);
  }

  return json({ ok: true } satisfies VerifyEmailResponse, 200, origin);
}

function validateIntake(raw: Record<string, unknown>): {
  ok: boolean;
  answers?: IntakeAnswers;
  reason?: IntakeResponse["reason"];
  field?: IntakeResponse["field"];
} {
  const str = (k: string): string =>
    typeof raw[k] === "string" ? (raw[k] as string).trim() : "";

  const answers: IntakeAnswers = {
    name: str("name"),
    email: str("email"),
    project_type: str("project_type"),
    project_details: str("project_details"),
    design_preferences: str("design_preferences"),
    timeline: str("timeline"),
    budget: str("budget"),
    extra_notes: str("extra_notes"),
  };

  // Chip options must come from the shared lists (never trust the client).
  if (!(PROJECT_TYPES as readonly string[]).includes(answers.project_type))
    return { ok: false, reason: "bad_option", field: "project_type" };
  if (!(TIMELINES as readonly string[]).includes(answers.timeline))
    return { ok: false, reason: "bad_option", field: "timeline" };
  if (!(BUDGETS as readonly string[]).includes(answers.budget))
    return { ok: false, reason: "bad_option", field: "budget" };

  // Name
  const nameCheck = checkText(answers.name, { field: "name" });
  if (!nameCheck.ok) return { ok: false, reason: nameCheck.reason, field: "name" };
  if (answers.name.length > LENGTH_CAPS.name)
    return { ok: false, reason: "too_long", field: "name" };

  // Project details (required, ≥10 chars, anti-gibberish)
  const detailsCheck = checkText(answers.project_details, {
    field: "project_details",
    gibberishCheck: true,
  });
  if (!detailsCheck.ok)
    return { ok: false, reason: detailsCheck.reason, field: "project_details" };

  // Design preferences (optional; URL validation)
  const designCheck = checkText(answers.design_preferences, {
    field: "design_preferences",
    allowEmpty: true,
  });
  if (!designCheck.ok)
    return { ok: false, reason: designCheck.reason, field: "design_preferences" };
  const urlCheck = checkUrlField(answers.design_preferences);
  if (!urlCheck.ok)
    return { ok: false, reason: urlCheck.reason, field: "design_preferences" };

  // Extra notes (optional, moderation + length only)
  const extraCheck = checkText(answers.extra_notes, {
    field: "extra_notes",
    allowEmpty: true,
  });
  if (!extraCheck.ok)
    return { ok: false, reason: extraCheck.reason, field: "extra_notes" };

  // Email: syntax + disposable (client already asked; re-verify here)
  const emailCheck = checkEmailLocal(answers.email);
  if (!emailCheck.ok)
    return { ok: false, reason: emailCheck.reason, field: "email" };

  return { ok: true, answers };
}

async function handleIntake(
  raw: unknown,
  origin: string | null,
  env: Env,
): Promise<Response> {
  if (typeof raw !== "object" || raw === null) {
    return json({ ok: false, reason: "missing" } satisfies IntakeResponse, 422, origin);
  }
  const body = raw as Record<string, unknown>;

  // Honeypot — a real visitor never sees this field.
  if (typeof body._gotcha === "string" && body._gotcha.trim() !== "") {
    return json({ ok: false, reason: "spam", field: "_gotcha" } satisfies IntakeResponse, 422, origin);
  }

  const result = validateIntake(body);
  if (!result.ok || !result.answers) {
    return json(
      { ok: false, reason: result.reason, field: result.field } satisfies IntakeResponse,
      422,
      origin,
    );
  }
  const answers = result.answers;

  // Server-side MX check (authoritative).
  const mx = await checkMx(emailDomain(answers.email));
  if (mx === "reject") {
    return json({ ok: false, reason: "no_mx", field: "email" } satisfies IntakeResponse, 422, origin);
  }
  if (mx === "infra") {
    return json({ ok: false, reason: "relay" } satisfies IntakeResponse, 502, origin);
  }

  const brief =
    typeof body.brief === "string" && body.brief.trim()
      ? (body.brief as string)
      : compileBrief(answers, { verifiedLine: "domain MX confirmed · not a disposable address" });

  // Telegram: summary message, then the .md file.
  const sent = await telegramApi(env, "sendMessage", {
    text: leadMessage(answers),
  });
  if (!sent) {
    return json({ ok: false, reason: "relay" } satisfies IntakeResponse, 502, origin);
  }
  const docSent = await telegramSendDocument(
    env,
    briefFilename(answers.name),
    brief,
    `Full brief — ${answers.name}`,
  );
  if (!docSent) {
    return json({ ok: false, reason: "relay" } satisfies IntakeResponse, 502, origin);
  }

  return json({ ok: true } satisfies IntakeResponse, 200, origin);
}

const workerHandler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") {
      return json({ ok: false, reason: "missing" }, 405, origin);
    }

    const url = new URL(request.url);
    if (url.pathname.endsWith("/verify-email")) {
      if (request.headers.get("Content-Length") &&
          Number(request.headers.get("Content-Length")) > 4 * 1024) {
        return json({ ok: false, reason: "syntax" }, 413, origin);
      }
      let raw: unknown;
      try {
        raw = await request.json();
      } catch {
        return json({ ok: false, reason: "syntax" } satisfies VerifyEmailResponse, 422, origin);
      }
      return handleVerifyEmail(raw, origin);
    }

    if (url.pathname.endsWith("/intake")) {
      const len = Number(request.headers.get("Content-Length") ?? "0");
      if (len > TOTAL_BODY_CAP) {
        return json({ ok: false, reason: "too_long" } satisfies IntakeResponse, 413, origin);
      }
      let raw: unknown;
      try {
        raw = await request.json();
      } catch {
        return json({ ok: false, reason: "missing" } satisfies IntakeResponse, 422, origin);
      }
      return handleIntake(raw, origin, env);
    }

    return json({ ok: false, reason: "missing" }, 404, origin);
  },
};

export default workerHandler;
