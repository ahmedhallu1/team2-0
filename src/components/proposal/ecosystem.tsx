"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, TRIGGER_START } from "@/lib/motion/tokens";
import { SectionHead } from "@/components/proposal/section-head";
import { engine } from "@/lib/proposals/kuphub";
import { Engagement } from "@/components/proposal/engagement";
import { proposalY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * The two businesses and the one team behind them, drawn rather than listed.
 *
 * A services grid would say the same words and prove nothing. This is a
 * diagram: two brands at the top, five capabilities below, and lines that only
 * connect where the capability actually applies — which is why Automation has
 * one line and not two. Hovering or focusing a capability lights its lines, so
 * the answer to "does that apply to me?" is visible rather than claimed.
 *
 * The SVG is measured from the real boxes, so the lines are correct at every
 * width instead of being hand-placed for one breakpoint.
 */
export function Ecosystem() {
  const root = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState<string | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const svg = el.querySelector<SVGSVGElement>("[data-wires]");
      if (!svg) return;

      const measure = () => {
        const box = el.getBoundingClientRect();
        svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);

        const point = (node: Element, edge: "bottom" | "top") => {
          const r = node.getBoundingClientRect();
          return {
            x: r.left - box.left + r.width / 2,
            y: r.top - box.top + (edge === "bottom" ? r.height : 0),
          };
        };

        el.querySelectorAll<SVGPathElement>("[data-wire]").forEach((wire) => {
          const from = el.querySelector(`[data-node='${wire.dataset.from}']`);
          const to = el.querySelector(`[data-node='${wire.dataset.to}']`);
          if (!from || !to) return;
          const a = point(from, "bottom");
          const b = point(to, "top");
          const mid = (a.y + b.y) / 2;
          wire.setAttribute(
            "d",
            `M ${a.x} ${a.y} C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y}`,
          );
        });
      };

      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(el);

      if (prefersReducedMotion()) return () => observer.disconnect();

      // The wires draw themselves as the diagram arrives.
      const wires = el.querySelectorAll<SVGPathElement>("[data-wire]");
      wires.forEach((wire) => {
        const length = wire.getTotalLength();
        wire.style.strokeDasharray = `${length}`;
        wire.style.strokeDashoffset = `${length}`;
      });
      const tween = gsap.to(wires, {
        strokeDashoffset: 0,
        duration: DUR.scene,
        ease: EASE.ascent,
        stagger: 0.07,
        scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
      });

      return () => {
        observer.disconnect();
        tween.kill();
      };
    },
    { scope: root },
  );

  const brands = [
    { id: "kuphub", name: "KUPHUB", line: "Sells to a person walking past.", color: "var(--kup-ink)" },
    { id: "linkup", name: "LinkUp Egypt", line: "Sells to a buyer with a spec.", color: "var(--link-ink)" },
  ] as const;

  return (
    <section
      id="engine"
      data-zone="both"
      aria-labelledby="engine-heading"
      className={clsx("relative border-t border-line bg-surface-2/20", proposalY)}
    >
      <div className={shell}>
        <SectionHead
          n="10"
          label="Two brands, one engine"
          headingId="engine-heading"
          lines={["Two businesses.", "One team behind both."]}
          lede="Not two retainers running in parallel. One studio that already knows both brands, sharing the photography, the production and the reporting between them — and only doing the work each one actually needs."
        />

        <div ref={root} className="relative mt-16">
          <svg
            data-wires
            aria-hidden
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            {engine.flatMap((pillar) =>
              pillar.applies.map((brand) => {
                const on = lit === pillar.id || lit === null;
                return (
                  <path
                    key={`${brand}-${pillar.id}`}
                    data-wire
                    data-from={brand}
                    data-to={pillar.id}
                    fill="none"
                    strokeWidth={lit === pillar.id ? 2 : 1.25}
                    stroke={
                      brand === "kuphub" ? "var(--kup-ink)" : "var(--link-ink)"
                    }
                    style={{
                      opacity: on ? (lit === pillar.id ? 0.95 : 0.34) : 0.1,
                      transition: "opacity .35s, stroke-width .35s",
                    }}
                  />
                );
              }),
            )}
          </svg>

          {/* The two businesses */}
          <div className="relative grid gap-4 sm:grid-cols-2">
            {brands.map((brand) => (
              <div
                key={brand.id}
                data-node={brand.id}
                className="rounded-xl border border-line bg-surface p-5 text-center sm:p-6"
              >
                <p
                  className="font-display text-lg font-extrabold tracking-tight"
                  style={{ color: brand.color }}
                >
                  {brand.name}
                </p>
                <p className="mt-1.5 text-xs text-muted">{brand.line}</p>
              </div>
            ))}
          </div>

          {/* The gap the wires cross */}
          <div className="h-20 sm:h-24" aria-hidden />

          {/* What 2.0 runs */}
          <ul className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
            {engine.map((pillar) => (
              <li key={pillar.id} className="contents">
                {/*
                  A real button, not a focusable list item. It has a job —
                  it lights this capability's connections and dims the rest —
                  so it gets a pressed state, a keyboard, and a tap target,
                  instead of five tab stops that announce nothing.
                */}
                <button
                  type="button"
                  // The wires measure this box, so the anchor has to be the
                  // element that actually has one — a `display: contents` list
                  // item reports an empty rect.
                  data-node={pillar.id}
                  aria-pressed={lit === pillar.id}
                  onClick={() => setLit((v) => (v === pillar.id ? null : pillar.id))}
                  onMouseEnter={() => setLit(pillar.id)}
                  onMouseLeave={() => setLit(null)}
                  onFocus={() => setLit(pillar.id)}
                  onBlur={() => setLit(null)}
                  className={clsx(
                    "h-full rounded-xl border bg-surface p-5 text-left transition-colors duration-400",
                    lit === pillar.id ? "border-accent" : "border-line hover:border-line-2",
                  )}
                >
                  <h3 className="font-display text-base leading-tight font-extrabold tracking-tight text-ink">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {pillar.line}
                  </p>
                  <span className="mt-4 block space-y-1.5 border-t border-line pt-3">
                    {pillar.items.map((item) => (
                      <span
                        key={item}
                        className="block text-[11px] leading-snug text-faint"
                      >
                        {item}
                      </span>
                    ))}
                  </span>
                  <span className="mt-4 flex flex-wrap gap-1.5">
                    {pillar.applies.map((b) => (
                      <span
                        key={b}
                        className="rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-[0.1em] uppercase"
                        style={{
                          borderColor:
                            b === "kuphub"
                              ? "color-mix(in srgb, var(--kup-ink) 45%, transparent)"
                              : "color-mix(in srgb, var(--link-ink) 45%, transparent)",
                          color: b === "kuphub" ? "var(--kup-ink)" : "var(--link-ink)",
                        }}
                      >
                        {b === "kuphub" ? "KUPHUB" : "LinkUp"}
                      </span>
                    ))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-muted">
          Pick a capability to see which business it serves. Automation earns
          its place on one side only — LinkUp is the one where the enquiries{" "}
          <em>are</em> the business.
        </p>

        <Engagement className="mt-14" />
      </div>
    </section>
  );
}
