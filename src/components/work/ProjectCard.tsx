import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Tag } from "@/components/ui/Tag";
import type { Project } from "@/lib/data";

const gradients: Record<string, string> = {
  "final-year-project":
    "linear-gradient(135deg, #f97316 0%, #ec4899 55%, #8b5cf6 100%)",
  "luxury-recipe-finder":
    "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #a855f7 100%)",
  "personal-finance":
    "linear-gradient(135deg, #059669 0%, #0891b2 55%, #1d4ed8 100%)",
  "asmr-video-platform":
    "linear-gradient(135deg, #7c3aed 0%, #2563eb 55%, #0ea5e9 100%)",
};

const fallback =
  "linear-gradient(135deg, #0099ff 0%, #0369a1 55%, #1e293b 100%)";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative aspect-[1/0.9875] overflow-hidden rounded-3xl">
        <div
          aria-hidden
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          style={{
            backgroundImage: gradients[project.slug] ?? fallback,
          }}
        />

        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover brightness-105 saturate-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : null}

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent via-black/30 to-black/75"
        />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {project.tech.slice(0, 2).map((t) => (
            <Tag
              key={t}
              className="border border-white/30 bg-black/55 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md"
            >
              {t}
            </Tag>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/75">
                {project.category}
              </p>
              <h3 className="mt-1 text-xl font-medium tracking-[-0.03em] text-white md:text-2xl">
                {project.title}
              </h3>
            </div>
            <span
              className={cn(
                "shrink-0 translate-x-3 text-sm text-white/0 transition-all duration-300",
                "group-hover:translate-x-0 group-hover:text-white",
              )}
            >
              View case →
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-white/50">
        {project.summary}
      </p>
    </Link>
  );
}
