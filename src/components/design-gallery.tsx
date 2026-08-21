"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import type { DesignPiece } from "@/lib/design";
import { Reveal } from "@/components/reveal";
import { Tilt } from "@/components/fx/tilt";
import { Lightbox, type LightboxItem } from "@/components/fx/lightbox";

export function DesignGallery({ pieces }: { pieces: DesignPiece[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const items: LightboxItem[] = pieces.map((p) => ({
    src: p.src,
    alt: p.alt,
    eyebrow: p.brand,
    caption: p.caption,
  }));

  return (
    <>
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-3">
        {pieces.map((piece, i) => (
          <Reveal key={piece.src} as="li" delay={(i % 3) * 0.06} variant="scale">
            <Tilt className="h-full rounded-2xl">
              <figure className="surface group h-full overflow-hidden rounded-2xl transition-colors duration-300 hover:border-accent/40">
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`View ${piece.brand} — ${piece.caption} full size`}
                  className="relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                >
                  <Image
                    src={piece.src}
                    alt={piece.alt}
                    fill
                    sizes="(min-width: 1024px) 21rem, (min-width: 640px) 30vw, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <span
                    aria-hidden
                    className="absolute right-2.5 bottom-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
                  >
                    <Maximize2 size={14} />
                  </span>
                </button>
                <figcaption className="border-t border-line p-3.5 sm:p-4">
                  <span className="block text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
                    {piece.brand}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-muted">
                    {piece.caption}
                  </span>
                </figcaption>
              </figure>
            </Tilt>
          </Reveal>
        ))}
      </ul>

      <Lightbox
        items={items}
        index={open}
        onClose={() => setOpen(null)}
        onIndex={setOpen}
      />
    </>
  );
}
