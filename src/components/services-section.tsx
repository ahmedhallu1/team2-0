"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  prefersReducedMotion,
} from "@/lib/motion/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion/tokens";
import { services, totalServices } from "@/lib/services";
import { Rise } from "@/components/motion/reveal";
import { AscentHeading } from "@/components/motion/ascent-heading";
import { ServiceGlyph } from "@/components/brand/service-glyph";
import { actionText, eyebrow, h1 } from "@/lib/ui";
import { measure, sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/**
 * The services page as five acts.
 *
 * A persistent index holds the left column: every service, every number, always
 * readable and always a link — the highlight and the morphing glyph are on top
 * of that, never instead of it. The right column plays each act in full, with
 * the included items arriving fast so nobody waits to read a list.
 *
 * Below `lg` the index disappears and the acts become plain vertical sections.
 */
export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const glyphRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Track which act owns the viewport. Purely for the index highlight.
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const acts = gsap.utils.toArray<HTMLElement>("[data-act]", root);
      const triggers = acts.map((act, i) =>
        ScrollTrigger.create({
          trigger: act,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: ({ isActive }) => {
            if (isActive) setActive(i);
          },
        }),
      );
      return () => triggers.forEach((t) => t.kill());
    },
    { scope: ref },
  );

  // The mark reconfigures between acts.
  useGSAP(
    () => {
      const el = glyphRef.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(
        el,
        { opacity: 0, rotate: -28, scale: 0.82 },
        { opacity: 1, rotate: 0, scale: 1, duration: DUR.slow, ease: EASE.ascent },
      );
    },
    { dependencies: [active] },
  );

  // Included items land quickly — information first, choreography second.
  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-includes]", root).forEach((list) => {
        gsap.fromTo(
          list.children,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: DUR.fast,
            ease: EASE.ascent,
            stagger: STAGGER.tight,
            scrollTrigger: { trigger: list, start: "top 90%", once: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section className={clsx("relative", sectionY)}>
      <div className={shell}>
        {/* Intro */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Rise as="p" className={eyebrow} eager index={0}>
              What we do
            </Rise>
            <AscentHeading
              as="h1"
              eager
              className={clsx(h1, "mt-5")}
              lines={[`${totalServices} services.`, "That’s the", "whole list."]}
            />
          </div>
          <Rise
            as="p"
            eager
            index={3}
            className={clsx(
              measure,
              "text-base leading-relaxed text-pretty text-muted lg:col-span-5 lg:text-lg",
            )}
          >
            We kept it to five things we do properly, rather than a menu you have
            to decode. Take one of them, or hand us the whole engine — most
            clients start with one and grow into the rest.
          </Rise>
        </div>

        <div
          ref={ref}
          className="mt-16 grid gap-x-14 sm:mt-20 lg:grid-cols-[16rem_minmax(0,1fr)]"
        >
          {/* Persistent index */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div
                ref={glyphRef}
                aria-hidden
                className="mb-8 h-28 w-28 text-brand"
              >
                <ServiceGlyph
                  key={services[active].id}
                  id={services[active].id}
                  className="h-full w-full"
                  strokeWidth={2.5}
                />
              </div>
              <p className="text-[11px] font-semibold tracking-[0.25em] text-faint uppercase">
                The five
              </p>
              <ol className="mt-5 space-y-1">
                {services.map((service, i) => (
                  <li key={service.id}>
                    <a
                      href={`#${service.id}`}
                      aria-current={i === active ? "true" : undefined}
                      className={clsx(
                        "group flex items-baseline gap-3 rounded-md py-1.5 text-sm transition-colors duration-300",
                        i === active
                          ? "font-semibold text-brand"
                          : "text-muted hover:text-ink",
                      )}
                    >
                      <span className="w-6 shrink-0 text-xs tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        aria-hidden
                        className={clsx(
                          "mt-[0.4em] h-px shrink-0 bg-accent transition-[width] duration-500",
                          i === active ? "w-5" : "w-0 group-hover:w-3",
                        )}
                      />
                      {service.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* The acts */}
          <div className="space-y-20 sm:space-y-28">
            {services.map((service, i) => (
              <article
                key={service.id}
                id={service.id}
                data-act
                className="scroll-mt-6"
              >
                <div className="flex items-center gap-4">
                  <span className="font-display text-sm font-bold text-brand tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="h-px flex-1 bg-line" />
                  <ServiceGlyph
                    id={service.id}
                    className="h-7 w-7 shrink-0 lg:hidden"
                    strokeWidth={3}
                  />
                </div>

                <h2 className="mt-6 font-display text-[clamp(1.875rem,4.5vw,3rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-ink">
                  {service.title}
                </h2>
                <p className="mt-4 font-display text-xl leading-snug font-semibold text-pretty text-brand sm:text-2xl">
                  {service.summary}
                </p>
                <p
                  className={clsx(
                    measure,
                    "mt-6 text-base leading-relaxed text-pretty text-muted",
                  )}
                >
                  {service.description}
                </p>

                <p className="mt-9 text-[11px] font-semibold tracking-[0.25em] text-faint uppercase">
                  What&apos;s included
                </p>
                <ul
                  data-includes
                  className={clsx(
                    "mt-4 grid gap-x-8 gap-y-2.5",
                    service.includes.length > 3 && "sm:grid-cols-2",
                  )}
                >
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 border-b border-line pb-2.5 text-sm text-ink"
                    >
                      <Check
                        size={15}
                        strokeWidth={2.5}
                        className="mt-[3px] shrink-0 text-brand"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={clsx(actionText, "mt-8")}
                  aria-label={`Start a conversation about ${service.title}`}
                >
                  Start a conversation
                  <ArrowUpRight
                    size={15}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </article>
            ))}

            <Rise delay={0.06} className="pt-2">
              <Link href="/work" className="group inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-brand">
                See what this looks like in practice
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}
