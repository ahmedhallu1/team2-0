import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { AscentHeading } from "@/components/motion/ascent-heading";
import { Rise } from "@/components/motion/reveal";
import { Magnetic } from "@/components/fx/magnetic";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { ContourField } from "@/components/proposal/geoarabia/contour-field";
import { contactEmail, phones } from "@/lib/contact";
import { actionGhost, actionPrimary, eyebrow } from "@/lib/ui";
import { shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * The close. The prices are already on the table one section up, so all this
 * asks for is a decision on what starts in October, and the one thing we need
 * from GeoArabia to start: their own material. Every concept above is drawn
 * from scans, models and sites we haven't seen yet.
 *
 * No portfolio strip, by request — the page is about them.
 */
const needs = [
  "Photos and scans from past projects",
  "The three competitors you watch in Riyadh",
  "Your company profile, if one exists",
  "Access to the domain and the Facebook page",
];

export function GeoClosing() {
  return (
    <section
      id="next"
      data-zone="geo"
      aria-labelledby="next-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32 lg:py-36"
    >
      <ContourField className="-z-10 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_100%,#000,transparent)]" />

      <div className={clsx(shell, "relative")}>
        <div className="flex flex-col items-center text-center">
          <p className={eyebrow}>05 — Next</p>

          <AscentHeading
            as="h2"
            id="next-heading"
            className="mt-6 font-display text-[clamp(2.4rem,8vw,5.25rem)] leading-[0.92] font-extrabold tracking-[-0.03em] text-ink"
            lines={["Let's put GeoArabia", <span key="l" className="text-gradient-brand">on the map.</span>]}
          />

          <Rise
            as="p"
            delay={0.1}
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-pretty text-muted"
          >
            Pick what starts in October and we&apos;ll send the agreement the
            same week. The site goes live in November, in time for Cityscape.
          </Rise>

          <Rise delay={0.14} className="mt-10 w-full max-w-2xl">
            <h3 className="text-[11px] font-semibold tracking-[0.22em] text-faint uppercase">
              What we need from you to start
            </h3>
            <ul className="mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line text-left sm:grid-cols-2">
              {needs.map((n, i) => (
                <li key={n} className="flex items-baseline gap-3 bg-surface p-4 text-sm text-ink">
                  <span className="font-display text-xs font-bold text-accent tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {n}
                </li>
              ))}
            </ul>
          </Rise>

          <Rise
            delay={0.18}
            className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center"
          >
            <Magnetic>
              <a
                href={phones[0].whatsappHref}
                target="_blank"
                rel="noreferrer"
                className={actionPrimary}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Confirm on WhatsApp
              </a>
            </Magnetic>
            <Magnetic>
              <Link href="/contact" className={actionGhost}>
                Book a call
                <ArrowUpRight
                  size={17}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Magnetic>
          </Rise>

          <Rise delay={0.22} className="mt-8">
            <a
              href={`mailto:${contactEmail}?subject=${encodeURIComponent("GeoArabia — next step")}`}
              className="inline-flex items-center gap-2 py-2.5 text-sm text-muted transition-colors hover:text-ink"
            >
              <Mail size={15} aria-hidden className="text-brand" />
              {contactEmail}
            </a>
          </Rise>
        </div>

        <footer className="mt-20 border-t border-line pt-8">
          <div className="flex flex-col gap-4 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
            <p>
              Prepared by <span className="font-semibold text-muted">2.0</span> for
              GeoArabia · September 2026 · Private, not indexed.
            </p>
            <p>
              Concept work is speculative and made for this proposal. Search
              results and page details as seen on 27 September 2026.
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
