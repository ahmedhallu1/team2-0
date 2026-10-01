"use client";

import { useMemo, useState } from "react";
import { builder, stores, type AddonId, type MilkId, type SizeId } from "@/lib/kuphub/site";
import { IcedCup } from "./iced-cup";
import { clsx } from "@/lib/clsx";

/**
 * Make it yours — the app's own customisation screen, played with on the web.
 *
 * The drink, the options and every price are the ones the KUPHUB app lists
 * for an Iced Latte, so the total here is the total there. The visitor can't
 * check out on the website — the button hands them to the app, which is the
 * point: this is the app's best trick, shown where people can try it.
 */
export function CupBuilder() {
  const [size, setSize] = useState<SizeId>("m");
  const [milk, setMilk] = useState<MilkId>("regular");
  const [addons, setAddons] = useState<Set<AddonId>>(() => new Set(["caramel"]));

  const toggle = (id: AddonId) =>
    setAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const total = useMemo(() => {
    const s = builder.sizes.find((o) => o.id === size)?.price ?? 0;
    const m = builder.milks.find((o) => o.id === milk)?.price ?? 0;
    const a = builder.addons.reduce((sum, o) => (addons.has(o.id) ? sum + o.price : sum), 0);
    return builder.base.price + s + m + a;
  }, [size, milk, addons]);

  return (
    <section
      id="yours"
      aria-labelledby="yours-heading"
      className="relative overflow-clip bg-forest-900 py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-[8%] h-[70vmin] w-[70vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,140,70,0.28)_0%,rgba(200,140,70,0)_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle,rgba(18,99,58,0.55)_0%,rgba(18,99,58,0)_65%)]"
      />

      <div className="relative mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="kup-reveal text-xs font-semibold tracking-[0.24em] text-caramel-300 uppercase">
            Build your cup
          </p>
          <h2
            id="yours-heading"
            className="kup-reveal mt-5 text-[clamp(2.8rem,7vw,6rem)] leading-[0.88] font-black tracking-[-0.055em]"
            style={{ ["--delay" as string]: "80ms" }}
          >
            Make it <span className="font-serif font-normal tracking-[-0.02em] text-caramel-300 italic">yours.</span>
          </h2>
          <p
            className="kup-reveal mt-6 max-w-xl text-lg leading-relaxed text-cream/70"
            style={{ ["--delay" as string]: "160ms" }}
          >
            The app lets you set every part of the cup. Try it here on an Iced
            Latte — same options, same prices — then order it for real.
          </p>
        </div>

        {/*
            Flex on phones, grid from lg. A sticky grid item can't outlive its
            own row, so on a phone the cup would scroll away the moment you
            reached the add-ons; as a flex item it sticks for the whole builder,
            shrunk to a bar so the options still have the screen.
          */}
        <div className="mt-14 flex flex-col gap-8 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-14">
          {/* The cup */}
          <div className="sticky top-16 z-20 -mx-5 bg-gradient-to-b from-forest-900 from-70% to-forest-900/0 px-5 pt-2 pb-5 sm:-mx-8 sm:px-8 lg:static lg:col-span-5 lg:mx-0 lg:bg-none lg:p-0">
            <div className="flex items-center gap-5 lg:sticky lg:top-28 lg:block">
              <div className="relative aspect-[2/3] h-40 shrink-0 sm:h-52 lg:mx-auto lg:h-auto lg:w-full lg:max-w-[26rem]">
                <IcedCup size={size} milk={milk} addons={addons} className="h-full w-full" />
              </div>
              <div className="flex flex-col gap-1 lg:mt-6 lg:flex-row lg:items-end lg:justify-center lg:gap-3">
                <p className="text-sm text-cream/55">{builder.base.name}</p>
                <p aria-live="polite" className="leading-none">
                  <span key={total} className="kup-tick inline-block text-[clamp(2.4rem,5vw,3.4rem)] font-black tracking-[-0.04em] tabular-nums">
                    {total}
                  </span>
                  <span className="ml-1.5 text-sm font-bold tracking-[0.12em] text-caramel-300">EGP</span>
                </p>
              </div>
            </div>
          </div>

          {/* The options */}
          <div className="lg:col-span-7">
            <div className="kup-reveal rounded-[2rem] border border-cream/10 bg-forest-950/50 p-6 backdrop-blur-sm sm:p-10">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-cream/10 pb-6">
                <div>
                  <h3 className="text-2xl font-black tracking-[-0.03em] sm:text-3xl">{builder.base.name}</h3>
                  <p className="mt-1.5 text-sm text-cream/60">{builder.base.note}.</p>
                </div>
                <p className="text-sm text-cream/60">
                  From <span className="font-bold text-cream">{builder.base.price} EGP</span>
                </p>
              </div>

              <Choice
                legend="Size"
                name="size"
                options={builder.sizes}
                value={size}
                onChange={(v) => setSize(v as SizeId)}
              />
              <Choice
                legend="Milk"
                name="milk"
                options={builder.milks}
                value={milk}
                onChange={(v) => setMilk(v as MilkId)}
              />

              <fieldset className="mt-8">
                <legend className="text-xs font-semibold tracking-[0.22em] text-cream/50 uppercase">Add-ons</legend>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {builder.addons.map((o) => {
                    const on = addons.has(o.id);
                    return (
                      <label key={o.id} className="cursor-pointer">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={on}
                          onChange={() => toggle(o.id)}
                        />
                        <span
                          className={clsx(
                            "kup-pill inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-caramel-300",
                            on
                              ? "border-caramel bg-caramel text-bean"
                              : "border-cream/18 text-cream/80 hover:border-cream/40",
                          )}
                        >
                          <span
                            aria-hidden
                            className={clsx(
                              "grid h-4 w-4 place-items-center rounded-full text-[0.7rem] leading-none transition-transform duration-300",
                              on ? "rotate-45 bg-bean text-caramel" : "border border-current",
                            )}
                          >
                            +
                          </span>
                          {o.label}
                          <span className={clsx("tabular-nums", on ? "text-bean/70" : "text-cream/45")}>+{o.price}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-cream/10 pt-8">
                <p className="max-w-xs text-sm leading-relaxed text-cream/55">
                  Sugar and ice are yours to set too — in the app, when you order.
                </p>
                <a
                  href={stores.path}
                  className="group inline-flex items-center gap-3 rounded-full bg-caramel py-3.5 pr-3.5 pl-6 font-bold text-bean transition-[transform,background-color] duration-300 ease-[var(--ease-back)] hover:-translate-y-0.5 hover:bg-caramel-300"
                >
                  Order it in the app
                  <span className="rounded-full bg-bean px-3 py-1 text-sm text-caramel-300 tabular-nums">
                    {total} EGP
                  </span>
                </a>
              </div>
            </div>
            <p className="mt-4 text-xs text-cream/60">
              Options and prices as the KUPHUB app lists them. Prices can vary by branch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Choice({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly { id: string; label: string; price: number }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="mt-8">
      <legend className="text-xs font-semibold tracking-[0.22em] text-cream/50 uppercase">{legend}</legend>
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {options.map((o) => {
          const on = o.id === value;
          return (
            <label key={o.id} className="cursor-pointer">
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={on}
                onChange={() => onChange(o.id)}
                className="peer sr-only"
              />
              <span
                className={clsx(
                  "kup-pill flex flex-col items-start rounded-2xl border px-4 py-3.5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-caramel-300 sm:px-5",
                  on ? "border-cream bg-cream text-ink" : "border-cream/15 text-cream hover:border-cream/40",
                )}
              >
                <span className="text-base font-bold sm:text-lg">{o.label}</span>
                <span className={clsx("mt-0.5 text-xs tabular-nums", on ? "text-ink/60" : "text-cream/50")}>
                  {o.price ? `+${o.price} EGP` : "Included"}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
