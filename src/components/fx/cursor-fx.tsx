"use client";

import { useEffect } from "react";

/**
 * Desktop-only flourish layer: a blend-mode cursor dot, an ambient glow that
 * trails the pointer, and a top scroll-progress bar. Pure transform/opacity,
 * rAF-batched, and disabled for touch + reduced-motion users.
 */
export function CursorFx() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dot = document.createElement("div");
    const glow = document.createElement("div");
    const bar = document.createElement("div");
    dot.className = "cursor-dot";
    glow.className = "cursor-glow";
    bar.className = "scroll-progress";

    if (fine && !reduce) {
      document.body.append(dot, glow);
    }
    document.body.append(bar);

    let mx = 0,
      my = 0,
      gx = 0,
      gy = 0,
      raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      document.documentElement.classList.add("cursor-ready");
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    };

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      bar.style.setProperty("--sp", String(p));
    };

    const loop = () => {
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      glow.style.transform = `translate(${gx}px, ${gy}px)`;
      raf = requestAnimationFrame(loop);
    };

    if (fine && !reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      dot.remove();
      glow.remove();
      bar.remove();
      document.documentElement.classList.remove("cursor-ready");
    };
  }, []);

  return null;
}
