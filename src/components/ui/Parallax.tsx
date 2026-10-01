"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  /** px the section drifts across its full travel; different values = different speeds */
  distance?: number;
  className?: string;
};

export function Parallax({ children, distance = 80, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.min(Math.max(progress, 0), 1);
      const y = (0.5 - clamped) * 2 * distance;
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [distance]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
