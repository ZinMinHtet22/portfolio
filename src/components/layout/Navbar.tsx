"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getProjects } from "@/lib/data";
import { ContactTrigger } from "@/components/contact/ContactTrigger";

type NavItem = { href: string; label: string; detail?: string };

const workItems: NavItem[] = [
  { href: "/work", label: "All projects", detail: "Overview" },
  ...getProjects().map((p) => ({
    href: `/work/${p.slug}`,
    label: p.title,
    detail: p.category,
  })),
];

const aboutItems: NavItem[] = [
  { href: "/about", label: "About", detail: "Background & skills" },
  { href: "/testimonials", label: "Testimonials", detail: "Kind words" },
  { href: "/resume", label: "Resume", detail: "CV & experience" },
];

const groups: { label: string; href?: string; items?: NavItem[] }[] = [
  { label: "Home", href: "/" },
  { label: "Work", items: workItems },
  { label: "About", items: aboutItems },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between px-5 py-5 md:px-10">
        <Link
          href="/"
          className="text-lg font-medium tracking-[-0.03em] text-white"
        >
          Zin Min Htet<span className="text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {groups.map((group) => {
            const active = group.href
              ? group.href === "/"
                ? pathname === "/"
                : pathname.startsWith(group.href)
              : group.items?.some((i) =>
                  i.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(i.href),
                );

            if (group.href) {
              return (
                <Link
                  key={group.label}
                  href={group.href}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-medium text-white/85 transition-all duration-200 hover:translate-x-0.5 hover:bg-white/10 hover:text-white",
                    active && "bg-white/10 text-white",
                  )}
                >
                  {group.label}
                </Link>
              );
            }

            return (
              <div
                key={group.label}
                className="group relative"
                tabIndex={0}
              >
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-white/85 transition-all duration-200 hover:bg-white/10 group-hover:text-white group-focus-within:text-white",
                    active && "bg-white/10 text-white",
                  )}
                  aria-haspopup="true"
                >
                  {group.label}
                  <span
                    aria-hidden
                    className="text-[10px] text-white/55 transition-transform duration-200 group-hover:rotate-180 group-hover:text-white"
                  >
                    ▼
                  </span>
                </button>

                <div className="invisible absolute left-1/2 top-full w-[260px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="rounded-[24px] border border-white/10 bg-[rgba(21,21,21,0.85)] p-2 shadow-2xl backdrop-blur-[10px]">
                    {group.items?.map((item, i) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex flex-col gap-0.5 rounded-[16px] px-4 py-3 transition-all duration-200 hover:bg-white/5 hover:translate-x-1",
                          i > 0 && "border-t border-white/5",
                          pathname === item.href && "bg-white/5",
                        )}
                      >
                        <span className="text-sm text-white/80">
                          {item.label}
                        </span>
                        {item.detail ? (
                          <span className="text-xs text-white/40">
                            {item.detail}
                          </span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ContactTrigger className="hidden md:inline-flex" />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-sm text-white/70 transition-colors hover:text-white md:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mx-4 rounded-[24px] border border-border bg-[rgba(21,21,21,0.9)] p-6 backdrop-blur-[10px] md:hidden">
          <nav className="flex flex-col">
            {[
              ...groups.flatMap((g) =>
                g.items ? g.items : [{ href: g.href!, label: g.label }],
              ),
              { href: "/contact", label: "Contact" },
            ].map((link, i, arr) => (
              <Link
                key={`${link.href}-${i}`}
                href={link.href}
                className={cn(
                  "border-b border-white/5 py-3.5 text-lg text-white/80 transition-all duration-200 hover:translate-x-1 hover:text-white",
                  i === arr.length - 1 && "border-b-0",
                  i === 0 && "pt-0",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mt-6 text-xs text-white/40">Socials</p>
          <div className="mt-2 flex flex-col gap-2">
            <a
              href="https://github.com/ZinMinHtet22"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-accent"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/zin-min-htet-a167b42b5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-accent"
            >
              LinkedIn
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
