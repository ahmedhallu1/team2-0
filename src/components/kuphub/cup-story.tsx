"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/motion/gsap";
import { CupCanvas } from "@/components/proposal/cup/cup-canvas";
import { popSetter, type Pop } from "@/components/proposal/cup/setters";
import type { CupState } from "@/components/proposal/cup/renderer";
import { StoreButtons } from "./brand";
import { clsx } from "@/lib/clsx";

/**
 * The opening of the site: a hero that turns into a short story as you scroll,
 * told by the cup.
 *
 * The cup is the canvas renderer from the proposal — a real cylindrical wrap
 * of the KUPHUB print, not a picture — driven here by three inputs at once:
 *
 *   time   the arrival (it lands blank, then the print goes on) and a slow
 *          sway, so it is never quite still while you read;
 *   hand   drag it sideways and it spins, keeps spinning, and settles back
 *          with the mark facing you;
 *   scroll two full turns across the scene, the lid lifting off on the second
 *          beat and the steam rising on the third.
 *
 * They are summed into one CupState each frame, so none of them fights the
 * others. Above-the-fold copy animates from CSS (transform only), never from
 * this file — the headline is painted on the first frame regardless of when
 * JavaScript arrives.
 */

type Beat = {
  n: string;
  lead: string;
  tail: string;
  body: string;
  /** Window on the scroll timeline. */
  at: [number, number];
};

const BEATS: Beat[] = [
  {
    n: "01",
    lead: "Less",
    tail: "waiting.",
    body: "Order ahead in the app. Pick it up on your way, or have it brought to your door.",
    at: [0.12, 0.36],
  },
  {
    n: "02",
    lead: "Less",
    tail: "fuss.",
    body: "Your size, your milk, your extra shot. Every cup made exactly the way you take it.",
    at: [0.34, 0.58],
  },
  {
    n: "03",
    lead: "More",
    tail: "koffee.",
    body: "Turkish, cappuccino, cold brew over ice — poured at four addresses across Alexandria.",
    at: [0.56, 0.8],
  },
  {
    n: "04",
    lead: "Kup",
    tail: "to go.",
    body: "Premium koffee in a cup worth carrying. That's the whole idea: less is more.",
    at: [0.78, 1],
  },
];

const CHIPS = [
  { label: "Hot", pos: "top-[14%] left-[4%] sm:left-[10%]" },
  { label: "Iced", pos: "top-[20%] right-[2%] sm:right-[8%]" },
  { label: "Pickup", pos: "bottom-[22%] left-[2%] sm:left-[8%]" },
  { label: "Delivery", pos: "bottom-[16%] right-[4%] sm:right-[12%]" },
] as const;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
/** Smooth 0→1 between two points of progress. */
const ramp = (p: number, a: number, b: number) => smooth(clamp((p - a) / (b - a)));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function beatAlpha(p: number, [a, b]: [number, number], last: boolean) {
  const fade = 0.05;
  const up = ramp(p, a, a + fade);
  const down = last ? 1 : 1 - ramp(p, b - fade, b);
  return Math.min(up, down);
}

