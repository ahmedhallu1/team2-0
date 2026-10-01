"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { appFeatures, trackerSteps } from "@/lib/kuphub/site";
import { AppQr, StoreButtons } from "./brand";
import { prefersReducedMotion } from "@/lib/motion/gsap";
import { clsx } from "@/lib/clsx";

const DWELL = 5200;

/**
 * The app, shown with the app.
 *
 * Every screen in the phone is a real KUPHUB screen from its store listing,
 * paired with the line from the listing that describes it. The list advances
 * on its own while it's on screen, and hands control over the moment anyone
 * touches it — hover, focus or click all stop the clock.
 */
export function AppShowcase() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView || prefersReducedMotion()) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % appFeatures.length), DWELL);
    return () => window.clearTimeout(id);
  }, [active, auto, inView]);

  const take = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <section
      id="app"
      ref={ref}
      aria-labelledby="app-heading"
      className="relative overflow-clip bg-forest-950 py-24 sm:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[10%] right-[-8%] h-[80vmin] w-[80vmin] rounded-full bg-[radial-gradient(circle,rgba(18,99,58,0.7)_0%,rgba(18,99,58,0)_62%)]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(200,140,70,0.18)_0%,rgba(200,140,70,0)_62%)]" />
      </div>

      {/*
          On a phone the left column dissolves (`contents`) so the phone can
          sit between the heading and the list instead of after all of it.
        */}
      <div className="relative mx-auto grid max-w-[90rem] px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="max-lg:contents lg:col-span-5">
          <p className="kup-reveal text-xs font-semibold tracking-[0.24em] text-caramel-300 uppercase">
            The KUPHUB app · iPhone &amp; Android
          </p>
          <h2
            id="app-heading"
            className="kup-reveal mt-5 text-[clamp(2.7rem,6vw,5.2rem)] leading-[0.9] font-black tracking-[-0.055em]"
            style={{ ["--delay" as string]: "80ms" }}
          >
            The whole café,
            <br />
            <span className="font-serif font-normal tracking-[-0.02em] text-caramel-300 italic">in your pocket.</span>
          </h2>
          <p
            className="kup-reveal mt-6 max-w-md text-lg leading-relaxed text-cream/70"
            style={{ ["--delay" as string]: "160ms" }}
          >
            Order ahead, track it to the door, pay from your wallet. In English
            and <span lang="ar">العربية</span>.
          </p>

          <ol className="kup-reveal mt-10 border-t border-cream/10 max-lg:order-3 max-lg:mt-4" style={{ ["--delay" as string]: "220ms" }}>
            {appFeatures.map((f, i) => {
              const on = i === active;
              return (
                <li key={f.id} className="border-b border-cream/10">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => take(i)}
                    onMouseEnter={() => take(i)}
                    onFocus={() => take(i)}
                    className="group relative w-full py-4 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className={clsx("font-mono text-xs tabular-nums transition-colors", on ? "text-caramel" : "text-cream/30")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={clsx(
                          "text-xl font-bold tracking-[-0.02em] transition-colors sm:text-2xl",
                          on ? "text-cream" : "text-cream/50 group-hover:text-cream/80",
                        )}
                      >
                        {f.title}
                      </span>
                    </span>
                    <span
                      className={clsx(
                        "grid pl-9 transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-expo)]",
                        on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="block pt-2 text-[0.95rem] leading-relaxed text-cream/65">{f.line}</span>
                      </span>
                    </span>
                    {on && auto && inView && (
                      <span
                        key={active}
                        aria-hidden
                        className="kup-progress absolute bottom-[-1px] left-0 h-px w-full origin-left bg-caramel"
                        style={{ ["--dwell" as string]: `${DWELL}ms` }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="kup-reveal mt-10 flex flex-wrap items-center gap-6 max-lg:order-4" style={{ ["--delay" as string]: "280ms" }}>
            <StoreButtons size="lg" />
          </div>

          <div className="mt-8 hidden items-center gap-5 rounded-3xl max-lg:order-5 border border-cream/10 bg-forest-900/60 p-4 pr-6 lg:inline-flex">
            <AppQr className="h-24 w-24 rounded-xl" />
            <div>
              <p className="text-sm font-bold">On a laptop?</p>
              <p className="mt-1 max-w-[13rem] text-sm leading-snug text-cream/60">
                Point your phone&apos;s camera here — it opens the right store.
              </p>
            </div>
          </div>
        </div>

        {/* The phone */}
        <div className="relative max-lg:order-2 max-lg:my-6 lg:col-span-7">
          <div className="relative mx-auto flex h-full max-w-xl items-center justify-center py-6">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[34vw] leading-none font-black tracking-[-0.08em] text-transparent [-webkit-text-stroke:1.5px_rgba(244,239,230,0.07)] select-none lg:text-[17vw]"
            >
              app
            </span>

            <div className="kup-reveal relative w-[min(17.5rem,70vw)] sm:w-[19rem]" style={{ ["--rd" as string]: "4rem" }}>
              <div className="relative aspect-[640/1394] overflow-hidden rounded-[2.9rem] border-[10px] border-[#0d0e0d] bg-black shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9),0_0_0_1.5px_rgba(244,239,230,0.12)]">
                {appFeatures.map((f, i) => (
                  <Image
                    key={f.id}
                    src={f.screen}
                    alt={i === active ? f.alt : ""}
                    aria-hidden={i !== active}
                    fill
                    sizes="(min-width: 640px) 19rem, 70vw"
                    className={clsx(
                      "kup-screen object-cover object-top",
                      i === active ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
                    )}
                  />
                ))}
              </div>

              {/* Live order — the tracker that sits on the app's home screen */}
              <div
                aria-hidden
                className="kup-float absolute top-[16%] -left-[42%] hidden w-60 rounded-2xl border border-cream/10 bg-forest-900/85 p-4 shadow-2xl backdrop-blur-md sm:block"
                style={{ ["--d" as string]: "-1s" }}
              >
                <p className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.16em] text-leaf uppercase">
                  <span className="relative grid h-2 w-2 place-items-center">
                    <span className="kup-ping absolute inset-0 rounded-full bg-leaf" />
                    <span className="h-2 w-2 rounded-full bg-leaf" />
                  </span>
                  Live order
                </p>
                <p className="mt-2 text-sm font-bold">Estimated 20–30 min</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream/10">
                  <div className="kup-track h-full rounded-full bg-caramel" />
                </div>
                <div className="mt-2 flex justify-between text-[0.62rem] text-cream/50">
                  {trackerSteps.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>

              <div
                aria-hidden
                className="kup-float absolute -right-[30%] bottom-[18%] hidden rounded-2xl bg-caramel px-4 py-3 text-bean shadow-2xl sm:block"
                style={{ ["--d" as string]: "-3.2s" }}
              >
                <p className="text-[0.62rem] font-bold tracking-[0.16em] uppercase opacity-70">KUPHUB Wallet</p>
                <p className="mt-0.5 text-sm font-black">Pay in a tap</p>
              </div>

              <div
                aria-hidden
                className="kup-float absolute -right-[22%] top-[6%] hidden rounded-full border border-cream/15 bg-forest-950/80 px-4 py-2 text-xs font-semibold backdrop-blur sm:block"
                style={{ ["--d" as string]: "-2s" }}
              >
                EN · <span lang="ar">عربي</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
