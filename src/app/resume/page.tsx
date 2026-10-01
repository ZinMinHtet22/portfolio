import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Resume",
  description: "Download my CV and view a quick summary of my background.",
};

export default function ResumePage() {
  return (
    <div className="px-5 pt-36 md:px-10 md:pt-44">
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
              PDF · updated [date] · ideal for HR departments
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
          If the preview doesn&apos;t load, use the download button above. Place
          your file at{" "}
          <code className="rounded-lg bg-white/5 px-2 py-1 text-xs text-white/70">
            public/resume.pdf
          </code>
          .
        </p>
      </div>

      {/* Text summary for accessibility/SEO */}
      <div className="mt-20 grid max-w-3xl gap-10 md:grid-cols-3">
        <section>
          <h2 className="text-xs uppercase tracking-widest text-white/40">
            Summary
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Full-stack developer with a technical support background and a
            calm, product-minded approach to building web applications.
            Experienced with Laravel, React, Next.js, Node.js, PostgreSQL, and
            modern AI-augmented development workflows.
          </p>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-white/40">
            Education
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>Bachelor&apos;s Degree — [University], [Years]</li>
            <li>Diploma — [Institute], [Years]</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-white/40">
            Experience
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>Technical Support — [Company], [Years]</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
