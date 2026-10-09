import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/hero/Hero";
import { Reveal, RevealWords } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { ContactTrigger } from "@/components/contact/ContactTrigger";
import { getFeaturedProjects, getTestimonials } from "@/lib/data";
import { Parallax } from "@/components/ui/Parallax";
import { FaqSection } from "@/components/home/FaqSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProcessCanvas } from "@/components/home/ProcessCanvas";

const toolIcons = [
  { name: "TypeScript", file: "typescript", color: "#3178C6" },
  { name: "Next.js", file: "nextdotjs", color: "#111111" },
  { name: "React", file: "react", color: "#61DAFB" },
  { name: "Laravel", file: "laravel", color: "#FF2D20" },
  { name: "Node.js", file: "nodedotjs", color: "#5FA04E" },
  { name: "PostgreSQL", file: "postgresql", color: "#4169E1" },
  { name: "Tailwind CSS", file: "tailwindcss", color: "#06B6D4" },
  { name: "Docker", file: "docker", color: "#2496ED" },
  { name: "Git", file: "git", color: "#F05032" },
  { name: "Figma", file: "figma", color: "#F24E1E" },
  { name: "Claude", file: "claude", color: "#D97757" },
  { name: "MySQL", file: "mysql", color: "#4479A1" },
  { name: "PHP", file: "php", color: "#777BB4" },
  { name: "Vite", file: "vite", color: "#646CFF" },
  { name: "Google Gemini", file: "googlegemini", color: "#8E75B2" },
  { name: "OpenAI", file: "openai", color: "#412991" },
  { name: "GitHub", file: "github", color: "#181717" },
  { name: "Python", file: "python", color: "#3776AB" },
  { name: "OpenJDK", file: "openjdk", color: "#007396" },
  { name: "Firebase", file: "firebase", color: "#FFCA28" },
  { name: "MongoDB", file: "mongodb", color: "#47A248" },
  { name: "GraphQL", file: "graphql", color: "#E10098" },
  { name: "Redux", file: "redux", color: "#764ABC" },
  { name: "AWS", file: "amazonwebservices", color: "#FF9900" },
  { name: "Linux", file: "linux", color: "#FCC624" },
  { name: "Jest", file: "jest", color: "#C21325" },
  { name: "Android", file: "android", color: "#3DDC84" },
  { name: "Bootstrap", file: "bootstrap", color: "#7952B3" },
  { name: "Sass", file: "sass", color: "#CC6699" },
  { name: "ESLint", file: "eslint", color: "#4B32C3" },
  { name: "Prettier", file: "prettier", color: "#F7B93E" },
  { name: "Webpack", file: "webpack", color: "#8DD6F9" },
  { name: "Three.js", file: "threedotjs", color: "#000000" },
  { name: "Redis", file: "redis", color: "#FF4438" },
  { name: "Nginx", file: "nginx", color: "#009639" },
  { name: "Socket.IO", file: "socketdotio", color: "#010101" },
  { name: "Angular", file: "angular", color: "#DD0031" },
  { name: "Svelte", file: "svelte", color: "#FF3E00" },
];

const coloredIcons = new Set([
  "amazonwebservices", "android", "angular", "bootstrap", "docker", "eslint",
  "figma", "firebase", "git", "github", "graphql", "jest", "laravel", "linux",
  "mongodb", "mysql", "nextdotjs", "nginx", "nodedotjs", "php", "postgresql",
  "python", "react", "redis", "redux", "sass", "socketdotio", "svelte",
  "tailwindcss", "threedotjs", "typescript", "vite", "webpack",
]);

