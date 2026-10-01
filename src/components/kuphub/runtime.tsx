"use client";

import { useEffect } from "react";
import { refreshWhenSettled } from "@/lib/motion/gsap";

/**
 * The page's only global behaviour: below-the-fold reveals, and one
 * ScrollTrigger refresh once the webfont has landed (Alexandria is wide, so
 * every pinned measurement shifts when it swaps in).
 *
 * Reveals are an IntersectionObserver toggling a class — CSS does the motion.
 * The hidden state is only armed here, after hydration, and anything already
 * on screen at that moment is marked visible first, so nothing that has been
 * painted ever blinks out.
 */
export function KupRuntime() {
  useEffect(() => {
    const root = document.documentElement;
    const items = Array.from(document.querySelectorAll<HTMLElement>(".kup-reveal"));
    const vh = window.innerHeight;
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add("is-in");
    });
    root.classList.add("kup-js");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    items.forEach((el) => {
      if (!el.classList.contains("is-in")) io.observe(el);
    });

    const stop = refreshWhenSettled();
    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  return null;
}
