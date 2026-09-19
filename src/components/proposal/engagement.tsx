import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHead } from "@/components/proposal/section-head";
import { Rise, RiseGroup } from "@/components/motion/reveal";
import { engagement } from "@/lib/proposals/kuphub";
import { actionText } from "@/lib/ui";
import { sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * How the work would actually run.
 *
 * Mapped onto the four stages already published on /process, so the proposal
 * and the website tell the same story — a prospect who checks will find the
 * same four words, not a second methodology invented for the pitch. The stage
 * names are theirs; the titles and the bodies are this engagement's.
 *
 * A server component: it is a list, and a list does not need hydration.
 */
export function Engagement() {
  return (
    <section
      id="engagement"
      aria-labelledby="engagement-heading"
      className={clsx("relative border-t border-line", sectionY)}
    >
      <div className={shell}>
        <SectionHead
          n="10"
          label="What we'd actually do"
          headingId="engagement-heading"
          lines={["The same four steps", "we run on everything."]}
          lede={
            <>
              This is 2.0&apos;s standard way of working, applied to these two
              businesses — the same four stages published on our own site, so
              nothing here is a special promise made for one meeting.
            </>
          }
        >
          <Rise className="mt-7">
            <Link href="/process" className={actionText}>
              See how we work
              <ArrowUpRight
                size={15}
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Rise>
        </SectionHead>

        <RiseGroup as="ol" className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
          {engagement.map((step) => (
            <li key={step.n} className="relative bg-surface p-6 sm:p-8">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-sm font-bold text-brand tabular-nums">
                  {step.n}
                </span>
                <span className="text-[11px] font-semibold tracking-[0.2em] text-faint uppercase">
                  {step.stage}
                </span>
              </div>
              <h3 className="mt-5 font-display text-xl leading-tight font-extrabold tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </RiseGroup>

        {/* The one thing a proposal usually leaves out. */}
        <Rise>
          <div className="mt-6 rounded-xl border border-line bg-surface-2/50 p-6 sm:p-8">
            <h3 className="font-display text-lg font-extrabold tracking-tight text-ink">
              And after launch, the part nobody puts in a proposal
            </h3>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Both sites stay with us — hosting, updates, changes",
                "The calendar is built a month ahead, not the night before",
                "Comments and DMs answered in Arabic and English",
                "One monthly report, in language a decision can be made from",
                "Photography reshot as the menu changes",
                "Campaigns planned around the seasons you actually trade in",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span
                    aria-hidden
                    className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Rise>
      </div>
    </section>
  );
}
