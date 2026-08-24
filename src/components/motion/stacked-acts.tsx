"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion/tokens";
import { clsx } from "@/lib/clsx";

/**
 * The five services as a stack that builds under the scroll.
 *
 * Desktop keeps the CSS sticky stack: each act pins one header-row lower than
 * the last, so the sequence assembles into a legible stack of tabs and every
 * number and title stays on screen. Two things had to be fixed for it to
 * behave the same for all five cards:
 *
 *  1. `--svc-step` was a guess (3.25rem) and the header actually measures ~57px,
 *     so every card sat a few pixels off and clipped the one above. The step is
 *     now measured from the real header and re-measured on resize.
 *  2. A sticky box may only travel as far as the room left in its containing
 *     block's *content* box. The last card had none at all — it never pinned,
 *     and cards slid up past ones still stuck. Padding on the list does not
 *     help, because padding is outside the content box; the trailing spacer
 *     child below is what gives every card the same room to hold its place
 *     before the stack peels away in order.
 *
 * Below `lg` there is no stacking to watch, so the cards get scroll-linked
 * motion of their own instead: each rises and scales into place as it becomes
 * the card you are reading, then recedes as the next arrives. Most of this site
 * is read on a phone, so that path carries the same weight as the desktop one.
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
      if (!root) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        ":scope > .svc-stack__card",
        root,
      );
      if (!cards.length) return;

      /**
       * Pin the step to the header's real height. A hard-coded value drifts the
       * moment the font, the padding or the type scale changes.
       */
      const measure = () => {
        const head = cards[0].querySelector("[data-act-head]");
        if (!head) return;
        const h = Math.round(head.getBoundingClientRect().height);
        if (h > 0) root.style.setProperty("--svc-step", `${h}px`);
      };
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(root);

      if (prefersReducedMotion()) return () => observer.disconnect();

      const mm = gsap.matchMedia();

      /**
       * Desktop exit. Cards pinned in one containing block necessarily run out
       * of room in reverse order, so left alone the bottom card slides up over
       * the headers above it and the stack comes apart on its way out. Carrying
       * them up together over that same window means the assembled stack leaves
       * as the one object it spent the whole section becoming.
       */
      mm.add("(min-width: 1024px)", () => {
        const last = cards[cards.length - 1];
        gsap.to(cards, {
          y: () =>
            -(parseFloat(getComputedStyle(last).top) +
              last.getBoundingClientRect().height +
              64),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "bottom bottom-=140",
            end: "bottom bottom-=560",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });
      });

      // Phones: no stack, so the cards carry the motion themselves.
      mm.add("(max-width: 1023.98px)", () => {
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
              { y: 86, scale: 0.9 },
              { y: 0, scale: 1, ease: "power2.out", duration: 1 },
            )
            .to(panel, { duration: 0.5 })
            .to(panel, { y: -34, scale: 0.95, ease: "power2.in", duration: 1 });
        });
      });

      // The contents animate in their own right, once, as each act lands.
      cards.forEach((card) => {
        const head = card.querySelector("[data-act-head]");
        const body = card.querySelector("[data-act-body]");
        if (!head || !body) return;

        gsap
          .timeline({
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          })
          .from(head.children, {
            x: -18,
            opacity: 0,
            duration: DUR.base,
            ease: EASE.ascent,
            stagger: STAGGER.base,
          })
          .from(
            body.children,
            {
              y: 26,
              opacity: 0,
              duration: DUR.base,
              ease: EASE.ascent,
              stagger: STAGGER.base,
            },
            0.16,
          )
          .from(
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

      return () => {
        observer.disconnect();
        mm.revert();
      };
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className={clsx("svc-stack", className)}>
      {children}
      {/* Not decoration: this is the room every card sticks into. See the note
          on `.svc-stack` — the constraint is the content box, so the space has
          to be a real child rather than padding on the list. */}
      <li
        aria-hidden="true"
        role="presentation"
        className="svc-stack__hold hidden"
      />
    </ol>
  );
}
