"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Service = {
  title: string;
  info: string;
  desc: string;
  modal: string;
  images: string[];
};

const services: Service[] = [
  {
    title: "Frontend engineering",
    info: "Interfaces",
    desc: "React and Next.js apps with strong typing, calm visual systems, and performance that stays fast as they grow.",
    modal: "React and Next.js apps with strong typing, calm visual systems, and performance that stays fast as they grow. I care about accessible markup, sensible component APIs, and interfaces that feel instant.",
    images: ["/projects/luxury-recipe.png", "/projects/vellum.png"],
  },
  {
    title: "Backend & APIs",
    info: "Systems",
    desc: "Laravel and Node.js services, relational schemas, auth flows (including WebAuthn), and integrations that hold up in production.",
    modal: "Laravel and Node.js services with relational schemas, token and passkey auth, queues, and REST endpoints that stay predictable under load — integrations that hold up in production.",
    images: ["/projects/nexus.png", "/projects/vellum.png"],
  },
  {
    title: "Product craft",
    info: "Design",
    desc: "Thoughtful UX, Tailwind design systems, and an eye for the small details that make software feel effortless.",
    modal: "Thoughtful UX, Tailwind design systems, and an eye for the small details that make software feel effortless — from empty states and loading skeletons to the micro-interactions people remember.",
    images: ["/projects/luxury-recipe.png", "/projects/nexus.png"],
  },
  {
    title: "AI-augmented delivery",
    info: "Workflow",
    desc: "Claude-powered architecture, refactors, and agent workflows that raise throughput without lowering the bar.",
    modal: "Claude-powered architecture, refactors, and agent workflows that raise throughput without lowering the bar. I use AI daily across planning, coding, and review — shipping faster while keeping the craft high.",
    images: ["/projects/vellum.png", "/projects/luxury-recipe.png"],
  },
  {
    title: "Databases & storage",
    info: "Data",
    desc: "MySQL, PostgreSQL, and MongoDB schemas with Redis caching — migrations, indexing, and queries that stay fast as data grows.",
    modal: "MySQL, PostgreSQL, and MongoDB schemas with Redis caching — careful migrations, indexing strategies, and queries that stay fast as your data grows.",
    images: ["/projects/nexus.png", "/projects/vellum.png"],
  },
  {
    title: "Deployment & DevOps",
    info: "Delivery",
    desc: "Docker containers, Nginx, CI/CD pipelines, and zero-drama deploys to Vercel, Render, and cloud servers.",
    modal: "Docker containers, Nginx, CI/CD pipelines, and zero-drama deploys to Vercel, Render, and cloud servers — with logging, health checks, and rollback plans when something misbehaves.",
    images: ["/projects/vellum.png", "/projects/nexus.png"],
  },
  {
    title: "Security & auth",
    info: "Protection",
    desc: "WebAuthn passkeys, token auth, email OTP flows, role-based access control, and hardened APIs built in from day one.",
    modal: "WebAuthn passkeys, Sanctum token auth, email OTP flows, and role-based access control — security designed in from day one rather than bolted on later.",
    images: ["/projects/nexus.png", "/projects/luxury-recipe.png"],
  },
  {
    title: "Testing & quality",
    info: "Reliability",
    desc: "Jest test suites, ESLint, Prettier, and TypeScript strictness that keep regressions out and refactors safe.",
    modal: "Jest test suites, ESLint, Prettier, and TypeScript strictness that keep regressions out — so refactors stay safe and releases stay boring.",
    images: ["/projects/luxury-recipe.png", "/projects/vellum.png"],
  },
];

