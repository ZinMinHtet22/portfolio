import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ContactTrigger } from "@/components/contact/ContactTrigger";

export const metadata: Metadata = {
  title: "About",
  description:
    "Background, education, experience, and AI-augmented development workflow.",
};

const education = [
  {
    degree: "Bachelor's Degree",
    school: "[University name]",
    years: "[Years]",
    detail: "[Focus / major, if relevant]",
  },
  {
    degree: "Diploma",
    school: "[Institute name]",
    years: "[Years]",
    detail: "[Focus / major, if relevant]",
  },
];

const experience = [
  {
    role: "Technical Support",
    company: "[Company name]",
    years: "[Years]",
    bullets: [
      "Troubleshot hardware, software, and network issues for end users",
      "Communicated technical solutions clearly to non-technical customers",
      "Documented recurring issues and improved internal knowledge base",
    ],
  },
];

const skills = {
  Languages: ["TypeScript", "JavaScript", "PHP", "SQL", "Python"],
  Frameworks: ["Next.js", "React", "Node.js", "Laravel"],
  Tools: ["Git", "PostgreSQL", "Docker", "Tailwind CSS"],
  Practices: ["REST APIs", "WebAuthn", "Responsive design", "Testing"],
};

export default function AboutPage() {
  return (
    <div className="px-5 pt-36 md:px-10 md:pt-44">
      <SectionHeading
        eyebrow="About"
        title="Developer with a calm craft."
        description="I build reliable, thoughtful software — with a background in technical support and an AI-augmented workflow that keeps quality high and iteration fast."
      />

      {/* Story */}
      <div className="grid max-w-4xl gap-8 text-base leading-relaxed text-white/60 md:grid-cols-2 md:text-lg">
        <p>
          I&apos;m a full-stack developer who cares about clear interfaces,
          solid architecture, and products that feel quiet to use. My path into
          development started with technical support, where I learned to debug
          under pressure and explain complex systems simply.
        </p>
        <p>
          Today I design and ship web applications end-to-end — from database
          schemas and APIs to polished frontends — while using modern AI tools
          to move faster without sacrificing craft.
        </p>
      </div>

      {/* Education */}
      <section className="mt-28">
        <h2 className="text-xs uppercase tracking-widest text-white/40">
          Education
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {education.map((item) => (
            <Reveal key={item.degree}>
              <div className="h-full rounded-3xl border border-border bg-surface p-7">
                <h3 className="font-medium tracking-[-0.02em] text-white">
                  {item.degree}
                </h3>
                <p className="mt-1.5 text-sm text-white/50">
                  {item.school} · {item.years}
                </p>
                <p className="mt-3 text-sm text-white/50">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mt-28">
        <h2 className="text-xs uppercase tracking-widest text-white/40">
          Experience
        </h2>
        <div className="mt-6 space-y-6">
          {experience.map((job) => (
            <div
              key={job.role}
              className="rounded-3xl border border-border bg-surface p-7"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-medium tracking-[-0.02em] text-white">
                  {job.role}
                </h3>
                <span className="text-sm text-white/40">{job.years}</span>
              </div>
              <p className="mt-1 text-sm text-white/50">{job.company}</p>
              <ul className="mt-5 space-y-3">
                {job.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-sm text-white/60"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* AI Workflow highlight */}
      <section className="mt-28">
        <div className="rounded-3xl bg-white/5 p-8 backdrop-blur-[5px] md:p-12">
          <p className="text-xs uppercase tracking-widest text-accent">
            AI-Augmented Development Workflow
          </p>
          <h3 className="display mt-4 max-w-2xl text-[32px] text-white md:text-[44px]">
            Shipping faster with intentional AI tooling
          </h3>
          <div className="mt-8 grid gap-6 text-sm leading-relaxed text-white/60 md:grid-cols-3">
            <p>
              I use <span className="font-medium text-white">Claude</span>{" "}
              daily for architecture discussions, refactors, code review, and
              turning vague requirements into concrete implementation plans.
            </p>
            <p>
              With{" "}
              <span className="font-medium text-white">
                Google Antigravity
              </span>
              , I run agentic workflows that handle multi-step tasks —
              exploration, scaffolding, and verification.
            </p>
            <p>
              The result: higher throughput, cleaner code, and more time spent
              on the problems that actually need human judgment.
            </p>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mt-28">
        <h2 className="text-xs uppercase tracking-widest text-white/40">
          Skills
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(skills).map(([group, items]) => (
            <div
              key={group}
              className="rounded-3xl border border-border bg-surface p-7"
            >
              <h3 className="text-sm font-medium text-white">{group}</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/50">
                {items.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-28 flex flex-wrap gap-4">
        <Link
          href="/resume"
          className="inline-flex h-12 items-center rounded-[20px] border border-white/10 bg-white/5 px-[18px] text-[15px] font-medium tracking-[-0.03em] text-white backdrop-blur-[5px] transition-colors duration-200 hover:bg-white/10"
        >
          Download CV
        </Link>
        <ContactTrigger className="h-12" />
      </div>
    </div>
  );
}
