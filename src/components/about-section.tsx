import { Compass, Handshake, Rocket } from "lucide-react";
import { Rise, RiseGroup } from "@/components/motion/reveal";
import { AscentHeading } from "@/components/motion/ascent-heading";
import { ConvergeMark } from "@/components/brand/converge-mark";
import { eyebrow, h1 } from "@/lib/ui";
import { sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * Three principles, three restrained interaction states — a chevron that
 * rises, two rules that meet, one rule that runs the full width. Each is a
 * different reading of the same idea; none of them carries meaning on its own.
 */
const values = [
  {
    icon: Compass,
    title: "Strategy first",
    body: "Every deliverable ladders up to a goal. We don't do busywork.",
    accent: (
      <span
        aria-hidden
        className="mt-6 block h-6 origin-bottom text-brand transition-transform duration-500 group-hover:-translate-y-1"
      >
        <svg viewBox="0 0 24 24" className="h-full w-auto" fill="none">
          <path
            d="M12 4v16M6 10l6-6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    ),
  },
  {
    icon: Handshake,
    title: "True partnership",
    body: "We work as an extension of your team — transparent and hands-on.",
    accent: (
      <span aria-hidden className="mt-6 flex h-6 items-center gap-1.5">
        <span className="h-px w-10 bg-accent transition-all duration-500 group-hover:w-14" />
        <span className="h-px w-10 bg-violet transition-all duration-500 group-hover:w-14" />
      </span>
    ),
  },
  {
    icon: Rocket,
    title: "Built to scale",
    body: "From first lead to new markets, our work grows with your ambition.",
    accent: (
      <span aria-hidden className="mt-6 flex h-6 items-center">
        <span className="h-px w-12 bg-gradient-to-r from-lime-400 to-violet-500 transition-all duration-700 group-hover:w-full" />
      </span>
    ),
  },
];

export function AboutSection() {
  return (
    <section className={clsx("relative overflow-hidden", sectionY)}>
      <div
        aria-hidden
        className="glow -z-10 -bottom-40 -left-40 h-[34rem] w-[34rem]"
        style={{ ["--glow" as string]: "var(--lime-400)" }}
      />

      <div className={shell}>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <Rise as="p" className={eyebrow} eager index={0}>
              Who we are
            </Rise>
            <AscentHeading
              as="h1"
              eager
              className={clsx(h1, "mt-5")}
              lines={["Five people.", "One standard."]}
            />

            <RiseGroup
              delay={0.06}
              className="mt-8 space-y-5 text-base leading-relaxed text-muted sm:text-lg"
              eager
            >
              <p>
                2.0 began as a group of five who first came together at{" "}
                <span className="font-medium text-ink">AIESEC</span> — where we
                learned how business really crosses borders. We took that
                experience and built an independent B2B services team of our
                own.
              </p>
              <p>
                Today we help companies promote, sell and expand — and when the
                thing a client needs doesn&apos;t exist yet, we build it. A
                wholesale marketplace, a CRM, an AI screening tool, a luxury
                event and the site people register through: all of it ours, all
                of it live. One partner, six services — so you can focus on the
                business while we elevate the vision.
              </p>
              <p className="border-l-2 border-line-2 pl-4 text-sm text-faint">
                2.0 is an independent team and is not affiliated with or
                endorsed by AIESEC.
              </p>
            </RiseGroup>
          </div>

          <div className="lg:col-span-5">
            <ConvergeMark className="mx-auto h-[18rem] w-[18rem] sm:h-[22rem] sm:w-[22rem] lg:h-[26rem] lg:w-[26rem]" />
          </div>
        </div>

        {/* Principles */}
        <RiseGroup
          as="ul"
          className="mt-20 grid gap-6 sm:mt-24 md:grid-cols-3"
          stagger={0.09}
        >
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <li
                key={v.title}
                className="group surface flex flex-col rounded-2xl p-7 transition-colors duration-500 hover:border-line-2"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-brand ring-1 ring-line transition-colors duration-500 group-hover:bg-accent group-hover:text-on-accent">
                  <Icon size={20} strokeWidth={2} aria-hidden />
                </span>
                <h2 className="mt-5 font-display text-lg font-bold text-ink">
                  {v.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {v.body}
                </p>
                <span className="mt-auto">{v.accent}</span>
              </li>
            );
          })}
        </RiseGroup>
      </div>
    </section>
  );
}
