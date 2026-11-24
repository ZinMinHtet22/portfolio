"use client";

import Link from "next/link";
import ShinyText from "@/components/react-bits/ShinyText";
import { StackMarquee } from "@/components/StackMarquee";

export function Hero() {
  const handleScrollToExplore = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-svh flex flex-col gap-10 px-5 pb-14 pt-28 sm:gap-16 sm:px-8 sm:pb-20 sm:pt-32 lg:gap-20 lg:px-12 lg:pb-28 lg:pt-36"
    >
      {/* (1) headline block at the top */}
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-[520px] text-[clamp(1.5rem,1.2vw+1rem,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white">
          Full-stack developer crafting calm, thoughtful digital experiences.
        </div>
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 self-start text-sm text-white/50 transition-colors hover:text-white md:mt-2"
        >
          Selected work
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {/* (2) wordmark inside a flex-1 region that centres it vertically in the leftover space */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <div
          aria-hidden
          className="wordmark-gradient -mx-2 select-none whitespace-nowrap text-center text-[clamp(3.25rem,13vw,15rem)] font-medium leading-[0.85] tracking-[-0.05em]"
        >
          Zin Min Htet
        </div>
      </div>

      {/* (3) meta row */}
      <div className="mt-8 flex items-end justify-between text-xs text-white/40 md:text-sm">
        <p className="flex flex-col gap-1">
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <ShinyText
              text="Available for new projects"
              color="rgba(255,255,255,0.55)"
              shineColor="#ffffff"
              speed={4}
              className="text-xs md:text-sm"
            />
          </span>
          <span>Full-stack · Myanmar</span>
        </p>
        <button
          onClick={handleScrollToExplore}
          className="flex items-center gap-2 cursor-pointer hover:text-white/60 transition-colors"
        >
          Scroll to explore
          <span className="inline-block animate-bounce">↓</span>
        </button>
      </div>

      {/* (4) marquee as the LAST element with margin-top: auto pinned to the bottom */}
      <StackMarquee />
    </section>
  );
}