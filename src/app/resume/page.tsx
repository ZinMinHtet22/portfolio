import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Resume",
  description: "Download my CV and view a quick summary of my background.",
};

export default function ResumePage() {
  return (
    <div className="px-5 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pt-36">
      <SectionHeading
        eyebrow="Resume"
        title="Curriculum Vitae."
        description="A concise overview of my education, experience, and skills — with a downloadable PDF for recruiters and HR."
      />

      <div className="max-w-3xl rounded-3xl border border-border bg-surface p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-medium tracking-[-0.02em] text-white">
              Download my CV
            </h3>
            <p className="mt-1.5 text-sm text-white/50">
              PDF · updated November 2026 · ideal for HR departments
            </p>
          </div>
          <a
            href="/resume.pdf"
            download
            className="inline-flex h-12 items-center justify-center rounded-[20px] bg-white px-[18px] text-[15px] font-medium tracking-[-0.03em] text-[#030303] transition-transform duration-200 hover:scale-[1.03]"
          >
            Download PDF
          </a>
        </div>
      </div>

      {/* Inline preview */}
      <div className="mt-14 max-w-3xl">
        <h2 className="text-xs uppercase tracking-widest text-white/40">
          Preview
        </h2>
        <div className="mt-5 overflow-hidden rounded-3xl border border-border bg-surface">
          <iframe
            src="/resume.pdf"
            title="Resume preview"
            className="h-[720px] w-full"
          />
        </div>
        <p className="mt-3 text-sm text-white/40">
          If the preview doesn&apos;t load, use the download button above.
        </p>
      </div>

      {/* Text summary for accessibility/SEO */}
      <div className="mt-14 grid max-w-3xl grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:mt-28 lg:grid-cols-3 lg:gap-8">
        <section>
          <h2 className="text-xs uppercase tracking-widest text-white/40">
            Summary
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Full-stack developer and Technology Associate with a background in
            technical support and a calm, product-minded approach to building
            web applications. Experienced with Laravel, React, Next.js,
            Node.js, PostgreSQL, and modern AI-augmented development workflows.
          </p>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-white/40">
            Education
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>
              BSc (Hons) Computer Science — University of Roehampton (via
              Lithan Academy), 2024 – 2025
            </li>
            <li>
              Pearson BTEC Level 3 Foundation Diploma (IT) — Lithan Academy,
              2024 · Grade Pass
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-white/40">
            Experience
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>
              Technology Associate — CLaaS2SaaS (Lithan Academy), June 2026 – Present
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
