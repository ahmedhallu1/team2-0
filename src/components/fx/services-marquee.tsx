"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  prefersReducedMotion,
} from "@/lib/motion/gsap";
import { capabilities } from "@/lib/services";
import { BrandIcon } from "@/components/brand-icon";

const BASE_SPEED = 46; // px per second
const MAX_BOOST = 300;

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="marquee__track" aria-hidden={hidden || undefined}>
      {capabilities.map((item, i) => (
        <span
          key={item}
          className="inline-flex items-center gap-6 font-display text-2xl font-semibold whitespace-nowrap text-faint sm:text-3xl"
        >
          {item}
          {/* The mark as punctuation — every fourth beat lands in lime. */}
          <BrandIcon
            markFill={i % 4 === 3 ? "var(--lime-400)" : "currentColor"}
            arrowFill={i % 4 === 3 ? "var(--violet-500)" : "currentColor"}
            className={i % 4 === 3 ? "h-3.5 w-3.5" : "h-2.5 w-2.5 opacity-45"}
          />
        </span>
      ))}
    </div>
  );
}

/**
 * The delivery band. It drifts at a constant base speed and takes a nudge from
 * scroll velocity — faster and in the direction you are travelling — then eases
 * back to its resting pace. It stops for hover, for keyboard focus, when it
 * scrolls out of view, and when the tab is hidden.
 *
 * Under reduced motion it is a static, horizontally scrollable list: the same
 * content, no movement.
 */
export function ServicesMarquee() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const row = el.querySelector<HTMLElement>("[data-marquee-row]");
      const track = el.querySelector<HTMLElement>(".marquee__track");
      if (!row || !track) return;

      const state = { boost: 0 };
      let width = track.offsetWidth;
      let x = 0;
      let paused = false;
      let visible = true;
      let direction = 1;

      const setX = gsap.quickSetter(row, "x", "px");
      const tick = (_t: number, delta: number) => {
        if (paused || !visible || document.hidden) return;
        const speed = (BASE_SPEED + state.boost) * direction;
        x -= (speed * delta) / 1000;
        if (width > 0) {
          if (x <= -width) x += width;
          if (x > 0) x -= width;
        }
        setX(x);
      };
      gsap.ticker.add(tick);

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: ({ isActive }) => {
          visible = isActive;
        },
        onUpdate: (self) => {
          direction = self.direction < 0 ? -1 : 1;
          const boost = Math.min(
            MAX_BOOST,
            Math.abs(self.getVelocity()) / 14,
          );
          if (boost > state.boost) {
            gsap.killTweensOf(state);
            state.boost = boost;
            gsap.to(state, { boost: 0, duration: 1.4, ease: "power2.out" });
          }
        },
      });

      const measure = () => {
        width = track.offsetWidth;
      };
      const observer = new ResizeObserver(measure);
      observer.observe(track);

      const stop = () => {
        paused = true;
      };
      const go = () => {
        paused = false;
      };
      el.addEventListener("pointerenter", stop);
      el.addEventListener("pointerleave", go);
      el.addEventListener("focusin", stop);
      el.addEventListener("focusout", go);

      return () => {
        gsap.ticker.remove(tick);
        gsap.killTweensOf(state);
        trigger.kill();
        observer.disconnect();
        el.removeEventListener("pointerenter", stop);
        el.removeEventListener("pointerleave", go);
        el.removeEventListener("focusin", stop);
        el.removeEventListener("focusout", go);
      };
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      aria-label="What we deliver"
      className="relative border-y border-line bg-surface/40 py-7 sm:py-9"
    >
      {/* Both copies always render so there is no hydration divergence; under
          reduced motion CSS drops the duplicate and lets the band scroll. */}
      <div className="marquee">
        <div data-marquee-row className="flex">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
