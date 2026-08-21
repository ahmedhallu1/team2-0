"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxItem = {
  src: string;
  alt: string;
  /** Small label above the caption (brand, project…). */
  eyebrow?: string;
  caption?: string;
};

/**
 * Full-size viewer built on the native <dialog>, so focus trapping, the
 * backdrop and Esc-to-close come from the platform rather than a library.
 * Nothing renders — and no image is requested — until an index is set.
 */
export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (next: number) => void;
}) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const open = index !== null;
  const count = items.length;

  const step = useCallback(
    (delta: number) => {
      if (index === null || count < 2) return;
      onIndex((index + delta + count) % count);
    },
    [index, count, onIndex],
  );

  // Drive the native modal from the `index` prop.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // The backdrop scrolls the page behind the dialog otherwise.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const item = index === null ? null : items[index];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // Clicking the backdrop lands on the dialog itself, never on its children.
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="lightbox m-auto max-h-none max-w-none bg-transparent p-0 text-ink backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      aria-label={item?.caption ?? "Image viewer"}
    >
      {item && (
        <div className="relative flex h-dvh w-screen flex-col gap-4 p-4 sm:p-8">
          {/* Fills the space left over by the caption, so artwork gets as
              much of the viewport as its aspect ratio allows. */}
          <div
            className="relative min-h-0 flex-1"
            // Keep clicks on the artwork from reaching the backdrop handler.
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={item.src}
              src={item.src}
              alt={item.alt}
              fill
              sizes="100vw"
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          <div
            className="mx-auto flex w-full max-w-2xl shrink-0 flex-col items-center gap-3 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {item.caption && (
              <p className="text-sm text-white/80">
                {item.eyebrow && (
                  <span className="font-semibold text-accent">
                    {item.eyebrow} ·{" "}
                  </span>
                )}
                {item.caption}
              </p>
            )}

            {count > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronLeft size={18} aria-hidden />
                </button>
                <span className="min-w-16 text-xs tabular-nums text-white/70">
                  {(index ?? 0) + 1} / {count}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronRight size={18} aria-hidden />
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:top-6 sm:right-6"
          >
            <X size={18} aria-hidden />
          </button>
        </div>
      )}
    </dialog>
  );
}
