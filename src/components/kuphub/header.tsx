"use client";

import { useEffect, useState } from "react";
import { KupLogo } from "./brand";
import { clsx } from "@/lib/clsx";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#yours", label: "Make it yours" },
  { href: "#mix", label: "Match & Mix" },
  { href: "#app", label: "The app" },
  { href: "#branches", label: "Branches" },
];

/**
 * Five anchors and one action. The bar is clear over the hero and frosts once
 * the page moves, so the cup is never sitting under a band of colour.
 */
export function KupHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled
          ? "border-b border-cream/8 bg-forest-950/72 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="KUPHUB"
        className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-6 px-5 sm:h-[4.5rem] sm:px-8 lg:px-12"
      >
        <a href="#top" className="shrink-0" aria-label="KUPHUB — back to the top">
          <KupLogo priority className="w-[3.1rem] sm:w-[3.4rem]" />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-[0.82rem] font-medium text-cream/72 transition-colors hover:text-cream"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#app"
          className="inline-flex items-center gap-2 rounded-full bg-caramel px-4 py-2.5 text-[0.82rem] font-bold text-bean transition-[transform,background-color] duration-300 ease-[var(--ease-back)] hover:-translate-y-0.5 hover:bg-caramel-300 sm:px-5"
        >
          Get the app
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-bean" />
        </a>
      </nav>
    </header>
  );
}
