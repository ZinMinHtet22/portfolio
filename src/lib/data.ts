export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  approach: string;
  result: string;
  role: string;
  tech: string[];
  highlights: string[];
  links: { live: string; github: string };
  image?: string;
  featured: boolean;
  order: number;
  // Optional extended fields (case-study template)
  whatIBuilt?: string;
  challenges?: string[];
  outcome?: string;
  year?: string | number;
  stack?: string[];
  proofLine?: string;
  status?: "live" | "local";
  imagePosition?: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

import projectsData from "../../content/projects.json";
import testimonialsData from "../../content/testimonials.json";

export function getProjects(): Project[] {
  return (projectsData.projects as Project[]).sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getTestimonials(): Testimonial[] {
  return testimonialsData.testimonials as Testimonial[];
}
