import type { NextRequest } from "next/server";
import { site } from "@/lib/kuphub/site";

/**
 * KUPHUB's own web manifest.
 *
 * The file-based `app/manifest.ts` belongs to 2.0 and is linked from every
 * root layout, so "Add to Home Screen" on KUPHUB's site used to install an
 * icon called "2.0". This one is KUPHUB's, and opens wherever its home is on
 * the host it was installed from — `/` on kuphub.elevate2point0.com, `/kuphub`
 * on ours.
 */
export function GET(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const home = host.startsWith("kuphub.") ? "/" : "/kuphub";

  return Response.json(
    {
      name: `${site.name} — Less is more`,
      short_name: site.name,
      description: "Premium koffee & kup to go. Four addresses in Alexandria, one app.",
      id: home,
      start_url: home,
      scope: home,
      display: "standalone",
      background_color: "#061a0e",
      theme_color: "#061a0e",
      icons: [
        { src: "/kuphub/icon.png", sizes: "192x192", type: "image/png" },
        { src: "/kuphub/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    {
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
