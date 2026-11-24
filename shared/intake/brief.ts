// The compiled brief (§6) — one artefact used identically in four places:
// Formspree email body, Telegram .md file, visitor download, mailto fallback.

import type { IntakeAnswers } from "./types";

export function briefDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function compileBrief(
  answers: IntakeAnswers,
  opts: {
    date?: string;
    /** "domain MX confirmed · not a disposable address"
     *  or "skipped — verification service unreachable" */
    verifiedLine: string;
  },
): string {
  const or = (v: string) => (v.trim() ? v.trim() : "—");
  const date = opts.date ?? briefDate();

  return [
    `# Project Brief — ${answers.name.trim()}`,
    `Date: ${date} · Source: Portfolio intake chat`,
    `Email verified: ${opts.verifiedLine}`,
    ``,
    `## Contact`,
    `- Name: ${answers.name.trim()}`,
    `- Email: ${answers.email.trim()}`,
    ``,
    `## Project`,
    `- Type: ${answers.project_type.trim()}`,
    `- Details: ${answers.project_details.trim()}`,
    `- Design preferences / references: ${or(answers.design_preferences)}`,
    ``,
    `## Logistics`,
    `- Timeline: ${answers.timeline.trim()}`,
    `- Budget: ${answers.budget.trim()}`,
    `- Anything else: ${or(answers.extra_notes)}`,
    ``,
  ].join("\n");
}

/** First name → safe filename piece for `project-brief-<firstname>.md`. */
export function briefFilename(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? "client";
  const safe = first.toLowerCase().replace(/[^a-z0-9-]/g, "") || "client";
  return `project-brief-${safe}.md`;
}
