import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactPanel } from "@/components/contact/ContactPanel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zin Min Htet — Full-stack Developer",
    template: "%s — Zin Min Htet",
  },
  description:
    "Full-stack developer portfolio — projects, experience, and contact.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ContactPanel />
      </body>
    </html>
  );
}
