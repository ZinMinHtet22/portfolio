import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getProjects } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/work", "/about", "/testimonials", "/resume", "/contact"];
  const projects = getProjects().map((p) => `/work/${p.slug}`);

  return [...routes, ...projects].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : route.startsWith("/work") ? 0.8 : 0.7,
  }));
}
