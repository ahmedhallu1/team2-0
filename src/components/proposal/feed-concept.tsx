"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, TRIGGER_START } from "@/lib/motion/tokens";
import { SectionHead } from "@/components/proposal/section-head";
import { ConceptTile } from "@/components/proposal/concept-tile";
import { Compare } from "@/components/proposal/compare";
import { Rise } from "@/components/motion/reveal";
import { kuphubFeed } from "@/lib/proposals/kuphub";
import { sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * The proposal's centre of gravity: nine designed frames instead of a
 * paragraph promising nine designed frames.
 *
 * The grid assembles rather than fades — each tile arrives on its own short
 * delay along a diagonal, which is the one moment on the page where a stagger
 * is doing real work: it makes you read the grid as a grid being *built*,
 * which is the whole argument of the section.
 */
export function FeedConcept() {
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = grid.current;
      if (!el || prefersReducedMotion()) return;
      const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", el);
      gsap.from(tiles, {
        opacity: 0,
        scale: 0.9,
        y: 26,
        duration: DUR.slow,
        ease: EASE.ascent,
        // Diagonal rather than row-by-row: the grid resolves from one corner
        // like a contact sheet being laid out.
        stagger: { each: 0.055, from: "start", grid: [3, 3], axis: undefined },
        scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
      });
    },
    { scope: grid },
  );

  return (
    <section
      id="feed"
      aria-labelledby="feed-heading"
      className={clsx("relative border-t border-line", sectionY)}
    >
      <div
        aria-hidden
        className="glow glow--tucked -z-10 top-0 -right-40 h-[30rem] w-[30rem]"
        style={{ ["--glow" as string]: "var(--kup)" }}
      />

      <div className={shell}>
        <SectionHead
          n="04"
          label="Don't tell them — show them"
          headingId="feed-heading"
          lines={["Same offers.", "One system."]}
          lede={
            <>
              Nine frames, designed against the offers already running:
              Business Morning, Ibn El Nady, Match &amp; Mix, the Turkish at
              twenty pounds. Nothing invented, nothing dropped — arranged so
              that next week&apos;s post is a fill-in rather than a redesign.
            </>
          }
        />

        <div ref={grid} className="mt-14">
          <div className="feed-scroll no-scrollbar sm:grid sm:grid-cols-3 sm:gap-2.5 lg:gap-3">
            {kuphubFeed.map((post) => (
              <ConceptTile key={post.id} post={post} />
            ))}
          </div>
          <Rise as="p" className="mt-5 text-xs leading-relaxed text-faint">
            Concept work by 2.0, made for this proposal. Where a live campaign
            would carry a photograph, these frames carry the shape of one —
            photography and video direction would be part of the work, not
            borrowed from the existing feed.
          </Rise>
        </div>

        {/* The system rules, said once. */}
        <Rise>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: "One message a frame",
                b: "The offer, or the product, or the place. Never all three.",
              },
              {
                t: "Four colourways",
                b: "Forest, cream, caramel, ink. The grid stays recognisable when you scroll past it.",
              },
              {
                t: "The mark, always placed",
                b: "Same corner, same size, every post. That repetition is the brand.",
              },
              {
                t: "Both languages, set properly",
                b: "Arabic is not a caption under the English. It is part of the composition.",
              },
            ].map((rule) => (
              <li key={rule.t} className="bg-surface p-5 sm:p-6">
                <h3 className="font-display text-base font-bold tracking-tight text-ink">
                  {rule.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{rule.b}</p>
              </li>
            ))}
          </ul>
        </Rise>

        {/* The same offer, both ways. */}
        <div className="mt-20 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-5">
            <h3 className="font-display text-[clamp(1.6rem,3.6vw,2.5rem)] leading-[1.02] font-extrabold tracking-[-0.02em] text-ink">
              One offer.
              <br />
              Drag it across.
            </h3>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              Both of these are ours — we didn&apos;t repost anything from the
              feed, and we didn&apos;t make the left one worse to win the
              argument. It carries exactly what a single frame is currently
              asked to carry. The question is only which one you can publish
              fifty-two times a year.
            </p>
          </div>
          <div className="lg:col-span-7">
            <Compare />
          </div>
        </div>
      </div>
    </section>
  );
}
