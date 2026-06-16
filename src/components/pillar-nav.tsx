"use client";

import { useEffect } from "react";
import { pillars } from "@/lib/services";

/** Header + sticky nav clearance when jumping to a pillar. */
const SCROLL_OFFSET = 120;

function scrollToPillar(id: string, smooth = true) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: smooth && !reduce ? "smooth" : "auto" });
}

/**
 * Sticky pillar quick-nav. Scrolls in-page without ever writing a `#hash`
 * to the URL, and honours a `?p=<pillar>` deep-link (from the home bento)
 * before cleaning the query string away.
 */
export function PillarNav() {
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("p");
    if (p && document.getElementById(p)) {
      requestAnimationFrame(() => {
        scrollToPillar(p, false);
        history.replaceState(null, "", "/services");
      });
    }
  }, []);

  return (
    <nav
      aria-label="Service pillars"
      className="no-scrollbar sticky top-16 z-30 mx-auto mt-10 -mb-2 flex max-w-full snap-x gap-1 overflow-x-auto rounded-full border border-line bg-bg/80 p-1.5 backdrop-blur-xl sm:top-18 sm:w-fit"
    >
      {pillars.map((pillar, i) => (
        <button
          key={pillar.id}
          type="button"
          onClick={() => scrollToPillar(pillar.id)}
          className="shrink-0 snap-start rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <span className="text-faint">0{i + 1}</span>
          <span className="ml-1.5">{pillar.name}</span>
        </button>
      ))}
    </nav>
  );
}
