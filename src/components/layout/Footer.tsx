import Link from "next/link";
import { ContactTrigger } from "@/components/contact/ContactTrigger";

const explore = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
];

const socials = [
  { href: "https://github.com/ZinMinHtet22", label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/zin-min-htet-a167b42b5",
    label: "LinkedIn",
  },
  { href: "https://mail.google.com/mail/?view=cm&fs=1&to=jefferyyas8@gmail.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="mt-40 px-5 pb-10 md:px-10">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between">
        <div className="flex flex-col gap-6">
          <p className="flex items-center gap-2 text-sm text-white/50">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Available for work
          </p>
          <h2 className="max-w-md text-2xl font-medium leading-snug tracking-[-0.03em] text-white">
            Building calm, thoughtful digital experiences — let&apos;s make
            something good together.
          </h2>
          <div>
            <ContactTrigger className="h-12 text-[17px]" />
          </div>
        </div>

        <div className="flex gap-16 md:gap-20">
          <div className="flex max-w-[150px] flex-col gap-6">
            <p className="text-sm text-white/40">Explore</p>
            <div className="flex flex-col gap-3">
              {explore.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-accent"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex max-w-[150px] flex-col gap-6">
            <p className="text-sm text-white/40">Socials</p>
            <div className="flex flex-col gap-3">
              {socials.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-accent"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col justify-between gap-2 border-t border-border pt-5 text-xs text-white/40 sm:flex-row">
        <p>© {new Date().getFullYear()} Zin Min Htet, All rights reserved.</p>
      </div>

      <div
        aria-hidden
        className="wordmark-gradient mt-6 select-none whitespace-nowrap text-center text-[13vw] font-medium leading-[0.9] tracking-[-0.05em]"
      >
        Zin Min Htet
      </div>
    </footer>
  );
}
