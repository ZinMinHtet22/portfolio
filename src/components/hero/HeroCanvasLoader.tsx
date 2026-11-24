"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroCanvas = dynamic(() => import("@/components/hero/HeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-32 w-32 animate-pulse rounded-full bg-sky-100/20" />
    </div>
  ),
});

export function HeroCanvasLoader() {
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setAllow(false);
      return;
    }
    // Defer mount to idle to reduce initial JS/WebGL cost
    const id = window.setTimeout(() => setAllow(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  if (!allow) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent_60%)]"
      />
    );
  }
  return <HeroCanvas />;
}
