"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";

/**
 * The footer's closing statement: the promise set oversized and cropped by the
 * bottom of the page, drifting a little as you reach it. Decorative — the same
 * words already appear as readable copy above — so it is hidden from assistive
 * technology rather than read out twice.
 */
export function FooterStatement() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const type = el.querySelector("[data-statement]");
      gsap.fromTo(
        type,
        { yPercent: 16 },
        {
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.6,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none mt-14 h-[0.62em] overflow-hidden font-display text-[clamp(3.5rem,15vw,13rem)] leading-[0.8] font-extrabold tracking-[-0.045em] select-none"
    >
      <div data-statement className="text-ink/[0.07]">
        Elevate your vision
      </div>
    </div>
  );
}
