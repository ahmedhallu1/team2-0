import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { actionGhost, actionPrimary, eyebrow, h1 } from "@/lib/ui";
import { sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

export const metadata: Metadata = {
  title: "Page not found",
  // Next adds its own `noindex` too; this one overrides the layout's `index`.
  robots: { index: false, follow: true },
};

const routes = [
  { href: "/work", label: "Our work" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "How we work" },
  { href: "/about", label: "About" },
];

/**
 * 2.0's 404 — reached through `[...missing]`, so it keeps the header and
 * footer. Static and motion-free: a dead end should cost nothing to render
 * and offer the way back immediately.
 */
export default function NotFound() {
  return (
    <section className={clsx("relative overflow-x-clip", sectionY)}>
      <div
        aria-hidden
        className="glow -z-10 top-0 left-1/2 h-[26rem] w-[40rem] max-w-[130vw] -translate-x-1/2"
        style={{ ["--glow" as string]: "var(--violet-500)" }}
      />
      <div className={clsx(shell, "pt-10 text-center sm:pt-16")}>
        <BrandIcon
          markFill="var(--ink)"
          arrowFill="var(--accent)"
          className="mx-auto h-16 w-16 sm:h-20 sm:w-20"
        />
        <p className={clsx(eyebrow, "mt-8")}>Error 404</p>
        <h1 className={clsx(h1, "mx-auto mt-5 max-w-3xl text-balance")}>
          This page didn&rsquo;t make the 2.0.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-pretty text-muted sm:text-lg">
          The link may be old, or the address mistyped. Everything we do is
          one step away.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className={actionPrimary}>
            Back to home
            <ArrowRight
              size={17}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <Link href="/contact" className={actionGhost}>
            Get in touch
          </Link>
        </div>
        <nav aria-label="Popular pages" className="mt-14">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
            {routes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className="font-semibold text-muted transition-colors hover:text-brand"
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
