import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getTestimonials } from "@/lib/data";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What clients and colleagues say about working with me.",
};

export default function TestimonialsPage() {
  const testimonials = getTestimonials();

  return (
    <div className="px-5 pt-36 md:px-10 md:pt-44">
      <SectionHeading
        eyebrow="Testimonials"
        title="Kind words from collaborators."
        description="Feedback from clients, teammates, and people I've worked with."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={i} delay={(i % 3) * 100} className="h-full">
            <figure className="flex h-full flex-col rounded-3xl bg-white/5 p-8 backdrop-blur-[5px]">
              <blockquote className="flex-1 leading-relaxed text-white/50">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 border-t border-white/5 pt-5">
                <p className="text-sm font-medium text-white">{t.name}</p>
                <p className="mt-1 text-sm text-white/40">
                  {t.role}
                  {t.company ? ` · ${t.company}` : ""}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
