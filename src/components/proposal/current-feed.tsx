"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { DUR, EASE, STAGGER, TRIGGER_START } from "@/lib/motion/tokens";
import type { CurrentPost } from "@/lib/proposals/kuphub";


/**
 * What is running now, shown as it actually is.
 *
 * These are the client's own posts, downloaded from their public channels and
 * shown back to them in a document prepared for them. They are not cropped,
 * recoloured or rearranged, and the captions describe what each frame is
 * carrying rather than passing judgement on it — the argument this section
 * makes is supposed to come from the concepts underneath, not from running
 * somebody's own work down in front of them.
 */
export function CurrentFeed({
  posts,
  label,
  className,
}: {
  posts: CurrentPost[];
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.from(el.querySelectorAll("[data-current]"), {
        opacity: 0,
        y: 20,
        duration: DUR.base,
        ease: EASE.ascent,
        stagger: STAGGER.tight,
        scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      <p className="text-[11px] font-semibold tracking-[0.28em] text-faint uppercase">
        {label}
      </p>

      <ul className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
        {posts.map((post) => (
          <li
            key={post.src}
            data-current
            className="w-[58%] shrink-0 snap-center sm:w-auto"
          >
            <figure>
              {/* One ratio for all of them. The posts themselves are a mix of
                  square and 9:16, and letting each keep its own left the row
                  ragged and full of letterboxing — which reads as our
                  presentation being sloppy rather than as their feed being
                  varied. Cropped from the centre, never distorted. */}
              <div className="aspect-[4/5] overflow-hidden rounded-lg border border-line bg-surface-2">
                <Image
                  src={post.src}
                  alt={post.alt}
                  width={post.width}
                  height={post.height}
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 31vw, 58vw"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-2.5">
                <span className="block text-[10px] tracking-[0.16em] text-faint uppercase">
                  {post.date}
                </span>
                <span className="mt-1 block text-xs leading-snug text-muted">
                  {post.note}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
