"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={delay ? ({ ["--d"]: `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

/** Splits text into word spans that blur-in with stagger. */
export function RevealWords({
  text,
  className,
  delayStep = 45,
  initialDelay = 0,
}: {
  text: string;
  className?: string;
  delayStep?: number;
  initialDelay?: number;
}) {
  const words = text.split(" ");
  return (
    <Reveal className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <span
            className="reveal-word"
            style={
              {
                ["--d"]: `${initialDelay + i * delayStep}ms`,
              } as CSSProperties
            }
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Reveal>
  );
}
