"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { clsx } from "@/lib/clsx";

/**
 * The only chrome on the proposal: who made it, where you are in it, and the
 * way out. The site's own dock is deliberately absent — this page is opened on
 * a large screen and walked through, and six navigation links at the top of it
 * would be an invitation to leave halfway.
 *
 * The progress bar is a real `<progress>` under the hood for assistive tech and
 * a transform-only fill for everyone else, so the scroll indicator costs one
 * compositor property and never lays out.
 */
export function ProposalChrome({ sections }: { sections: { id: string; label: string }[] }) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(sections[0]?.label ?? "");
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
        setLifted(window.scrollY > 24);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Which chapter is on screen — read from the sections themselves so the
  // label can never fall out of step with the markup.
  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!hit) return;
        const match = sections.find((s) => s.id === hit.target.id);
        if (match) setCurrent(match.label);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        lifted && "border-b border-line bg-bg/80 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex w-full max-w-[90rem] items-center gap-4 px-5 py-3 sm:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-md transition-opacity hover:opacity-80"
          aria-label="2.0 — back to the site"
        >
          <BrandLogo className="h-6 sm:h-7" priority />
        </Link>

        <span aria-hidden className="hidden h-4 w-px bg-line-2 sm:block" />

        <p className="min-w-0 flex-1 truncate text-[11px] font-medium tracking-[0.2em] text-faint uppercase">
          <span className="hidden sm:inline">Proposal · KUPHUB × LinkUp · </span>
          <span className="text-muted">{current}</span>
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="#next"
            className="group hidden items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold tracking-tight text-on-accent sm:inline-flex"
          >
            Next step
            <ArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>

      <span aria-hidden className="block h-px w-full bg-line">
        <span
          ref={fillRef}
          className="block h-px w-full origin-left bg-gradient-to-r from-violet-500 to-lime-400"
          style={{ transform: "scaleX(0)" }}
        />
      </span>
    </header>
  );
}
