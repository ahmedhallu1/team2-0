import { NextResponse, type NextRequest } from "next/server";
import { stores } from "@/lib/kuphub/site";

/**
 * kuphub.elevate2point0.com/app — one link for both stores.
 *
 * The QR code and every "in the app" button point here. A phone goes straight
 * to its own store; anything else (a laptop, a crawler) is sent back to the
 * app section of the site, where both badges are.
 *
 * iPadOS Safari reports itself as a Mac, so an iPad lands on the site rather
 * than the App Store — one extra tap, and better than guessing wrong.
 */
export function GET(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";

  if (/iPhone|iPad|iPod/i.test(ua)) return NextResponse.redirect(stores.appStore, 302);
  if (/Android/i.test(ua)) return NextResponse.redirect(stores.googlePlay, 302);

  const host = request.headers.get("host") ?? "";
  const home = host.startsWith("kuphub.") ? "/#app" : "/kuphub#app";
  return NextResponse.redirect(new URL(home, request.nextUrl.origin), 302);
}
