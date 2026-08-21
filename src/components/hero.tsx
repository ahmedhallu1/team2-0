import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { Magnetic } from "@/components/fx/magnetic";
import { totalServices } from "@/lib/services";
import { totalProjects } from "@/lib/work";

const stats = [
  { value: "5", label: "Founders, one team" },
  { value: `${totalServices}`, label: "Services, end to end" },
  { value: `${totalProjects}`, label: "Projects shipped" },
  { value: "Global", label: "Local & international reach" },
];

const headline = ["Elevate", "your", "vision"];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-5 pt-32 pb-20 sm:px-8 sm:pt-40 sm:pb-28">
      {/* Ambient background */}
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div aria-hidden className="aurora">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>
      <BrandIcon
        aria-hidden
        markFill="var(--violet-500)"
        arrowFill="var(--lime-400)"
        className="absolute top-32 right-6 -z-10 hidden h-28 w-28 opacity-15 [animation:float-slow_8s_ease-in-out_infinite] lg:right-12 lg:block lg:h-40 lg:w-40"
      />

      <div className="mx-auto max-w-4xl text-center">
        <div className="hero-rise flex justify-center" style={{ ["--i" as string]: 0 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            A B2B growth partner for ambitious businesses
          </span>
        </div>

        <h1 className="mt-7 font-display text-[clamp(2.75rem,11vw,6.25rem)] leading-[0.92] font-extrabold tracking-tight text-balance text-ink">
          {headline.map((word, i) => (
            <span
              key={word}
              className={
                "kinetic-word" +
                (word === "vision" ? " text-gradient-brand sheen" : "")
              }
              style={{ ["--w" as string]: i }}
            >
              {word}
              {i < headline.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        <p
          className="hero-rise mx-auto mt-7 max-w-2xl text-base leading-relaxed text-pretty text-muted sm:text-lg"
          style={{ ["--i" as string]: 3 }}
        >
          We help businesses grow — at home and across borders. Six services,
          one team: brand and content, websites and platforms, growth
          marketing, lead generation, market and trade, and events. 2.0 is the
          partner behind the scenes of your next chapter.
        </p>

        <div
          className="hero-rise mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
          style={{ ["--i" as string]: 4 }}
        >
          <Magnetic>
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-on-accent transition-transform hover:-translate-y-0.5"
            >
              Start a conversation
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/work"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line-2 px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-brand"
            >
              See what we&apos;ve built
            </Link>
          </Magnetic>
        </div>

        {/* Stat strip */}
        <dl
          className="hero-rise mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4"
          style={{ ["--i" as string]: 5 }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-surface px-4 py-6 text-center transition-colors hover:bg-surface-2"
            >
              <dt className="font-display text-3xl font-bold text-brand">
                {s.value}
              </dt>
              <dd className="mt-1 text-xs leading-snug text-muted">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
