import { SectionHead } from "@/components/proposal/section-head";
import { Rise, RiseGroup } from "@/components/motion/reveal";
import {
  contentPillars,
  creativeDirection,
  firstTen,
  positioning,
  strategy,
} from "@/lib/proposals/geoarabia";
import { proposalY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * The content strategy, as agreed in the client deck: one positioning line,
 * five pillars, the first ten posts in order, and the creative rules they are
 * made by. It sits between the plan (what we run) and the campaigns (when we
 * push), because it is what the social retainer actually produces.
 *
 * Pillar colours are a key, not decoration — each post in the first ten is
 * tagged with the pillar it serves, so the room can see the mix is deliberate.
 */

const PILLAR_TONE: Record<string, string> = {
  Brand: "#9fc0e8",
  Education: "#5ccbe0",
  Services: "#c7d6ee",
  "Project value": "#8fe0c4",
  Conversion: "#f2c48d",
};

function toneFor(pillar: string) {
  return PILLAR_TONE[pillar.split(" · ")[0]] ?? "var(--accent)";
}

export function GeoContent() {
  return (
    <section
      id="content"
      data-zone="geo"
      aria-labelledby="content-heading"
      className={clsx("relative border-t border-line", proposalY)}
    >
      <div className={shell}>
        <SectionHead
          n="04"
          label="The content"
          headingId="content-heading"
          lines={["Five pillars.", "Ten posts to start."]}
          lede="The strategy behind the social retainer: who GeoArabia is on screen, what it talks about, and the first month in order."
        />

        {/* Positioning, and the three rules that follow from it. */}
        <Rise className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-12">
          <div className="bg-surface p-6 sm:p-8 lg:col-span-5">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
              Positioning
            </p>
            <p className="mt-4 font-display text-[clamp(1.4rem,2.6vw,1.9rem)] leading-[1.12] font-extrabold tracking-[-0.02em] text-ink">
              {positioning}
            </p>
          </div>
          <dl className="grid gap-px bg-line sm:grid-cols-3 lg:col-span-7">
            {strategy.map((s) => (
              <div key={s.label} className="bg-surface p-6">
                <dt className="text-[11px] font-semibold tracking-[0.2em] text-faint uppercase">
                  {s.label}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">{s.body}</dd>
              </div>
            ))}
          </dl>
        </Rise>

        {/* The five pillars — the key for the calendar below. */}
        <RiseGroup as="ul" className="mt-4 grid gap-3 sm:grid-cols-2 lg:mt-5 lg:grid-cols-5">
          {contentPillars.map((p) => (
            <li key={p.name} className="rounded-xl border border-line bg-surface-2/60 p-5">
              <p className="flex items-center gap-2 font-display text-base font-extrabold tracking-tight text-ink">
                <span
                  aria-hidden
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: toneFor(p.name) }}
                />
                {p.name}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </RiseGroup>

        {/* The first ten posts, in publishing order. */}
        <Rise className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
              The first ten posts
            </h3>
            <p className="text-xs text-faint">LinkedIn, Instagram and Facebook · in order</p>
          </div>
          <ol className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {firstTen.map((post, i) => (
              <li key={post.title} className="flex flex-col bg-surface p-5">
                <span className="font-display text-2xl font-extrabold tracking-tight text-faint tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 font-display text-[15px] leading-snug font-extrabold tracking-tight text-ink">
                  {post.title}
                </p>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">{post.direction}</p>
                <p
                  className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase"
                  style={{ color: toneFor(post.pillar) }}
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: toneFor(post.pillar) }}
                  />
                  {post.pillar}
                </p>
              </li>
            ))}
          </ol>
        </Rise>

        {/* How every one of them is made. */}
        <Rise className="mt-14">
          <h3 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            Creative direction
          </h3>
          <dl className="mt-6 grid gap-6 border-t border-line pt-6 md:grid-cols-3 md:gap-8">
            {creativeDirection.map((c) => (
              <div key={c.label}>
                <dt className="text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                  {c.label}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-pretty text-muted">{c.body}</dd>
              </div>
            ))}
          </dl>
        </Rise>
      </div>
    </section>
  );
}
