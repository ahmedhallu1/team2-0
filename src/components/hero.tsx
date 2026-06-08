"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { totalServices } from "@/lib/services";

const stats = [
  { value: "5", label: "Founders, one team" },
  { value: `${totalServices}`, label: "Services on offer" },
  { value: "B2B", label: "Built for business" },
  { value: "Global", label: "Local & international reach" },
];

export function Hero() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative isolate overflow-hidden px-5 pt-28 pb-20 sm:px-8 sm:pt-36 sm:pb-28">
      {/* Ambient background */}
      <div className="bg-grid absolute inset-0 -z-10 opacity-50" />
      <div
        aria-hidden
        className="glow-purple absolute -top-24 -left-32 -z-10 h-[32rem] w-[32rem] rounded-full opacity-70 blur-2xl"
      />
      <div
        aria-hidden
        className="glow-lime absolute -top-10 -right-24 -z-10 h-[26rem] w-[26rem] rounded-full opacity-50 blur-2xl"
      />
      {/* Decorative brand mark — kept fully on-screen so it never crops oddly */}
      <BrandIcon
        aria-hidden
        markFill="var(--color-purple-500)"
        arrowFill="var(--color-lime-400)"
        className="absolute top-28 right-6 -z-10 hidden h-28 w-28 opacity-15 lg:right-12 lg:block lg:h-40 lg:w-40"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-4xl text-center"
      >
        <motion.div variants={item} className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium tracking-wide text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
            A B2B growth partner for ambitious businesses
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-7 font-display text-[clamp(2.75rem,11vw,6rem)] leading-[0.95] font-bold tracking-tight text-ink"
        >
          Elevate your
          <br />
          <span className="text-gradient-lime">vision</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          We help businesses grow — at home and across borders. From
          international lead generation and digital platforms to content, SEO,
          media buying, market research and supplier sourcing, 2.0 is the
          partner behind the scenes of your next chapter.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-lime-400 px-7 py-3.5 text-sm font-bold text-base-950 transition-all hover:-translate-y-0.5 hover:bg-lime-300"
          >
            Start a conversation
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-lime-400/70 hover:text-lime-400"
          >
            Explore our services
          </Link>
        </motion.div>

        {/* Stat strip */}
        <motion.dl
          variants={item}
          className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-base-900 px-4 py-6 text-center">
              <dt className="font-display text-2xl font-bold text-lime-400 sm:text-3xl">
                {s.value}
              </dt>
              <dd className="mt-1 text-xs leading-snug text-muted">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
