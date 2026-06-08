import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "2.0 — Elevate your vision",
    short_name: "2.0",
    description:
      "A B2B growth partner: international leads, digital platforms, content, SEO, media buying, market research and supplier sourcing.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
