"use client";

import dynamic from "next/dynamic";

const HeroCanvas = dynamic(() => import("@/components/hero/HeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-32 w-32 animate-pulse rounded-full bg-sky-100" />
    </div>
  ),
});

export function HeroCanvasLoader() {
  return <HeroCanvas />;
}
