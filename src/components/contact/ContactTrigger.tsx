"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  variant?: "pill" | "plain";
};

export function ContactTrigger({
  children = "Get in touch",
  className,
  variant = "pill",
}: Props) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
      className={cn(
        variant === "pill"
          ? "inline-flex h-11 items-center rounded-[20px] bg-white px-5 text-[15px] font-medium tracking-[-0.03em] text-[#030303] transition-transform duration-200 hover:scale-[1.03]"
          : "inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white",
        className,
      )}
    >
      {children}
    </button>
  );
}
