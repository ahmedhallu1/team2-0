"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, STAGGER, TRIGGER_START } from "@/lib/motion/tokens";
import { SectionHead } from "@/components/proposal/section-head";
import { sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * Why a calendar beats a queue.
 *
 * The argument is structural, so the section is a structure: four pillars, and
 * what each one produces in a month. Choosing a pillar swaps the outputs — the
 * point being that the brand is the fixed part and the posts are the variable,
 * which is the opposite of how a feed built one graphic at a time works.
 *
 * Implemented as a proper tablist: arrow keys move between pillars, the panel
 * is labelled by its tab, and with JavaScript off all four panels are present
 * in the markup and simply read as four lists.
 */

const PILLARS = [
  {
    id: "product",
    title: "Product",
    line: "What is in the kup.",
    share: "40%",
    outputs: [
      "A product frame a week — one drink, shot properly",
      "The Match & Mix range as a set, not seven separate posts",
      "A 40-second pour reel, monthly",
      "Seasonal launches with a look of their own",
    ],
  },
  {
    id: "offer",
    title: "Offer",
    line: "The reason to come today.",
    share: "25%",
    outputs: [
      "Business Morning, in the same frame every time it runs",
      "Ibn El Nady as a weekend fixture",
      "One template, filled in — not redesigned",
      "Stories that expire when the offer does",
    ],
  },
  {
    id: "place",
    title: "Place",
    line: "Four branches, four characters.",
    share: "20%",
    outputs: [
      "A branch film for each address",
      "Green Corner as its own destination",
      "Opening hours and directions people can actually find",
      "The club ground, when the club is playing",
    ],
  },
  {
    id: "people",
    title: "People",
    line: "Who makes it and who drinks it.",
    share: "15%",
    outputs: [
      "The baristas, named",
      "Hiring posts that look like the brand",
      "Customer content, reposted with a frame around it",
      "Replies, in both languages, inside the day",
    ],
  },
] as const;

export function ContentSystem() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.from(el.querySelectorAll("[data-pillar]"), {
        opacity: 0,
        y: 24,
        duration: DUR.base,
        ease: EASE.ascent,
        stagger: STAGGER.base,
        scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
      });
    },
    { scope: ref },
  );

  // Panels cross-fade on change; the list itself never moves.
  useGSAP(
    () => {
      const panel = ref.current?.querySelector("[data-panel-live]");
      if (!panel || prefersReducedMotion()) return;
      gsap.fromTo(
        panel.querySelectorAll("li"),
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: DUR.fast,
          ease: EASE.ascent,
          stagger: STAGGER.tight,
        },
      );
    },
    { dependencies: [active], scope: ref },
  );

  /** Roving focus, the way a tablist is meant to behave. */
  function onKey(event: React.KeyboardEvent) {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (active + delta + PILLARS.length) % PILLARS.length;
    setActive(next);
    tabsRef.current
      ?.querySelectorAll<HTMLButtonElement>("[role=tab]")
      [next]?.focus();
  }

  return (
    <section
      id="system"
      aria-labelledby="system-heading"
      className={clsx("relative border-t border-line", sectionY)}
    >
      <div className={shell}>
        <SectionHead
          n="06"
          label="Social, as a system"
          headingId="system-heading"
          lines={["Not more posts.", "A shape that repeats."]}
          lede={
            <>
              Right now every post is a fresh decision. A system makes most of
              those decisions once: four pillars, a fixed share of the month
              each, and a frame already designed for whatever goes in it.
            </>
          }
        />

        <div ref={ref} className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* The pillars */}
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Content pillars"
            aria-orientation="vertical"
            onKeyDown={onKey}
            className="flex gap-2.5 overflow-x-auto pb-1 lg:col-span-5 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {PILLARS.map((p, i) => (
              <button
                key={p.id}
                data-pillar
                role="tab"
                type="button"
                id={`pillar-${p.id}`}
                aria-selected={i === active}
                aria-controls={`panel-${p.id}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className={clsx(
                  "group relative shrink-0 rounded-xl border p-5 text-left transition-colors duration-400 lg:w-full",
                  i === active
                    ? "border-accent bg-surface"
                    : "border-line bg-surface/50 hover:border-line-2",
                )}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-lg font-extrabold tracking-tight text-ink">
                    {p.title}
                  </span>
                  <span
                    className={clsx(
                      "font-display text-sm font-bold tabular-nums",
                      i === active ? "text-brand" : "text-faint",
                    )}
                  >
                    {p.share}
                  </span>
                </div>
                <p className="mt-1.5 hidden text-sm text-muted lg:block">{p.line}</p>

                {/* The share, drawn — a month is a fixed amount of space. */}
                <span
                  aria-hidden
                  className="mt-3 hidden h-[3px] w-full rounded-full bg-line lg:block"
                >
                  <span
                    className="block h-full rounded-full transition-all duration-700"
                    style={{
                      width: p.share,
                      background: i === active ? "var(--accent)" : "var(--line-2)",
                    }}
                  />
                </span>
              </button>
            ))}
          </div>

          {/* What that pillar produces */}
          <div className="lg:col-span-7">
            {PILLARS.map((p, i) => (
              <div
                key={p.id}
                id={`panel-${p.id}`}
                role="tabpanel"
                aria-labelledby={`pillar-${p.id}`}
                hidden={i !== active}
                data-panel-live={i === active ? "" : undefined}
                className="rounded-xl border border-line bg-surface p-6 sm:p-8"
              >
                <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                  {p.title} — what it produces
                </p>
                <ul className="mt-5 space-y-3.5">
                  {p.outputs.map((o) => (
                    <li key={o} className="flex gap-3.5 text-sm leading-relaxed text-ink">
                      <span
                        aria-hidden
                        className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      {o}
                    </li>
                  ))}
                </ul>
                <p className="mt-7 border-t border-line pt-5 text-sm leading-relaxed text-muted">
                  Every one of those is a frame that already exists. Publishing
                  it is filling it in.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