export function CupStory() {
  const root = useRef<HTMLDivElement>(null);
  const state = useRef<CupState>({
    spin: 0.5,
    lid: 0,
    blend: 0,
    label: "blank",
    nextLabel: "kuphub",
    steam: 0,
    time: 0,
    lift: 0,
    light: false,
  });

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const zone = el.querySelector<HTMLElement>("[data-cupzone]");
      const canvas = el.querySelector<HTMLElement>("[data-cup-canvas]");
      const poke = () => canvas?.dispatchEvent(new CustomEvent("cup:update"));

      if (prefersReducedMotion()) {
        // The finished frame: printed, facing, lid on. CSS un-pins the scene
        // and lays the beats out as a list (see kuphub.css).
        Object.assign(state.current, { spin: 0.5, blend: 1, lift: 1, lid: 0, steam: 0 });
        poke();
        return;
      }

      const fades = gsap.utils.toArray<HTMLElement>("[data-fade]", el);
      const beats = gsap.utils.toArray<HTMLElement>("[data-beat]", el);
      const ticks = gsap.utils.toArray<HTMLElement>("[data-tick]", el);
      const chips = gsap.utils.toArray<HTMLElement>("[data-chip]", el).map((c) => popSetter(c)) as Pop[];
      const kup = el.querySelector<HTMLElement>("[data-giant='kup']");
      const hub = el.querySelector<HTMLElement>("[data-giant='hub']");
      const glow = el.querySelector<HTMLElement>("[data-warm]");
      const hint = el.querySelector<HTMLElement>("[data-hint]");

      const set = {
        fadeO: fades.map((f) => gsap.quickSetter(f, "opacity") as (v: number) => void),
        fadeY: fades.map((f) => gsap.quickSetter(f, "y", "px") as (v: number) => void),
        beatO: beats.map((b) => gsap.quickSetter(b, "opacity") as (v: number) => void),
        beatY: beats.map((b) => gsap.quickSetter(b, "y", "px") as (v: number) => void),
        kupY: kup ? (gsap.quickSetter(kup, "yPercent") as (v: number) => void) : null,
        hubY: hub ? (gsap.quickSetter(hub, "yPercent") as (v: number) => void) : null,
        kupO: kup ? (gsap.quickSetter(kup, "opacity") as (v: number) => void) : null,
        hubO: hub ? (gsap.quickSetter(hub, "opacity") as (v: number) => void) : null,
        warm: glow ? (gsap.quickSetter(glow, "opacity") as (v: number) => void) : null,
        hint: hint ? (gsap.quickSetter(hint, "opacity") as (v: number) => void) : null,
      };

      /* ---------------- scroll ---------------- */
      let p = 0;
      const apply = (progress: number) => {
        p = progress;
        const out = ramp(p, 0.03, 0.12);
        fades.forEach((_, i) => {
          set.fadeO[i](1 - out);
          set.fadeY[i](-out * 48);
        });
        BEATS.forEach((beat, i) => {
          const a = beatAlpha(p, beat.at, i === BEATS.length - 1);
          set.beatO[i](a);
          set.beatY[i]((1 - a) * 26);
          ticks[i]?.setAttribute("data-on", a > 0.4 ? "true" : "false");
        });
        set.kupY?.(-ramp(p, 0, 0.5) * 38);
        set.hubY?.(ramp(p, 0, 0.5) * 38);
        set.kupO?.(1 - ramp(p, 0.05, 0.45) * 0.55);
        set.hubO?.(1 - ramp(p, 0.05, 0.45) * 0.55);
        set.warm?.(0.35 + ramp(p, 0.45, 0.75) * 0.65);
        set.hint?.(1 - ramp(p, 0.01, 0.06));
        chips.forEach((pop, i) => {
          const a = ramp(p, 0.84 + i * 0.03, 0.92 + i * 0.03);
          pop(a, 0.8 + a * 0.2);
        });
      };
      apply(0);

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });

      /* ---------------- hand ---------------- */
      // Spin is measured in turns. Dragging across the whole zone is a turn.
      const hand = { offset: 0, vel: 0, down: false, x: 0, t: 0, used: false };
      const onDown = (e: PointerEvent) => {
        if (!zone) return;
        hand.down = true;
        hand.x = e.clientX;
        hand.t = performance.now();
        hand.vel = 0;
        zone.setPointerCapture?.(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!hand.down || !zone) return;
        const now = performance.now();
        const dx = e.clientX - hand.x;
        const turns = -dx / Math.max(240, zone.clientWidth);
        const dt = Math.max(8, now - hand.t) / 1000;
        hand.offset += turns;
        hand.vel = hand.vel * 0.6 + (turns / dt) * 0.4;
        hand.x = e.clientX;
        hand.t = now;
        if (!hand.used && Math.abs(hand.offset) > 0.05) {
          hand.used = true;
          hint?.setAttribute("data-used", "true");
        }
      };
      const onUp = () => {
        hand.down = false;
      };
      zone?.addEventListener("pointerdown", onDown);
      zone?.addEventListener("pointermove", onMove);
      zone?.addEventListener("pointerup", onUp);
      zone?.addEventListener("pointercancel", onUp);
      zone?.addEventListener("lostpointercapture", onUp);

      /* ---------------- time ---------------- */
      const started = performance.now();
      let last = started;
      let frame = 0;
      let visible = true;

      const loop = (now: number) => {
        frame = 0;
        const t = (now - started) / 1000;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        if (!hand.down) {
          hand.offset += hand.vel * dt;
          hand.vel *= Math.pow(0.08, dt);
          // Once it has nearly stopped, ease it home so the mark faces us.
          if (Math.abs(hand.vel) < 0.35) {
            const home = Math.round(hand.offset);
            hand.offset += (home - hand.offset) * (1 - Math.pow(0.03, dt));
          }
        }

        const arrive = clamp(t / 1.1);
        const s = state.current;
        s.lift = easeOut(arrive);
        s.blend = smooth(clamp((t - 0.6) / 0.9));
        const unwind = -0.42 * (1 - easeOut(clamp(t / 2)));
        const sway = 0.05 * Math.sin(t * 0.75) * (1 - ramp(p, 0, 0.1));
        s.spin = 0.5 + unwind + sway + hand.offset + p * 2;
        s.lid = ramp(p, 0.38, 0.58);
        s.steam = ramp(p, 0.5, 0.72) * 0.95;
        poke();

        if (visible) frame = requestAnimationFrame(loop);
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !frame) {
            last = performance.now();
            frame = requestAnimationFrame(loop);
          }
        },
        { rootMargin: "100px" },
      );
      io.observe(el);
      frame = requestAnimationFrame(loop);

      return () => {
        trigger.kill();
        io.disconnect();
        if (frame) cancelAnimationFrame(frame);
        zone?.removeEventListener("pointerdown", onDown);
        zone?.removeEventListener("pointermove", onMove);
        zone?.removeEventListener("pointerup", onUp);
        zone?.removeEventListener("pointercancel", onUp);
        zone?.removeEventListener("lostpointercapture", onUp);
      };
    },
    { scope: root },
  );

  return (
    <section id="top" aria-labelledby="hero-title" className="relative">
      <div ref={root} className="kup-story relative">
        <div className="kup-stage">
          {/* Atmosphere */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
            <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_40%,#0f4a28_0%,#08200f_46%,#030f08_100%)]" />
            <div
              data-warm
              className="absolute top-[18%] right-[6%] h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle,rgba(200,140,70,0.42)_0%,rgba(200,140,70,0)_66%)] opacity-35 max-lg:top-[8%] max-lg:right-1/2 max-lg:translate-x-1/2"
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-forest-950/80 to-transparent" />
          </div>

          {/* The giant mark, outlined, behind the cup */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center select-none max-lg:justify-start max-lg:pt-[10svh] lg:items-end lg:pr-[4vw]"
          >
            <span data-giant="kup" className="block">
              <span
                className="kup-giant-enter block text-[38vw] leading-[0.8] font-black tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgba(244,239,230,0.13)] lg:text-[22vw]"
                style={{ ["--i" as string]: 0 }}
              >
                KUP
              </span>
            </span>
            <span data-giant="hub" className="block">
              <span
                className="kup-giant-enter relative block text-[38vw] leading-[0.8] font-black tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgba(244,239,230,0.13)] lg:text-[22vw]"
                style={{ ["--i" as string]: 1 }}
              >
                HUB
                <span className="absolute -right-[0.16em] bottom-[0.06em] h-[0.17em] w-[0.17em] rounded-full bg-caramel/80" />
              </span>
            </span>
          </div>

          <div className="relative mx-auto flex h-full max-w-[90rem] flex-col px-5 pt-16 sm:px-8 sm:pt-[4.5rem] lg:grid lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-12">
            {/* The cup */}
            <div className="kup-cupwrap relative min-h-0 flex-1 lg:order-2 lg:col-span-7 lg:h-full">
              <div
                data-cupzone
                className="kup-cupzone absolute inset-0 flex items-center justify-center lg:inset-y-[6%]"
                aria-hidden
              >
                <CupCanvas
                  stateRef={state}
                  maxDpr={2}
                  className="h-full max-h-[min(44rem,82svh)] w-full max-w-[34rem]"
                />
              </div>

              <ul aria-hidden className="pointer-events-none absolute inset-0">
                {CHIPS.map((c) => (
                  <li
                    key={c.label}
                    data-chip
                    style={{ opacity: 0 }}
                    className={clsx(
                      "absolute inline-flex items-center gap-2 rounded-full border border-cream/15 bg-forest-950/60 px-3.5 py-1.5 text-[0.7rem] font-semibold tracking-[0.18em] text-cream uppercase backdrop-blur-md sm:text-xs",
                      c.pos,
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-caramel" />
                    {c.label}
                  </li>
                ))}
              </ul>

              <p
                data-hint
                className="pointer-events-none absolute bottom-[3%] left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[0.7rem] font-medium tracking-[0.2em] text-cream/55 uppercase transition-opacity duration-700 data-[used=true]:!opacity-0 [@media(pointer:fine)]:inline-flex"
              >
                <span aria-hidden className="text-caramel">⟷</span> Drag to turn the cup
              </p>
            </div>

            {/* Words: the hero, then the beats, in one cell */}
            <div className="relative z-10 shrink-0 pb-8 sm:pb-12 lg:order-1 lg:col-span-5 lg:pb-0">
              <div className="kup-stack kup-beats">
                <div data-fade className="self-end lg:self-center">
                  <p
                    className="kup-enter mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] font-semibold tracking-[0.24em] text-caramel-300 uppercase sm:text-xs"
                    style={{ ["--i" as string]: 0 }}
                  >
                    Premium koffee &amp; kup to go
                    <span className="hidden h-px w-6 bg-caramel/50 sm:inline-block" aria-hidden />
                    <span lang="ar" dir="rtl" className="hidden font-medium tracking-normal normal-case sm:inline">
                      الإسكندرية
                    </span>
                  </p>
                  <h1
                    id="hero-title"
                    className="kup-enter text-[clamp(3.3rem,9.4vw,8.6rem)] leading-[0.86] font-black tracking-[-0.055em] text-cream"
                    style={{ ["--i" as string]: 1 }}
                  >
                    Less <span className="text-caramel">is</span>
                    <br />
                    <span className="font-serif font-normal tracking-[-0.02em] italic">more.</span>
                  </h1>
                  <p
                    className="kup-enter mt-6 max-w-[26rem] text-[0.98rem] leading-relaxed text-cream/72 sm:text-lg [@media(max-height:700px)_and_(max-width:639px)]:hidden"
                    style={{ ["--i" as string]: 2 }}
                  >
                    Four addresses in Alexandria — and all of them in your
                    pocket. Order ahead, skip the queue, take it to go.
                  </p>
                  <div className="kup-enter mt-7" style={{ ["--i" as string]: 3 }}>
                    <StoreButtons />
                  </div>
                </div>

                {BEATS.map((beat) => (
                  <div
                    key={beat.n}
                    data-beat
                    style={{ opacity: 0 }}
                    className="self-end lg:self-center"
                  >
                    <p className="mb-4 font-mono text-xs tracking-[0.3em] text-caramel-300">
                      {beat.n} <span className="text-cream/30">/ 04</span>
                    </p>
                    <h2 className="text-[clamp(2.9rem,7.4vw,6.6rem)] leading-[0.88] font-black tracking-[-0.05em] text-cream">
                      {beat.lead}{" "}
                      <span className="font-serif font-normal tracking-[-0.02em] text-caramel-300 italic">
                        {beat.tail}
                      </span>
                    </h2>
                    <p className="mt-5 max-w-[24rem] text-[0.98rem] leading-relaxed text-cream/72 sm:text-lg">
                      {beat.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Where we are */}
          <ol
            aria-hidden
            className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 lg:flex"
          >
            {BEATS.map((b) => (
              <li
                key={b.n}
                data-tick
                data-on="false"
                className="h-[3px] w-10 rounded-full bg-cream/15 transition-colors duration-500 data-[on=true]:bg-caramel"
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
