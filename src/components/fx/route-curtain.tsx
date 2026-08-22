"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { EASE } from "@/lib/motion/tokens";
import { BrandIcon } from "@/components/brand-icon";

/**
 * The branded page transition: a client-side navigation lands already covered
 * by the brand canvas, which then wipes upward off the new page while the mark
 * rises out of it — the loader's gesture, compressed to ~600ms.
 *
 * It is set in a layout effect, so the covered state is painted on the same
 * frame the new route commits; there is no flash of the incoming page. It is
 * purely decorative: aria-hidden, pointer-events none, and skipped entirely
 * for reduced-motion visitors and on the first load (which the loader owns).
 */
export function RouteCurtain() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (first.current) {
        first.current = false;
        return;
      }
      if (prefersReducedMotion()) return;

      const mark = el.querySelector(".route-curtain__mark");
      const tl = gsap.timeline({
        onComplete: () => gsap.set(el, { visibility: "hidden", opacity: 0 }),
      });

      tl.set(el, {
        visibility: "visible",
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0%)",
      })
        .fromTo(
          mark,
          { opacity: 0, scale: 0.72, rotate: -30 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.34, ease: EASE.ascent },
          0,
        )
        .to(
          el,
          { clipPath: "inset(0% 0% 100% 0%)", duration: 0.52, ease: EASE.precise },
          0.16,
        )
        .to(mark, { y: -70, opacity: 0, duration: 0.42, ease: EASE.exit }, 0.16);
    },
    { dependencies: [pathname] },
  );

  return (
    <div ref={ref} className="route-curtain" aria-hidden="true">
      <div className="route-curtain__mark">
        <BrandIcon
          markFill="var(--ink)"
          arrowFill="var(--accent)"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
