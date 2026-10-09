"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const types = ["Project based", "Full-time role"] as const;
const builds = ["Website", "Web App", "Mobile App", "API / Backend", "Other"];
const budgets = ["3-5k", "5-10k", "10k+", "Other"];

export function ContactPanel() {
  const [open, setOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [type, setType] = useState<(typeof types)[number]>("Project based");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedBuilds, setSelectedBuilds] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setConfirmClose(false);
    };
    window.addEventListener("open-contact", onOpen);
    return () => window.removeEventListener("open-contact", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (confirmClose) {
        setConfirmClose(false);
      } else {
        setConfirmClose(true);
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, confirmClose]);

  function attemptClose() {
    setConfirmClose(true);
  }

  function toggleBuild(b: string) {
    setSelectedBuilds((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/xljgbzgd", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          type,
          builds: selectedBuilds.join(", "),
          budget,
          details,
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-2xl bg-white/5 px-5 py-4 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:bg-white/10";
  const chipClass = (active: boolean) =>
    cn(
      "rounded-2xl px-5 py-3 text-sm transition-all duration-200",
      active
        ? "bg-white text-black"
        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
    );

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={attemptClose}
        className={cn(
          "fixed inset-0 z-[60] bg-black/75 backdrop-blur-xl backdrop-grayscale transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Contact form"
        className={cn(
          "fixed inset-y-0 right-0 z-[70] w-full overflow-y-auto border-l border-white/10 bg-[#141414] transition-transform duration-300 ease-out sm:w-[560px] sm:rounded-l-[32px]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="p-7 md:p-10">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-white/40">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Available for new projects
            </span>
            <button
              type="button"
              onClick={attemptClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close contact panel"
            >
              ✕
            </button>
          </div>

          <h2 className="display mt-8 max-w-[420px] text-[42px] text-white md:text-[52px]">
            Let&apos;s build something good together.
          </h2>

          {status === "sent" ? (
            <div className="mt-10 rounded-3xl bg-white/5 p-8">
              <p className="text-lg font-medium text-white">Message sent.</p>
              <p className="mt-2 text-sm text-white/50">
                Thanks {name || "—"} — I&apos;ll get back to you soon.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setName("");
                  setEmail("");
                  setDetails("");
                  setSelectedBuilds([]);
                  setBudget("");
                }}
                className="mt-5 text-sm font-medium text-accent underline underline-offset-4"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-8">
              {/* Type toggle */}
              <div>
                <p className="text-sm text-white/50">Select type</p>
                <div className="mt-3 inline-flex rounded-full bg-white/5 p-1">
                  {types.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={cn(
                        "rounded-full px-5 py-2 text-sm transition-all duration-200",
                        type === t
                          ? "bg-white text-black"
                          : "text-white/50 hover:text-white",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal info */}
              <div>
                <p className="text-sm text-white/50">Personal info</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input
                    className={inputClass}
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                  <input
                    className={inputClass}
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* What we build */}
              <div>
                <p className="text-sm text-white/50">What we build?</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {builds.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggleBuild(b)}
                      className={chipClass(selectedBuilds.includes(b))}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <p className="text-sm text-white/50">Project budget range</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {budgets.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudget(b)}
                      className={chipClass(budget === b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div>
                <p className="text-sm text-white/50">Project details</p>
                <textarea
                  rows={5}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Tell me about your project, timeline, and goals..."
                  className={cn(inputClass, "mt-3 resize-none")}
                />
              </div>

              {status === "error" ? (
                <p className="text-sm text-red-400">
                  Something went wrong. Please try again or email me directly.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex h-12 w-full items-center justify-center rounded-[20px] bg-white px-[18px] text-[16px] font-medium tracking-[-0.03em] text-[#030303] transition-transform duration-200 hover:scale-[1.01] disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send message"}
              </button>

              <p className="text-center text-xs text-white/40">
                Or email{" "}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=jefferyyas8@gmail.com"
                  className="text-accent underline underline-offset-4"
                >
                  jefferyyas8@gmail.com
                </a>{" "}
                directly
              </p>
            </form>
          )}
        </div>
      </aside>

      {/* Exit confirm modal */}
      <div
        className={cn(
          "fixed inset-0 z-[80] flex items-center justify-center px-5 transition-opacity duration-200",
          confirmClose
            ? "opacity-100"
            : "pointer-events-none opacity-0",
        )}
        role="alertdialog"
        aria-label="Unsaved changes"
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-2xl backdrop-grayscale"
          onClick={() => setConfirmClose(false)}
        />
        <div
          className={cn(
            "exit-card relative w-full max-w-md overflow-hidden rounded-[36px] border border-white/20 bg-gradient-to-br from-white/20 via-white/10 to-white/5 px-10 py-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.05),0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-transform duration-300",
            confirmClose ? "scale-100" : "scale-95",
          )}
        >
          <div className="relative">
            <p className="text-xl font-medium leading-snug tracking-[-0.02em] text-white drop-shadow-sm">
              Your details aren&apos;t sent yet — you can pick up right where
              you left off.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setConfirmClose(false);
                }}
                className="exit-btn inline-flex h-12 items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/15 px-6 text-[15px] text-white backdrop-blur-xl transition-colors duration-200 hover:bg-white/25"
              >
                <span aria-hidden>✕</span> Close anyway
              </button>
              <button
                type="button"
                onClick={() => setConfirmClose(false)}
                className="exit-btn inline-flex h-12 items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/15 px-6 text-[15px] text-white backdrop-blur-xl transition-colors duration-200 hover:bg-white/25"
              >
                <span aria-hidden>→</span> Back to form
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
