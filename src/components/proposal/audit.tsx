"use client";

import { useRef, useState } from "react";
import { Globe, TriangleAlert } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, STAGGER, TRIGGER_START } from "@/lib/motion/tokens";
import { SectionHead } from "@/components/proposal/section-head";
import { Rise } from "@/components/motion/reveal";
import { observations, type Observation } from "@/lib/proposals/kuphub";
import { proposalY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * The audit — the section most likely to go wrong, so it is built with a rule.
 *
 * Every card states something that was read off a public channel and can be
 * checked on a phone while we are still in the room, and then says what it
 * makes possible. Nothing here grades the client's taste, and there are no
 * numbers we cannot show the source for. The persuasion is meant to come from
 * the concept work further down the page, not from this section.
 *
 * The two domains lead, because they are the one finding that needs no
 * interpretation at all: we open a browser and nothing happens.
 */

const BRAND_LABEL: Record<Observation["brand"], string> = {
  kuphub: "KUPHUB",
  linkup: "LinkUp",
  both: "Both",
};

function ObservationCard({ item, index }: { item: Observation; index: number }) {
  return (
    <li
      data-obs
      className="group relative flex w-[78%] shrink-0 snap-center flex-col rounded-xl border border-line bg-surface p-6 transition-colors duration-500 hover:border-line-2 sm:w-auto sm:p-7"
    >
      <div className="flex items-center gap-3">
        <span className="font-display text-xs font-bold text-faint tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase"
          style={{
            borderColor:
              item.brand === "linkup"
                ? "color-mix(in srgb, var(--link) 45%, transparent)"
                : item.brand === "kuphub"
                  ? "color-mix(in srgb, var(--kup-ink) 45%, transparent)"
                  : "var(--line-2)",
            color:
              item.brand === "linkup"
                ? "var(--link-ink)"
                : item.brand === "kuphub"
                  ? "var(--kup-ink)"
                  : "var(--muted)",
          }}
        >
          {BRAND_LABEL[item.brand]}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl leading-tight font-extrabold tracking-tight text-ink">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{item.seen}</p>

      <p className="mt-5 flex-1 border-t border-line pt-4 text-sm leading-relaxed font-medium text-ink">
        {item.opportunity}
      </p>

      <p className="mt-4 text-[11px] text-faint">{item.source}</p>
    </li>
  );
}

/**
 * The domain check, played back. Two addresses, two responses — a 522 from a
 * registered domain and a placeholder from a live one. It is the only place on
 * the page that shows a raw status code, and it earns it: it is the thing that
 * is easiest to verify and hardest to argue with.
 */
function DomainProbe() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const rows = el.querySelectorAll("[data-probe-row]");
      if (prefersReducedMotion()) {
        setShown(true);
        return;
      }
      gsap.from(rows, {
        opacity: 0,
        y: 16,
        duration: DUR.base,
        ease: EASE.ascent,
        stagger: 0.18,
        scrollTrigger: {
          trigger: el,
          start: TRIGGER_START,
          once: true,
          onEnter: () => setShown(true),
        },
      });
    },
    { scope: ref },
  );

  const rows = [
    {
      host: "kuphub.com",
      status: "522",
      note: "Connection timed out — the domain resolves, nothing answers behind it.",
      where: "Printed on the Facebook page.",
      bad: true,
    },
    {
      host: "linkupegypt.com",
      status: "200",
      note: "“Launching Soon.” A placeholder, on a live domain.",
      where: "Linked from both LinkUp profiles.",
      bad: false,
    },
  ];

  return (
    <div
      ref={ref}
      className="concept mt-14 border border-line bg-surface-2/60 p-6 sm:p-8"
    >
      <div className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] text-faint uppercase">
        <Globe size={14} aria-hidden className="text-brand" />
        Checked 20 September 2026
      </div>

      {/* The strongest finding on the page had no title on it, which also left
          a gap in the heading outline between the section and its cards. */}
      <h3 className="mt-5 font-display text-2xl leading-tight font-extrabold tracking-tight text-ink sm:text-3xl">
        <span className="text-faint tabular-nums">01</span>{" "}
        Two addresses, no doors
      </h3>

      <ul className="mt-7 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
        {rows.map((row) => (
          <li key={row.host} data-probe-row className="bg-surface p-5 sm:p-6">
            <p className="flex items-center gap-2 font-mono text-sm text-ink">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: row.bad ? "var(--violet-400)" : "var(--accent)" }}
              />
              {row.host}
            </p>
            <p
              className={clsx(
                "mt-4 font-display text-4xl font-extrabold tracking-tight tabular-nums transition-opacity duration-700 sm:text-5xl",
                shown ? "opacity-100" : "opacity-0",
              )}
              style={{ color: row.bad ? "var(--violet-ink)" : "var(--brand)" }}
            >
              {row.status}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{row.note}</p>
            <p className="mt-2 text-xs text-faint">{row.where}</p>
          </li>
        ))}
      </ul>

      <p className="mt-6 flex items-start gap-2.5 text-sm leading-relaxed text-ink">
        <TriangleAlert
          size={16}
          aria-hidden
          className="mt-0.5 shrink-0 text-accent"
        />
        Both are already registered and already advertised. Neither needs to be
        bought — they need something built on them.
      </p>
    </div>
  );
}

export function Audit() {
  const ref = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.from(el.querySelectorAll("[data-obs]"), {
        opacity: 0,
        y: 28,
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
      id="audit"
      data-zone="both"
      aria-labelledby="audit-heading"
      className={clsx("relative border-t border-line bg-surface-2/20", proposalY)}
    >
      <div className={shell}>
        <SectionHead
          n="03"
          label="What we see"
          headingId="audit-heading"
          lines={["Strong foundations.", "Room to build."]}
          lede={
            <>
              Everything below was read off the public channels this week, and
              every one of them can be checked from your phone before you leave
              the room. <span className="text-ink">No guesses, and no numbers we can&apos;t show you the source for.</span>
            </>
          }
        />

        <DomainProbe />

        <Rise>
          <ul
            ref={ref}
            className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4 lg:gap-5"
          >
            {observations
              .filter((o) => o.id !== "domains")
              .map((item, i) => (
                <ObservationCard key={item.id} item={item} index={i + 1} />
              ))}
          </ul>
        </Rise>
      </div>
    </section>
  );
}
