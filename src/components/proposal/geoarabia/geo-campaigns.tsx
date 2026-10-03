import { CalendarDays, Timer } from "lucide-react";
import { SectionHead } from "@/components/proposal/section-head";
import { Rise, RiseGroup } from "@/components/motion/reveal";
import { ContourField } from "@/components/proposal/geoarabia/contour-field";
import { campaigns, timeline } from "@/lib/proposals/geoarabia";
import { proposalY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * Campaigns and the six months they sit in, as one chapter — the brief asked
 * for each campaign's duration and output, and a timeline is only the same
 * information laid along a line, so saying it twice would be padding.
 *
 * Every date here is a real one: Cityscape Global runs 16–19 November 2026 in
 * Riyadh, and Founding Day is 22 February. National Day (23 September) has
 * just passed, which is why it is not on the list.
 */
export function GeoCampaigns() {
  const [lead, ...rest] = campaigns;

  return (
    <section
      id="campaigns"
      data-zone="geo"
      aria-labelledby="campaigns-heading"
      className={clsx("relative border-t border-line bg-surface-2/40", proposalY)}
    >
      <div className={shell}>
        <SectionHead
          n="04"
          label="Campaigns & timeline"
          headingId="campaigns-heading"
          lines={["Six months,", "four campaigns."]}
          lede="One campaign runs the whole time. Three are tied to dates the market is already watching. Each has a length and a list of what gets made."
        />

        {/* The always-on campaign gets the frame: it is what the SEO, the
            social and the bot are all made from. */}
        <Rise className="mt-12">
          <article className="concept relative isolate overflow-hidden border border-line bg-surface p-7 sm:p-9">
            <ContourField className="-z-10 opacity-40 [mask-image:linear-gradient(to_left,#000,transparent_70%)]" />
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="flex flex-wrap items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                  {lead.when}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line-2 px-2.5 py-0.5 text-[10px] tracking-[0.14em] text-muted">
                    <Timer size={11} aria-hidden />
                    {lead.duration}
                  </span>
                </p>
                <h3 className="mt-4 font-display text-[clamp(1.8rem,4.6vw,3rem)] leading-[0.95] font-extrabold tracking-[-0.03em] text-ink">
                  {lead.name}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink">{lead.line}</p>
                <p className="mt-4 max-w-xl border-l-2 border-accent pl-4 text-sm leading-relaxed text-muted">
                  {lead.because}
                </p>
              </div>
              <ul className="grid content-start gap-2.5 lg:col-span-5 lg:pt-8">
                {lead.outputs.map((o) => (
                  <li key={o} className="rounded-lg border border-line bg-surface-2/80 px-4 py-3 text-sm text-ink">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </Rise>

        <RiseGroup as="ul" className="mt-4 grid gap-4 md:grid-cols-3 lg:mt-5 lg:gap-5">
          {rest.map((c) => (
            <li key={c.id} className="flex flex-col rounded-xl border border-line bg-surface p-6">
              <p className="flex items-center justify-between gap-3 text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={12} aria-hidden />
                  {c.when}
                </span>
                <span className="inline-flex items-center gap-1 text-faint">
                  <Timer size={11} aria-hidden />
                  {c.duration}
                </span>
              </p>
              <h3 className="mt-4 font-display text-xl leading-tight font-extrabold tracking-tight text-ink">
                {c.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink">{c.line}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{c.because}</p>
              <ul className="mt-5 flex flex-1 flex-wrap content-end gap-1.5 border-t border-line pt-4">
                {c.outputs.map((o) => (
                  <li key={o} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-ink">
                    {o}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </RiseGroup>

        {/* The six months, as a surveyed line: one station per month. */}
        <Rise className="mt-16">
          <h3 id="timeline" className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            October to March
          </h3>
          <ol className="relative mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
            <span
              aria-hidden
              className="absolute top-[7px] right-0 left-0 hidden h-px bg-line-2 lg:block"
            />
            {timeline.map((t, i) => (
              <li key={t.month} className="relative pl-7 lg:pl-0">
                <span
                  aria-hidden
                  className={clsx(
                    "absolute top-0.5 left-0 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 lg:relative lg:top-0",
                    i === 1 ? "border-accent bg-accent" : "border-accent bg-bg",
                  )}
                />
                <p className="text-[11px] font-semibold tracking-[0.2em] text-brand uppercase lg:mt-4">
                  <span className="text-faint tabular-nums">M{i + 1}</span> · {t.month}
                </p>
                <p className="mt-2 font-display text-base leading-tight font-extrabold tracking-tight text-ink">
                  {t.title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted">{t.body}</p>
              </li>
            ))}
          </ol>
        </Rise>
      </div>
    </section>
  );
}
