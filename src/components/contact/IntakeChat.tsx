"use client";

// Project intake chat — a scripted, rule-based flow (no AI) inside ContactPanel.
// Client-side moderation/verification gives instant feedback; the Worker is the
// authoritative gatekeeper at send time. Progress persists in sessionStorage only.

import { useCallback, useEffect, useRef, useState } from "react";
import { BUDGETS, PROJECT_TYPES, TIMELINES, LENGTH_CAPS } from "@shared/intake/constants";
import { checkEmailLocal, checkText, checkUrlField } from "@shared/intake/validate";
import { compileBrief, briefFilename } from "@shared/intake/brief";
import type { IntakeAnswers, VerifyReason } from "@shared/intake/types";
import { cn } from "@/lib/utils";

const WORKER_URL = process.env.NEXT_PUBLIC_INTAKE_WORKER_URL;
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
const STORAGE_KEY = "zin-intake-progress";

const EMPTY: IntakeAnswers = {
  name: "",
  email: "",
  project_type: "",
  project_details: "",
  design_preferences: "",
  timeline: "",
  budget: "",
  extra_notes: "",
};

const INTRO =
  "Hi, I'm Zin's intake assistant — I'll ask a few quick questions and send him a tidy project brief.";

const QUESTIONS: Record<number, string> = {
  1: "What kind of project is it?",
  2: "Tell me about it — what should it do? List the must-have features.",
  3: "Any design style you like, or reference sites/links?",
  4: "When do you need it?",
  5: "What budget have you set aside for this?",
  6: "Anything else I should pass on?",
  7: "Your name?",
  8: "And the best email to reach you?",
};

const STEP_FIELD: Record<number, keyof IntakeAnswers> = {
  1: "project_type",
  2: "project_details",
  3: "design_preferences",
  4: "timeline",
  5: "budget",
  6: "extra_notes",
  7: "name",
  8: "email",
};

const FIELD_STEP: Record<keyof IntakeAnswers, number> = {
  project_type: 1,
  project_details: 2,
  design_preferences: 3,
  timeline: 4,
  budget: 5,
  extra_notes: 6,
  name: 7,
  email: 8,
};

const MSG = {
  strike:
    "I can only help with project enquiries — let's keep it about your project. Could you rephrase that?",
  strikeEnd:
    "I'll have to stop the intake here. You can reach Zin directly through the Message tab.",
  details: "Could you add a little more detail? Even one full sentence helps.",
  missing: "That one's needed — go ahead when you're ready.",
  badUrl: "That link doesn't look right — please fix it or remove it.",
  tooManyLinks: "Please keep it to three links or fewer.",
  tooLong: "That answer is a little long — could you shorten it?",
  syntax: "That email doesn't look quite right — could you check it?",
  disposable:
    "That looks like a temporary email address — please use a permanent one so Zin can actually reply to you.",
  noMx:
    "That email domain doesn't appear able to receive email — could you double-check it?",
  sendModeration:
    "That wording isn't something I can pass on — let's keep it about your project.",
};

type Msg = { id: number; from: "bot" | "user"; text: string };
type Awaiting =
  | null
  | { step: number; kind: "chips" | "text" | "email" | "textSkip" }
  | { step: 9; kind: "review" };

type Saved = {
  answers: IntakeAnswers;
  step: number;
  strikes: number;
  pendingReturn: boolean;
  emailVerified: "mx" | "skipped" | null;
};

let msgId = 0;

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const desktopPointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches;

