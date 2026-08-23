"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { clsx } from "@/lib/clsx";

/**
 * Low-amplitude image parallax, gated with `gsap.matchMedia()` so it never
 * exists under reduced motion. It runs at every width — at a smaller amplitude
 * on phones, where a large travel would be more distracting than alive.
 *
 * The media sits in an oversized inner box so travelling never exposes an edge.
 */
export function ParallaxMedia({
  children,
  className,
  amount: amountProp = 6,
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
        {
          wide: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          narrow:
            "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const amount = context.conditions?.wide
            ? amountProp
            : amountProp * 0.6;
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
    { scope: ref, dependencies: [amountProp] },
  );

  return (
    <div ref={ref} className={clsx("relative overflow-hidden", className)}>
      <div data-parallax className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
