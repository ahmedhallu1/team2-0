"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { EASE } from "@/lib/motion/tokens";
import { BrandIcon } from "@/components/brand-icon";
import { introSkipped, rememberIntroPlayed } from "@/lib/motion/intro";

/**
 * The brand splash — the site's first gesture, and the first half of one
 * continuous move that ends with the hero.
 *
 * Sequence (≈1.2s): the glow breathes in · the burst resolves from a compact
 * state and locks · the lime chevron rises through it · the canvas wipes
 * upward to uncover the page. The wipe starts at 0.58s, which is when the
 * hero's own CSS entrance is mid-rise, so the two read as one continuous move
 * without the hero having to wait on this timeline to paint.
 *
 * Plays only on the first hard load of a session. Repeat loads, reduced-motion
 * visitors and pages opened in a background tab skip it entirely.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // A tab loaded in the background gets no rAF, so the timeline would sit
      // frozen over the page until it is focused. Skip straight to the site.
      if (introSkipped() || document.hidden) {
        rememberIntroPlayed();
        gsap.set(el, { display: "none" });
        return;
      }

      const glow = el.querySelector(".preloader__glow");
      const mark = el.querySelector(".preloader__mark");
      const burst = el.querySelector("[data-burst]");
      const chevron = el.querySelector("[data-chevron]");

      const tl = gsap.timeline({
        onComplete: () => {
          rememberIntroPlayed();
          gsap.set(el, { display: "none" });
        },
      });

      tl.set(mark, { transformOrigin: "50% 50%" })
        .set([burst, chevron], { transformOrigin: "50% 50%" })
        .fromTo(
          glow,
          { opacity: 0, scale: 0.72 },
          { opacity: 0.85, scale: 1, duration: 0.6, ease: EASE.ascent },
          0,
        )
        .fromTo(
          burst,
          { opacity: 0, scale: 0.55, rotate: -120 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.66, ease: EASE.ascent },
          0.04,
        )
        .fromTo(
          chevron,
          { opacity: 0, yPercent: 55 },
          { opacity: 1, yPercent: 0, duration: 0.4, ease: EASE.ascent },
          0.3,
        )
        // The canvas separates upward and the mark leaves with it.
        // Stop swallowing clicks the moment the page starts showing through.
        .add(() => gsap.set(el, { pointerEvents: "none" }), 0.58)
        .to(
          mark,
          { y: -72, opacity: 0, duration: 0.5, ease: EASE.exit },
          0.58,
        )
        .to(glow, { opacity: 0, duration: 0.4, ease: EASE.exit }, 0.58)
        .to(
          el,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.58,
            ease: EASE.precise,
          },
          0.6,
        );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="preloader" aria-hidden="true">
      <div className="preloader__glow" />
      <div className="preloader__mark">
        <BrandIcon
          markFill="var(--ink)"
          arrowFill="var(--accent)"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
