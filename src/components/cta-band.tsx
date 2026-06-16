import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { BrandIcon } from "@/components/brand-icon";
import { Magnetic } from "@/components/fx/magnetic";

export function CtaBand({
  title = "Ready to elevate your vision?",
  subtitle = "Tell us where you want to grow — we'll show you how 2.0 can help.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24">
      <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-line bg-surface px-6 py-14 text-center sm:px-12 sm:py-20">
        <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="glow-violet absolute top-1/2 left-1/2 -z-10 h-64 w-[40rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        />
        <BrandIcon
          aria-hidden
          markFill="var(--violet-500)"
          arrowFill="var(--lime-400)"
          className="absolute top-6 right-6 -z-10 hidden h-16 w-16 opacity-20 sm:block sm:h-20 sm:w-20"
        />
        <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted">
          {subtitle}
        </p>
        <Magnetic className="mt-8">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-on-accent transition-transform hover:-translate-y-0.5"
          >
            Get in touch
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Magnetic>
      </Reveal>
    </section>
  );
}
