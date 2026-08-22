"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { Rise } from "@/components/motion/reveal";
import { Lightbox, type LightboxItem } from "@/components/fx/lightbox";

export type CollateralItem = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

/**
 * A project's collateral as a curated contact sheet rather than an image dump:
 * numbered frames on a single rail, each captioned, each openable full size.
 *
 * The rail is a focusable region so it can be scrolled from the keyboard, and
 * every frame is a real button — nothing here needs a pointer.
 */
export function WorkCollateral({
  items,
  projectName,
}: {
  items: CollateralItem[];
  projectName: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const lightboxItems: LightboxItem[] = items.map((g) => ({
    ...g,
    eyebrow: projectName,
  }));

  return (
    <div className="mt-14 sm:mt-16">
      <Rise className="flex items-baseline gap-4">
        <p className="text-[11px] font-semibold tracking-[0.25em] text-faint uppercase">
          What we designed for it
        </p>
        <span aria-hidden className="h-px flex-1 bg-line" />
        <p className="text-[11px] tracking-[0.2em] text-faint tabular-nums">
          {String(items.length).padStart(2, "0")} frames
        </p>
      </Rise>

      <Rise
        delay={0.04}
        className="mt-6 [mask-image:linear-gradient(90deg,#000_92%,transparent)] [-webkit-mask-image:linear-gradient(90deg,#000_92%,transparent)]"
      >
        {/* The region role and the tab stop belong on the scroll container,
            not on the list — a <ul role="region"> loses its list semantics. */}
        <div
          role="region"
          aria-label={`${projectName} — design collateral`}
          tabIndex={0}
          className="no-scrollbar overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <ul className="flex snap-x snap-mandatory gap-4">
            {items.map((item, i) => (
              <li key={item.src} className="w-60 shrink-0 snap-start sm:w-72">
                <figure className="group h-full">
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    className="frame relative flex h-52 w-full cursor-zoom-in items-center justify-center bg-surface-2 transition-colors duration-500 sm:h-72"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      sizes="(min-width: 640px) 18rem, 15rem"
                      className="h-full w-auto object-contain transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    {/* The artwork's own alt names this button — an aria-label
                        that replaced it would break WCAG 2.5.3. */}
                    <span className="sr-only"> — view full size</span>
                    {/* Lime, not the project tint: these numbers sit on
                        --surface-2, where the tints fall under 4.5:1 at 12px. */}
                    <span
                      aria-hidden
                      className="absolute top-2.5 left-3 font-display text-xs font-bold tracking-widest text-brand tabular-nums"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden
                      className="absolute right-2.5 bottom-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
                    >
                      <Maximize2 size={14} />
                    </span>
                  </button>
                  <figcaption className="mt-3 text-xs leading-snug text-muted">
                    {item.caption}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </Rise>

      <Lightbox
        items={lightboxItems}
        index={open}
        onClose={() => setOpen(null)}
        onIndex={setOpen}
      />
    </div>
  );
}
