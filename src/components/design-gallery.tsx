"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import type { DesignPiece } from "@/lib/design";
import { Curtain } from "@/components/motion/reveal";
import { Lightbox, type LightboxItem } from "@/components/fx/lightbox";
import { clsx } from "@/lib/clsx";

/**
 * Art direction by rhythm rather than by masonry: tiles alternate between a
 * tall and a square crop and the middle column drops half a step on wide
 * screens. The result reads as a composed spread while staying a plain grid in
 * document order — so keyboard users and crawlers walk it in the order it is
 * written, and it collapses to a normal two-up gallery on phones.
 */
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
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-3 lg:items-start">
        {pieces.map((piece, i) => {
          const tall = i % 3 === 0;
          return (
            <li
              key={piece.src}
              className={clsx(i % 3 === 1 && "lg:mt-12")}
            >
              <figure className="group">
                <Curtain
                  className={clsx(
                    "frame relative w-full",
                    tall ? "aspect-[4/5]" : "aspect-square",
                  )}
                  delay={(i % 3) * 0.05}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    className="curtain__media absolute inset-0 h-full w-full cursor-zoom-in"
                  >
                    <Image
                      src={piece.src}
                      alt={piece.alt}
                      fill
                      sizes="(min-width: 1024px) 22rem, (min-width: 640px) 30vw, 45vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <span className="sr-only"> — view full size</span>
                    <span
                      aria-hidden
                      className="absolute right-2.5 bottom-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
                    >
                      <Maximize2 size={14} />
                    </span>
                  </button>
                </Curtain>
                <figcaption className="mt-3">
                  <span className="block text-[11px] font-semibold tracking-[0.2em] text-brand uppercase">
                    {piece.brand}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-muted">
                    {piece.caption}
                  </span>
                </figcaption>
              </figure>
            </li>
          );
        })}
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
