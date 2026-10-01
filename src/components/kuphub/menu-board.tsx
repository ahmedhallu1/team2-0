"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { menu, stores } from "@/lib/kuphub/site";
import { Stamp } from "./stamp";
import { clsx } from "@/lib/clsx";

/**
 * The board — set like a printed menu on cream stock, the colour of the cup
 * before it's printed.
 *
 * Only what KUPHUB's own app lists gets a price. Where the app doesn't give us
 * one — the juices, the sandwiches, the desserts — the board says what the
 * thing is and sends you to the app for the number, rather than inventing it.
 */
export function MenuBoard() {
  const [active, setActive] = useState(menu[0].id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const group = menu.find((g) => g.id === active) ?? menu[0];

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = menu.findIndex((g) => g.id === active);
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % menu.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + menu.length) % menu.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = menu.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(menu[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <section
      id="menu"
      aria-labelledby="menu-heading"
      className="relative overflow-hidden bg-paper py-24 text-ink sm:py-32"
    >
      <Stamp className="pointer-events-none absolute -right-12 -bottom-28 h-52 w-52 opacity-80" />

      <div className="mx-auto grid max-w-[90rem] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:col-span-4">
          <p className="kup-reveal flex items-center gap-3 text-xs font-semibold tracking-[0.24em] text-forest uppercase">
            The board
            <span lang="ar" dir="rtl" className="font-medium tracking-normal text-ink/45 normal-case">
              المنيو
            </span>
          </p>
          <h2
            id="menu-heading"
            className="kup-reveal mt-5 text-[clamp(2.6rem,5.6vw,4.6rem)] leading-[0.9] font-black tracking-[-0.05em]"
            style={{ ["--delay" as string]: "80ms" }}
          >
            A short board,
            <br />
            <span className="font-serif font-normal tracking-[-0.02em] text-forest italic">poured properly.</span>
          </h2>
          <p
            className="kup-reveal mt-6 max-w-sm text-base leading-relaxed text-ink/70"
            style={{ ["--delay" as string]: "160ms" }}
          >
            The prices here are the ones the KUPHUB app shows. They can change
            from branch to branch — the app always has yours.
          </p>

          <div
            role="tablist"
            aria-label="Menu sections"
            aria-orientation="vertical"
            onKeyDown={onKey}
            className="kup-reveal mt-10 -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0 lg:flex-col lg:gap-1 lg:overflow-visible"
            style={{ ["--delay" as string]: "220ms" }}
          >
            {menu.map((g, i) => {
              const on = g.id === active;
              return (
                <button
                  key={g.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${g.id}`}
                  aria-selected={on}
                  aria-controls={`panel-${g.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(g.id)}
                  className={clsx(
                    "kup-pill group flex shrink-0 items-center justify-between gap-6 rounded-full border px-5 py-3 text-left lg:rounded-2xl lg:px-5 lg:py-4",
                    on
                      ? "border-forest bg-forest text-cream"
                      : "border-ink/12 text-ink/75 hover:border-ink/30 hover:text-ink",
                  )}
                >
                  <span className="text-base font-bold tracking-[-0.01em] lg:text-xl">{g.label}</span>
                  <span
                    lang="ar"
                    dir="rtl"
                    className={clsx("hidden text-sm lg:inline", on ? "text-cream/70" : "text-ink/40")}
                  >
                    {g.arabic}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8 lg:pl-8 xl:pl-16">
          <div
            key={group.id}
            role="tabpanel"
            id={`panel-${group.id}`}
            aria-labelledby={`tab-${group.id}`}
            className="kup-panel-in"
          >
            <p className="font-serif text-[clamp(1.7rem,3.2vw,2.6rem)] leading-tight text-forest italic">
              {group.line}
            </p>

            <ul className="mt-8 border-t border-ink/12">
              {group.items.map((item, i) => (
                <li
                  key={item.name}
                  className="kup-panel-row group border-b border-ink/12 py-6 sm:py-8"
                  style={{ ["--row" as string]: i }}
                >
                  <div className="flex items-end gap-4">
                    <h3 className="text-[clamp(1.6rem,3.4vw,2.7rem)] leading-none font-black tracking-[-0.04em] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-1.5">
                      {item.name}
                    </h3>
                    <span aria-hidden className="kup-leader mb-2 h-1 flex-1 text-ink/25" />
                    {item.price ? (
                      <p className="shrink-0 leading-none">
                        <span className="text-[clamp(1.6rem,3.4vw,2.7rem)] font-black tracking-[-0.04em] tabular-nums">
                          {item.price}
                        </span>
                        <span className="ml-1.5 text-xs font-bold tracking-[0.12em] text-ink/70">EGP</span>
                      </p>
                    ) : (
                      <p
                        className={clsx(
                          "mb-1 shrink-0 rounded-full px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.14em] uppercase",
                          item.tag ? "bg-caramel text-bean" : "border border-ink/20 text-ink/60",
                        )}
                      >
                        {item.tag ?? "In the app"}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="text-[0.95rem] text-ink/65">{item.note}</p>
                    <p lang="ar" dir="rtl" className="text-[0.95rem] font-medium text-forest/80">
                      {item.arabic}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
            <p className="max-w-md text-sm leading-relaxed text-ink/60">
              Hot drinks, cold drinks, smoothies and juices, sandwiches and
              desserts — the full board, with every size and add-on, lives in
              the app.
            </p>
            <a
              href={stores.path}
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-cream transition-[transform,background-color] duration-300 ease-[var(--ease-back)] hover:-translate-y-0.5 hover:bg-forest"
            >
              See the whole board
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