export function ServicesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  const open = openIndex !== null;
  const active = openIndex !== null ? services[openIndex] : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openService = (i: number) => {
    setOpenIndex(i);
    setImgIndex(0);
  };

  const trackRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ left: number; top: number; w: number; h: number } | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const measure = () => {
      const track = trackRef.current;
      const tab = track?.querySelector<HTMLButtonElement>(`[data-idx="${openIndex}"]`);
      if (!track || !tab) return;
      setPill({ left: tab.offsetLeft, top: tab.offsetTop, w: tab.offsetWidth, h: tab.offsetHeight });
    };
    measure();
    const tab = trackRef.current?.querySelector<HTMLButtonElement>(`[data-idx="${openIndex}"]`);
    tab?.scrollIntoView({ block: "nearest", inline: "center" });
    const t = setTimeout(measure, 350);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [openIndex]);

  return (
    <>
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {services.map((s, i) => (
          <div
            key={s.title}
            className="group flex items-start justify-between gap-6 rounded-[36px] bg-white p-8 shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
          >
            <div>
              <p className="text-xs text-black/40">{s.info}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-black md:text-2xl">
                {s.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-black/60">
                {s.desc}
              </p>
            </div>
            <button
              type="button"
              aria-label={`Open ${s.title}`}
              onClick={() => openService(i)}
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-sheet text-black transition-all duration-300 group-hover:rotate-45 group-hover:bg-black group-hover:text-white hover:scale-110 hover:bg-black hover:text-white"
            >
              ↗
            </button>
          </div>
        ))}
      </div>

      {open && active
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-3 py-6 sm:px-4 sm:py-8"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div
            onClick={() => setOpenIndex(null)}
            className="absolute inset-0 bg-black/55 backdrop-blur-xl"
          />

          <div className="relative flex max-h-full w-full max-w-5xl flex-col items-center gap-3 overflow-y-auto sm:gap-5">
            <div
              id="service-tabs"
              className="max-w-full self-stretch overflow-x-auto rounded-full bg-black/85 p-1.5 shadow-lg [scrollbar-width:none] md:self-auto md:overflow-x-visible [&::-webkit-scrollbar]:hidden"
            >
              <div
                ref={trackRef}
                className="relative flex min-w-max gap-1 md:min-w-0 md:flex-wrap md:justify-center"
              >
                {pill ? (
                  <span
                    aria-hidden
                    className="absolute rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out"
                    style={{ left: pill.left, top: pill.top, width: pill.w, height: pill.h }}
                  />
                ) : null}
                {services.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    data-idx={i}
                    onClick={() => openService(i)}
                    className={cn(
                      "relative z-10 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors duration-200 sm:px-4 sm:text-sm",
                      i === openIndex
                        ? "text-black"
                        : "text-white/55 hover:text-white",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[10px] font-semibold tracking-[0.08em] transition-colors duration-200",
                        i === openIndex ? "text-black/40" : "text-white/35",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full overflow-hidden rounded-[24px] bg-[#e6e6e6] p-2.5 shadow-2xl sm:rounded-[36px] sm:p-3 md:rounded-[40px] md:p-4">
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-base text-black shadow-md transition-transform duration-200 hover:scale-110 sm:right-6 sm:top-6 sm:h-11 sm:w-11 sm:text-lg"
              >
                ✕
              </button>

              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-neutral-200 sm:rounded-[24px] md:aspect-auto md:h-full md:min-h-[340px]">
                  <Image
                    src={active.images[imgIndex]}
                    alt={active.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() =>
                      setImgIndex(
                        (idx) => (idx - 1 + active.images.length) % active.images.length,
                      )
                    }
                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black shadow transition hover:bg-white"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() =>
                      setImgIndex((idx) => (idx + 1) % active.images.length)
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black shadow transition hover:bg-white"
                  >
                    ›
                  </button>
                </div>

                <div className="flex flex-col justify-end px-1 pb-2 pt-1 sm:px-2 sm:pb-4 sm:pt-2 md:pb-6">
                  <div className="mb-3 flex items-center gap-2 sm:mb-4">
                    {active.images.map((img, i) => (
                      <button
                        key={img}
                        type="button"
                        aria-label={`Image ${i + 1}`}
                        onClick={() => setImgIndex(i)}
                        className={cn(
                          "h-9 w-12 overflow-hidden rounded-md transition sm:h-10 sm:w-14",
                          i === imgIndex
                            ? "ring-2 ring-black/70"
                            : "opacity-60 hover:opacity-100",
                        )}
                      >
                        <Image src={img} alt="" width={56} height={40} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-black sm:text-3xl md:text-4xl">
                    {active.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-black/60 sm:mt-3 sm:text-[15px]">
                    {active.modal}
                  </p>
                </div>
              </div>
            </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
