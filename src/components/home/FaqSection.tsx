"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What do you build?",
    a: "Full-stack web products end-to-end — database schemas, REST APIs, auth flows, and polished React/Next.js frontends. Laravel and TypeScript are my defaults.",
  },
  {
    q: "Are you open to freelance work?",
    a: "Yes. I'm open to freelance projects, collaborations, and full-time roles. The quickest way to reach me is the Get in touch button — I reply within a day.",
  },
  {
    q: "What's your core stack?",
    a: "React, Next.js, TypeScript, Tailwind CSS, Laravel, MySQL/PostgreSQL, Docker, and Vercel/Render for deploys — plus Gemini and Claude for AI features.",
  },
  {
    q: "Can you build a product end-to-end?",
    a: "That's my preferred way of working. My capstone Vellum and the Nexus finance platform both went from schema design to deployed production apps.",
  },
  {
    q: "How do you use AI in your work?",
    a: "I run an AI-augmented workflow with Claude for architecture, refactors, and agent-driven iteration — faster delivery without cutting corners on craft.",
  },
  {
    q: "Where are you based?",
    a: "Myanmar (UTC+6:30), and I work remotely with teams across time zones. Communication is async-friendly with regular progress updates.",
  },
  {
    q: "Do you have professional experience?",
    a: "Yes — I came from a technical support background, where I learned to debug under pressure and explain complex systems simply before moving into development.",
  },
  {
    q: "How fast can you start?",
    a: "Usually within a week for new projects. For anything urgent, mention the deadline when you reach out and I'll tell you honestly if it fits.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
      <h2 className="display max-w-[900px] text-[42px] text-white/60 md:text-[65px] xl:text-[82px]">
        Frequently asked questions.
      </h2>

      <div className="mt-10 grid grid-cols-1 items-start gap-5 sm:mt-14 md:grid-cols-2 lg:mt-20 lg:gap-8">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className="overflow-hidden rounded-[24px] bg-white/5 transition-colors duration-200 hover:bg-white/[0.07]"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-5 px-7 py-6 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-[17px] font-semibold tracking-[-0.02em] text-white">
                  {f.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/60 transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                >
                  ▼
                </span>
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-7 pb-7 text-[15px] leading-relaxed text-white/50">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
