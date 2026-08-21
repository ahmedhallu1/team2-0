"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Lightbox, type LightboxItem } from "@/components/fx/lightbox";

export type CollateralItem = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

/** The design pieces made for one project, as a scrollable, zoomable strip. */
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
    <Reveal delay={0.06} className="mt-10">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-faint uppercase">
        What we designed for it
      </p>
      <ul
        role="region"
        aria-label={`${projectName} — design collateral`}
        tabIndex={0}
        className="no-scrollbar mt-4 flex snap-x gap-4 overflow-x-auto pb-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {items.map((g, i) => (
          <li key={g.src} className="w-56 shrink-0 snap-start sm:w-auto">
            <figure className="surface group h-full overflow-hidden rounded-xl transition-colors duration-300 hover:border-accent/40">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View ${g.caption} full size`}
                className="relative flex h-44 w-full cursor-zoom-in items-center justify-center bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent sm:h-64"
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  width={g.width}
                  height={g.height}
                  sizes="(min-width: 640px) 24rem, 14rem"
                  className="h-full w-auto object-contain"
                />
                <span
                  aria-hidden
                  className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
                >
                  <Maximize2 size={14} />
                </span>
              </button>
              <figcaption className="border-t border-line px-3.5 py-3 text-xs leading-snug text-muted">
                {g.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <Lightbox
        items={lightboxItems}
        index={open}
        onClose={() => setOpen(null)}
        onIndex={setOpen}
      />
    </Reveal>
  );
}
