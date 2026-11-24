import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tag } from "@/components/ui/Tag";
import { RevealWords } from "@/components/ui/Reveal";
import { LiveDemo } from "@/components/work/LiveDemo";
import { ContactTrigger } from "@/components/contact/ContactTrigger";
import { getProject, getProjects } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.image ? [project.image] : ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: project.image ? [project.image] : ["/og.png"],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const stack = project.stack && project.stack.length > 0 ? project.stack : project.tech;
  const whatIBuilt = project.whatIBuilt ?? project.approach;
  const outcome = project.outcome ?? project.result;
  const challenges = project.challenges ?? [];

  return (
    <div className="px-5 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pt-36">
      <div className="max-w-4xl">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">
            ←
          </span>
          Back to work
        </Link>

        <div className="mt-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/40">
            <span>{project.category}</span>
            {project.year ? (
              <>
                <span className="text-white/20">·</span>
                <span>{project.year}</span>
              </>
            ) : null}
          </div>
          <RevealWords
            text={project.title}
            className="display mt-4 text-[42px] text-white md:text-[65px] xl:text-[72px]"
          />
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            {project.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {stack.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-2xl bg-white/5 px-4 py-2 text-sm text-white/70"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            {project.links.live ? (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-4 transition-all duration-200 hover:translate-x-1"
              >
                Live demo →
              </a>
            ) : null}
            {project.links.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-all duration-200 hover:translate-x-1 hover:text-white"
              >
                View code →
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {!project.image ? (
        <div className="mt-14 max-w-4xl sm:mt-20 lg:mt-28">
          <div className="flex aspect-[16/9] w-full items-center justify-center rounded-3xl border border-dashed border-white/20 bg-surface/60 px-6 text-center">
            <p className="text-sm text-white/50">
              Project image placeholder (DESIGN.md style). Add a screenshot at{" "}
              <span className="font-mono text-white/70">
                {`/projects/${project.slug}.png`}
              </span>{" "}
              (or update the <span className="font-mono text-white/70">image</span> field in{" "}
              <span className="font-mono text-white/70">content/projects.json</span>).
            </p>
          </div>
        </div>
      ) : (
        project.links.live ? <LiveDemo url={project.links.live} title={project.title} /> : null
      )}

      <div className="mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:mt-20 md:grid-cols-2 lg:mt-28 lg:gap-8">
        <div className="rounded-3xl border border-border bg-surface p-7">
          <h2 className="text-xs uppercase tracking-widest text-white/40">Problem</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60">{project.problem}</p>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-7">
          <h2 className="text-xs uppercase tracking-widest text-white/40">What I built</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60">{whatIBuilt}</p>
        </div>
      </div>

      {project.highlights && project.highlights.length > 0 ? (
        <div className="mt-14 max-w-4xl sm:mt-20 lg:mt-28">
          <h2 className="text-xs uppercase tracking-widest text-white/40">Highlights</h2>
          <ul className="mt-6 space-y-4">
            {project.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-3 border-b border-border pb-4 text-white/70"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {challenges.length > 0 ? (
        <div className="mt-14 max-w-4xl sm:mt-20 lg:mt-28">
          <h2 className="text-xs uppercase tracking-widest text-white/40">Hard parts solved</h2>
          <ul className="mt-6 space-y-4">
            {challenges.map((c) => (
              <li
                key={c}
                className="flex items-start gap-3 border-b border-border pb-4 text-white/70"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {outcome ? (
        <div className="mt-14 max-w-4xl sm:mt-20 lg:mt-28 rounded-3xl border border-border bg-surface p-7">
          <h2 className="text-xs uppercase tracking-widest text-white/40">Outcome</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60">{outcome}</p>
        </div>
      ) : null}

      <div className="mt-14 max-w-4xl border-t border-border pt-6">
        <p className="text-sm text-white/50">
          <span className="text-white">Role:</span> {project.role}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {stack.map((t) => (
            <Tag key={t} className="bg-white/5 text-white/60 backdrop-blur-none">
              {t}
            </Tag>
          ))}
        </div>
      </div>

      <div className="mt-14 max-w-4xl rounded-3xl bg-white/5 p-8 backdrop-blur-[5px] sm:mt-20 md:p-10 lg:mt-28">
        <p className="text-xs uppercase tracking-widest text-accent">Let’s talk</p>
        <h2 className="display mt-3 text-[28px] text-white md:text-[36px]">
          Have a project like this in mind?
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
          I’m available for freelance work, collaborations, and full-time roles.
        </p>
        <ContactTrigger className="mt-6 h-12 text-[15px]" />
      </div>
    </div>
  );
}