export default function Home() {
  const featured = getFeaturedProjects().slice(0, 3);
  const testimonials = getTestimonials().slice(0, 3);

  return (
    <>
      <Hero />

      {/* About reveal */}
      <Parallax distance={130}>
      <section className="px-5 pt-40 md:px-10">
        <RevealWords
          text="I craft code that turns ambitious ideas into products people trust."
          className="display max-w-[1100px] text-[42px] text-white/60 md:text-[65px] xl:text-[82px]"
        />

        <div className="mt-20 grid gap-10 md:grid-cols-3 md:gap-16">
          <p className="text-base font-medium text-white md:text-lg">
            About me.
          </p>
          <div className="space-y-4 text-base leading-relaxed text-white/60">
            <p>
              Full-stack developer with a technical support background — I
              learned to debug under pressure and explain complex systems
              simply.
            </p>
            <p>
              I ship web applications end-to-end: database schemas and APIs
              through to polished, quiet interfaces.
            </p>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-white/60">
            <p>
              An AI-augmented workflow with Claude keeps iteration fast without
              cutting corners on craft.
            </p>
            <Link
              href="/about"
              className="inline-block text-sm text-accent underline underline-offset-4 transition-all duration-200 hover:translate-x-1"
            >
              Explore my background →
            </Link>
          </div>
        </div>
      </section>
      </Parallax>

      {/* Selected work */}
      <Parallax distance={200}>
      <section className="px-5 pt-40 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <RevealWords
            text="Selected work. Recent projects I'm proud of."
            className="display max-w-[900px] text-[42px] text-white/60 md:text-[65px] xl:text-[82px]"
          />
          <Link
            href="/work"
            className="group inline-flex shrink-0 items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            All projects
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <Reveal key={project.slug} delay={i * 100}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>
      </Parallax>

      {/* Process canvas */}
      <Parallax distance={140}>
      <section className="px-5 pt-40 md:px-10">
        <ProcessCanvas />
      </section>
      </Parallax>

      {/* Tools sheet (light) */}
      <Parallax distance={150}>
      <section className="px-5 pt-40 md:px-10">
        <div className="rounded-3xl bg-sheet px-5 pb-24 pt-8 text-black md:px-10 md:pb-40 md:pt-12">
        <Parallax distance={160}>
        <div className="mt-4 md:mt-6">
          <h2 className="display text-[42px] md:text-[56px] xl:text-[72px]">
            My tools
          </h2>
          <div className="mt-5 flex flex-wrap items-center gap-3 md:gap-4">
          {toolIcons.map((t) => (
            <div key={t.name} className="group relative">
              <div className="flex h-12 w-12 cursor-default items-center justify-center rounded-[16px] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-transform duration-200 group-hover:-translate-y-1.5 md:h-14 md:w-14">
                {coloredIcons.has(t.file) ? (
                  <Image
                    src={`/tools/c/${t.file}.svg`}
                    alt=""
                    aria-hidden
                    width={40}
                    height={40}
                    className="h-8 w-8 object-contain md:h-9 md:w-9"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="h-6 w-6 md:h-8 md:w-8"
                    style={{
                      backgroundColor: t.color,
                      WebkitMaskImage: `url(/tools/${t.file}.svg)`,
                      maskImage: `url(/tools/${t.file}.svg)`,
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                    }}
                  />
                )}
                <span className="sr-only">{t.name}</span>
              </div>
              <span className="pointer-events-none absolute -bottom-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-black/50 opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
                {t.name}
              </span>
            </div>
          ))}
          </div>
          <h2 className="display mt-8 text-[42px] md:mt-10 md:text-[56px] xl:text-[72px]">
            My stack
          </h2>
        </div>
        </Parallax>

          <ServicesSection />
        </div>
      </section>
      </Parallax>

      {/* Testimonials */}
      <Parallax distance={230}>
      <section className="px-5 pt-40 md:px-10">
        <RevealWords
          text="Kind words. Trusted by the people I've worked with."
          className="display max-w-[900px] text-[42px] text-white/50 md:text-[65px] xl:text-[82px]"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={i} className="h-full">
              <figure className="flex h-full flex-col rounded-3xl bg-white/5 p-8 backdrop-blur-[5px]">
                <blockquote className="flex-1 text-lg leading-snug tracking-[-0.02em] text-white/50">
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

        <Link
          href="/testimonials"
          className="group mt-10 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          Read all testimonials
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </section>
      </Parallax>

      {/* FAQ */}
      <Parallax distance={170}>
        <FaqSection />
      </Parallax>

      {/* CTA */}
      <Parallax distance={100}>
      <section className="px-5 pt-40 md:px-10">
        <RevealWords
          text="Have a project in mind? Let's build it."
          className="display max-w-[900px] text-[42px] text-white/60 md:text-[65px] xl:text-[82px]"
        />
        <p className="mt-8 max-w-xl text-base leading-relaxed text-white/50">
          I&apos;m open to freelance work, collaborations, and full-time roles.
        </p>
        <ContactTrigger className="mt-10 h-12 text-[17px]" />
      </section>
      </Parallax>
    </>
  );
}
