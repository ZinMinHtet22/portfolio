import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-between px-5 pb-5 pt-36 md:px-10 md:pt-44">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <h1 className="max-w-[420px] text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-white md:text-[34px]">
          Full-stack developer crafting calm, thoughtful digital experiences.
        </h1>
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

      <div
        aria-hidden
        className="wordmark-gradient -mx-2 select-none whitespace-nowrap text-center text-[13.5vw] font-medium leading-[0.85] tracking-[-0.05em]"
      >
        Zin Min Htet
      </div>

      <div className="mt-8 flex items-end justify-between text-xs text-white/40 md:text-sm">
        <p className="flex flex-col gap-1">
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Available for new projects
          </span>
          <span>Full-stack · Myanmar</span>
        </p>
        <p className="flex items-center gap-2">
          Scroll to explore
          <span className="inline-block animate-bounce">↓</span>
        </p>
      </div>
    </section>
  );
}
