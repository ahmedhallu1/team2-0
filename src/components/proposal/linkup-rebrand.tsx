"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, STAGGER, TRIGGER_START } from "@/lib/motion/tokens";
import { SectionHead } from "@/components/proposal/section-head";
import { Rise } from "@/components/motion/reveal";
import { CupGlyph } from "@/components/proposal/kup-glyphs";
import { linkupLockups, linkupSizes } from "@/lib/proposals/kuphub";
import { proposalY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * The case for rebranding LinkUp — made entirely out of their own artwork.
 *
 * We are not offering an opinion on whether the mark is nice. We are putting
 * the four lockups they are currently running next to each other and letting
 * the count make the argument: one company, four names, four descriptors, two
 * colour stories. A buyer who meets them twice does not know they have met the
 * same company.
 *
 * The proposed direction keeps what is theirs and worth keeping — the cup in
 * the mark, the amber, the "KUP" that rhymes with their sister business — and
 * fixes the part that does not survive contact with a buyer: a descriptor that
 * says what they actually make.
 */

/** Our setting of a proposed mark. Drawn from type, never traced. */
function ProposedMark({
  descriptor,
  tone = "dark",
}: {
  descriptor: string;
  tone?: "dark" | "light";
}) {
  const ink = tone === "dark" ? "#f7f4ee" : "#14120f";
  return (
    <span className="inline-flex flex-col items-center">
      <span
        className="inline-flex items-baseline font-display text-3xl leading-none font-extrabold tracking-[-0.045em] uppercase sm:text-4xl"
        style={{ color: ink }}
      >
        Link
        <span style={{ color: "var(--link)" }}>up</span>
      </span>
      <span
        className="mt-2 text-[9px] font-semibold tracking-[0.42em] uppercase sm:text-[10px]"
        style={{ color: tone === "dark" ? "rgba(247,244,238,0.55)" : "rgba(20,18,15,0.55)" }}
      >
        {descriptor}
      </span>
    </span>
  );
}

export function LinkUpRebrand() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.from(el.querySelectorAll("[data-lockup]"), {
        opacity: 0,
        y: 18,
        duration: DUR.base,
        ease: EASE.ascent,
        stagger: STAGGER.base,
        scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="rebrand"
      data-zone="linkup"
      aria-labelledby="rebrand-heading"
      className={clsx("relative border-t border-line", proposalY)}
    >
      <div className={shell}>
        <SectionHead
          n="08"
          label="LinkUp — the identity"
          headingId="rebrand-heading"
          lines={["One company.", "Four introductions."]}
          lede={
            <>
              These are all live, all LinkUp, all right now. We haven&apos;t
              redrawn any of them — this is just the four of them next to each
              other for the first time.
            </>
          }
        />

        {/* The four, as they actually read. */}
        <div ref={ref} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {linkupLockups.map((lockup, i) => (
            <div
              key={lockup.descriptor}
              data-lockup
              className="flex flex-col rounded-xl border border-line bg-surface p-5"
            >
              <span className="font-display text-xs font-bold text-faint tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-4 font-display text-xl leading-none font-extrabold tracking-[-0.04em] text-ink uppercase">
                {lockup.mark}
              </span>
              <span className="mt-2 text-[10px] leading-snug font-semibold tracking-[0.2em] text-brand uppercase">
                {lockup.descriptor}
              </span>
              <span className="mt-auto pt-5 text-xs text-muted">{lockup.where}</span>
              <span className="mt-1 text-[11px] text-faint">{lockup.palette}</span>
            </div>
          ))}
        </div>

        <Rise
          as="p"
          className="mt-6 max-w-3xl text-base leading-relaxed text-pretty text-ink"
        >
          None of them says what the company makes. &ldquo;Covering&rdquo;,
          &ldquo;Packing Solutions&rdquo; and &ldquo;Eco Solutions&rdquo; could
          be a shipping firm, a cleaning supplier or a consultancy — and the one
          that does say it, &ldquo;Paper Kup&rdquo;, describes the range they
          have already moved past.{" "}
          <span className="text-brand">
            They make reusable and rice-husk cups, printed in the mould, from
            one unit up. That is unusual, and no mark on any channel says it.
          </span>
        </Rise>

        {/* What we'd propose instead. */}
        <Rise className="mt-14">
          <h3 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            One mark. What it would actually have to do.
          </h3>

          <div className="mt-7 grid gap-3 lg:grid-cols-12">
            <div
              className="concept flex min-h-[15rem] flex-col items-center justify-center gap-6 border border-line p-8 lg:col-span-7"
              style={{ background: "var(--surface-2)" }}
            >
              <ProposedMark descriptor="Reusable cup makers" />
              <span aria-hidden className="h-px w-16 bg-line-2" />
              <CupGlyph className="h-20 text-ink/45" />
            </div>

            <div className="grid gap-3 lg:col-span-5">
              {[
                {
                  t: "Keep the cup in the mark",
                  b: "The dot of the i is already a cup with steam. It is the best thing they own and it survives any rebrand.",
                },
                {
                  t: "Keep the amber, lose the third palette",
                  b: "Black and amber, everywhere. The green set goes — sustainability is a claim the products make, not a second identity.",
                },
                {
                  t: "One descriptor that says the business",
                  b: "Not “solutions”. What they make, who it is for, and the one thing nobody else offers: from a single cup.",
                },
                {
                  t: "A system, not a logo",
                  b: "Type, colour, photography rules, spec-sheet layouts and a packaging print standard — so a fifth lockup can't appear.",
                },
              ].map((item) => (
                <div key={item.t} className="rounded-xl border border-line bg-surface p-5">
                  <h4 className="font-display text-base font-bold tracking-tight text-ink">
                    {item.t}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.b}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The mark has to work where it is actually used. */}
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              { label: "On the cup", sub: linkupSizes.join(" · ") },
              { label: "On a spec sheet", sub: "Small, mono, legible" },
              { label: "On a buyer's shelf", sub: "Next to their own brand" },
            ].map((use) => (
              <div
                key={use.label}
                className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-4"
              >
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    {use.label}
                  </span>
                  <span className="block text-xs text-faint">{use.sub}</span>
                </span>
                <ProposedMarkMini />
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs leading-relaxed text-faint">
            Concept by 2.0, for this proposal. The observations above are drawn
            from LinkUp&apos;s own live artwork across Instagram, the Facebook
            profile, the cover and the product posts.
          </p>
        </Rise>

        {/* What is running now, for reference. */}
        <LinkUpCurrentStrip />
      </div>
    </section>
  );
}

function ProposedMarkMini() {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-baseline font-display text-sm leading-none font-extrabold tracking-[-0.04em] text-ink uppercase"
    >
      Link
      <span style={{ color: "var(--link)" }}>up</span>
    </span>
  );
}

/** Their current artwork, shown once for reference rather than picked over. */
function LinkUpCurrentStrip() {
  return (
    <Rise className="mt-14">
      <p className="text-[11px] font-semibold tracking-[0.28em] text-faint uppercase">
        The four, in the wild
      </p>
      <ul className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
        {[
          { src: "/proposals/linkup/current/post-a.jpg", alt: "LinkUp's custom-print post under the COVERING mark", note: "COVERING" },
          { src: "/proposals/linkup/current/post-b.jpg", alt: "LinkUp's reusable range post under the ECO SOLUTIONS mark", note: "ECO SOLUTIONS" },
          { src: "/proposals/linkup/current/post-c.jpg", alt: "A LinkUp product post showing a branded reusable cup", note: "Product" },
          { src: "/proposals/linkup/current/post-d.jpg", alt: "A LinkUp post showing customers' brands printed on their cups", note: "Client work" },
        ].map((p) => (
          <li key={p.src} className="w-[58%] shrink-0 snap-center sm:w-auto">
            <figure>
              <div className="aspect-square overflow-hidden rounded-lg border border-line bg-surface-2">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={414}
                  height={414}
                  sizes="(min-width: 640px) 22vw, 58vw"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-2 text-[10px] tracking-[0.16em] text-faint uppercase">
                {p.note}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Rise>
  );
}
