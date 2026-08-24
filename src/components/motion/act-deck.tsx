"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion/tokens";
import { clsx } from "@/lib/clsx";

/**
 * The five services as a deck that assembles under the scroll.
 *
 * This used to be a CSS sticky stack, and the sticky was the problem: a sticky
 * element is bounded by the room left inside its containing block, so the last
 * card had almost none and unstuck *first* — cards slid up past ones that were
 * still pinned, and the fourth never closed like the rest. There is no arrangement
 * of offsets that fixes that; the constraint is structural.
 *
 * So nothing is pinned now. Each card owns one scrubbed timeline across its own
 * travel: it rises and scales into place, holds while it is the card you are
 * reading, then recedes a little as the next one arrives. Because the motion is
 * driven by the card's own position rather than by sticky offsets, every card
 * behaves identically — and it behaves the same on a phone as on a desktop,
 * which is where most of this site is read.
 *
 * The recede is scale and travel only. Dimming it made a card that was not yet
 * fully covered look like a rendering fault.
 */
export function ActDeck({
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

      const mm = gsap.matchMedia();

      mm.add(
        {
          wide: "(min-width: 1024px)",
          narrow: "(max-width: 1023.98px)",
        },
        (context) => {
          const narrow = Boolean(context.conditions?.narrow);
          // Phones get the larger move: the card is most of the screen, so the
          // same travel that reads as a nudge on a desktop barely registers.
          const rise = narrow ? 86 : 64;
          const from = narrow ? 0.9 : 0.93;
          const recede = narrow ? 0.95 : 0.965;

          cards.forEach((card) => {
            const panel = card.querySelector("[data-act-panel]");
            if (!panel) return;

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                },
              })
              .fromTo(
                panel,
                { y: rise, scale: from },
                { y: 0, scale: 1, ease: "power2.out", duration: 1 },
              )
              .to(panel, { duration: 0.5 })
              .to(panel, {
                y: -34,
                scale: recede,
                ease: "power2.in",
                duration: 1,
              });
          });
        },
      );

      // The contents animate in their own right, once, as each card lands.
      cards.forEach((card) => {
        const head = card.querySelector("[data-act-head]");
        const rule = card.querySelector("[data-act-rule]");
        const body = card.querySelector("[data-act-body]");
        if (!head || !body) return;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
        });

        tl.from(head.children, {
          x: -18,
          opacity: 0,
          duration: DUR.base,
          ease: EASE.ascent,
          stagger: STAGGER.base,
        });
        if (rule) {
          tl.fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, duration: DUR.slow, ease: EASE.ascent },
            0.1,
          );
        }
        tl.from(
          body.children,
          {
            y: 26,
            opacity: 0,
            duration: DUR.base,
            ease: EASE.ascent,
            stagger: STAGGER.base,
          },
          0.16,
        ).from(
          card.querySelectorAll("[data-act-item]"),
          {
            y: 12,
            opacity: 0,
            duration: DUR.fast,
            ease: EASE.ascent,
            stagger: STAGGER.tight,
          },
          0.3,
        );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className={clsx("act-deck", className)}>
      {children}
    </ol>
  );
}
