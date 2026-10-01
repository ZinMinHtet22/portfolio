import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Tag({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-2xl bg-black/15 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-[5px]",
        className,
      )}
      {...props}
    />
  );
}
