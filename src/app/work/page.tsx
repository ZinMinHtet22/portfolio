import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/work/ProjectCard";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects and case studies.",
};

export default function WorkPage() {
  const projects = getProjects();

  return (
    <div className="px-5 pt-36 md:px-10 md:pt-44">
      <SectionHeading
        eyebrow="Work"
        title="Projects & Case Studies"
        description="Full-stack products, secure authentication, media platforms, and academic work."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
