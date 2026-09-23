import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Rise, RiseGroup } from "@/components/motion/reveal";
import { engagement } from "@/lib/proposals/kuphub";
import { actionText } from "@/lib/ui";
import { clsx } from "@/lib/clsx";

/**
 * How the work would run — now a block inside the engine chapter rather than a
 * chapter of its own.
 *
 * The four stages are the ones already published on elevate2point0.com/process,
 * so the proposal and the site tell the same story and nothing here is a
 * special promise invented for one meeting. Everything that used to sit under
 * it as a six-item list has been reduced to the one line that was actually
 * doing the work.
 *
 * A server component: it is a list, and a list does not need hydration.
 */
export function Engagement({ className }: { className?: string }) {
  return (
    <div className={clsx("border-t border-line pt-12", className)}>
      <Rise className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          And the four steps we&apos;d run it in
        </h3>
        <Link href="/process" className={actionText}>
          How we work
          <ArrowUpRight
            size={14}
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </Rise>

      <RiseGroup
        as="ol"
        className="mt-7 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
      >
        {engagement.map((step) => (
          <li key={step.n} className="bg-surface p-5">
            <div className="flex items-baseline gap-2.5">
              <span className="font-display text-xs font-bold text-brand tabular-nums">
                {step.n}
              </span>
              <span className="text-[10px] font-semibold tracking-[0.2em] text-faint uppercase">
                {step.stage}
              </span>
            </div>
            <h4 className="mt-3 font-display text-base leading-tight font-extrabold tracking-tight text-ink">
              {step.title}
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </RiseGroup>

      <Rise as="p" className="mt-5 text-sm leading-relaxed text-muted">
        Both sites stay with us afterwards — hosting, updates and changes — the
        calendar is built a month ahead rather than the night before, and the
        comments and DMs get answered in both languages inside the day.
      </Rise>
    </div>
  );
}
