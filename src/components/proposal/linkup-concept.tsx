"use client";

import { useRef } from "react";
import { ArrowRight, Leaf, Recycle, ShieldCheck } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, STAGGER, TRIGGER_START } from "@/lib/motion/tokens";
import { SectionHead } from "@/components/proposal/section-head";
import { Rise } from "@/components/motion/reveal";
import { CupGlyph, LinkMark } from "@/components/proposal/kup-glyphs";
import {
  linkupLines,
  linkupProducts,
  linkupSizes,
} from "@/lib/proposals/kuphub";
import { sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * LinkUp, reimagined — and deliberately *not* the KUPHUB section in a
 * different colour.
 *
 * KUPHUB sells to a person walking past, so its section is a feed and a menu.
 * LinkUp sells to a buyer who needs a spec, a size, a certificate and a price,
 * so its section is a product system and a quote path. Same studio, same
 * discipline, completely different shape — which is the argument for hiring
 * one team to do both.
 *
 * Every specification on this page is LinkUp's own, off their product
 * graphics. The campaign line is theirs too: it is already on their cover.
 */

const ICONS = [Recycle, Leaf, ShieldCheck];

export function LinkUpConcept() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.from(el.querySelectorAll("[data-product]"), {
        opacity: 0,
        y: 32,
        duration: DUR.slow,
        ease: EASE.ascent,
        stagger: STAGGER.loose,
        scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="linkup"
      aria-labelledby="linkup-heading"
      className={clsx("relative border-t border-line", sectionY)}
    >
      <div
        aria-hidden
        className="glow glow--tucked -z-10 -top-20 -left-40 h-[30rem] w-[30rem]"
        style={{ ["--glow" as string]: "var(--link)" }}
      />

      <div className={shell}>
        <SectionHead
          n="08"
          label="LinkUp Egypt"
          headingId="linkup-heading"
          lines={["A catalogue,", "not a feed."]}
          lede={
            <>
              A buyer specifying cups needs four things: the material, the
              sizes, the certification and a way to ask for a quote. Right now
              all four live in the comments. This is the same information,
              built as a product system.
            </>
          }
        />

        {/* The campaign, using their own line */}
        <Rise>
          <div
            className="concept mt-14 grid gap-8 border border-line p-7 sm:p-10 lg:grid-cols-12 lg:items-center"
            style={{ background: "linear-gradient(120deg,#17150f,#0f0e0a 70%)" }}
          >
            <div className="lg:col-span-7">
              <p
                className="text-[11px] font-semibold tracking-[0.28em] uppercase"
                style={{ color: "var(--link)" }}
              >
                The campaign — their own line
              </p>
              <p className="mt-5 font-display text-[clamp(1.7rem,4.4vw,3rem)] leading-[0.94] font-extrabold tracking-[-0.035em] text-white">
                Sustainability starts with
                <span style={{ color: "var(--link)" }}> one cup</span>.
              </p>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/60">
                It is already written across their Facebook cover, and it is a
                better line than most packaging companies ever land on. It has
                simply never been given a campaign, a set of assets, or a page
                to live on.
              </p>
              <ul className="mt-7 flex flex-wrap gap-2">
                {linkupLines.slice(1).map((line) => (
                  <li
                    key={line}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-white/55"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative lg:col-span-5">
              <div className="flex items-end justify-center gap-4">
                {/* A family shot — for this business the sizes *are* the range. */}
                {[0.68, 1, 0.8].map((h, i) => (
                  <CupGlyph
                    key={h}
                    lid={i === 1}
                    className="text-white/70"
                    style={{ height: `${h * 9}rem` }}
                  />
                ))}
              </div>
              <p className="mt-5 text-center text-[11px] tracking-[0.2em] text-white/35 uppercase">
                {linkupSizes.join(" · ")}
              </p>
            </div>
          </div>
        </Rise>

        {/* The range */}
        <div ref={ref} className="mt-6 grid gap-4 lg:grid-cols-3">
          {linkupProducts.map((product, i) => {
            const Icon = ICONS[i] ?? Recycle;
            return (
              <article
                key={product.name}
                data-product
                className="flex flex-col rounded-xl border border-line bg-surface p-6 sm:p-7"
              >
                <Icon size={20} aria-hidden style={{ color: "var(--link-ink)" }} />
                <h3 className="mt-5 font-display text-xl font-extrabold tracking-tight text-ink">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {product.sub}
                </p>
                <dl className="mt-6 flex-1 space-y-px overflow-hidden rounded-lg border border-line bg-line">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-baseline justify-between gap-4 bg-surface px-3.5 py-2.5"
                    >
                      <dt className="text-[11px] tracking-[0.12em] text-faint uppercase">
                        {spec.label}
                      </dt>
                      <dd className="text-right text-xs font-medium text-ink">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            );
          })}
        </div>

        {/* The site: a catalogue with a quote path at the end of it */}
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <h3 className="font-display text-[clamp(1.5rem,3.2vw,2.2rem)] leading-[1.02] font-extrabold tracking-[-0.02em] text-ink">
              linkupegypt.com
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              The domain is live and says &ldquo;Launching Soon&rdquo;. Behind
              it: the range, the specifications, the certifications, and a form
              that turns a scroll into a named enquiry with a size and a
              quantity attached.
            </p>
            <ul className="mt-6 space-y-2.5">
              {[
                "Product pages a buyer can send to a colleague",
                "Downloadable spec sheets",
                "Quote requests routed to WhatsApp",
                "The rice-husk range, with a page of its own",
                "English and Arabic",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-ink">
                  <ArrowRight
                    size={14}
                    aria-hidden
                    className="mt-1 shrink-0"
                    style={{ color: "var(--link-ink)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-8">
            <div className="device">
              <div className="device__bar">
                <span className="device__dot" />
                <span className="device__dot" />
                <span className="device__dot" />
                <span className="ml-3 flex-1 truncate rounded-md bg-bg/60 px-3 py-1 text-[11px] text-faint">
                  linkupegypt.com/products/reusable-pp
                </span>
              </div>
              <LinkUpSite />
            </div>
          </div>
        </div>

        <Rise as="p" className="mt-8 text-xs leading-relaxed text-faint">
          Concept by 2.0. Materials, sizes, finishes and the campaign line are
          LinkUp&apos;s own, taken from their public product graphics.
        </Rise>
      </div>
    </section>
  );
}

function LinkUpSite() {
  return (
    <div className="bg-[#faf8f4] text-[#14120f]">
      <div className="flex items-center justify-between border-b border-black/8 px-6 py-3.5">
        <LinkMark className="text-sm" />
        <nav className="hidden gap-6 text-[11px] font-medium text-black/55 sm:flex">
          {["Reusable PP", "Rice husk", "IML printing", "Sustainability", "About"].map(
            (n) => (
              <span key={n}>{n}</span>
            ),
          )}
        </nav>
        <span
          className="rounded-md px-3 py-1.5 text-[11px] font-bold text-white"
          style={{ background: "var(--link-deep)" }}
        >
          Request a quote
        </span>
      </div>

      <div className="grid gap-8 px-6 py-9 sm:grid-cols-12 sm:px-10">
        <div className="sm:col-span-6">
          <p className="text-[10px] tracking-[0.24em] text-black/40 uppercase">
            Reusable collection
          </p>
          <p className="mt-3 font-display text-[clamp(1.5rem,4vw,2.6rem)] leading-[0.92] font-extrabold tracking-[-0.035em]">
            Reusable PP
          </p>
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-black/60">
            Food-grade PP5, microwave safe, hot and cold. Printed in the mould,
            so the graphic lasts as long as the cup does.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {linkupSizes.map((size, i) => (
              <span
                key={size}
                className={clsx(
                  "rounded-md border px-3 py-1.5 text-[11px] font-semibold",
                  i === 2
                    ? "border-transparent text-white"
                    : "border-black/15 text-black/65",
                )}
                style={i === 2 ? { background: "var(--link-deep)" } : undefined}
              >
                {size}
              </span>
            ))}
          </div>

          <div className="mt-7 rounded-lg border border-black/10 bg-white p-4">
            <p className="text-[11px] font-semibold">Minimum order</p>
            <p className="mt-1 font-display text-2xl font-extrabold tracking-tight">
              None
            </p>
            <p className="mt-1 text-[11px] text-black/50">
              Their own promise, in the place a buyer looks for it.
            </p>
          </div>
        </div>

        <div className="sm:col-span-6">
          <div className="flex h-44 items-end justify-center gap-3 rounded-lg bg-[#f0ebe2]">
            {/* The ladder the buyer is actually choosing between. */}
            {[0.58, 0.72, 0.88, 1].map((h, i) => (
              <CupGlyph
                key={h}
                lid={i % 2 === 1}
                className="text-black/45"
                style={{ height: `${h * 8}rem` }}
              />
            ))}
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10">
            {[
              ["Material", "PP5, food grade"],
              ["Print", "IML, in-mould"],
              ["Use", "Hot & cold"],
              ["Care", "Microwave safe"],
            ].map(([k, v]) => (
              <div key={k} className="bg-white px-3.5 py-2.5">
                <dt className="text-[9px] tracking-[0.14em] text-black/40 uppercase">
                  {k}
                </dt>
                <dd className="mt-0.5 text-[11px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-10"
        style={{ background: "var(--link)" }}
      >
        <p className="font-display text-base font-extrabold tracking-tight text-[#1a1105]">
          Tell us the size and the quantity.
        </p>
        <span className="rounded-md bg-[#1a1105] px-4 py-2 text-[11px] font-bold text-white">
          Request a quote
        </span>
      </div>
    </div>
  );
}
