"use client";

import { useState } from "react";
import { branches, stores } from "@/lib/kuphub/site";
import { clsx } from "@/lib/clsx";

/**
 * Four addresses, on a drawn map of the stretch of Alexandria they sit in.
 *
 * The map is a schematic — the coast, the Corniche and four pins in roughly
 * the right relation to one another — and it says so. Real directions are one
 * tap away on every card, and the app knows which branch is nearest.
 */
export function Branches() {
  const [active, setActive] = useState(branches[1].id);

  return (
    <section
      id="branches"
      aria-labelledby="branches-heading"
      className="relative overflow-hidden bg-paper py-24 text-ink sm:py-32"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="kup-reveal flex items-center gap-3 text-xs font-semibold tracking-[0.24em] text-forest uppercase">
              Find us
              <span lang="ar" dir="rtl" className="font-medium tracking-normal text-ink/45 normal-case">
                فروعنا في إسكندرية
              </span>
            </p>
            <h2
              id="branches-heading"
              className="kup-reveal mt-5 text-[clamp(2.8rem,7vw,6.2rem)] leading-[0.88] font-black tracking-[-0.055em]"
              style={{ ["--delay" as string]: "80ms" }}
            >
              Four addresses.
              <br />
              <span className="font-serif font-normal tracking-[-0.02em] text-forest italic">One city.</span>
            </h2>
          </div>
          <p
            className="kup-reveal max-w-md text-lg leading-relaxed text-ink/70 lg:col-span-5 lg:justify-self-end"
            style={{ ["--delay" as string]: "160ms" }}
          >
            From Shatby to Smouha. The app finds the nearest one for you, with
            the distance, the directions and the hours.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          {/* The map */}
          <div className="kup-reveal relative overflow-hidden rounded-[2rem] border border-ink/10 bg-paper-2 lg:col-span-7">
            <svg viewBox="0 0 1000 640" className="block h-auto w-full" aria-hidden>
              <defs>
                <pattern id="kup-streets" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)">
                  <path d="M0 0 H46 M0 0 V46" stroke="#13110d" strokeOpacity="0.06" strokeWidth="1.2" />
                </pattern>
                <pattern id="kup-sea" width="60" height="22" patternUnits="userSpaceOnUse">
                  <path d="M0 11 Q15 3 30 11 T60 11" fill="none" stroke="#0c4f28" strokeOpacity="0.18" strokeWidth="1.4" />
                </pattern>
              </defs>

              <rect width="1000" height="640" fill="url(#kup-streets)" />

              {/* The sea, and the Corniche along its edge */}
              <path
                d="M0 0 H1000 V48 C960 60 910 76 850 94 C760 120 660 140 570 160 C480 180 410 206 310 206 C210 206 130 232 0 258 Z"
                fill="#0c4f28"
                fillOpacity="0.1"
              />
              <path
                d="M0 0 H1000 V48 C960 60 910 76 850 94 C760 120 660 140 570 160 C480 180 410 206 310 206 C210 206 130 232 0 258 Z"
                fill="url(#kup-sea)"
              />
              <path
                d="M1000 48 C960 60 910 76 850 94 C760 120 660 140 570 160 C480 180 410 206 310 206 C210 206 130 232 0 258"
                fill="none"
                stroke="#c88c46"
                strokeWidth="3"
                strokeDasharray="2 9"
                strokeLinecap="round"
              />
              <text x="520" y="78" textAnchor="middle" fontSize="30" fill="#0c4f28" fillOpacity="0.55" fontStyle="italic" fontFamily="var(--font-kup-serif), Georgia, serif">
                Mediterranean Sea
              </text>
              <text x="0" y="0" fontSize="15" fontWeight="700" letterSpacing="4" fill="#8a5a24" transform="translate(612 182) rotate(-12)">
                CORNICHE
              </text>

              {/* North */}
              <g transform="translate(930 560)" fill="#13110d" fillOpacity="0.5">
                <path d="M0 -26 L9 6 L0 0 L-9 6 Z" />
                <text y="30" textAnchor="middle" fontSize="15" fontWeight="700">N</text>
              </g>

              {/* Pins */}
              {branches.map((b, i) => {
                const on = b.id === active;
                const x = b.at.x * 10;
                const y = b.at.y * 6.4;
                return (
                  <g
                    key={b.id}
                    transform={`translate(${x} ${y})`}
                    onMouseEnter={() => setActive(b.id)}
                    className="cursor-pointer"
                  >
                    {on && <circle r="22" fill="#c88c46" className="kup-ping" />}
                    <circle r={on ? 22 : 17} fill={on ? "#c88c46" : "#0c4f28"} style={{ transition: "r 0.4s" }} />
                    <circle r={on ? 22 : 17} fill="none" stroke="#f7f2e8" strokeWidth="3" />
                    <text y="6" textAnchor="middle" fontSize="16" fontWeight="800" fill={on ? "#1a1105" : "#f7f2e8"}>
                      {i + 1}
                    </text>
                    <text
                      y={on ? 50 : 44}
                      textAnchor="middle"
                      fontSize="19"
                      fontWeight="800"
                      fill="#13110d"
                      fillOpacity={on ? 1 : 0.6}
                      style={{ transition: "fill-opacity 0.3s" }}
                    >
                      {b.name}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="absolute bottom-4 left-5 text-[0.7rem] font-semibold tracking-[0.18em] text-ink/45 uppercase">
              Alexandria · not to scale
            </p>
          </div>

          {/* The cards */}
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {branches.map((b, i) => {
              const on = b.id === active;
              return (
                <li
                  key={b.id}
                  className="kup-reveal"
                  style={{ ["--delay" as string]: `${i * 70}ms` }}
                  onMouseEnter={() => setActive(b.id)}
                  onFocusCapture={() => setActive(b.id)}
                >
                  <div
                    className={clsx(
                      "flex h-full items-center gap-5 rounded-2xl border p-5 transition-colors duration-300",
                      on ? "border-forest bg-forest text-cream" : "border-ink/10 bg-white/50",
                    )}
                  >
                    <span
                      aria-hidden
                      className={clsx(
                        "grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-black transition-colors duration-300",
                        on ? "bg-caramel text-bean" : "bg-forest text-cream",
                      )}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-black tracking-[-0.02em]">{b.name}</h3>
                      <p className={clsx("text-sm", on ? "text-cream/75" : "text-ink/60")}>{b.detail}</p>
                      <p lang="ar" dir="rtl" className={clsx("mt-1 text-sm text-right", on ? "text-cream/60" : "text-ink/45")}>
                        {b.arabic}
                      </p>
                    </div>
                    <a
                      href={b.maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        "shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold transition-colors",
                        on ? "border-cream/30 hover:bg-cream hover:text-forest" : "border-ink/15 hover:border-forest hover:text-forest",
                      )}
                    >
                      Directions<span className="sr-only"> to KUPHUB {b.name}</span> ↗
                    </a>
                  </div>
                </li>
              );
            })}
            <li className="kup-reveal">
              <a
                href={stores.path}
                className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-ink/20 p-5 text-sm font-semibold text-ink/70 transition-colors hover:border-forest hover:text-forest"
              >
                Nearest branch, with distance and hours — in the app
                <span aria-hidden>→</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
