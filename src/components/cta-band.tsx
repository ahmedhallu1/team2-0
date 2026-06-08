import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { BrandIcon } from "@/components/brand-icon";

export function CtaBand({
  title = "Ready to elevate your vision?",
  subtitle = "Tell us where you want to grow — we'll show you how 2.0 can help.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24">
      <div
        aria-hidden
        className="glow-purple absolute top-1/2 left-1/2 -z-10 h-64 w-[40rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
      />
      <BrandIcon
        aria-hidden
        markFill="var(--color-base-800)"
        arrowFill="var(--color-base-800)"
        className="absolute top-6 right-6 -z-10 hidden h-16 w-16 opacity-50 sm:block sm:h-20 sm:w-20"
      />
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
          {subtitle}
        </p>
        <Link
          href="/contact"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-lime-400 px-7 py-3.5 text-sm font-bold text-base-950 transition-all hover:-translate-y-0.5 hover:bg-lime-300"
        >
          Get in touch
          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </Reveal>
    </section>
  );
}
