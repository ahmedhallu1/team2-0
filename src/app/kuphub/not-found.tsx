import type { Metadata } from "next";
import { KupLogo, LessIsMore } from "@/components/kuphub/brand";

export const metadata: Metadata = {
  title: "Page not found — KUPHUB",
  // Next adds its own `noindex` too; this one overrides the layout's `index`.
  robots: { index: false, follow: false },
};

/** KUPHUB's 404, in its own palette — no trace of 2.0. */
export default function KupNotFound() {
  // /kuphub is home on our host, and next.config redirects it to `/` on
  // KUPHUB's — so one link serves both without reading the request (which
  // would make the whole segment dynamic).
  const home = "/kuphub";

  return (
    <main
      id="main"
      className="kup-grain flex min-h-svh flex-col items-center justify-center px-6 py-20 text-center"
    >
      <KupLogo className="w-28 sm:w-32" priority />
      <p className="mt-10 text-xs font-semibold tracking-[0.24em] text-caramel-300 uppercase">
        404 · الصفحة غير موجودة
      </p>
      <h1 className="mt-5 text-[clamp(2.4rem,7vw,4.4rem)] leading-[0.92] font-black tracking-[-0.05em]">
        This kup is empty.
      </h1>
      <p className="mt-6 max-w-sm text-lg leading-relaxed text-cream/75">
        The page you were after isn&rsquo;t on the board. The menu, the app and
        all four branches are one tap away.
      </p>
      <a
        href={home}
        className="mt-10 inline-flex items-center gap-3 rounded-full bg-caramel px-7 py-4 font-bold text-bean transition-transform duration-300 hover:-translate-y-0.5"
      >
        Back to KUPHUB <span aria-hidden>→</span>
      </a>
      <LessIsMore className="mt-14 text-[11px] font-semibold text-cream/60" />
    </main>
  );
}
