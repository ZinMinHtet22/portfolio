import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-white text-[#030303] hover:scale-[1.03] focus-visible:ring-white/40",
  ghost:
    "bg-white/5 text-white border border-white/10 hover:bg-white/10 focus-visible:ring-white/20 backdrop-blur-[5px]",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex h-12 items-center justify-center gap-3 rounded-[20px] px-[18px] text-[15px] font-medium tracking-[-0.03em] transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
