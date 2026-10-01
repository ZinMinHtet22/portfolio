import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tag } from "@/components/ui/Tag";
import { RevealWords } from "@/components/ui/Reveal";
import { LiveDemo } from "@/components/work/LiveDemo";
import { getProject, getProjects } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project" };
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="px-5 pt-36 md:px-10 md:pt-44">
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
          <span className="text-sm text-white/40">{project.category}</span>
          <RevealWords
            text={project.title}
            className="display mt-4 text-[42px] text-white md:text-[65px] xl:text-[72px]"
          />
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            {project.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-2xl bg-white/5 px-4 py-2 text-sm text-white/70"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-8 flex gap-6 text-sm">
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

      {project.links.live ? (
        <LiveDemo url={project.links.live} title={project.title} />
      ) : null}

      <div className="mt-16 grid max-w-4xl gap-6 md:grid-cols-3">
        {[
          { label: "Problem", body: project.problem },
          { label: "Approach", body: project.approach },
          { label: "Result", body: project.result },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-3xl border border-border bg-surface p-7"
          >
            <h2 className="text-xs uppercase tracking-widest text-white/40">
              {s.label}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {s.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 max-w-4xl">
        <h2 className="text-xs uppercase tracking-widest text-white/40">
          Highlights
        </h2>
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

      <div className="mt-14 max-w-4xl border-t border-border pt-6">
        <p className="text-sm text-white/50">
          <span className="text-white">Role:</span> {project.role}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Tag key={t} className="bg-white/5 text-white/60 backdrop-blur-none">
              {t}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
