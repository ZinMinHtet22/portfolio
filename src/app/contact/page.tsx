import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about projects, roles, or collaborations.",
};

const channels = [
  {
    label: "Email",
    value: "jefferyyas8@gmail.com",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=jefferyyas8@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/zin-min-htet-a167b42b5",
    href: "https://www.linkedin.com/in/zin-min-htet-a167b42b5",
  },
  {
    label: "GitHub",
    value: "github.com/ZinMinHtet22",
    href: "https://github.com/ZinMinHtet22",
  },
];

export default function ContactPage() {
  return (
    <div className="px-5 pt-36 md:px-10 md:pt-44">
      <SectionHeading
        eyebrow="Contact"
        title="Let's work together."
        description="Open to freelance projects, collaborations, and full-time opportunities. Drop a message and I'll reply as soon as I can."
      />

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-3xl border border-border bg-surface p-7 md:p-9">
            <ContactForm />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {channels.map((ch) => (
            <a
              key={ch.label}
              href={ch.href}
              target={ch.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group block rounded-3xl border border-border bg-surface p-7 transition-all duration-200 hover:border-white/20"
            >
              <p className="text-xs uppercase tracking-wider text-white/40">
                {ch.label}
              </p>
              <p className="mt-2 flex items-center gap-2 break-all text-sm font-medium text-accent underline decoration-transparent underline-offset-4 transition-all duration-200 group-hover:translate-x-1 group-hover:decoration-accent/50">
                {ch.value}
                <span aria-hidden>→</span>
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
