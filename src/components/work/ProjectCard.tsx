"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import GlareHover from "@/components/react-bits/GlareHover";
import type { Project } from "@/lib/data";

type Props = {
  project: Project;
  featured?: boolean;
  className?: string;
};

export function ProjectCard({ project, featured = false, className }: Props) {
  const stack = project.stack?.length ? project.stack : project.tech;
  const shown = stack.slice(0, stack.length > 4 ? 3 : 4);
  const hidden = stack.length - shown.length;
  const chips = hidden > 0 ? [...shown, `+${hidden} more`] : shown;

  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-3xl border border-border bg-surface p-6 transition-colors duration-200",
        "hover:border-white/15 motion-reduce:transition-none",
        featured && "lg:col-span-2",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-5 sm:gap-6">
        <GlareHover
          width="100%"
          height="100%"
          background="transparent"
          borderColor="rgba(255,255,255,0.07)"
          borderRadius="20px"
          glareColor="#0099ff"
          glareOpacity={0.12}
          glareSize={35}
          glareAngle={-30}
          variant="streak"
          mode="hover"
          className="relative aspect-[16/10] w-full overflow-hidden"
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes={
                featured
                  ? "(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 100vw"
                  : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              }
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
              style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
            />
          ) : (
            <div aria-hidden className="h-full w-full bg-[#080808]" />
          )}
        </GlareHover>

        <div className="flex flex-1 flex-col gap-4 sm:gap-5">
          <div className="flex items-center justify-between gap-3 text-xs tracking-wider">
            <span className="text-white/50">
              {project.category}
              {project.year ? (
                <>
                  <span className="mx-1.5 opacity-40" aria-hidden>
                    ·
                  </span>
                  {project.year}
                </>
              ) : null}
            </span>
            {project.status ? (
              <span className="inline-flex shrink-0 items-center rounded-full border border-white/10 bg-transparent px-2.5 py-1 text-[11px] font-medium text-white/70">
                {project.status === "live" ? "● Live" : "Local system"}
              </span>
            ) : null}
          </div>

          <h3 className="line-clamp-2 min-h-[2.75em] text-2xl font-semibold leading-snug tracking-tight text-white sm:text-[28px]">
            {project.title}
          </h3>

          <p className="line-clamp-2 min-h-[3.25em] text-sm leading-relaxed text-white/50 sm:text-[15px]">
            {project.summary}
          </p>

          {project.proofLine ? (
            <p className="h-5 truncate text-sm font-semibold tracking-tight text-accent">
              {project.proofLine}
            </p>
          ) : null}

          <div className="grid grid-cols-4 gap-2 pt-1">
            {chips.map((chip) => (
              <span
                key={chip}
                className="truncate rounded-md border border-white/[0.06] bg-[#161616] px-2 py-1.5 text-center text-xs text-white/70"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-auto border-t border-white/[0.06] pt-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors duration-150 group-hover:text-white motion-reduce:transition-none">
              View case study
              <span className="transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none">
                →
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
