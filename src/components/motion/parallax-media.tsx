"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { clsx } from "@/lib/clsx";

/**
 * Low-amplitude image parallax. Deliberately gated with `gsap.matchMedia()` to
 * pointer-capable widths with motion allowed — on phones the effect costs more
 * than it gives, and it must not exist at all under reduced motion.
 *
 * The media sits in an oversized inner box so travelling never exposes an edge.
 */
export function ParallaxMedia({
  children,
  className,
  amount = 6,
}: {
  children: ReactNode;
  className?: string;
  /** Peak travel as a percentage of the media's own height. */
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const inner = el.querySelector("[data-parallax]");
      if (!inner) return;

      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Grow the media only while it actually travels, so every other
          // context frames the artwork exactly as authored.
          const bleed = amount + 2;
          gsap.set(inner, {
            top: `-${bleed}%`,
            height: `${100 + bleed * 2}%`,
          });
          gsap.fromTo(
            inner,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          );
        },
      );
      return () => mm.revert();
    },
    { scope: ref, dependencies: [amount] },
  );

  return (
    <div ref={ref} className={clsx("relative overflow-hidden", className)}>
      <div data-parallax className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
