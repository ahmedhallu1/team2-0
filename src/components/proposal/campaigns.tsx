"use client";

import { useRef, useState } from "react";
import { Leaf, Recycle, Trophy } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, STAGGER, TRIGGER_START } from "@/lib/motion/tokens";
import { SectionHead } from "@/components/proposal/section-head";
import { Rise } from "@/components/motion/reveal";
import { CupGlyph, Dot, KupMark } from "@/components/proposal/kup-glyphs";
import { campaigns, contentMonth } from "@/lib/proposals/kuphub";
import { proposalY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * Campaigns — the argument that a month of posts is not the same as a reason
 * to care.
 *
 * The lead idea is "One Cup", and it is here because it is the only thing in
 * the whole proposal that works *because* one owner has both companies: LinkUp
 * manufactures reusable cups with no minimum, KUPHUB has a branch inside
 * Smouha's ground, so a club-edition reusable cup costs them a print run and
 * nothing else. Every other campaign is built the same way — out of something
 * they already own rather than something they would have to go and buy.
 */
export function Campaigns() {
  const [open, setOpen] = useState(campaigns[0].id);
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.from(el.querySelectorAll("[data-campaign]"), {
        opacity: 0,
        y: 22,
        duration: DUR.base,
        ease: EASE.ascent,
        stagger: STAGGER.base,
        scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
      });
    },
    { scope: ref },
  );

  const hero = campaigns[0];

  return (
    <section
      id="campaigns"
      data-zone="kuphub"
      aria-labelledby="campaigns-heading"
      className={clsx("relative border-t border-line", proposalY)}
    >
      <div className={shell}>
        <SectionHead
          n="06"
          label="Campaigns, not posts"
          headingId="campaigns-heading"
          lines={["A reason to care,", "not just a discount."]}
          lede="Four campaigns, each built out of something both businesses already own. None of them needs a new product, a new partner or a new supplier to start."
        />

        {/* The lead idea gets a frame of its own. */}
        <Rise className="mt-12">
          <article
            className="concept relative overflow-hidden border border-line p-7 sm:p-10"
            style={{
              background:
                "linear-gradient(135deg, var(--surface-3), var(--surface-2) 62%)",
            }}
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <p className="flex flex-wrap items-center gap-2.5 text-[11px] font-semibold tracking-[0.24em] text-brand uppercase">
                  <Trophy size={14} aria-hidden />
                  KUPHUB × LinkUp × Smouha
                </p>

                <h3 className="mt-5 font-display text-[clamp(1.9rem,5vw,3.4rem)] leading-[0.92] font-extrabold tracking-[-0.035em] text-ink">
                  {hero.name}
                  <Dot className="ml-[0.08em] inline-block h-[0.11em] w-[0.11em] align-baseline" />
                </h3>
                {hero.arabic ? (
                  /* `dir` governs how the Arabic runs internally; the block
                     itself stays inline so it sits under the headline rather
                     than drifting to the far side of a seven-column box. */
                  <p
                    dir="rtl"
                    lang="ar"
                    className="mt-3 inline-block text-lg font-semibold text-muted"
                  >
                    {hero.arabic}
                  </p>
                ) : null}

                <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-ink">
                  {hero.line}
                </p>
                <p className="mt-4 max-w-xl border-l-2 border-accent pl-4 text-sm leading-relaxed text-muted">
                  {hero.because}
                </p>

                <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                  {hero.outputs.map((o) => (
                    <li
                      key={o}
                      className="flex gap-3 text-sm leading-snug text-ink"
                    >
                      <Leaf
                        size={14}
                        aria-hidden
                        className="mt-0.5 shrink-0 text-brand"
                      />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>

              {/* The club-edition cup, as it would be printed. */}
              <div className="lg:col-span-5">
                <div
                  className="relative mx-auto flex max-w-[15rem] flex-col items-center rounded-xl p-7"
                  style={{ background: "var(--kup)" }}
                >
                  <span className="text-[9px] font-semibold tracking-[0.24em] text-white/55 uppercase">
                    Club edition
                  </span>
                  <CupGlyph className="mt-4 h-40 text-white/85" />
                  <KupMark tone="light" className="mt-4 text-sm" />
                  <span
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold tracking-[0.12em] uppercase"
                    style={{ background: "var(--kup-amber)", color: "#1a1105" }}
                  >
                    <Recycle size={10} aria-hidden />
                    Rice husk · refillable
                  </span>
                  <span className="mt-3 text-center text-[10px] leading-snug text-white/50">
                    Made by LinkUp. Filled at Green Corner.
                  </span>
                </div>
              </div>
            </div>
          </article>
        </Rise>

        {/* The rest, as an accordion so the section stays short. */}
        <div ref={ref} className="mt-5 grid gap-3">
          {campaigns.slice(1).map((c) => {
            const isOpen = open === c.id;
            return (
              <div
                key={c.id}
                data-campaign
                className={clsx(
                  "rounded-xl border bg-surface transition-colors duration-400",
                  isOpen ? "border-accent" : "border-line",
                )}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`campaign-${c.id}`}
                    onClick={() => setOpen(isOpen ? "" : c.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                  >
                    <span className="min-w-0">
                      <span className="block font-display text-lg font-extrabold tracking-tight text-ink">
                        {c.name}
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        {c.line}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="hidden text-[10px] tracking-[0.16em] text-faint uppercase sm:inline">
                        {c.season}
                      </span>
                      <span
                        aria-hidden
                        className={clsx(
                          "text-xl leading-none text-brand transition-transform duration-300",
                          isOpen && "rotate-45",
                        )}
                      >
                        +
                      </span>
                    </span>
                  </button>
                </h3>

                <div id={`campaign-${c.id}`} hidden={!isOpen} className="px-5 pb-6 sm:px-6">
                  <p className="max-w-2xl border-l-2 border-line-2 pl-4 text-sm leading-relaxed text-muted">
                    {c.because}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {c.outputs.map((o) => (
                      <li
                        key={o}
                        className="rounded-full border border-line px-3 py-1.5 text-xs text-ink"
                      >
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* What a month looks like once the campaigns have a calendar. */}
        <Rise className="mt-14">
          <h3 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            And what a month actually looks like
          </h3>
          <div className="mt-6 overflow-hidden rounded-xl border border-line">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                A sample month of content across both businesses
              </caption>
              <thead>
                <tr className="bg-surface-2">
                  <th scope="col" className="p-3.5 text-[10px] font-semibold tracking-[0.18em] text-faint uppercase">
                    Week
                  </th>
                  <th scope="col" className="p-3.5 text-[10px] font-semibold tracking-[0.18em] text-faint uppercase">
                    KUPHUB
                  </th>
                  <th scope="col" className="p-3.5 text-[10px] font-semibold tracking-[0.18em] text-faint uppercase">
                    LinkUp
                  </th>
                </tr>
              </thead>
              <tbody>
                {contentMonth.map((row) => (
                  <tr key={row.week} className="border-t border-line bg-surface">
                    <td className="p-3.5 text-xs font-semibold text-brand">
                      {row.week}
                    </td>
                    <td className="p-3.5 text-sm text-ink">{row.kuphub}</td>
                    <td className="p-3.5 text-sm text-muted">{row.linkup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">
            Plus stories, replies and whatever the week actually brings — the
            calendar is the floor, not the ceiling.
          </p>
        </Rise>
      </div>
    </section>
  );
}
