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
    <div className="px-5 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pt-36">
      <SectionHeading
        eyebrow="Work"
        title="Projects & Case Studies"
        description="Full-stack products, secure authentication, media platforms, and academic work."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} featured={i === 0} />
        ))}
      </div>
    </div>
  );
}