export function IntakeChat({
  onSwitchToMessage,
}: {
  onSwitchToMessage?: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [answers, setAnswers] = useState<IntakeAnswers>(EMPTY);
  const [step, setStep] = useState(1);
  const [strikes, setStrikes] = useState(0);
  const [pendingReturn, setPendingReturn] = useState(false);
  const [emailVerified, setEmailVerified] = useState<"mx" | "skipped" | null>(null);
  const [awaiting, setAwaiting] = useState<Awaiting>(null);
  const [draft, setDraft] = useState("");
  const [resumeOffer, setResumeOffer] = useState<Saved | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<"active" | "ended" | "done">("active");
  const [emailChecking, setEmailChecking] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const startedRef = useRef(false);
  const stepRef = useRef(step);
  stepRef.current = step;

  // ---------- message helpers ----------

  const addBot = useCallback((text: string) => {
    setMessages((m) => [...m, { id: ++msgId, from: "bot", text }]);
  }, []);

  const botSay = useCallback(
    (text: string, delay = 400): Promise<void> =>
      new Promise((resolve) => {
        setTyping(true);
        window.setTimeout(
          () => {
            setTyping(false);
            addBot(text);
            resolve();
          },
          reduced() ? 0 : delay,
        );
      }),
    [addBot],
  );

  const addUser = useCallback((text: string) => {
    setMessages((m) => [...m, { id: ++msgId, from: "user", text }]);
  }, []);

  const ask = useCallback(
    async (target: number, opts?: { intro?: boolean }) => {
      setStep(target);
      setDraft("");
      if (target >= 1 && target <= 8) {
        if (opts?.intro) await botSay(INTRO);
        await botSay(QUESTIONS[target]);
        setAwaiting({
          step: target,
          kind:
            target === 1 || target === 4 || target === 5
              ? "chips"
              : target === 3 || target === 6
                ? "textSkip"
                : target === 8
                  ? "email"
                  : "text",
        });
      } else if (target === 9) {
        await botSay("Here's your brief — give it a look, then send it to Zin.");
        setAwaiting({ step: 9, kind: "review" });
      }
    },
    [botSay],
  );

  // ---------- persistence ----------

  useEffect(() => {
    if (!hydrated || phase !== "active" || step >= 10) return;
    const saved: Saved = {
      answers,
      step,
      strikes,
      pendingReturn,
      emailVerified,
    };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      /* storage unavailable — flow still works, just no resume */
    }
  }, [hydrated, answers, step, strikes, pendingReturn, emailVerified, phase]);

  const clearProgress = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // ---------- start / resume ----------

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let saved: Saved | null = null;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Saved;
        if (parsed && parsed.answers && parsed.step >= 1 && parsed.step <= 9) {
          saved = parsed;
        }
      }
    } catch {
      /* corrupted save — start fresh */
    }

    if (saved) {
      setResumeOffer(saved);
      addBot(
        "Welcome back — I saved your progress. Continue where you left off, or start over?",
      );
    } else {
      void ask(1, { intro: true });
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto-scroll + focus
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, awaiting, resumeOffer]);

  useEffect(() => {
    if (!awaiting || typing || !desktopPointer()) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [awaiting, typing]);

  // ---------- strikes ----------

  const applyModeration = useCallback(async (): Promise<void> => {
    const next = strikes + 1;
    setStrikes(next);
    setAwaiting(null);
    if (next >= 3) {
      setPhase("ended");
      clearProgress();
      await botSay(MSG.strikeEnd);
      return;
    }
    await botSay(MSG.strike);
    await ask(stepRef.current); // re-ask the same step
  }, [strikes, ask, botSay, clearProgress]);

  // ---------- validation per step ----------

  const validate = (
    target: number,
    raw: string,
  ):
    | { ok: true; value: string }
    | { ok: false; moderation: boolean; msg: string } => {
    const value = raw.trim();

    if (target === 1 || target === 4 || target === 5) {
      const list =
        target === 1 ? PROJECT_TYPES : target === 4 ? TIMELINES : BUDGETS;
      const ok = (list as readonly string[]).some(
        (o) => o.toLowerCase() === value.toLowerCase(),
      );
      if (!ok) return { ok: false, moderation: false, msg: MSG.missing };
      const match = (list as readonly string[]).find(
        (o) => o.toLowerCase() === value.toLowerCase(),
      );
      return { ok: true, value: match ?? value };
    }

    if (target === 2) {
      const check = checkText(value, {
        field: "project_details",
        gibberishCheck: true,
      });
      if (check.ok) return { ok: true, value };
      if (check.reason === "moderation")
        return { ok: false, moderation: true, msg: MSG.strike };
      if (check.reason === "too_long")
        return {
          ok: false,
          moderation: false,
          msg: `${MSG.tooLong} (max ${LENGTH_CAPS.project_details} characters)`,
        };
      return { ok: false, moderation: false, msg: MSG.details };
    }

    if (target === 3) {
      if (!value) return { ok: true, value: "" }; // Skip
      const check = checkText(value, {
        field: "design_preferences",
        allowEmpty: true,
      });
      if (check.ok) {
        const url = checkUrlField(value);
        if (url.ok) return { ok: true, value };
        return {
          ok: false,
          moderation: false,
          msg: url.reason === "too_many_links" ? MSG.tooManyLinks : MSG.badUrl,
        };
      }
      if (check.reason === "moderation")
        return { ok: false, moderation: true, msg: MSG.strike };
      return { ok: false, moderation: false, msg: MSG.tooLong };
    }

    if (target === 6) {
      if (!value) return { ok: true, value: "" }; // Skip
      const check = checkText(value, { field: "extra_notes", allowEmpty: true });
      if (check.ok) return { ok: true, value };
      if (check.reason === "moderation")
        return { ok: false, moderation: true, msg: MSG.strike };
      return { ok: false, moderation: false, msg: MSG.tooLong };
    }

    if (target === 7) {
      const check = checkText(value, { field: "name" });
      if (check.ok) return { ok: true, value };
      if (check.reason === "moderation")
        return { ok: false, moderation: true, msg: MSG.strike };
      return { ok: false, moderation: false, msg: MSG.tooLong };
    }

    return { ok: true, value };
  };

  // ---------- email verification (step 8) ----------

  const verifyThenAdvance = async (email: string) => {
    const local = checkEmailLocal(email);
    if (!local.ok) {
      await botSay(reasonMessage(local.reason));
      await ask(8);
      return;
    }

    if (!WORKER_URL) {
      // Verification off (env unset) → proceed; send stage flags [Unverified].
      setEmailVerified(null);
      finishAnswer(8, email);
      return;
    }

    setEmailChecking(true);
    try {
      const res = await fetch(`${WORKER_URL}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setEmailVerified("mx");
        setEmailChecking(false);
        finishAnswer(8, email);
        return;
      }
      setEmailChecking(false);
      if (res.status >= 500) {
        // Infra failure is not a rejection — proceed, send stage flags it.
        setEmailVerified("skipped");
        finishAnswer(8, email);
        return;
      }
      let reason: VerifyReason | undefined;
      try {
        reason = ((await res.json()) as { reason?: VerifyReason }).reason;
      } catch {
        reason = "syntax";
      }
      await botSay(reasonMessage(reason));
      await ask(8);
    } catch {
      setEmailChecking(false);
      setEmailVerified("skipped");
      finishAnswer(8, email);
    }
  };

  const reasonMessage = (reason?: VerifyReason) =>
    reason === "disposable"
      ? MSG.disposable
      : reason === "no_mx"
        ? MSG.noMx
        : MSG.syntax;

  // ---------- answer routing ----------

  const finishAnswer = (target: number, value: string) => {
    const field = STEP_FIELD[target];
    setAnswers((prev) => ({ ...prev, [field]: value }));
    if (pendingReturn) {
      setPendingReturn(false);
      void ask(9);
    } else if (target === 8) {
      void ask(9);
    } else {
      void ask(target + 1);
    }
  };

  const handleSubmit = async (raw: string, display?: string) => {
    if (!awaiting || awaiting.step >= 9 || emailChecking) return;
    const target = awaiting.step;
    setAwaiting(null);
    addUser(display ?? (raw.trim() || "—"));

    const result = validate(target, raw);
    if (!result.ok) {
      if (result.moderation) {
        await applyModeration();
        return;
      }
      await botSay(result.msg);
      await ask(target);
      return;
    }

    if (target === 8) {
      await verifyThenAdvance(result.value);
      return;
    }
    finishAnswer(target, result.value);
  };

  const handleChip = (value: string) => {
    void handleSubmit(value, value);
  };

  const handleSkip = () => {
    void handleSubmit("", "Skipped");
  };

  // ---------- resume / restart ----------

  const doResume = async () => {
    const saved = resumeOffer;
    if (!saved) return;
    setResumeOffer(null);
    setAnswers(saved.answers);
    setStrikes(saved.strikes);
    setPendingReturn(saved.pendingReturn);
    setEmailVerified(saved.emailVerified);
    await ask(saved.step);
  };

  const doStartOver = async () => {
    setResumeOffer(null);
    clearProgress();
    setAnswers(EMPTY);
    setStrikes(0);
    setPendingReturn(false);
    setEmailVerified(null);
    setPhase("active");
    setSendError(null);
    setMessages([]);
    await ask(1, { intro: true });
  };

  const editField = (target: number) => {
    if (sending) return;
    setAwaiting(null);
    setPendingReturn(true);
    void (async () => {
      setStep(target);
      setDraft("");
      await botSay("Sure — update this part:");
      await botSay(QUESTIONS[target]);
      setAwaiting({
        step: target,
        kind:
          target === 1 || target === 4 || target === 5
            ? "chips"
            : target === 3 || target === 6
              ? "textSkip"
              : target === 8
                ? "email"
                : "text",
      });
    })();
  };

  // ---------- send ----------

  const verifiedLine = () =>
    emailVerified === "mx"
      ? "domain MX confirmed · not a disposable address"
      : "skipped — verification service unreachable";

  const buildBrief = () => compileBrief(answers, { verifiedLine: verifiedLine() });

  const subject = (unverified: boolean) =>
    `${unverified ? "[Unverified] " : ""}New project intake — ${answers.project_type} — ${answers.name}`;

  const formspreeBody = (unverified: boolean) => ({
    _replyto: answers.email,
    email: answers.email,
    name: answers.name,
    _subject: subject(unverified),
    project_type: answers.project_type,
    project_details: answers.project_details,
    design_preferences: answers.design_preferences || "—",
    timeline: answers.timeline,
    budget: answers.budget,
    extra_notes: answers.extra_notes || "—",
    brief: buildBrief(),
    _gotcha: "",
  });

  const sendToFormspree = async (unverified: boolean): Promise<boolean> => {
    if (!FORMSPREE_ID) return false;
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formspreeBody(unverified)),
    });
    return res.ok;
  };

  const gotoStep = async (
    target: number,
    msg: string,
  ) => {
    await botSay(msg);
    if (pendingReturn) setPendingReturn(false);
    await ask(target);
  };

  const handleSend = async () => {
    if (sending) return;
    setSending(true);
    setSendError(null);

    try {
      // --- Worker first (gatekeeper) ---
      if (WORKER_URL) {
        let workerOk = false;
        let rejected: { reason?: string; field?: string } | null = null;

        try {
          const res = await fetch(`${WORKER_URL}/intake`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...answers, brief: buildBrief(), _gotcha: "" }),
          });
          if (res.ok) {
            workerOk = true;
          } else if (res.status < 500) {
            // 4xx = authoritative rejection — nothing was delivered anywhere.
            try {
              rejected = (await res.json()) as {
                reason?: string;
                field?: string;
              };
            } catch {
              rejected = { reason: "missing" };
            }
          }
          // 5xx = relay/infra failure → falls through to Formspree-only
        } catch {
          // unreachable — not a rejection; falls through
        }

        if (rejected) {
          // Nothing was delivered — send the visitor back to the offending step.
          const field = (rejected.field ?? "project_details") as keyof IntakeAnswers;
          const target = FIELD_STEP[field] ?? 2;
          const msg =
            rejected.reason === "moderation"
              ? MSG.sendModeration
              : rejected.reason === "no_mx" ||
                  rejected.reason === "disposable" ||
                  rejected.reason === "syntax"
                ? reasonMessage(rejected.reason as VerifyReason)
                : rejected.reason === "bad_url"
                  ? MSG.badUrl
                  : rejected.reason === "too_many_links"
                    ? MSG.tooManyLinks
                    : rejected.reason === "too_short" ||
                        rejected.reason === "gibberish"
                      ? MSG.details
                      : rejected.reason === "too_long"
                        ? MSG.tooLong
                        : MSG.missing;
          setSending(false);
          await gotoStep(target, msg);
          return;
        }

        if (workerOk) {
          // Accepted + delivered to Telegram → archive via Formspree (best effort).
          try {
            await sendToFormspree(false);
          } catch {
            /* Telegram already has it — archive failure is not user-facing */
          }
          setSending(false);
          setPhase("done");
          clearProgress();
          return;
        }
        // infra → fall through to Formspree-only with [Unverified]
        try {
          const ok = await sendToFormspree(true);
          if (ok) {
            setSending(false);
            setPhase("done");
            clearProgress();
            return;
          }
        } catch {
          /* fall through to mailto */
        }
        setSending(false);
        setSendError("fallback");
        return;
      }

      // --- Worker unset → Formspree-only with [Unverified] ---
      try {
        const ok = await sendToFormspree(true);
        if (ok) {
          setSending(false);
          setPhase("done");
          clearProgress();
          return;
        }
      } catch {
        /* fall through to mailto */
      }
      setSending(false);
      setSendError("fallback");
    } catch {
      setSending(false);
      setSendError("fallback");
    }
  };

  const downloadBrief = () => {
    const blob = new Blob([buildBrief()], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = briefFilename(answers.name);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const mailtoHref = () =>
    `mailto:jefferyyas8@gmail.com?subject=${encodeURIComponent(
      subject(true),
    )}&body=${encodeURIComponent(buildBrief())}`;

  // ---------- render ----------

  const chipClass = (active = false) =>
    cn(
      "rounded-2xl px-5 py-3 text-sm transition-all duration-200",
      active
        ? "bg-white text-black"
        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
    );

  const inputClass =
    "w-full rounded-2xl bg-white/5 px-5 py-4 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:bg-white/10";

  const reviewRow = (label: string, value: string, editStep?: number) => (
    <div className="border-b border-white/5 py-3 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-white/40">
            {label}
          </p>
          <p className="mt-1 break-words text-sm text-white/85">
            {value || "—"}
          </p>
        </div>
        {editStep ? (
          <button
            type="button"
            onClick={() => editField(editStep)}
            className="shrink-0 text-xs font-medium text-accent underline underline-offset-4 hover:text-white"
          >
            Edit
          </button>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      {/* progress */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-white/40" aria-live="polite">
          {phase === "done"
            ? "Sent"
            : step === 9
              ? "Review your brief"
              : `Step ${step} of 8`}
        </p>
        {phase === "active" ? (
          <button
            type="button"
            onClick={() => void doStartOver()}
            className="text-xs text-white/40 transition-colors hover:text-white/70"
          >
            Start over
          </button>
        ) : null}
      </div>

      {/* messages */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Intake conversation"
        className="max-h-[45vh] min-h-[220px] space-y-3 overflow-y-auto rounded-3xl bg-black/20 p-4"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex",
              m.from === "user" ? "justify-end" : "justify-start",
            )}
          >
            <p
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-relaxed",
                m.from === "user"
                  ? "rounded-br-md border border-accent/30 bg-accent/10 text-white"
                  : "rounded-tl-md bg-white/5 text-white/75",
              )}
            >
              {m.text}
            </p>
          </div>
        ))}
        {typing ? (
          <div className="flex justify-start">
            <span className="rounded-3xl rounded-tl-md bg-white/5 px-4 py-3 text-sm text-white/40">
              <span className="animate-pulse">•••</span>
            </span>
          </div>
        ) : null}
      </div>

      {/* resume offer */}
      {resumeOffer && !typing ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void doResume()}
            className={chipClass(true)}
          >
            Continue where you left off
          </button>
          <button
            type="button"
            onClick={() => void doStartOver()}
            className={chipClass()}
          >
            Start over
          </button>
        </div>
      ) : null}

      {/* email verification in progress */}
      {emailChecking ? (
        <p className="mt-4 text-sm text-white/50">Checking that domain…</p>
      ) : null}

      {/* inputs */}
      {!resumeOffer && phase === "active" && awaiting && !typing && !emailChecking ? (
        <div className="mt-4">
          {awaiting.kind === "chips" ? (
            <div className="flex flex-wrap gap-3">
              {(awaiting.step === 1
                ? PROJECT_TYPES
                : awaiting.step === 4
                  ? TIMELINES
                  : BUDGETS
              ).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleChip(option)}
                  className={chipClass()}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : awaiting.kind === "review" ? (
            <div className="rounded-3xl border border-border bg-surface p-5">
              <p className="mb-2 text-sm font-medium text-white">
                Your project brief
              </p>
              {reviewRow("Project type", answers.project_type, 1)}
              {reviewRow("Project details", answers.project_details, 2)}
              {reviewRow("Design preferences", answers.design_preferences, 3)}
              {reviewRow("Timeline", answers.timeline, 4)}
              {reviewRow("Budget", answers.budget, 5)}
              {reviewRow("Anything else", answers.extra_notes, 6)}
              {reviewRow("Name", answers.name, 7)}
              {reviewRow("Email", answers.email, 8)}

              {sendError === "fallback" ? (
                <p className="mt-4 text-xs leading-relaxed text-red-400">
                  Direct delivery is having trouble right now — you can send the
                  brief straight to Zin&apos;s inbox instead:{" "}
                  <a className="underline" href={mailtoHref()}>
                    email the brief
                  </a>
                  .
                </p>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => void handleSend()}
                  className="inline-flex h-11 items-center rounded-[20px] bg-white px-5 text-[15px] font-medium text-[#030303] transition-transform duration-200 hover:scale-[1.02] disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send my brief to Zin"}
                </button>
                <button
                  type="button"
                  onClick={() => void doStartOver()}
                  className="inline-flex h-11 items-center rounded-[20px] bg-white/5 px-5 text-[15px] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Start over
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <>
                {awaiting.kind === "email" ? (
                    <input
                      ref={(el) => {
                        inputRef.current = el;
                      }}
                      type="email"
                      value={draft}
                      autoComplete="email"
                      placeholder="you@example.com"
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void handleSubmit(draft);
                        }
                      }}
                      className={inputClass}
                    />
                  ) : (
                    <textarea
                      ref={(el) => {
                        inputRef.current = el;
                      }}
                      rows={awaiting.step === 2 ? 4 : 2}
                      value={draft}
                      placeholder={
                        awaiting.step === 2
                          ? "Must-have features, pages, integrations…"
                          : awaiting.step === 7
                            ? "Your name"
                            : "Your answer (optional links are fine)"
                      }
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void handleSubmit(draft);
                        }
                      }}
                      className={cn(inputClass, "resize-none")}
                    />
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => void handleSubmit(draft)}
                      className="inline-flex h-10 items-center rounded-[20px] bg-white px-5 text-sm font-medium text-[#030303] transition-transform hover:scale-[1.02]"
                    >
                      Send
                    </button>
                    {awaiting.kind === "textSkip" ? (
                      <button
                        type="button"
                        onClick={handleSkip}
                        className="inline-flex h-10 items-center rounded-[20px] bg-white/5 px-5 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        Skip
                      </button>
                    ) : null}
                  </div>
              </>
            </div>
          )}
        </div>
      ) : null}

      {/* strike-3 end screen */}
      {phase === "ended" ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSwitchToMessage}
            className="inline-flex h-11 items-center rounded-[20px] bg-white px-5 text-[15px] font-medium text-[#030303] transition-transform hover:scale-[1.02]"
          >
            Open Message tab
          </button>
          <button
            type="button"
            onClick={() => void doStartOver()}
            className="inline-flex h-11 items-center rounded-[20px] bg-white/5 px-5 text-[15px] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Start over
          </button>
        </div>
      ) : null}

      {/* success screen */}
      {phase === "done" ? (
        <div className="mt-4 rounded-3xl border border-border bg-surface p-6">
          <p className="text-lg font-medium text-white">
            Thanks — your brief is on its way.
          </p>
          <p className="mt-2 text-sm text-white/50">
            I usually reply within 24–48 hours.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={downloadBrief}
              className="inline-flex h-11 items-center rounded-[20px] bg-white px-5 text-[15px] font-medium text-[#030303] transition-transform hover:scale-[1.02]"
            >
              Download my brief (.md)
            </button>
            <button
              type="button"
              onClick={() => void doStartOver()}
              className="inline-flex h-11 items-center rounded-[20px] bg-white/5 px-5 text-[15px] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              Start another intake
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
