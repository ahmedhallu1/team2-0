"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion/gsap";
import { CupRenderer, refreshStrips, type CupState } from "./renderer";
import { clsx } from "@/lib/clsx";

/**
 * The canvas the cup lives on, and the only place that knows how to keep it
 * alive: device-pixel sizing, a repaint when the webfonts land or the theme
 * flips, and a frame loop that runs *only* while the cup is on screen and only
 * while something is actually moving.
 *
 * The state comes in through a ref rather than props on purpose. The scroll
 * timeline updates it up to once a frame; routing that through React state
 * would re-render the tree sixty times a second to change numbers that never
 * reach the DOM.
 */
export function CupCanvas({
  stateRef,
  className,
  /** Redraw even when nothing changed — used while steam is drifting. */
  live = true,
}: {
  stateRef: React.RefObject<CupState>;
  className?: string;
  live?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let renderer: CupRenderer;
    try {
      renderer = new CupRenderer(canvas);
    } catch {
      /**
       * No 2D context — a browser with canvas disabled, or a phone under
       * enough memory pressure to refuse one. Everything the scene says is
       * real text either way, so collapse it to the same layout a
       * reduced-motion visitor gets rather than leaving a viewport-sized hole
       * where the cup was going to be.
       */
      const scroller = wrap.closest<HTMLElement>(".cup-scroll");
      if (scroller) {
        scroller.dataset.still = "true";
        scroller
          .querySelector("[data-cup-beats]")
          ?.setAttribute("data-still", "true");
      }
      wrap.style.display = "none";
      return;
    }

    const reduced = prefersReducedMotion();
    let frame = 0;
    let visible = true;
    let last = "";
    const started = performance.now();

    const paint = () => {
      const state = stateRef.current;
      if (!state) return;
      state.time = (performance.now() - started) / 1000;
      renderer.draw(state);
    };

    /**
     * Only put work on the compositor when the picture would actually change.
     * A scrubbed frame is repainted because its key moved; steam is the one
     * thing that animates on its own clock, so it is the only reason to keep a
     * continuous loop alive.
     */
    const tick = () => {
      frame = 0;
      if (!visible) return;
      const state = stateRef.current;
      const drifting = live && !reduced && !!state && state.steam > 0.01;
      const key = state
        ? `${state.spin.toFixed(4)}|${state.lid.toFixed(3)}|${state.blend.toFixed(3)}|${state.label}|${state.nextLabel}|${state.steam.toFixed(3)}|${state.lift.toFixed(3)}`
        : "";
      if (key !== last || drifting) {
        last = key;
        paint();
      }
      if (drifting) frame = requestAnimationFrame(tick);
    };

    const request = () => {
      if (frame || !visible) return;
      frame = requestAnimationFrame(tick);
    };

    // The scroll timeline pokes this after every update it makes.
    const onPoke = () => request();
    wrap.addEventListener("cup:update", onPoke);

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // Deliberately does not touch the label strips. They are painted from
      // design-space constants, so a resize cannot change them — and this
      // callback fires often enough (fonts, orientation, the address bar) that
      // reallocating them here was churning tens of megabytes of canvas.
      // 1.5× rather than the device's full ratio. The cup is soft-shaded with
      // no fine detail, so the extra pixels bought nothing and every one of
      // them is fill cost on a phone.
      renderer.resize(rect.width, rect.height, Math.min(window.devicePixelRatio || 1, 1.5));
      paint();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Canvas text falls back to a system face until the webfont is ready, so
    // the strips are repainted once it lands — for every cup on the page, not
    // just this one.
    let cancelled = false;
    document.fonts?.ready
      .then(() => {
        if (cancelled) return;
        refreshStrips();
        paint();
      })
      .catch(() => {});

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) request();
        else if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(wrap);

    request();

    return () => {
      cancelled = true;
      wrap.removeEventListener("cup:update", onPoke);
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, [stateRef, live]);

  return (
    <div ref={wrapRef} className={clsx("relative", className)} data-cup-canvas>
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
    </div>
  );
}
