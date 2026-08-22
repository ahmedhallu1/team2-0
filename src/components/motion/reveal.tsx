"use client";

import {
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, RISE, STAGGER, TRIGGER_START } from "@/lib/motion/tokens";
import { clsx } from "@/lib/clsx";

type Distance = keyof typeof RISE;

/** Keeps the CSS start state and the tween's `from` value identical. */
function riseVar(distance: Distance): CSSProperties {
  return { ["--rise-d" as string]: `${RISE[distance]}px` };
}

/**
 * The scroll-entrance patterns the site uses below the fold. They share one rule: the
 * hidden state lives in CSS behind `.js`, so content is always present for
 * crawlers, keyboard users and anyone without JavaScript — GSAP only ever
 * animates *from* that state, never into a permanent one.
 */

/**
 * Restrained rise — a single block arriving from below.
 *
 * `eager` swaps the scroll trigger for the CSS first-paint entrance. Use it for
 * anything above the fold: there is no scroll to wait for, and a block that
 * only appears once GSAP has hydrated is exactly what pushes LCP out.
 */
export function Rise({
  children,
  as,
  className,
  style,
  delay = 0,
  distance = "md",
  eager = false,
  index = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  distance?: Distance;
  eager?: boolean;
  /** Stagger position within an eager group. */
  index?: number;
}) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || eager || prefersReducedMotion()) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: RISE[distance] },
        {
          opacity: 1,
          y: 0,
          duration: DUR.slow,
          ease: EASE.ascent,
          delay,
          scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
        },
      );
    },
    { scope: ref, dependencies: [delay, distance, eager] },
  );

  if (eager) {
    return (
      <Tag
        ref={ref}
        className={clsx("enter-rise", className)}
        style={{ ["--enter-i" as string]: index, ...style }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={clsx("rise", className)}
      style={{ ...riseVar(distance), ...style }}
    >
      {children}
    </Tag>
  );
}

/** Restrained stagger — direct children ascend in sequence. */
export function RiseGroup({
  children,
  as,
  className,
  delay = 0,
  distance = "md",
  stagger = STAGGER.base,
  eager = false,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  distance?: Distance;
  stagger?: number;
  /** Above the fold: hand the entrance to CSS. See `Rise`. */
  eager?: boolean;
}) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || eager || prefersReducedMotion()) return;
      gsap.fromTo(
        Array.from(el.children),
        { opacity: 0, y: RISE[distance] },
        {
          opacity: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE.ascent,
          delay,
          stagger,
          scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
        },
      );
    },
    { scope: ref, dependencies: [delay, distance, stagger, eager] },
  );

  if (eager) {
    return (
      <Tag ref={ref} className={clsx("enter-rise", className)}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={clsx("rise-group", className)}
      style={riseVar(distance)}
    >
      {children}
    </Tag>
  );
}

/**
 * Image curtain — the frame uncovers upward while the artwork settles back to
 * its natural scale, so the picture feels revealed rather than faded in.
 */
export function Curtain({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const media = el.querySelector(".curtain__media");
      const tl = gsap.timeline({
        delay,
        scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
        // A rectangular inset() left in place would square off the frame's
        // rounded corners, so drop it entirely once the reveal is done.
        onComplete: () => gsap.set(el, { clipPath: "none" }),
      });
      tl.fromTo(
        el,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: DUR.scene,
          ease: EASE.ascent,
        },
      );
      if (media) {
        tl.fromTo(
          media,
          { scale: 1.07 },
          { scale: 1, duration: DUR.scene + 0.3, ease: EASE.ascent },
          0,
        );
      }
    },
    { scope: ref, dependencies: [delay] },
  );

  return (
    <div ref={ref} className={clsx("curtain", className)}>
      {children}
    </div>
  );
}
