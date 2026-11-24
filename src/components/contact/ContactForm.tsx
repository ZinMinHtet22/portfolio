"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
const MAILTO = "mailto:jefferyyas8@gmail.com?subject=Portfolio%20inquiry";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FORMSPREE_ID) return;
    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus("loading");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (!FORMSPREE_ID) {
    return (
      <div className="rounded-3xl bg-white/5 p-8 text-center backdrop-blur-[5px]">
        <p className="font-medium text-white">Contact form not configured yet.</p>
        <p className="mt-2 text-sm text-white/50">
          Email me directly and I’ll reply as soon as I can.
        </p>
        <a
          href={MAILTO}
          className="mt-4 inline-flex h-11 items-center justify-center rounded-[20px] bg-white px-5 text-[15px] font-medium text-[#030303] transition-transform hover:scale-[1.02]"
        >
          Email jefferyyas8@gmail.com
        </a>
        <p className="mt-4 text-xs text-white/40">
          Set NEXT_PUBLIC_FORMSPREE_ID in .env.local to enable form submissions.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl bg-white/5 p-8 text-center backdrop-blur-[5px]">
        <p className="font-medium text-white">Message sent.</p>
        <p className="mt-2 text-sm text-white/50">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-accent underline underline-offset-4"
        >
          Send another
        </button>
      </div>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent focus:ring-2 focus:ring-accent/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/70">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/70">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white/70">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={inputClass}
          placeholder="Tell me about your project or role..."
        />
      </div>

      {status === "error" ? (
        <p className="text-sm text-red-400">
          Something went wrong. Please try again or{" "}
          <a className="underline" href={MAILTO}>
            email me directly
          </a>
          .
        </p>
      ) : null}

      <Button type="submit" variant="primary" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send message"}
      </Button>

      <p className="text-xs text-white/40">
        Powered by Formspree — your details go straight to my inbox.
      </p>
    </form>
  );
}
