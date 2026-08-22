"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion/tokens";
import { Magnetic } from "@/components/fx/magnetic";
import { shell } from "@/lib/layout";

/**
 * The culmination of the ascent. The brand mark opens out of nothing — the
 * panel behind the type is literally masked by the burst, expanding until it
 * fills the band — and the last thing left standing is "Get in touch".
 *
 * The band keeps the dark canvas in both themes: it is the one moment the site
 * commits to full contrast, and lime reads hardest against it.
 */
export function CtaBand({
  title = "Ready to elevate your vision?",
  subtitle = "Tell us where you want to grow — we'll show you how 2.0 can help.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const mask = el.querySelector(".brand-mask");
      const items = el.querySelectorAll("[data-cta-item]");

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
      tl.fromTo(
        mask,
        { "--mask-size": "0%", rotate: -35 },
        {
          "--mask-size": "100%",
          rotate: 0,
          duration: 1.6,
          ease: EASE.ascent,
        },
      ).fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: DUR.slow,
          ease: EASE.ascent,
          stagger: STAGGER.base,
        },
        0.25,
      );
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#0a0a0b] py-24 sm:py-32 lg:py-40"
    >
      <div
        aria-hidden
        className="ascent-grid opacity-40"
        style={{ ["--grid-x" as string]: "8rem", ["--grid-y" as string]: "8rem" }}
      />
      {/* Centring lives on the wrapper so GSAP owns the inner transform alone.
          The mask ends at 100%, where the burst exactly fills its box — any
          larger and the shape stops reading as the mark. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(56rem,135vw)] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="brand-mask h-full w-full opacity-[0.28]"
          style={{
            background:
              "conic-gradient(from 210deg, var(--violet-500), var(--lime-400) 45%, var(--violet-500))",
          }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(78% 68% at 50% 50%, rgba(10,10,11,0.55), rgba(10,10,11,0.88))",
        }}
      />

      <div className={shell}>
        <div className="relative mx-auto max-w-3xl text-center">
          <h2
            data-cta-item
            className="rise font-display text-[clamp(2.25rem,6vw,4.25rem)] leading-[1] font-extrabold tracking-[-0.03em] text-balance text-white"
          >
            {title}
          </h2>
          <p
            data-cta-item
            className="rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-pretty text-white/70 sm:text-lg"
          >
            {subtitle}
          </p>
          <div data-cta-item className="rise mt-10 flex justify-center">
            <Magnetic>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 text-base font-bold tracking-tight text-[#0a0a0b] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Get in touch
                <ArrowRight
                  size={18}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
