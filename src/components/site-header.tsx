"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { EASE, STAGGER } from "@/lib/motion/tokens";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Magnetic } from "@/components/fx/magnetic";
import { contactEmail } from "@/lib/contact";
import { clsx } from "@/lib/clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "How we work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const placed = useRef(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Compact the dock once the page has left the top.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setCompact(window.scrollY > 12);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Close the mobile sheet on route change — adjusting state during render
  // beats a setState-in-effect cascade.
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    if (open) setOpen(false);
  }

  /**
   * One indicator glides between links rather than each link owning its own
   * underline, so the active route reads as a single object moving.
   */
  useGSAP(
    () => {
      const nav = navRef.current;
      const indicator = indicatorRef.current;
      if (!nav || !indicator) return;

      const place = (animate: boolean) => {
        const active = nav.querySelector<HTMLElement>("[data-active='true']");
        if (!active) {
          gsap.to(indicator, { opacity: 0, duration: 0.2 });
          return;
        }
        const bounds = nav.getBoundingClientRect();
        const target = active.getBoundingClientRect();
        const vars = {
          x: target.left - bounds.left,
          width: target.width,
          opacity: 1,
        };
        if (animate && !prefersReducedMotion()) {
          gsap.to(indicator, { ...vars, duration: 0.52, ease: EASE.settle });
        } else {
          gsap.set(indicator, vars);
        }
      };

      place(placed.current);
      placed.current = true;

      // Link widths shift when the display font swaps in.
      const observer = new ResizeObserver(() => place(false));
      observer.observe(nav);
      return () => observer.disconnect();
    },
    { dependencies: [pathname] },
  );

  /** Full-screen sheet: the panel wipes down, the routes ascend into it. */
  useGSAP(
    () => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const items = sheet.querySelectorAll("[data-sheet-item]");

      if (prefersReducedMotion()) {
        gsap.set(sheet, { clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" });
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      if (open) {
        gsap
          .timeline()
          .fromTo(
            sheet,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: EASE.precise },
          )
          .fromTo(
            items,
            { opacity: 0, y: 34 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: EASE.ascent,
              stagger: STAGGER.base,
            },
            0.16,
          );
      } else {
        gsap.to(sheet, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.36,
          ease: EASE.precise,
        });
      }
    },
    { dependencies: [open] },
  );

  // Lock the page, close on Escape, and hand focus back to the toggle.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const first = sheetRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="dock" data-compact={compact ? "true" : "false"}>
        <div className="dock__inner">
          <Link
            href="/"
            aria-label="2.0 — home"
            className="flex shrink-0 items-center rounded-md transition-opacity hover:opacity-85"
          >
            <BrandLogo className="h-7 sm:h-8" priority />
          </Link>

          {/* Desktop nav */}
          <div
            ref={navRef}
            className="relative hidden items-center gap-0.5 md:flex"
          >
            <span ref={indicatorRef} className="dock__indicator" aria-hidden />
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-active={isActive(link.href) ? "true" : "false"}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={clsx(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300",
                  isActive(link.href) ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <div className="hidden md:block">
              <Magnetic>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold tracking-tight text-on-accent"
                >
                  Get in touch
                  <ArrowUpRight
                    size={16}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </Magnetic>
            </div>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-line-2 md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile navigation */}
      <div
        id="mobile-menu"
        ref={sheetRef}
        data-open={open ? "true" : "false"}
        inert={!open}
        aria-label="Site menu"
        className="nav-sheet md:hidden"
      >
        <div
          aria-hidden
          className="glow absolute -top-24 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2"
          style={{ ["--glow" as string]: "var(--violet-500)" }}
        />
        <nav className="relative px-6 pt-24 pb-10">
          <ul className="space-y-1">
            {links.map((link, i) => (
              <li key={link.href} data-sheet-item>
                <Link
                  href={link.href}
                  // The dock already prefetches these six routes; a second copy
                  // in the sheet only competes for bandwidth on a slow link.
                  prefetch={false}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={clsx(
                    "flex items-baseline gap-4 border-b border-line py-4 font-display text-3xl font-extrabold tracking-tight transition-colors",
                    isActive(link.href) ? "text-brand" : "text-ink",
                  )}
                >
                  <span className="w-8 shrink-0 font-sans text-xs font-semibold text-faint tabular-nums">
                    0{i + 1}
                  </span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div data-sheet-item className="mt-9">
            <Link
              href="/contact"
              prefetch={false}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-4 text-base font-bold tracking-tight text-on-accent"
            >
              Get in touch
              <ArrowUpRight size={18} aria-hidden />
            </Link>
            <a
              href={`mailto:${contactEmail}`}
              className="mt-5 block text-center text-sm text-muted"
            >
              {contactEmail}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
