"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE } from "@/lib/motion/tokens";
import { AscentHeading } from "@/components/motion/ascent-heading";
import { Rise } from "@/components/motion/reveal";
import { Magnetic } from "@/components/fx/magnetic";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { CupGlyph, KupMark, LinkMark } from "@/components/proposal/kup-glyphs";
import { contactEmail, phones } from "@/lib/contact";
import { actionGhost, actionPrimary, eyebrow } from "@/lib/ui";
import { shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * The close.
 *
 * No pricing, no packages, no form. The proposal's job was to make the next
 * conversation worth having, and the only thing asked for here is that
 * conversation — with the two people who would be in it already named.
 *
 * The three marks resolving into one line is the last beat of the cup story:
 * the object both businesses share, and the studio that would sit behind it.
 */
export function Closing() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const marks = el.querySelectorAll("[data-mark]");
      const cup = el.querySelector("[data-close-cup]");

      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 72%", once: true } })
        .from(marks, {
          opacity: 0,
          y: 24,
          duration: DUR.slow,
          ease: EASE.ascent,
          stagger: 0.14,
        })
        .from(
          cup,
          { opacity: 0, y: 40, scale: 0.9, duration: DUR.scene, ease: EASE.ascent },
          0.1,
        );
    },
    { scope: ref },
  );

  return (
    <section
      id="next"
      aria-labelledby="next-heading"
      className="relative isolate overflow-hidden border-t border-line py-24 sm:py-32 lg:py-40"
    >
      <div
        aria-hidden
        className="ascent-grid -z-10"
        style={{ ["--grid-x" as string]: "8rem", ["--grid-y" as string]: "10rem" }}
      />
      <div
        aria-hidden
        className="glow glow--tucked -z-10 -bottom-52 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2"
        style={{ ["--glow" as string]: "var(--violet-500)" }}
      />

      <div className={clsx(shell, "relative")}>
        <div ref={ref} className="flex flex-col items-center text-center">
          <span data-close-cup className="inline-block">
            <CupGlyph className="h-24 text-ink opacity-25 sm:h-28" />
          </span>

          <p className={clsx(eyebrow, "mt-8")}>12 — Where this goes next</p>

          <AscentHeading
            as="h2"
            id="next-heading"
            className="mt-6 font-display text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.92] font-extrabold tracking-[-0.03em] text-ink"
            lines={["Let's build", <span key="l" className="text-gradient-brand">what&apos;s next.</span>]}
          />

          {/* The three marks, on one line, at last. */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <span data-mark>
              <KupMark tone="light" className="text-2xl sm:text-3xl" />
            </span>
            <span data-mark aria-hidden className="text-2xl text-faint sm:text-3xl">
              ×
            </span>
            <span data-mark>
              <LinkMark className="text-2xl sm:text-3xl" />
            </span>
            <span data-mark aria-hidden className="text-2xl text-faint sm:text-3xl">
              ×
            </span>
            <span
              data-mark
              className="font-display text-2xl font-extrabold tracking-[-0.04em] text-ink sm:text-3xl"
            >
              2.0
            </span>
          </div>

          <Rise
            as="p"
            delay={0.1}
            className="mx-auto mt-9 max-w-xl text-base leading-relaxed text-pretty text-muted"
          >
            Two domains you already own, four branches, a range nobody has a
            page for, and thirty-six thousand people waiting on one channel.
            The next step isn&apos;t a contract — it&apos;s an hour to decide
            which of the two we start with.
          </Rise>

          <Rise
            delay={0.16}
            className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center"
          >
            <Magnetic>
              <Link href="/contact" className={actionPrimary}>
                Start the conversation
                <ArrowUpRight
                  size={17}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href={phones[0].whatsappHref}
                target="_blank"
                rel="noreferrer"
                className={actionGhost}
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp us
              </a>
            </Magnetic>
          </Rise>

          <Rise delay={0.22} className="mt-10">
            <a
              href={`mailto:${contactEmail}?subject=${encodeURIComponent("KUPHUB × LinkUp — next step")}`}
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
            >
              <Mail size={15} aria-hidden className="text-brand" />
              {contactEmail}
            </a>
          </Rise>
        </div>

        {/* Where this page came from, and what it is. */}
        <footer className="mt-24 border-t border-line pt-8">
          <div className="flex flex-col gap-4 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
            <p>
              Prepared by 2.0 for KUPHUB and LinkUp Egypt · September 2026 ·
              Private — not indexed.
            </p>
            <p>
              All concept work shown is speculative and made for this proposal.
              Brand names, product details and public posts belong to their
              owners.
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
