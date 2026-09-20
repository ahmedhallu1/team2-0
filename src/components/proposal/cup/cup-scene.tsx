"use client";

import { useMemo, useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/motion/gsap";
import { CupCanvas } from "./cup-canvas";
import { popSetter, type Pop } from "./setters";
import type { CupState } from "./renderer";
import { clsx } from "@/lib/clsx";
import { shell } from "@/lib/layout";
import { eyebrow } from "@/lib/ui";

/**
 * The cup sequence — the spine of the proposal.
 *
 * Four beats, one scrubbed timeline, one pinned frame. Everything the cup does
 * is derived from a single progress value by `cupStateAt`, which is a pure
 * function: the scroll path and the reduced-motion path call the same code, one
 * with sixty values a second and one with a single value, and they cannot drift
 * apart.
 *
 * The beat copy is authored in the markup, not injected. Without JavaScript,
 * with reduced motion, or to a screen reader, the section reads as four short
 * captioned statements in order — which is exactly what it says out loud.
 */

type Beat = {
  n: string;
  lede: string;
  body: string;
  /** Window on the master timeline. */
  at: [number, number];
};

const BEATS: Beat[] = [
  {
    n: "01",
    lede: "Before it is a brand, it is a blank.",
    body: "Reusable PP. Six to sixteen ounces. Printed with whatever the buyer wants on it. LinkUp Egypt makes this one.",
    at: [0.0, 0.26],
  },
  {
    n: "02",
    lede: "Then somebody puts a name on it.",
    body: "KUPHUB fills it, four addresses across Alexandria, every day. Same object. Different business.",
    at: [0.24, 0.5],
  },
  {
    n: "03",
    lede: "And the customer decides what they think.",
    body: "Before the first sip. From the print, the photograph, the post that brought them in, and whether there was anywhere to go and look.",
    at: [0.48, 0.74],
  },
  {
    n: "04",
    lede: "Four things decide that.",
    body: "Identity, content, a website, and the work of putting all three in front of people. 2.0 would run all four — for both businesses.",
    at: [0.72, 1.0],
  },
];

const LAYERS = [
  { label: "Identity", corner: "tl" },
  { label: "Content", corner: "tr" },
  { label: "Website", corner: "bl" },
  { label: "Growth", corner: "br" },
] as const;

/** Smooth 0→1 ramp between two points. */
function ramp(p: number, from: number, to: number): number {
  if (to <= from) return p >= to ? 1 : 0;
  const t = Math.min(1, Math.max(0, (p - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

/**
 * The whole sequence as one function of progress. Exported so the static
 * fallback and the live scrub cannot disagree about what the cup is doing.
 */
export function cupStateAt(p: number, base: CupState): CupState {
  const printed = ramp(p, 0.2, 0.36);
  return {
    ...base,
    lift: ramp(p, 0, 0.1),
    /**
     * A turn and a half, arranged so the wordmark is square to the viewer at
     * two moments that matter: when the print lands (p ≈ 0.35) and when the
     * four layers name themselves at the end. The strip carries the mark at
     * its centre, so "facing us" means a spin of ½ plus any whole turn.
     */
    spin: -0.038 + p * 1.538,
    blend: printed,
    label: "blank",
    nextLabel: "kuphub",
    lid: ramp(p, 0.5, 0.72),
    steam: ramp(p, 0.56, 0.82) * 0.95,
  };
}

/** Opacity for a beat at the given progress — in, hold, out. */
function beatAlpha(p: number, [from, to]: [number, number], last: boolean): number {
  const fade = 0.055;
  const rise = ramp(p, from, from + fade);
  const fall = last ? 1 : 1 - ramp(p, to - fade, to);
  return Math.min(rise, fall);
}

export function CupScene() {
  const root = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CupState>({
    spin: 0,
    lid: 0,
    blend: 0,
    label: "blank",
    nextLabel: "kuphub",
    steam: 0,
    time: 0,
    lift: 0,
    light: false,
  });

  /**
   * The frame a reduced-motion visitor gets: the end of the sequence, which is
   * also the only point where the wordmark is square to the viewer — printed,
   * open and steaming, with every beat readable at once.
   */
  const restState = useMemo(() => 1, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const canvas = el.querySelector<HTMLElement>("[data-cup-canvas]");
      const beats = gsap.utils.toArray<HTMLElement>("[data-beat]", el);
      const layers = gsap.utils.toArray<HTMLElement>("[data-layer]", el);
      const ticks = gsap.utils.toArray<HTMLElement>("[data-tick]", el);
      const poke = () =>
        canvas?.dispatchEvent(new CustomEvent("cup:update"));

      if (prefersReducedMotion()) {
        // `useGSAP` runs in a layout effect, so these attributes land before
        // the browser paints: the scroller collapses and the beats un-stack
        // without the static reader ever seeing the animated arrangement.
        el.dataset.still = "true";
        el.querySelector("[data-cup-beats]")?.setAttribute("data-still", "true");
        Object.assign(stateRef.current, cupStateAt(restState, stateRef.current));
        gsap.set(beats, { opacity: 1, y: 0 });
        gsap.set(layers, { opacity: 1, scale: 1 });
        gsap.set(ticks, { opacity: 1 });
        poke();
        return;
      }

      const setters = {
        beat: beats.map((b) => ({
          o: gsap.quickSetter(b, "opacity") as (v: number) => void,
          y: gsap.quickSetter(b, "y", "px") as (v: number) => void,
        })),
        // See setters.ts — `quickSetter` cannot express GSAP's compound
        // `scale` alias, and trying throws on every frame in WebKit.
        layer: layers.map((l) => popSetter(l)) as Pop[],
      };

      const apply = (p: number) => {
        Object.assign(stateRef.current, cupStateAt(p, stateRef.current));
        poke();

        BEATS.forEach((beat, i) => {
          const a = beatAlpha(p, beat.at, i === BEATS.length - 1);
          setters.beat[i].o(a);
          setters.beat[i].y((1 - a) * 22);
          ticks[i]?.setAttribute("data-on", a > 0.4 ? "true" : "false");
        });

        layers.forEach((_, i) => {
          const a = ramp(p, 0.78 + i * 0.035, 0.87 + i * 0.035);
          setters.layer[i](a, 0.86 + a * 0.14);
        });
      };

      apply(0);

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.45,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });

      return () => trigger.kill();
    },
    { scope: root, dependencies: [restState] },
  );

  return (
    <section
      aria-labelledby="cup-heading"
      className="relative"
      // The pinned frame is one viewport; the scroll length above it is what
      // the timeline is scrubbed against. Shorter on phones, where the same
      // distance costs far more thumb travel.
    >
      <div ref={root} className="cup-scroll relative h-[340vh] lg:h-[420vh]">
        <div className="cup-stage sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          <div
            aria-hidden
            className="ascent-grid -z-10"
            style={{ ["--grid-x" as string]: "8rem", ["--grid-y" as string]: "10rem" }}
          />
          <div
            aria-hidden
            className="glow -z-10 top-[8%] left-1/2 h-[34rem] w-[34rem] -translate-x-1/2"
            style={{ ["--glow" as string]: "#0c4f28", ["--ambient" as string]: "0.85" }}
          />

          <div className={clsx(shell, "relative flex min-h-0 flex-1 flex-col pt-20 sm:pt-24")}>
            <h2 id="cup-heading" className="sr-only">
              One cup, and everything it carries
            </h2>

            {/* The stage */}
            <div className="cup-arena relative flex min-h-0 flex-1 items-center justify-center pb-2">
              <ul className="layer-ring">
                {LAYERS.map((layer, i) => (
                <li
                  key={layer.label}
                  data-layer
                  style={{ opacity: 0 }}
                  className={clsx(
                    "pointer-events-none absolute z-10 inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface/80 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-ink uppercase backdrop-blur-sm sm:px-4 sm:text-xs",
                    layer.corner === "tl" && "top-[6%] left-0 sm:top-[10%] sm:left-[4%]",
                    layer.corner === "tr" && "top-[6%] right-0 sm:top-[10%] sm:right-[4%]",
                    layer.corner === "bl" && "bottom-[6%] left-0 sm:bottom-[14%] sm:left-[4%]",
                    layer.corner === "br" && "right-0 bottom-[6%] sm:right-[4%] sm:bottom-[14%]",
                  )}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: i % 2 ? "var(--violet-500)" : "var(--accent)" }}
                  />
                  {layer.label}
                </li>
                ))}
              </ul>

              <CupCanvas
                stateRef={stateRef}
                className="h-full max-h-[clamp(19rem,60vh,40rem)] w-full max-w-[clamp(15rem,34vw,32rem)]"
              />
            </div>

            {/* The beats — stacked in one frame, cross-faded by the scrub */}
            <div className="relative shrink-0 pb-10 sm:pb-14">
              <div data-cup-beats className="cup-beats relative mx-auto grid max-w-2xl">
                {BEATS.map((beat, i) => (
                  <div
                    key={beat.n}
                    data-beat
                    style={{ opacity: i === 0 ? 1 : 0 }}
                    className="text-center"
                  >
                    <p className={clsx(eyebrow, "mb-3")}>{beat.n}</p>
                    <p className="font-display text-[clamp(1.35rem,3.4vw,2.25rem)] leading-[1.12] font-extrabold tracking-[-0.02em] text-balance text-ink">
                      {beat.lede}
                    </p>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-pretty text-muted">
                      {beat.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Where we are in the sequence */}
              <ol
                data-cup-ticks
                className="mt-7 flex items-center justify-center gap-2"
                aria-hidden
              >
                {BEATS.map((beat) => (
                  <li
                    key={beat.n}
                    data-tick
                    data-on="false"
                    className="h-[3px] w-8 rounded-full bg-line-2 transition-colors duration-500 data-[on=true]:bg-accent sm:w-12"
                  />
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
