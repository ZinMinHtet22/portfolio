"use client";

import { useEffect, useRef, useState } from "react";

type Step = {
  id: string;
  num: string;
  label: string;
  icon: "search" | "layers" | "code" | "flask" | "cloud" | "flag";
  meta: string;
  accent: string;
  x: number;
  y: number;
};

const stepsMeta: Omit<Step, "x" | "y">[] = [
  {
    id: "discover",
    num: "01",
    label: "Discover",
    icon: "search",
    meta: "Goals · Research · Requirements · Scope",
    accent: "#38bdf8",
  },
  {
    id: "design",
    num: "02",
    label: "Design",
    icon: "layers",
    meta: "Wireframes · UI · Prototypes",
    accent: "#fb923c",
  },
  {
    id: "build",
    num: "03",
    label: "Build",
    icon: "code",
    meta: "React · APIs · Integrations",
    accent: "#22d3ee",
  },
  {
    id: "test",
    num: "04",
    label: "Test",
    icon: "flask",
    meta: "Jest · Lint · Type safety",
    accent: "#f472b6",
  },
  {
    id: "deploy",
    num: "05",
    label: "Deploy",
    icon: "cloud",
    meta: "CI/CD · Docker · Cloud",
    accent: "#60a5fa",
  },
  {
    id: "ship",
    num: "06",
    label: "Ship",
    icon: "flag",
    meta: "Monitor · Iterate · Scale",
    accent: "#34d399",
  },
];

const desktopPos = [
  { x: 15, y: 33 },
  { x: 31, y: 63 },
  { x: 47, y: 35 },
  { x: 63, y: 63 },
  { x: 78, y: 31 },
  { x: 85, y: 62 },
];

const mobilePos = [
  { x: 26, y: 32 },
  { x: 74, y: 32 },
  { x: 26, y: 50 },
  { x: 74, y: 50 },
  { x: 26, y: 68 },
  { x: 74, y: 68 },
];

const layout = (narrow: boolean): Step[] =>
  stepsMeta.map((m, i) => ({ ...m, ...(narrow ? mobilePos[i] : desktopPos[i]) }));

const links: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [0, 2],
  [2, 4],
];

const floatChips = [
  { x: 10, y: 54, text: "user interviews", delay: "0.2s" },
  { x: 22, y: 80, text: "pixel-perfect UI", delay: "1.1s" },
  { x: 87, y: 13, text: "Lighthouse 98", delay: "0.6s" },
  { x: 84, y: 79, text: "zero handoffs", delay: "1.6s" },
  { x: 13, y: 16, text: "scope locked", delay: "0.9s" },
];

const sparkles: { x: number; y: number; plus?: boolean; delay: string }[] = [
  { x: 24, y: 12, delay: "0s" },
  { x: 74, y: 9, delay: "0.8s" },
  { x: 45, y: 52, plus: true, delay: "1.4s" },
  { x: 93, y: 45, delay: "0.4s" },
  { x: 6, y: 41, plus: true, delay: "2s" },
  { x: 56, y: 48, delay: "1.1s" },
  { x: 95, y: 66, delay: "1.7s" },
  { x: 20, y: 90, plus: true, delay: "0.5s" },
  { x: 33, y: 88, delay: "2.3s" },
];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const iconPaths: Record<Step["icon"], string[]> = {
  search: ["M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z", "M15.5 15.5 21 21"],
  layers: [
    "M12 2.5 2.5 7.5 12 12.5 21.5 7.5 12 2.5Z",
    "M2.5 12.5 12 17.5 21.5 12.5",
    "M2.5 17 12 22 21.5 17",
  ],
  code: ["M8.5 6 3 12l5.5 6", "M15.5 6 21 12l-5.5 6"],
  flask: [
    "M9.5 3h5",
    "M10.5 3v6.2L5.3 18.4A2 2 0 0 0 7 21.5h10a2 2 0 0 0 1.7-3.1L13.5 9.2V3",
    "M7.8 15h8.4",
  ],
  cloud: [
    "M6.5 17.5a4 4 0 0 1 .5-7.97 5.5 5.5 0 0 1 10.6-1.03A3.75 3.75 0 0 1 17.5 17.5h-11Z",
    "M12 14.5v-5",
    "M9.5 11.5 12 9l2.5 2.5",
  ],
  flag: [
    "M5 21V4",
    "M5 4.5c2.5-1.5 4.5 1.5 7 0s4.5-1.5 7 0v8c-2.5-1.5-4.5 1.5-7 0s-4.5-1.5-7 0",
  ],
};

