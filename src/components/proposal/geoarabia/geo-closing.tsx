import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { AscentHeading } from "@/components/motion/ascent-heading";
import { Rise } from "@/components/motion/reveal";
import { Magnetic } from "@/components/fx/magnetic";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { ContourField } from "@/components/proposal/geoarabia/contour-field";
import { requiredAssets } from "@/lib/proposals/geoarabia";
import { rmz } from "@/lib/proposals/rmz";
import { RmzLogo } from "@/components/proposal/rmz-logo";
import { actionGhost, actionPrimary, eyebrow } from "@/lib/ui";
import { shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * The close. The prices are already on the table one section up, so all this
 * asks for is a decision on what starts in October, and the one thing we need
 * from GeoArabia to start: their own material — the asset list from the
 * content-strategy deck, plus access. Every post above is made from it.
 *
 * No portfolio strip, by request — the page is about them.
 */
const needs = [
  ...requiredAssets,
  "Access to the domain, the site and the social pages",
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
          <p className={eyebrow}>07 — Next</p>

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
            same week. The domain is connected in October, and the first
            articles are live in November, in time for Cityscape.
          </Rise>

          <Rise delay={0.14} className="mt-10 w-full max-w-3xl">
            <h3 className="text-[11px] font-semibold tracking-[0.22em] text-faint uppercase">
              What we need from you to start
            </h3>
            <ul className="mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line text-left sm:grid-cols-2 lg:grid-cols-3">
              {needs.map((n, i) => (
                <li
                  key={n}
                  className={clsx(
                    "flex items-baseline gap-3 bg-surface p-4 text-sm text-ink",
                    // Access is the odd one out — give it the full row.
                    i === needs.length - 1 && "sm:col-span-2 lg:col-span-3",
                  )}
                >
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
                href={rmz.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className={actionPrimary}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Confirm on WhatsApp
              </a>
            </Magnetic>
            <Magnetic>
              <a href={`tel:${rmz.phone.e164}`} className={actionGhost}>
                <Phone size={16} aria-hidden />
                Call {rmz.phone.display}
              </a>
            </Magnetic>
          </Rise>

          <Rise
            delay={0.22}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-1"
          >
            <a
              href={`mailto:${rmz.email}?subject=${encodeURIComponent("GeoArabia — next step")}`}
              className="inline-flex items-center gap-2 py-2.5 text-sm text-muted transition-colors hover:text-ink"
            >
              <Mail size={15} aria-hidden className="text-brand" />
              {rmz.email}
            </a>
            <a
              href={rmz.linkedin}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 py-2.5 text-sm text-muted transition-colors hover:text-ink"
            >
              RMZtech on LinkedIn
              <ArrowUpRight size={14} aria-hidden className="text-brand" />
            </a>
          </Rise>

          {/* Who it is from — the presenting agency's lockup, once, at the end. */}
          <Rise delay={0.26} className="mt-12">
            <a href={rmz.site} target="_blank" rel="noreferrer" aria-label="RMZtech — The Platform">
              <RmzLogo className="text-xl" />
            </a>
          </Rise>
        </div>

        <footer className="mt-20 border-t border-line pt-8">
          <div className="flex flex-col gap-4 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
            <p>
              Prepared by <span className="font-semibold text-muted">RMZtech</span> for
              GeoArabia · October 2026 · Private, not indexed.
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
