"use client";

import { useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { EASE } from "@/lib/motion/tokens";
import { CupGlyph, Dot, KupMark } from "./kup-glyphs";
import { comparison } from "@/lib/proposals/kuphub";

/**
 * The same offer, arranged two ways.
 *
 * Both halves are our own reconstructions and both are labelled as such — we
 * are not reposting the client's artwork, and we are not exaggerating it
 * either. The left is the same offer carrying everything the channel currently
 * asks a single frame to carry: two languages, three price rules, the hours,
 * the branches, the logo and a badge. It is drawn honestly, because a
 * strawman would be both unfair and unconvincing the moment anyone opened the
 * real feed next to it.
 *
 * The argument is not "that one is ugly". It is: same information, same offer,
 * and one of them can be repeated next week without redesigning it.
 *
 * Driven by a real range input, so it drags, takes focus, and works from the
 * arrow keys without any of that being reimplemented in JavaScript.
 */
export function Compare() {
  const [at, setAt] = useState(52);
  const wrap = useRef<HTMLDivElement>(null);
  const nudged = useRef(false);
  /** Ours, not the browser's — see `onPointerDown`. */
  const dragging = useRef(false);

  /**
   * A control nobody touches proves nothing, so the handle demonstrates itself
   * once when the comparison first comes into view — a short travel and back,
   * and never again. Skipped entirely if the visitor has already moved it, or
   * asked for less motion.
   */
  useGSAP(
    () => {
      const el = wrap.current;
      if (!el || prefersReducedMotion()) return;
      const hint = gsap.timeline({
        paused: true,
        onComplete: () => {
          nudged.current = true;
        },
      });
      hint
        .to({ v: 52 }, {
          v: 33,
          duration: 0.65,
          ease: EASE.settle,
          onUpdate() {
            if (!nudged.current) setAt(Math.round(this.targets()[0].v));
          },
        })
        .to({ v: 33 }, {
          v: 52,
          duration: 0.8,
          ease: EASE.settle,
          onUpdate() {
            if (!nudged.current) setAt(Math.round(this.targets()[0].v));
          },
        });

      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || nudged.current) return;
          io.disconnect();
          gsap.delayedCall(0.35, () => hint.play());
        },
        { threshold: 0.55 },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        hint.kill();
      };
    },
    { scope: wrap },
  );

  /** Any deliberate move cancels the hint for good. */
  function move(value: number) {
    nudged.current = true;
    setAt(Math.max(0, Math.min(100, value)));
  }

  /**
   * The divider is dragged with pointer events on the frame, not by the range
   * input underneath it.
   *
   * The range is still there, and still does the keyboard and screen-reader
   * work — but it cannot be the drag target. An `opacity: 0` range stretched
   * over a box hit-tests only on its *thumb* in Safari, so on an iPhone the
   * whole frame was dead to touch and the comparison simply would not move.
   * Pointer events hit the element you actually touched, are captured for the
   * length of the gesture, and behave identically for mouse, pen and finger.
   *
   * `touch-action: pan-y` on the frame (see globals.css) is what makes this
   * cooperate with the page: the browser keeps vertical scrolling, and hands
   * us the horizontal gesture. If it decides mid-gesture that the visitor is
   * scrolling after all, it sends `pointercancel` and the drag ends.
   */
  function fromClientX(clientX: number) {
    const el = wrap.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    if (!box.width) return;
    move(((clientX - box.left) / box.width) * 100);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    fromClientX(event.clientX);
    // Capture keeps the gesture alive past the frame's edges, but it is an
    // enhancement, not the mechanism: it throws for any pointer the browser
    // does not consider active, and gating the drag on it meant one throw
    // took the whole interaction out.
    try {
      wrap.current?.setPointerCapture(event.pointerId);
    } catch {
      /* no capture — the drag still works inside the frame */
    }
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    fromClientX(event.clientX);
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    try {
      const el = wrap.current;
      if (el?.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
    } catch {
      /* nothing to release */
    }
  }

  return (
    <div>
      {/*
        The two labels sit above the frame rather than on it. Overlaid, they
        landed on whatever the mockup happened to have in that corner — on a
        phone the "Direction" chip printed straight over the proposed frame's
        own "Daily" line. Each label still sits over the half it names, so
        nothing is lost by moving them out of the artwork.
      */}
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-[10px] font-semibold tracking-[0.18em] text-muted uppercase sm:text-xs">
          {comparison.today.label}
        </span>
        <span className="text-[10px] font-semibold tracking-[0.18em] text-brand uppercase sm:text-xs">
          One possible direction
        </span>
      </div>

      <div
        ref={wrap}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        className="compare concept relative aspect-square w-full max-w-[34rem] border border-line"
      >
        {/* Proposed — the full frame, uncovered as the handle moves left. */}
        <div className="absolute inset-0">
          <ProposedFrame />
        </div>

        {/* Today — clipped to the handle. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - at}% 0 0)` }}
        >
          <TodayFrame />
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={at}
          onChange={(e) => move(Number(e.target.value))}
          className="compare__range"
          aria-label={`Reveal: ${comparison.today.label} against ${comparison.proposed.label}`}
        />

        <span className="compare__handle" style={{ left: `${at}%` }} aria-hidden>
          <span className="compare__grip">
            <MoveHorizontal size={16} />
          </span>
        </span>

      </div>

      <dl className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
            {comparison.today.label}
          </dt>
          <dd className="mt-2 text-sm leading-relaxed text-faint">
            {comparison.today.note}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
            {comparison.proposed.label}
          </dt>
          <dd className="mt-2 text-sm leading-relaxed text-muted">
            {comparison.proposed.note}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * The offer as the channel carries it now: every rule in the frame at once.
 * Reconstructed, and drawn without caricature — the type is properly set, the
 * colours are the brand's own, nothing is crooked. It is simply full.
 */
function TodayFrame() {
  return (
    <div
      className="relative h-full w-full overflow-hidden p-[5%] text-white"
      style={{ background: "linear-gradient(150deg,#0c4f28,#07331a 62%,#12100d)" }}
    >
      <div className="flex items-start justify-between">
        <KupMark tone="light" className="text-[clamp(0.6rem,2vw,0.95rem)]" />
        <span
          className="rounded px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase"
          style={{ background: "#c8102e" }}
        >
          Offer
        </span>
      </div>

      <p className="mt-[4%] text-center font-display text-[clamp(0.95rem,3.4vw,1.7rem)] leading-[0.95] font-extrabold">
        BUSINESS MORNING
      </p>
      <p
        dir="rtl"
        lang="ar"
        className="mt-[2%] text-center text-[clamp(0.6rem,2.1vw,1rem)] font-bold"
        style={{ color: "#f0c869" }}
      >
        ابدأ يومك صح مع كاب هب
      </p>
      <p className="text-center text-[clamp(0.5rem,1.6vw,0.72rem)] font-semibold">
        START YOUR DAY RIGHT · 7 AM — 5 PM
      </p>

      <div className="mt-[4%] grid grid-cols-3 gap-[3%] text-center">
        {[
          { big: "50%", small: "الأوردر التاني", en: "2nd order" },
          { big: "4th", small: "مجاناً", en: "free" },
          { big: "20", small: "جنيه", en: "Turkish" },
        ].map((c) => (
          <div
            key={c.big}
            className="rounded border border-white/25 bg-white/10 p-[7%]"
          >
            <p className="font-display text-[clamp(0.8rem,2.8vw,1.35rem)] leading-none font-extrabold" style={{ color: "#f0c869" }}>
              {c.big}
            </p>
            <p dir="rtl" lang="ar" className="mt-0.5 text-[clamp(0.4rem,1.3vw,0.6rem)]">
              {c.small}
            </p>
            <p className="text-[clamp(0.35rem,1.1vw,0.5rem)] opacity-70">{c.en}</p>
          </div>
        ))}
      </div>

      <div className="mt-[4%] flex items-end justify-center gap-[4%]">
        <CupGlyph className="h-[22%] opacity-80" />
        <CupGlyph className="h-[26%] opacity-80" />
        <CupGlyph className="h-[22%] opacity-80" />
      </div>

      <div className="absolute inset-x-[5%] bottom-[4%]">
        <p className="text-center text-[clamp(0.38rem,1.2vw,0.55rem)] leading-tight opacity-85">
          سموحة — أمام نادي مبارك · نادي سموحة جرين كورنر · مصطفى كامل — عمارات
          الضباط · الشاطبي
        </p>
        <p className="mt-0.5 text-center text-[clamp(0.36rem,1.1vw,0.5rem)] opacity-60">
          الخصم يطبق على الأوردر الأقل سعراً · العرض لفترة محدودة
        </p>
      </div>
    </div>
  );
}

/** The same offer, the same two languages, inside the system. */
function ProposedFrame() {
  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden p-[8%]"
      style={{ background: "var(--kup)", color: "#fff" }}
    >
      <div className="flex items-start justify-between">
        <p className="text-[clamp(0.5rem,1.5vw,0.7rem)] tracking-[0.22em] text-white/60 uppercase">
          07:00 — 17:00
        </p>
        <span className="text-[clamp(0.5rem,1.5vw,0.7rem)] tracking-[0.22em] text-white/60 uppercase">
          Daily
        </span>
      </div>

      <div>
        <p className="font-display text-[clamp(1.4rem,5.6vw,2.8rem)] leading-[0.86] font-extrabold tracking-[-0.045em]">
          Business
          <br />
          morning
          <Dot className="ml-[0.08em] inline-block h-[0.12em] w-[0.12em] align-baseline" />
        </p>
        <p
          dir="rtl"
          lang="ar"
          className="mt-[5%] text-[clamp(0.72rem,2.4vw,1.15rem)] font-semibold text-white/75"
        >
          ابدأ يومك صح
        </p>
      </div>

      <div className="flex items-end justify-between gap-3">
        <p className="max-w-[62%] text-[clamp(0.52rem,1.7vw,0.8rem)] leading-snug text-white/70">
          Second order half price.
          <br />
          Every fourth on us.
        </p>
        <KupMark tone="light" className="text-[clamp(0.55rem,1.7vw,0.85rem)] opacity-85" />
      </div>
    </div>
  );
}