export function ProcessCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  const [steps, setSteps] = useState<Step[]>(() => layout(false));
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setNarrow(el.clientWidth < 640));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setSteps(layout(narrow));
    setDragIdx(null);
  }, [narrow]);

  const startDrag = (e: React.PointerEvent<HTMLDivElement>, idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const el = e.currentTarget;
    const startX = e.clientX;
    const startY = e.clientY;
    const origin = { x: steps[idx].x, y: steps[idx].y };
    const halfW = ((el.offsetWidth / 2) / rect.width) * 100 + 1;
    const halfH = ((el.offsetHeight / 2) / rect.height) * 100 + 1;

    const box = el.querySelector<HTMLElement>("[data-cardbox]");
    if (box) box.style.transform = "";
    setDragIdx(idx);

    const onMove = (ev: PointerEvent) => {
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      setSteps((prev) =>
        prev.map((s, i) =>
          i === idx
            ? {
                ...s,
                x: clamp(origin.x + dx, halfW, 100 - halfW),
                y: clamp(origin.y + dy, halfH, 100 - halfH),
              }
            : s,
        ),
      );
    };

    const onUp = () => {
      setDragIdx(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const tilt = (e: React.PointerEvent<HTMLDivElement>, active: boolean) => {
    if (!active) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "transform 120ms ease-out";
    el.style.transform = `perspective(560px) rotateX(${-py * 10}deg) rotateY(${px * 10}deg)`;
  };

  const tiltReset = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transition = "transform 400ms ease-out";
    el.style.transform = "";
  };

  const path = (a: Step, b: Step) => {
    const mx = (a.x + b.x) / 2;
    return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
  };

  return (
    <div
      ref={canvasRef}
      className="relative h-[520px] w-full select-none overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0a0a0a] md:h-[640px] md:rounded-[40px]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div
          aria-hidden
          className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#0099ff]/15 blur-[90px] md:h-80 md:w-80"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#ff6b35]/10 blur-[90px] md:h-80 md:w-80"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(10,10,10,0.85) 100%)",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          aria-hidden
          className="absolute -left-20 bottom-2 h-72 w-72 rounded-full border border-dashed border-white/[0.05] md:-left-24 md:h-80 md:w-80"
        />
        <div
          aria-hidden
          className="absolute right-6 top-16 h-36 w-36 rounded-full border border-white/[0.04] md:right-10 md:top-20 md:h-44 md:w-44"
        />

        {floatChips.map((c) => (
          <span
            key={c.text}
            className="absolute hidden md:block"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span
              className="card-float flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-[10px] text-white/40 backdrop-blur-sm"
              style={{ animationDelay: c.delay }}
            >
              <span className="h-1 w-1 rounded-full bg-white/40" />
              {c.text}
            </span>
          </span>
        ))}

        {sparkles.map((s, i) => (
          <span
            key={i}
            className={`pc-twinkle absolute ${s.plus ? "text-[11px] leading-none text-white/30" : "h-[3px] w-[3px] rounded-full bg-white/40"}`}
            style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: s.delay }}
          >
            {s.plus ? "+" : ""}
          </span>
        ))}
      </div>

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          {links.map(([a, b], i) => (
            <linearGradient key={i} id={`pc-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={steps[a].accent} />
              <stop offset="100%" stopColor={steps[b].accent} />
            </linearGradient>
          ))}
        </defs>
        {links.map(([a, b], i) => (
          <g key={i}>
            <path
              d={path(steps[a], steps[b])}
              fill="none"
              stroke={`url(#pc-grad-${i})`}
              strokeWidth="1.25"
              opacity="0.4"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={path(steps[a], steps[b])}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
              className="process-flow"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>

      <span className="pointer-events-none absolute bottom-5 left-5 z-10 hidden text-[11px] uppercase tracking-[0.18em] text-white/30 md:block md:bottom-7 md:left-7">
        Drag to rearrange
      </span>

      <div className="pointer-events-none absolute inset-x-0 top-6 z-10 flex flex-col items-center gap-3 px-6 md:top-9">
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/40 md:text-[11px]">
          How I work
        </span>
        <h2 className="display max-w-xl text-center text-[30px] leading-[1.06] text-white md:text-[46px]">
          One process. No handoff gaps.
        </h2>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center px-8 md:bottom-10">
        <p className="max-w-xl text-center text-xs leading-relaxed text-white/45 md:text-[15px]">
          From the first sketch to production, the same person designs, builds,
          and ships it. No telephone game, no lost context — just steady,
          end-to-end ownership of the work.
        </p>
      </div>

      {steps.map((s, i) => (
        <div
          key={s.id}
          onPointerDown={(e) => startDrag(e, i)}
          className={`group absolute z-10 flex w-[112px] cursor-grab flex-col items-center active:cursor-grabbing md:w-[150px] ${
            dragIdx === i ? "z-20" : ""
          }`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: `translate(-50%, -50%) rotate(${dragIdx === i ? 1.5 : 0}deg)`,
            transition: "transform 0.2s ease",
            touchAction: "none",
          }}
        >
          <div
            className="card-float w-full"
            style={{
              animationDelay: `${i * 0.7}s`,
              animationPlayState: dragIdx === i ? "paused" : "running",
            }}
          >
            <div
              className="pc-border relative rounded-[20px] p-[1.5px] md:rounded-[24px]"
              style={{
                background: `conic-gradient(from var(--pc-a), transparent 6%, ${s.accent} 20%, transparent 36%, transparent 100%)`,
                boxShadow: `0 14px 34px -14px ${s.accent}59`,
              }}
            >
              <div
                data-cardbox
                onPointerMove={(e) => tilt(e, dragIdx !== i)}
                onPointerLeave={tiltReset}
                className={`relative flex h-[70px] w-full flex-col items-center justify-center gap-[3px] overflow-hidden rounded-[18.5px] px-2.5 md:h-[104px] md:gap-1 md:rounded-[22.5px] md:px-3 ${
                  dragIdx === i ? "scale-105" : ""
                }`}
                style={{
                  background: `radial-gradient(120% 90% at 50% 0%, ${s.accent}1f, #0d0d0d 62%)`,
                }}
              >
                <span className="pointer-events-none absolute left-2.5 top-1 text-[17px] font-bold leading-none tracking-tight text-white/[0.07] md:left-3.5 md:top-2 md:text-[26px]">
                  {s.num}
                </span>

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={s.accent}
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="md:h-7 md:w-7"
                >
                  {iconPaths[s.icon].map((d) => (
                    <path key={d} d={d} />
                  ))}
                </svg>

                <span className="text-[9px] font-semibold leading-none text-white md:text-[11px]">
                  {s.label}
                </span>
                <span className="text-center text-[6px] leading-[1.3] text-white/50 md:text-[7.5px]">
                  {s.meta}
                </span>

                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.16)_50%,transparent_65%)] transition-transform duration-700 group-hover:translate-x-full"
                />

                <svg
                  className="absolute right-2 top-2 z-10 text-white/25"
                  width="11"
                  height="11"
                  viewBox="0 0 14 14"
                  fill="currentColor"
                  aria-hidden
                >
                  <circle cx="4" cy="3" r="1.3" />
                  <circle cx="10" cy="3" r="1.3" />
                  <circle cx="4" cy="7" r="1.3" />
                  <circle cx="10" cy="7" r="1.3" />
                  <circle cx="4" cy="11" r="1.3" />
                  <circle cx="10" cy="11" r="1.3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
