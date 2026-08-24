"use client";

import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";

/**
 * Scroll-linked motion for the case-study chapters on small screens.
 *
 * On desktop each chapter's identity column is sticky, so the copy holds while
 * the evidence scrolls past it — that pinning *is* the animation. Below `lg`
 * there is nothing to pin against, which left the work page as a sequence of
 * one-shot reveals and noticeably flatter than the desktop it mirrors.
 *
 * So on phones the chapter carries the motion itself: the number drives in from
 * the margin, the whole chapter lifts as it enters, and the tint behind it
 * opens up. All scrubbed, so it tracks the finger rather than firing once.
 *
 * Mounted once and reaching out by attribute, so the chapters themselves stay
 * server-rendered — the same approach the portfolio rail already uses.
 */
export function ChapterMotion() {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia();
    mm.add("(max-width: 1023.98px)", () => {
      document.querySelectorAll<HTMLElement>("[data-chapter]").forEach((ch) => {
        const grid = ch.querySelector("[data-chapter-grid]");
        const number = ch.querySelector("[data-chapter-number]");
        const glow = ch.querySelector("[data-chapter-glow]");

        if (grid) {
          gsap.fromTo(
            grid,
            { y: 54 },
            {
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ch,
                start: "top bottom",
                end: "top 40%",
                scrub: 0.6,
              },
            },
          );
        }
        if (number) {
          gsap.fromTo(
            number,
            { x: -34, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ch,
                start: "top 92%",
                end: "top 58%",
                scrub: 0.5,
              },
            },
          );
        }
        if (glow) {
          gsap.fromTo(
            glow,
            { scale: 0.5, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ch,
                start: "top bottom",
                end: "center 60%",
                scrub: 0.8,
              },
            },
          );
        }
      });
    });
    return () => mm.revert();
  }, []);

  return null;
}
