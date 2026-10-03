import { ArrowUpRight } from "lucide-react";
import { SectionHead } from "@/components/proposal/section-head";
import { Rise } from "@/components/motion/reveal";
import { competitors, socialReview } from "@/lib/proposals/geoarabia";
import { proposalY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * The competitive review, as its own chapter — it is the part of the
 * content-strategy deck the client will look for by name, so it gets the name.
 *
 * Two tables, mirroring the deck's two slides: who the competitors are and
 * what they position on, then how each brand currently shows up on social,
 * with GeoArabia's own row first and marked. Real <table>s, because this is
 * tabular data and a screen reader should be able to walk it by column.
 * On phones each table scrolls sideways inside its frame rather than
 * squeezing three columns into 375px.
 */

const th =
  "p-4 text-left text-[10px] font-semibold tracking-[0.2em] text-faint uppercase whitespace-nowrap";

export function GeoCompetitors() {
  return (
    <section
      id="competitors"
      data-zone="geo"
      aria-labelledby="competitors-heading"
      className={clsx("relative border-t border-line", proposalY)}
    >
      <div className={shell}>
        <SectionHead
          n="02"
          label="Competitive review"
          headingId="competitors-heading"
          lines={["Three competitors,", "one open lane."]}
          lede="The three firms GeoArabia is measured against, reviewed on LinkedIn and their official websites."
        />

        {/* 1 — Who they are. */}
        <Rise className="mt-12">
          <h3 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            Positioning
          </h3>
          <div className="no-scrollbar mt-5 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[40rem] border-collapse">
              <caption className="sr-only">
                Competitors, their positioning and focus, and their websites
              </caption>
              <thead className="bg-surface-2">
                <tr>
                  <th scope="col" className={th}>Company</th>
                  <th scope="col" className={th}>Positioning / focus</th>
                  <th scope="col" className={th}>Website</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c) => (
                  <tr key={c.name} className="border-t border-line bg-surface align-top">
                    <th
                      scope="row"
                      className="p-4 text-left font-display text-base font-extrabold tracking-tight whitespace-nowrap text-ink sm:p-5"
                    >
                      {c.name}
                    </th>
                    <td className="p-4 text-sm leading-relaxed text-muted sm:p-5">{c.focus}</td>
                    <td className="p-4 sm:p-5">
                      <a
                        href={`https://${c.host}`}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1 font-mono text-xs whitespace-nowrap text-brand"
                      >
                        {c.host}
                        <ArrowUpRight
                          size={12}
                          aria-hidden
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Rise>

        {/* 2 — How each shows up on social, GeoArabia first. */}
        <Rise className="mt-12">
          <h3 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            Social media
          </h3>
          <div className="no-scrollbar mt-5 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[40rem] border-collapse">
              <caption className="sr-only">
                Each brand&apos;s social channels and current content direction
              </caption>
              <thead className="bg-surface-2">
                <tr>
                  <th scope="col" className={th}>Brand</th>
                  <th scope="col" className={th}>Channel</th>
                  <th scope="col" className={th}>Current direction</th>
                </tr>
              </thead>
              <tbody>
                {socialReview.map((r) => (
                  <tr
                    key={r.brand}
                    className={clsx(
                      "border-t border-line align-top",
                      r.self ? "bg-surface-3" : "bg-surface",
                    )}
                  >
                    <th
                      scope="row"
                      className="p-4 text-left font-display text-base font-extrabold tracking-tight whitespace-nowrap text-ink sm:p-5"
                    >
                      <span className="flex items-center gap-2">
                        {r.self ? (
                          <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
                        ) : null}
                        {r.brand}
                      </span>
                    </th>
                    <td className="p-4 text-sm whitespace-nowrap text-ink sm:p-5">{r.channel}</td>
                    <td className="p-4 text-sm leading-relaxed text-muted sm:p-5">{r.direction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Rise>

        {/* What we take from it. */}
        <Rise className="mt-8 border-l-2 border-accent pl-5">
          <p className="max-w-3xl text-base leading-relaxed text-pretty text-ink">
            All three lead with the drone, the scanner and the finished model.
            GeoArabia can tell that story too — its own site lists DJI, FARO,
            Leica and NavVis kit — and it has hydrology and underwater ROV work
            that none of the three lead with.{" "}
            <span className="text-muted">
              That is the lane: the same visual proof, plus the services nobody
              else is talking about.
            </span>
          </p>
        </Rise>
      </div>
    </section>
  );
}
