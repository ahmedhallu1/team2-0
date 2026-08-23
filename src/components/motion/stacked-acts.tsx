"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion/tokens";
import { clsx } from "@/lib/clsx";

/**
 * Choreography for the stacked service acts.
 *
 * Two layers, because the sequence has to work at both ends of the range:
 *
 *  - Every card, every width, gets an entrance — the card lifts in, its header
 *    row resolves, then the body and the included items follow. Without this
 *    the stack was just boxes that appeared, which read as static on phones
 *    where there is no stacking to watch.
 *  - On desktop the covered card recedes: as the next act slides over it, its
 *    body drifts up and dims, so the stack gains depth instead of one opaque
 *    panel simply occluding another. The header strip is never touched — every
 *    number and title stays at full contrast, which is what makes the stack
 *    readable in the first place.
 *
 * The markup stays in the server component; this only reaches in by data
 * attribute, so none of the copy ships twice.
 */
export function StackedActs({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;

      const cards = gsap.utils.toArray<HTMLElement>(":scope > li", root);
      if (!cards.length) return;

      cards.forEach((card) => {
        const panel = card.querySelector("[data-act-panel]");
        const head = card.querySelector("[data-act-head]");
        const body = card.querySelector("[data-act-body]");
        if (!panel || !head || !body) return;

        gsap
          .timeline({
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          })
          .from(panel, {
            y: 48,
            opacity: 0,
            duration: DUR.slow,
            ease: EASE.ascent,
          })
          .from(
            head.children,
            {
              y: 16,
              opacity: 0,
              duration: DUR.base,
              ease: EASE.ascent,
              stagger: STAGGER.base,
            },
            0.14,
          )
          .from(
            body.children,
            {
              y: 24,
              opacity: 0,
              duration: DUR.base,
              ease: EASE.ascent,
              stagger: STAGGER.base,
            },
            0.22,
          )
          .from(
            card.querySelectorAll("[data-act-item]"),
            {
              y: 10,
              opacity: 0,
              duration: DUR.fast,
              ease: EASE.ascent,
              stagger: STAGGER.tight,
            },
            0.34,
          );
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          const body = card.querySelector("[data-act-body]");
          if (!next || !body) return;
          gsap.to(body, {
            y: -28,
            opacity: 0.2,
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top 88%",
              end: "top 42%",
              scrub: true,
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className={clsx("svc-stack", className)}>
      {children}
    </ol>
  );
}
