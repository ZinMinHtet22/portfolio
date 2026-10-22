import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactPanel } from "@/components/contact/ContactPanel";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zin Min Htet — Full-stack Developer",
    template: "%s — Zin Min Htet",
  },
  description: siteDescription,
  keywords: [
    "full-stack developer",
    "React",
    "Next.js",
    "Laravel",
    "TypeScript",
    "portfolio",
    "Myanmar developer",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: "Zin Min Htet — Full-stack Developer",
    description: siteDescription,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Zin Min Htet" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zin Min Htet — Full-stack Developer",
    description: siteDescription,
    images: ["/og.png"],
  },
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
