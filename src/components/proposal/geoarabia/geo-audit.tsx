import { Globe, Search, TriangleAlert } from "lucide-react";
import { SectionHead } from "@/components/proposal/section-head";
import { Rise, RiseGroup } from "@/components/motion/reveal";
import { domainProbe, observations, searchToday } from "@/lib/proposals/geoarabia";
import { proposalY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * What we see. Same rule as the KUPHUB audit: every line here can be checked
 * on a phone while we are still in the room, and each one says what it makes
 * possible rather than grading anyone.
 *
 * The two findings that need no interpretation lead — the domain that serves
 * an empty folder, and the search a buyer runs today — and the rest sit under
 * them as cards. The last card is deliberately good news: the brand is fine,
 * which is also why nothing on this page proposes a rebrand.
 */
export function GeoAudit() {
  return (
    <section
      id="audit"
      data-zone="geo"
      aria-labelledby="audit-heading"
      className={clsx("relative border-t border-line bg-surface-2/40", proposalY)}
    >
      <div className={shell}>
        <SectionHead
          n="01"
          label="What we see"
          headingId="audit-heading"
          lines={["The work is real.", "The front door isn't."]}
          lede={
            <>
              Everything below was checked on 27 September 2026 from the public
              record.{" "}
              <span className="text-ink">
                Every point can be verified from your phone.
              </span>
            </>
          }
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-12 lg:gap-5">
          {/* 01 — the domain, played back. */}
          <Rise className="concept border border-line bg-surface p-6 sm:p-7 lg:col-span-7">
            <p className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] text-faint uppercase">
              <Globe size={14} aria-hidden className="text-accent" />
              Opened in a browser
            </p>
            <h3 className="mt-4 font-display text-2xl leading-tight font-extrabold tracking-tight text-ink sm:text-3xl">
              <span className="text-faint tabular-nums">01</span> Two domains, no website
            </h3>

            <ul className="mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
              {domainProbe.map((row) => (
                <li key={row.host} className="bg-surface-2 p-5">
                  <p className="flex items-center gap-2 font-mono text-sm text-ink">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#ff8a7a]" />
                    {row.host}
                  </p>
                  <p className="mt-4 font-mono text-2xl font-bold tracking-tight text-[#ffb3a7] sm:text-3xl">
                    {row.status}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{row.note}</p>
                  <p className="mt-2 text-xs text-faint">{row.where}</p>
                </li>
              ))}
            </ul>

            <p className="mt-5 flex items-start gap-2.5 text-sm leading-relaxed text-ink">
              <TriangleAlert size={16} aria-hidden className="mt-0.5 shrink-0 text-accent" />
              SEO and GEO both start from a website. Without one there is
              nothing to rank and nothing for an assistant to quote, so the
              build comes first.
            </p>
          </Rise>

          {/* 02 — the buyer's search, as it comes back today. */}
          <Rise delay={0.08} className="concept flex flex-col border border-line bg-surface p-6 sm:p-7 lg:col-span-5">
            <p className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] text-faint uppercase">
              <Search size={14} aria-hidden className="text-accent" />
              Searched {searchToday.checked}
            </p>
            <h3 className="mt-4 font-display text-2xl leading-tight font-extrabold tracking-tight text-ink sm:text-3xl">
              <span className="text-faint tabular-nums">02</span> What a buyer finds
            </h3>

            <div className="mt-6 flex-1 rounded-lg border border-line bg-surface-2 p-4">
              <p className="flex items-center gap-2 rounded-full border border-line-2 bg-surface px-3.5 py-2 text-sm text-ink">
                <Search size={13} aria-hidden className="text-faint" />
                {searchToday.query}
              </p>
              <ol className="mt-4 space-y-3.5">
                {searchToday.results.map((r) => (
                  <li key={r.host}>
                    <p className="text-[11px] text-faint">{r.host}</p>
                    <p className="text-sm leading-snug text-[#a9c7ff]">{r.title}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-dashed border-line-2 pt-3 text-sm text-muted">
                geoarabia.sa — <span className="text-[#ffb3a7]">not in the results</span>
              </p>
            </div>
          </Rise>
        </div>

        <RiseGroup
          as="ul"
          className="mt-4 grid gap-4 md:grid-cols-3 lg:mt-5 lg:gap-5"
        >
          {observations.map((item, i) => (
            <li
              key={item.id}
              className="flex flex-col rounded-xl border border-line bg-surface p-6 transition-colors duration-500 hover:border-line-2"
            >
              <span className="font-display text-xs font-bold text-faint tabular-nums">
                {String(i + 3).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg leading-tight font-extrabold tracking-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.seen}</p>
              <p className="mt-5 flex-1 border-t border-line pt-4 text-sm leading-relaxed font-medium text-ink">
                {item.opportunity}
              </p>
              <p className="mt-4 text-[11px] text-faint">{item.source}</p>
            </li>
          ))}
        </RiseGroup>
      </div>
    </section>
  );
}
