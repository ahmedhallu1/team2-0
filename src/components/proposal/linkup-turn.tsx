"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/motion/gsap";
import { CupCanvas } from "@/components/proposal/cup/cup-canvas";
import type { CupState } from "@/components/proposal/cup/renderer";
import { popSetter, type Pop } from "@/components/proposal/cup/setters";
import { eyebrow } from "@/lib/ui";
import { shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * The turn — from one business to the other, without leaving the object.
 *
 * This is the hinge of the whole proposal, so it reuses the hero's cup rather
 * than introducing a new device: the KUPHUB print lifts off, the cup is a
 * blank again, the other buyers of that blank arrive around it, and the last
 * thing printed on it is LinkUp's own mark. Nobody has to be told the two
 * businesses are connected — they watch one become the other.
 *
 * The buyers are drawn as unnamed marks on purpose. LinkUp's customer list is
 * not ours to publish, and the point is the category, not the names.
 */

/**
 * Placed in a ring around the cup and kept out of the lower middle, where the
 * statement sits — an earlier arrangement put "a stadium" straight through the
 * headline. The last two are dropped on phones, where there is no ring to
 * speak of and six chips crowd the cup off its own stage.
 */
const BUYERS = [
  { label: "A café", at: "top-[22%] left-0 sm:left-[2%]" },
  { label: "A bakery", at: "top-[20%] right-0 sm:right-[2%]", small: false },
  { label: "A cloud kitchen", at: "bottom-[24%] left-0 sm:left-[3%]" },
  { label: "A juice bar", at: "right-0 bottom-[26%] sm:right-[3%]", small: false },
  { label: "A hotel", at: "top-0 left-[14%]" },
  { label: "A stadium", at: "top-[2%] right-[14%]" },
] as const;

function ramp(p: number, from: number, to: number): number {
  if (to <= from) return p >= to ? 1 : 0;
  const t = Math.min(1, Math.max(0, (p - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

/**
 * The reverse of the opening sequence, then forward into LinkUp.
 *
 * Two cross-fades share one progress value, so the halfway mark is where the
 * cup belongs to nobody — which is the longest-held frame in the scene and the
 * one the whole section is about.
 */
export function turnStateAt(p: number, base: CupState): CupState {
  const toBlank = p < 0.52;
  return {
    ...base,
    lift: 1,
    // Exactly one turn, so the scene ends with LinkUp's mark facing front.
    spin: 1.5 + p,
    label: toBlank ? "kuphub" : "blank",
    nextLabel: toBlank ? "blank" : "linkup",
    blend: toBlank ? ramp(p, 0.06, 0.36) : ramp(p, 0.68, 0.94),
    // The lid comes back down as the cup stops being anyone's in particular.
    lid: 1 - ramp(p, 0.08, 0.3),
    steam: (1 - ramp(p, 0.04, 0.22)) * 0.95,
  };
}

export function LinkUpTurn() {
  const root = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CupState>({
    spin: 1.5,
    lid: 1,
    blend: 0,
    label: "kuphub",
    nextLabel: "blank",
    steam: 0.95,
    time: 0,
    lift: 1,
    light: false,
  });

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const canvas = el.querySelector<HTMLElement>("[data-cup-canvas]");
      const kup = el.querySelector<HTMLElement>("[data-turn='kuphub']");
      const link = el.querySelector<HTMLElement>("[data-turn='linkup']");
      const buyers = gsap.utils.toArray<HTMLElement>("[data-buyer]", el);
      const poke = () => canvas?.dispatchEvent(new CustomEvent("cup:update"));

      if (prefersReducedMotion()) {
        // See the note in cup-scene.tsx: set before paint, so the scroller
        // collapses and the two statements read one after the other rather
        // than printed on top of each other.
        el.dataset.still = "true";
        el.querySelector("[data-cup-beats]")?.setAttribute("data-still", "true");
        Object.assign(stateRef.current, turnStateAt(1, stateRef.current));
        gsap.set([kup, link, ...buyers], { opacity: 1, y: 0, scale: 1 });
        poke();
        return;
      }

      const set = {
        kup: kup ? gsap.quickSetter(kup, "opacity") : null,
        link: link ? gsap.quickSetter(link, "opacity") : null,
        // See setters.ts — the compound `scale` alias cannot go through
        // `quickSetter` without throwing in WebKit.
        buyers: buyers.map((b) => popSetter(b)) as Pop[],
      };

      const apply = (p: number) => {
        Object.assign(stateRef.current, turnStateAt(p, stateRef.current));
        poke();
        // The two statements overlap rather than queue: an earlier cut left a
        // stretch in the middle of the scene with the cup on screen and no
        // words at all, which read as the page having lost its place.
        set.kup?.(1 - ramp(p, 0.34, 0.46));
        set.link?.(ramp(p, 0.44, 0.58));
        buyers.forEach((_, i) => {
          // In on the blank, out again as LinkUp's own mark lands.
          const a =
            ramp(p, 0.36 + i * 0.025, 0.47 + i * 0.025) * (1 - ramp(p, 0.66, 0.8));
          set.buyers[i](a, 0.82 + a * 0.18);
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
    { scope: root },
  );

  return (
    <section
      id="turn"
      aria-labelledby="turn-heading"
      className="relative border-t border-line"
    >
      <div ref={root} className="cup-scroll relative h-[240vh] lg:h-[300vh]">
        <div className="cup-stage sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div
            aria-hidden
            className="glow -z-10 top-1/4 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2"
            style={{ ["--glow" as string]: "var(--link)", ["--ambient" as string]: "0.6" }}
          />

          <div className={clsx(shell, "relative")}>
            <h2 id="turn-heading" className="sr-only">
              From KUPHUB to LinkUp Egypt
            </h2>

            <div className="relative mx-auto flex max-w-4xl flex-col items-center">
              <CupCanvas
                stateRef={stateRef}
                className="h-[clamp(16rem,44vh,26rem)] w-full max-w-[22rem]"
              />

              {/* Who else buys the blank. `display: contents` by default, so each
                  chip still positions against the stage; in the static state
                  the list becomes a real row (see `.buyer-ring`). */}
              <ul className="buyer-ring">
                {BUYERS.map((b) => (
                <li
                  key={b.label}
                  data-buyer
                  style={{ opacity: 0 }}
                  className={clsx(
                    "pointer-events-none absolute z-10 rounded-full border border-line-2 bg-surface/85 px-2.5 py-1 text-[9px] font-semibold tracking-[0.14em] text-muted uppercase backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-xs",
                    "small" in b && b.small === false ? "hidden sm:block" : undefined,
                    b.at,
                  )}
                >
                  {b.label}
                </li>
                ))}
              </ul>

              {/* The two statements, cross-faded through the same frame */}
              <div
                data-cup-beats
                className="cup-beats relative mt-6 grid w-full max-w-xl text-center"
              >
                <div data-turn="kuphub" data-beat>
                  <p className={clsx(eyebrow, "mb-3")}>07 — The turn</p>
                  <p className="font-display text-[clamp(1.4rem,3.6vw,2.4rem)] leading-[1.06] font-extrabold tracking-[-0.025em] text-balance text-ink">
                    Take the name off, and it&apos;s a different business.
                  </p>
                </div>

                <div data-turn="linkup" data-beat style={{ opacity: 0 }}>
                  <p
                    className="mb-3 text-[11px] font-semibold tracking-[0.3em] uppercase"
                    style={{ color: "var(--link-ink)" }}
                  >
                    LinkUp Egypt
                  </p>
                  <p className="font-display text-[clamp(1.4rem,3.6vw,2.4rem)] leading-[1.06] font-extrabold tracking-[-0.025em] text-balance text-ink">
                    KUPHUB is one customer of this cup.
                  </p>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-pretty text-muted">
                    LinkUp sells the blank — reusable PP, rice husk, printed in
                    the mould with whoever&apos;s logo, and no minimum order.
                    Thirty-six thousand people follow it. None of them have a
                    website to go to.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
