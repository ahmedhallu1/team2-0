import type { MetadataRoute } from "next";

const base = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://team2-0.vercel.app"
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{ path: string; priority: number }> = [
    { path: "/", priority: 1 },
    { path: "/work", priority: 0.9 },
    { path: "/services", priority: 0.9 },
    { path: "/process", priority: 0.7 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  }));
}
