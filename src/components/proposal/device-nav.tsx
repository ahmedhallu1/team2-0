"use client";

import { useId, useState, type ReactNode } from "react";
import { clsx } from "@/lib/clsx";

/**
 * The website concepts, made clickable.
 *
 * A picture of a website proves that somebody can draw one. A website you can
 * click through proves it works — and in a meeting it means the page can be
 * driven rather than described: tap Branches, tap Offers, the thing responds.
 *
 * Deliberately a real tablist rather than a fake one. The nav items are
 * buttons, the panels are labelled by the tab that opens them, arrow keys move
 * between them, and every panel's content is in the markup whether or not it
 * is the visible one — so the concept is fully readable with JavaScript off
 * and to anyone using a screen reader.
 */

export type DevicePanel = {
  id: string;
  label: string;
  content: ReactNode;
};

export function DeviceNav({
  panels,
  accent,
  ink,
  mutedInk,
  action,
  brandMark,
  className,
}: {
  panels: DevicePanel[];
  /** The bar's active-item colour. */
  accent: string;
  ink: string;
  mutedInk: string;
  /** The primary button at the right of the bar. */
  action: string;
  brandMark: ReactNode;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const base = useId();

  function onKey(event: React.KeyboardEvent) {
    const delta =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (active + delta + panels.length) % panels.length;
    setActive(next);
    (
      event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]
    )?.focus();
  }

  return (
    <div className={className}>
      <div
        className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-6"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        {brandMark}

        <div
          role="tablist"
          aria-label="Site sections"
          onKeyDown={onKey}
          className="no-scrollbar -mx-2 flex items-center gap-1 overflow-x-auto px-2"
        >
          {panels.map((panel, i) => (
            <button
              key={panel.id}
              role="tab"
              type="button"
              id={`${base}-tab-${panel.id}`}
              aria-selected={i === active}
              aria-controls={`${base}-panel-${panel.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={clsx(
                "shrink-0 rounded-md px-3 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-300 sm:py-1.5",
              )}
              style={{
                color: i === active ? ink : mutedInk,
                background: i === active ? "rgba(255,255,255,0.1)" : "transparent",
              }}
            >
              {panel.label}
            </button>
          ))}
        </div>

        <span
          className="hidden shrink-0 rounded-md px-3 py-1.5 text-[11px] font-bold sm:inline-block"
          style={{ background: accent, color: "#1a1105" }}
        >
          {action}
        </span>
      </div>

      {panels.map((panel, i) => (
        <div
          key={panel.id}
          id={`${base}-panel-${panel.id}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${panel.id}`}
          hidden={i !== active}
        >
          {panel.content}
        </div>
      ))}
    </div>
  );
}
