"use client";

import { useState } from "react";
import { flavours, stores, type Flavour } from "@/lib/kuphub/site";
import { clsx } from "@/lib/clsx";

/**
 * Match & Mix — KUPHUB's iced tea in seven flavours, any three for the price
 * of two. On the feed it's a crowded graphic; here it's the glass itself: pick
 * flavours and they pour in as layers, in the order you chose them.
 */

const SLOTS = [
  { y: 322, h: 106 },
  { y: 216, h: 106 },
  { y: 110, h: 106 },
];

const GLASS_INNER = "M46 64 L62 422 Q63 430 72 430 L188 430 Q197 430 198 422 L214 64 Z";
const GLASS_OUTER = "M38 56 L55 426 Q57 440 72 440 L188 440 Q203 440 205 426 L222 56";

export function MatchMix() {
  const [picked, setPicked] = useState<string[]>(["peach", "lemon"]);
  const chosen = picked
    .map((id) => flavours.find((f) => f.id === id))
    .filter((f): f is Flavour => !!f);
  const full = chosen.length === 3;

  const pick = (id: string) =>
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      const next = [...prev, id];
      // A fourth pick pours out the first one, rather than refusing.
      return next.length > 3 ? next.slice(next.length - 3) : next;
    });

  const status = full
    ? "Three flavours — you pay for two."
    : chosen.length === 2
      ? "Pick one more. That one's on us."
      : chosen.length === 1
        ? "Two more to go."
        : "Pick up to three flavours.";

  return (
    <section
      id="mix"
      aria-labelledby="mix-heading"
      className="relative overflow-hidden bg-paper py-24 text-ink sm:py-32"
    >
      <div className="mx-auto grid max-w-[90rem] items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-7">
          <p className="kup-reveal flex items-center gap-3 text-xs font-semibold tracking-[0.24em] text-forest uppercase">
            Iced tea, seven ways
            <span lang="ar" dir="rtl" className="font-medium tracking-normal text-ink/45 normal-case">
              اختار 3 نكهات وادفع تمن 2
            </span>
          </p>
          <h2
            id="mix-heading"
            className="kup-reveal mt-5 text-[clamp(3rem,8vw,7rem)] leading-[0.86] font-black tracking-[-0.06em]"
            style={{ ["--delay" as string]: "80ms" }}
          >
            Match <span className="text-caramel">&amp;</span>
            <br />
            <span className="font-serif font-normal tracking-[-0.02em] text-forest italic">Mix.</span>
          </h2>
          <p
            className="kup-reveal mt-6 max-w-lg text-lg leading-relaxed text-ink/70"
            style={{ ["--delay" as string]: "160ms" }}
          >
            Seven flavours of iced tea. Pick any three and pay for two — the
            three-for-two runs at the Smouha Club and Edmond Fremon branches.
          </p>

          <div
            role="group"
            aria-label="Flavours"
            className="kup-reveal mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 2xl:grid-cols-4"
            style={{ ["--delay" as string]: "220ms" }}
          >
            {flavours.map((f) => {
              const order = picked.indexOf(f.id);
              const on = order >= 0;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick(f.id)}
                  className={clsx(
                    "kup-pill group relative flex items-center gap-3 rounded-2xl border p-2.5 pr-4 text-left",
                    on ? "border-ink bg-ink text-cream" : "border-ink/12 bg-white/40 hover:border-ink/35",
                  )}
                >
                  <span
                    aria-hidden
                    className="relative h-11 w-11 shrink-0 rounded-full shadow-[inset_0_-6px_12px_rgba(0,0,0,0.18)] transition-transform duration-500 ease-[var(--ease-back)] group-hover:scale-110"
                    style={{ background: `radial-gradient(circle at 32% 28%, ${f.light} 0%, ${f.color} 62%)` }}
                  >
                    {on && (
                      <span className="kup-pop absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-caramel text-[0.65rem] font-black text-bean">
                        {order + 1}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{f.name}</span>
                    <span lang="ar" dir="rtl" className={clsx("block text-xs", on ? "text-cream/60" : "text-ink/50")}>
                      {f.arabic}
                    </span>
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setPicked([])}
              disabled={!picked.length}
              className="kup-pill rounded-2xl border border-dashed border-ink/20 px-4 text-sm font-semibold text-ink/55 hover:border-ink/40 hover:text-ink disabled:pointer-events-none disabled:opacity-40"
            >
              Pour it out
            </button>
          </div>

          <p aria-live="polite" className="mt-6 text-base font-semibold text-forest">
            {status}
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="kup-reveal relative mx-auto w-full max-w-[22rem]">
            <svg viewBox="0 0 260 470" className="w-full" role="img" aria-label={glassLabel(chosen)}>
              <defs>
                <clipPath id="mix-inner">
                  <path d={GLASS_INNER} />
                </clipPath>
                <linearGradient id="mix-depth" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
                  <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
                  <stop offset="1" stopColor="#000" stopOpacity="0.16" />
                </linearGradient>
                <linearGradient id="mix-sheen" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
                  <stop offset="0.16" stopColor="#fff" stopOpacity="0.08" />
                  <stop offset="0.75" stopColor="#fff" stopOpacity="0" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.24" />
                </linearGradient>
              </defs>

              <ellipse cx="130" cy="452" rx="96" ry="11" fill="#13110d" opacity="0.14" />

              <g clipPath="url(#mix-inner)">
                <rect x="30" y="40" width="200" height="400" fill="#13110d" fillOpacity="0.035" />
                {SLOTS.map((slot, i) => {
                  const f = chosen[i];
                  return (
                    <g
                      key={i}
                      className="kup-layer"
                      style={{ transform: f ? "scaleY(1)" : "scaleY(0)", opacity: f ? 1 : 0 }}
                    >
                      <rect x="30" y={slot.y} width="200" height={slot.h + 14} style={{ fill: f?.color ?? "transparent", transition: "fill 0.6s ease" }} />
                      {/* The surface — a wave that keeps moving */}
                      <g transform={`translate(0 ${slot.y - 8})`}>
                        <g className="kup-wave" style={{ ["--speed" as string]: `${5 + i}s` }}>
                          <path
                            d="M0 8 Q 20 0 40 8 T 80 8 T 120 8 T 160 8 T 200 8 T 240 8 T 280 8 T 320 8 T 360 8 T 400 8 T 440 8 T 480 8 V 30 H 0 Z"
                            style={{ fill: f?.color ?? "transparent", transition: "fill 0.6s ease" }}
                          />
                        </g>
                      </g>
                      <rect x="30" y={slot.y} width="200" height="10" fill={f?.light ?? "transparent"} opacity="0.45" />
                    </g>
                  );
                })}

                <rect x="30" y="100" width="200" height="340" fill="url(#mix-depth)" />

                {/* Ice, sitting in whatever's poured */}
                {[
                  { x: 70, y: 112, r: -12, d: "0s" },
                  { x: 130, y: 98, r: 14, d: "-1.4s" },
                  { x: 100, y: 160, r: 4, d: "-2.4s" },
                  { x: 152, y: 150, r: -18, d: "-0.8s" },
                ].map((c) => (
                  <g key={`${c.x}`} transform={`translate(${c.x} ${c.y})`} style={{ opacity: chosen.length ? 1 : 0.35, transition: "opacity 0.5s" }}>
                    <rect
                      className="kup-bob"
                      width="38"
                      height="36"
                      rx="8"
                      fill="#fff"
                      fillOpacity="0.32"
                      stroke="#fff"
                      strokeOpacity="0.8"
                      strokeWidth="1.5"
                      style={{ ["--r" as string]: `${c.r}deg`, ["--d" as string]: c.d }}
                    />
                  </g>
                ))}
              </g>

              {/* Straw */}
              <g transform="rotate(10 160 60)">
                <rect x="152" y="-6" width="15" height="300" rx="7.5" fill="#0c4f28" />
                <rect x="152" y="-6" width="4.5" height="300" rx="2.2" fill="#fff" opacity="0.25" />
              </g>

              {/* The glass */}
              <path d={GLASS_OUTER} fill="url(#mix-sheen)" stroke="#13110d" strokeOpacity="0.55" strokeWidth="2.5" strokeLinejoin="round" />
              <ellipse cx="130" cy="56" rx="92" ry="8" fill="none" stroke="#13110d" strokeOpacity="0.5" strokeWidth="2.5" />
              <path d="M54 80 L68 400" stroke="#fff" strokeOpacity="0.7" strokeWidth="6" strokeLinecap="round" />
              <image href="/kup/logo-mark.png" x="100" y="330" width="60" height="52" opacity="0.95" />
            </svg>

            {full && (
              <p
                key={picked.join()}
                className="kup-pop absolute top-[18%] -right-2 grid h-24 w-24 place-items-center rounded-full bg-caramel text-center text-bean shadow-[0_18px_40px_-16px_rgba(26,17,5,0.6)] sm:-right-6"
              >
                <span className="leading-none">
                  <span className="block text-2xl font-black tracking-[-0.04em]">3 for 2</span>
                  <span className="mt-1 block text-[0.62rem] font-bold tracking-[0.16em] uppercase">This one&apos;s free</span>
                </span>
              </p>
            )}

            <p className="mt-6 text-center text-sm font-semibold text-ink/70">
              {chosen.length ? chosen.map((f) => f.name).join(" · ") : "An empty glass, for now."}
            </p>
            <div className="mt-6 flex justify-center">
              <a
                href={stores.path}
                className="group inline-flex items-center gap-3 rounded-full bg-forest px-6 py-3.5 text-sm font-bold text-cream transition-[transform,background-color] duration-300 ease-[var(--ease-back)] hover:-translate-y-0.5 hover:bg-forest-500"
              >
                Order a Match &amp; Mix
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function glassLabel(chosen: Flavour[]) {
  if (!chosen.length) return "An empty glass";
  return `A glass of iced tea layered with ${chosen.map((f) => f.name.toLowerCase()).join(", ")}`;
}
