// Shared field validation & anti-gibberish (§11.4) + email syntax (§11.2).
// Same code runs in the browser (instant feedback) and in the Worker (authoritative).

import { moderateText } from "./blocklist";
import { isDisposableDomain } from "./disposable";
import {
  DETAILS_MIN_LENGTH,
  LENGTH_CAPS,
  MAX_LINKS_PER_FIELD,
} from "./constants";
import type { IntakeAnswers, VerifyReason } from "./types";

export interface CheckResult {
  ok: boolean;
  reason?:
    | "moderation"
    | "gibberish"
    | "too_short"
    | "too_long"
    | "bad_url"
    | "too_many_links"
    | "missing";
}

const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function checkEmailSyntax(email: string): boolean {
  const value = email.trim();
  if (!value || value.length > LENGTH_CAPS.email) return false;
  if (!EMAIL_RE.test(value)) return false;
  if (value.includes("..")) return false;
  const [local, rest] = value.split("@");
  if (!local || !rest) return false;
  if (local.length > 64) return false;
  const labels = rest.split(".");
  if (labels.some((l) => l.length === 0 || l.length > 63)) return false;
  const tld = labels[labels.length - 1];
  if (!/^[a-z]{2,}$/i.test(tld)) return false;
  return true;
}

export function emailDomain(email: string): string {
  return email.trim().toLowerCase().split("@")[1] ?? "";
}

/** Syntax + disposable only — the MX half of verification lives server-side (§11.3). */
export function checkEmailLocal(email: string): {
  ok: boolean;
  reason?: VerifyReason;
} {
  const value = email.trim();
  if (!checkEmailSyntax(value)) return { ok: false, reason: "syntax" };
  if (isDisposableDomain(emailDomain(value)))
    return { ok: false, reason: "disposable" };
  return { ok: true };
}

/** Free-text checks: required → moderation → length → (details: anti-gibberish).
 *  `allowEmpty` marks the optional Skip steps (design / extra notes). */
export function checkText(
  value: string,
  opts: {
    allowEmpty?: boolean;
    field: keyof IntakeAnswers;
    gibberishCheck?: boolean;
  },
): CheckResult {
  const v = value.trim();
  if (!v) return opts.allowEmpty ? { ok: true } : { ok: false, reason: "missing" };

  const cap = (LENGTH_CAPS as Partial<Record<keyof IntakeAnswers, number>>)[
    opts.field
  ];
  if (cap && v.length > cap) return { ok: false, reason: "too_long" };

  const moderation = moderateText(v);
  if (!moderation.ok) return { ok: false, reason: "moderation" };

  if (opts.gibberishCheck) {
    if (v.length < DETAILS_MIN_LENGTH) return { ok: false, reason: "too_short" };
    if (isGibberish(v)) return { ok: false, reason: "gibberish" };
  }
  return { ok: true };
}

/** Anti-gibberish: reject >60% repeated characters/tokens, a single repeated
 *  word, or an answer made of only a couple of identical tokens. */
export function isGibberish(value: string): boolean {
  const v = value.trim().toLowerCase();

  // (a) repeated tokens: all-identical answer, or ≤40% unique across ≥3 tokens
  const tokens = v.split(/\s+/).filter(Boolean);
  if (tokens.length >= 2) {
    const unique = new Set(tokens).size;
    if (unique === 1) return true;
    if (tokens.length >= 3 && unique / tokens.length <= 0.4) return true;
  }

  // (b) >60% of alphanumeric characters are the same character
  const chars = v.replace(/[^a-z0-9]/g, "");
  if (chars.length >= 6) {
    const counts = new Map<string, number>();
    for (const ch of chars) counts.set(ch, (counts.get(ch) ?? 0) + 1);
    const max = Math.max(...counts.values());
    if (max / chars.length > 0.6) return true;
  }

  return false;
}

/** URL field check (§11.4): tokens starting with `http` must parse as
 *  http(s) URLs; max 3 links. Bare domains are accepted as plain text. */
export function checkUrlField(value: string): CheckResult {
  const v = value.trim();
  if (!v) return { ok: true }; // optional field handled by caller

  const tokens = v.split(/\s+/);
  let links = 0;
  for (const token of tokens) {
    // Any token starting with "http" must parse as a valid http(s) URL (§11.4).
    if (!/^https?/i.test(token)) continue;
    links += 1;
    try {
      const u = new URL(token);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        return { ok: false, reason: "bad_url" };
      }
      if (!u.hostname.includes(".")) return { ok: false, reason: "bad_url" };
    } catch {
      return { ok: false, reason: "bad_url" };
    }
  }
  if (links > MAX_LINKS_PER_FIELD) return { ok: false, reason: "too_many_links" };
  return { ok: true };
}
