"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE } from "@/lib/motion/tokens";
import { SectionHead } from "@/components/proposal/section-head";
import { Rise } from "@/components/motion/reveal";
import { CupGlyph, Dot, KupMark, PinGlyph } from "@/components/proposal/kup-glyphs";
import { kuphubBranches, kuphubCampaigns, kuphubMenu } from "@/lib/proposals/kuphub";
import { sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * kuphub.com, as it could be — built as real markup inside a device frame
 * rather than shown as a flat picture of a website.
 *
 * That choice is the point of the section. Every branch, every product and
 * every offer on this screen is one KUPHUB already publishes; the only new
 * thing is that they are in one place with one address. And because it is real
 * DOM, it is crisp on a projector, it re-colours with the page's theme, and we
 * can point at any part of it live.
 *
 * The desktop frame and the phone are the same content at two widths, on
 * purpose — most of this audience arrives from a link in a bio.
 */
export function SiteConcept() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const desktop = el.querySelector("[data-desktop]");
      const phone = el.querySelector("[data-phone]");
      if (!desktop || !phone) return;

      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
        })
        .from(desktop, {
          opacity: 0,
          y: 48,
          rotateX: 8,
          duration: DUR.scene,
          ease: EASE.ascent,
        })
        .from(phone, { opacity: 0, y: 60, duration: DUR.slow, ease: EASE.ascent }, 0.22);

      // The phone drifts a little against the desktop while the section passes,
      // which is what stops the pair reading as one flat image.
      gsap.to(phone, {
        y: -34,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="site"
      aria-labelledby="site-heading"
      className={clsx("relative border-t border-line bg-surface-2/20", sectionY)}
    >
      <div className={shell}>
        <SectionHead
          n="05"
          label="The website"
          headingId="site-heading"
          lines={["Four addresses.", "One address."]}
          lede={
            <>
              kuphub.com already exists — it just doesn&apos;t open yet. Here is
              what would be behind it: the menu, the branches, and whichever
              offer is running today, on a page a customer can be sent to from
              anywhere.
            </>
          }
        />

        <div
          ref={ref}
          className="relative mt-14"
          style={{ perspective: "1600px" }}
        >
          <div data-desktop className="device mx-auto max-w-5xl lg:mr-24 lg:ml-0 xl:mr-28">
            <div className="device__bar">
              <span className="device__dot" />
              <span className="device__dot" />
              <span className="device__dot" />
              <span className="ml-3 flex-1 truncate rounded-md bg-bg/60 px-3 py-1 text-[11px] text-faint">
                kuphub.com
              </span>
            </div>
            <DesktopSite />
          </div>

          {/* The same site, where most of the traffic would actually arrive. */}
          <div
            data-phone
            // Hung off the corner rather than sitting inside the frame: the
            // phone has to overlap to read as a second device, but not so far
            // in that it swallows a column of the menu it is illustrating.
            className="device device--phone mx-auto mt-8 w-[15rem] lg:absolute lg:-right-6 lg:-bottom-24 lg:mt-0 xl:-right-16"
          >
            <PhoneSite />
          </div>
        </div>

        <Rise as="p" className="mt-24 text-xs leading-relaxed text-faint lg:mt-32">
          Concept by 2.0. Branches, products, prices and offers are KUPHUB&apos;s
          own, taken from the public channels — nothing here has been invented.
        </Rise>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const NAV = ["Menu", "Branches", "Offers", "Our koffee"];

function DesktopSite() {
  return (
    <div
      className="relative overflow-hidden text-white"
      style={{ background: "var(--kup)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-3.5">
        <KupMark tone="light" className="text-sm" />
        <nav className="hidden items-center gap-6 text-[11px] font-medium text-white/70 sm:flex">
          {NAV.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </nav>
        <span
          className="rounded-md px-3 py-1.5 text-[11px] font-bold"
          style={{ background: "var(--kup-amber)", color: "#1a1105" }}
        >
          Order
        </span>
      </div>

      {/* Hero */}
      <div className="grid gap-6 px-6 pt-8 pb-10 sm:grid-cols-12 sm:px-10 sm:pt-12">
        <div className="sm:col-span-7">
          <p className="text-[10px] tracking-[0.24em] text-white/50 uppercase">
            Alexandria · since the first kup
          </p>
          <p className="mt-4 font-display text-[clamp(1.7rem,4.6vw,3.2rem)] leading-[0.88] font-extrabold tracking-[-0.04em]">
            Less is more
            <Dot className="ml-[0.08em] inline-block h-[0.12em] w-[0.12em] align-baseline" />
          </p>
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/70">
            Premium koffee and kup to go. Four branches across the city, open
            from seven.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <span
              className="rounded-md px-4 py-2 text-[11px] font-bold"
              style={{ background: "var(--kup-amber)", color: "#1a1105" }}
            >
              See the menu
            </span>
            <span className="rounded-md border border-white/25 px-4 py-2 text-[11px] font-semibold text-white/85">
              Find your branch
            </span>
          </div>
        </div>
        <div className="relative hidden sm:col-span-5 sm:block">
          <CupGlyph className="mx-auto h-40 opacity-90" />
        </div>
      </div>

      {/* Today's offer — the thing the feed currently has to re-announce. */}
      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-white/10 px-6 py-3.5 sm:px-10"
        style={{ background: "rgba(0,0,0,0.18)" }}
      >
        <span className="text-[10px] tracking-[0.2em] text-white/45 uppercase">
          On today
        </span>
        {kuphubCampaigns.map((c) => (
          <span key={c.title} className="text-[11px] text-white/80">
            <span className="font-semibold">{c.title}</span>
            <span className="text-white/45"> — {c.line}</span>
          </span>
        ))}
      </div>

      {/* Menu */}
      <div className="grid gap-px bg-white/10 sm:grid-cols-4">
        {kuphubMenu.map((group) => (
          <div key={group.group} className="p-5 sm:p-6" style={{ background: "var(--kup)" }}>
            <p className="font-display text-sm font-bold tracking-tight">
              {group.group}
            </p>
            <ul className="mt-3 space-y-2">
              {group.items.map((item) => (
                <li key={item.name}>
                  <p className="text-[11px] font-medium text-white/85">{item.name}</p>
                  <p className="text-[10px] leading-snug text-white/45">{item.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Branches */}
      <div className="px-6 py-8 sm:px-10">
        <p className="text-[10px] tracking-[0.24em] text-white/50 uppercase">
          Branches
        </p>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-4">
          {kuphubBranches.map((b) => (
            <li
              key={b.name}
              className="rounded-lg border border-white/12 bg-white/[0.04] p-4"
            >
              <PinGlyph className="h-4 w-4 text-white/40" />
              <p className="mt-2.5 font-display text-[13px] font-bold tracking-tight">
                {b.name}
              </p>
              <p className="mt-1 text-[10px] leading-snug text-white/55">{b.detail}</p>
              <p
                dir="rtl"
                lang="ar"
                className="mt-1.5 text-[10px] leading-snug text-white/35"
              >
                {b.arabic}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PhoneSite() {
  return (
    <div
      className="flex h-[30rem] flex-col overflow-hidden text-white"
      style={{ background: "var(--kup)" }}
    >
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <KupMark tone="light" className="text-[11px]" />
        <span className="text-[9px] tracking-[0.18em] text-white/45 uppercase">
          Menu
        </span>
      </div>

      <div className="px-4">
        <p className="font-display text-2xl leading-[0.88] font-extrabold tracking-[-0.04em]">
          Less is
          <br />
          more
          <Dot className="ml-[0.08em] inline-block h-[0.13em] w-[0.13em] align-baseline" />
        </p>
        <span
          className="mt-4 inline-block rounded-md px-3 py-1.5 text-[10px] font-bold"
          style={{ background: "var(--kup-amber)", color: "#1a1105" }}
        >
          Order now
        </span>
      </div>

      <div
        className="mt-5 flex items-center gap-2 px-4 py-2.5"
        style={{ background: "rgba(0,0,0,0.2)" }}
      >
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: "var(--kup-amber)" }}
        />
        <p className="truncate text-[10px] text-white/75">
          Business Morning — 7am to 5pm
        </p>
      </div>

      <ul className="flex-1 divide-y divide-white/10 overflow-hidden px-4">
        {[
          { n: "Turkish", p: "20 EGP" },
          { n: "Match & Mix", p: "3 for 2" },
          { n: "Santarosa", p: "New" },
          { n: "Desserts", p: "" },
        ].map((row) => (
          <li key={row.n} className="flex items-center justify-between py-3">
            <span className="text-[11px] font-medium">{row.n}</span>
            <span className="text-[10px] text-white/50">{row.p}</span>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-4 border-t border-white/10 py-2.5 text-center text-[8px] text-white/45">
        {["Menu", "Branches", "Offers", "Order"].map((t, i) => (
          <span key={t} className={i === 0 ? "text-white" : undefined}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
