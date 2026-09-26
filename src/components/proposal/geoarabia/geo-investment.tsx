"use client";

import { useId, useMemo, useState } from "react";
import { Check, Lock } from "lucide-react";
import { SectionHead } from "@/components/proposal/section-head";
import { Rise } from "@/components/motion/reveal";
import {
  commitmentDiscount,
  offers,
  terms,
  type Currency,
  type Offer,
} from "@/lib/proposals/geoarabia";
import { proposalY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * The prices — the one part of this proposal KUPHUB's didn't have, on the
 * only paper-coloured ground on the page, because this is where it stops
 * arguing and starts quoting.
 *
 * It is a builder rather than a table because the room will ask "and without
 * the WhatsApp?" and the answer should appear, not be worked out on a phone.
 * Each item is a native checkbox (focusable, announced, Space to toggle), the
 * totals sit in a live region, and the two items the plan can't stand without
 * — the site and the SEO — are locked on.
 *
 * Currencies are never mixed into one figure. The social retainer is quoted in
 * dollars and everything else in pounds, so the totals read "EGP + USD".
 */

const GROUPS: { id: Offer["group"]; title: string; note: string }[] = [
  { id: "build", title: "Build once", note: "One-off, paid 50/50" },
  { id: "run", title: "Run monthly", note: "Billed in advance" },
  { id: "add", title: "Add when ready", note: "Switch on any month" },
];

const fmt = (n: number, c: Currency) =>
  c === "USD" ? `$${n.toLocaleString("en-US")}` : `${n.toLocaleString("en-US")} EGP`;

function priceLabel(o: Offer) {
  if (o.priceNote) return o.priceNote;
  return o.cadence === "month" ? `${fmt(o.price, o.currency)} / month` : fmt(o.price, o.currency);
}

/** "12,500 EGP + $500", dropping whichever side is zero. */
function mixed(egp: number, usd: number) {
  const parts = [egp ? fmt(egp, "EGP") : "", usd ? fmt(usd, "USD") : ""].filter(Boolean);
  return parts.length ? parts.join(" + ") : "—";
}

function OfferTile({
  offer,
  on,
  onToggle,
}: {
  offer: Offer;
  on: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  const featured = offer.id === "seo";
  return (
    <li
      className={clsx(
        "relative flex flex-col rounded-xl border bg-surface p-5 transition-[border-color,box-shadow] duration-300 sm:p-6",
        on ? "border-accent shadow-[0_0_0_1px_var(--accent)]" : "border-line",
        featured && "md:col-span-2",
      )}
    >
      <label htmlFor={id} className={clsx("flex items-start gap-3", offer.required ? "cursor-default" : "cursor-pointer")}>
        <input
          id={id}
          type="checkbox"
          checked={on}
          disabled={offer.required}
          onChange={onToggle}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={clsx(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--ring)]",
            on ? "border-accent bg-accent text-on-accent" : "border-line-2 bg-surface",
          )}
        >
          {offer.required ? <Lock size={11} /> : on ? <Check size={13} strokeWidth={3} /> : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="font-display text-lg font-extrabold tracking-tight text-ink">
              {offer.name}
              {offer.required ? (
                <span className="ml-2 align-middle text-[10px] font-semibold tracking-[0.14em] text-faint uppercase">
                  Core
                </span>
              ) : null}
            </span>
            <span className="font-display text-base font-extrabold tracking-tight text-ink tabular-nums">
              {priceLabel(offer)}
            </span>
          </span>
          <span className="mt-1 block text-sm leading-snug text-muted">{offer.line}</span>
        </span>
      </label>

      <ul
        className={clsx(
          "mt-4 grid gap-x-6 gap-y-1.5 border-t border-line pt-4 pl-8",
          featured && "sm:grid-cols-2",
        )}
      >
        {offer.includes.map((i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-snug text-muted">
            <span aria-hidden className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full bg-brand" />
            {i}
          </li>
        ))}
      </ul>
    </li>
  );
}

export function GeoInvestment() {
  const [picked, setPicked] = useState<Set<string>>(
    () => new Set(offers.filter((o) => o.recommended).map((o) => o.id)),
  );
  const [committed, setCommitted] = useState(true);
  const commitId = useId();

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const totals = useMemo(() => {
    const t = { onceEGP: 0, monthEGP: 0, monthUSD: 0, ads: false };
    for (const o of offers) {
      if (!picked.has(o.id)) continue;
      if (o.cadence === "once") t.onceEGP += o.price;
      else if (o.cadence === "percent") {
        t.monthEGP += o.price;
        t.ads = true;
      } else if (o.currency === "USD") t.monthUSD += o.price;
      else t.monthEGP += o.price;
    }
    return t;
  }, [picked]);

  // The discount applies to retainers only — never to the minimum fee on ads,
  // which is a percentage of someone else's spend.
  const discounted = (n: number) => Math.round(n * (1 - commitmentDiscount));
  const adsFloor = totals.ads ? offers.find((o) => o.cadence === "percent")!.price : 0;
  const monthEGP = committed
    ? discounted(totals.monthEGP - adsFloor) + adsFloor
    : totals.monthEGP;
  const monthUSD = committed ? discounted(totals.monthUSD) : totals.monthUSD;
  const sixMonths = { egp: totals.onceEGP + monthEGP * 6, usd: monthUSD * 6 };

  return (
    <section
      id="investment"
      data-zone="geo-paper"
      aria-labelledby="investment-heading"
      className={clsx("relative", proposalY)}
    >
      <div className={shell}>
        <SectionHead
          n="04"
          label="Investment"
          headingId="investment-heading"
          lines={["What it costs,", "item by item."]}
          lede="The recommended start is already switched on. Tick anything on or off and the totals update. The website and the SEO stay on, because the plan doesn't work without them."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="space-y-10 lg:col-span-8">
            {GROUPS.map((g) => (
              <Rise key={g.id}>
                <div className="flex items-baseline justify-between gap-4 border-b border-line-2 pb-3">
                  <h3 className="font-display text-xl font-extrabold tracking-tight text-ink">{g.title}</h3>
                  <p className="text-xs text-faint">{g.note}</p>
                </div>
                <ul className="mt-4 grid gap-3 md:grid-cols-2">
                  {offers
                    .filter((o) => o.group === g.id)
                    .map((o) => (
                      <OfferTile
                        key={o.id}
                        offer={o}
                        on={picked.has(o.id)}
                        onToggle={() => toggle(o.id)}
                      />
                    ))}
                </ul>
              </Rise>
            ))}
          </div>

          {/* The summary follows the reader down the list on desktop. */}
          <aside
            aria-label="Totals"
            className="lg:sticky lg:top-24 lg:col-span-4"
          >
            <div className="overflow-hidden rounded-xl bg-[#13254a] text-white shadow-[0_24px_60px_-30px_rgba(19,37,74,0.6)]">
              <div className="p-6 sm:p-7" aria-live="polite">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-white/60 uppercase">
                  Your selection
                </p>

                <dl className="mt-6 space-y-5">
                  <div>
                    <dt className="text-xs text-white/65">Once, to build</dt>
                    <dd className="mt-1 font-display text-2xl font-extrabold tracking-tight tabular-nums">
                      {mixed(totals.onceEGP, 0)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-white/65">Every month</dt>
                    <dd className="mt-1 font-display text-2xl font-extrabold tracking-tight tabular-nums">
                      {mixed(monthEGP, monthUSD)}
                    </dd>
                    {committed && (totals.monthEGP || totals.monthUSD) ? (
                      <dd className="mt-1 text-xs text-white/55 tabular-nums">
                        was {mixed(totals.monthEGP, totals.monthUSD)}
                      </dd>
                    ) : null}
                    {totals.ads ? (
                      <dd className="mt-1 text-xs text-white/55">Ads: 15% of spend, 5,000 EGP minimum shown.</dd>
                    ) : null}
                  </div>
                  <div className="border-t border-white/15 pt-5">
                    <dt className="text-xs text-white/65">First six months, all in</dt>
                    <dd className="mt-1 font-display text-lg font-extrabold tracking-tight text-[#8fe0ef] tabular-nums">
                      {mixed(sixMonths.egp, sixMonths.usd)}
                    </dd>
                  </div>
                </dl>

                <label
                  htmlFor={commitId}
                  className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-white/15 p-3.5 transition-colors hover:border-white/30"
                >
                  <input
                    id={commitId}
                    type="checkbox"
                    checked={committed}
                    onChange={(e) => setCommitted(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden
                    className={clsx(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#8fe0ef]",
                      committed ? "border-[#8fe0ef] bg-[#8fe0ef] text-[#13254a]" : "border-white/40",
                    )}
                  >
                    {committed ? <Check size={13} strokeWidth={3} /> : null}
                  </span>
                  <span className="text-sm leading-snug">
                    Commit to six months
                    <span className="mt-0.5 block text-xs text-white/60">
                      {Math.round(commitmentDiscount * 100)}% off every monthly retainer
                    </span>
                  </span>
                </label>
              </div>

              <ul className="space-y-2 border-t border-white/10 bg-black/15 p-6 text-xs leading-relaxed text-white/65 sm:px-7">
                {terms.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span aria-hidden className="mt-[0.55em] h-px w-2.5 shrink-0 bg-white/40" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
