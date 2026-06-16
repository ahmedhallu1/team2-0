"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { clsx } from "@/lib/clsx";

/**
 * Fade + rise when scrolled into view — CSS transitions driven by a single
 * IntersectionObserver. No animation library, transform/opacity only, fires
 * once. Respects prefers-reduced-motion and shows content with JS disabled
 * (the `.reveal` base styles only apply under the `.js` class on <html>).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as,
  variant,
}: {
  children: ReactNode;
  /** stagger delay in seconds */
  delay?: number;
  className?: string;
  as?: ElementType;
  /** entrance direction/style; defaults to a simple rise */
  variant?: "up" | "scale" | "left" | "right" | "blur";
}) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced-motion users are handled in CSS (the `.reveal` base is overridden
    // to fully visible), so the observer just drives the default case here.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={clsx("reveal", className)}
      data-visible={visible ? "true" : "false"}
      data-variant={variant && variant !== "up" ? variant : undefined}
      style={delay ? { ["--reveal-delay" as string]: `${delay * 1000}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
