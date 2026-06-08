"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { clsx } from "@/lib/clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "How we work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-white/10 bg-base-950"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          aria-label="2.0 — home"
          className="flex items-center transition-opacity hover:opacity-90"
        >
          <BrandMark className="text-2xl" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-lime-400"
                  : "text-muted hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-full bg-lime-400 px-5 py-2 text-sm font-bold text-base-950 transition-all hover:-translate-y-0.5 hover:bg-lime-300"
          >
            Get in touch
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink ring-1 ring-white/15 transition-colors hover:bg-white/5 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={clsx(
          "overflow-hidden border-white/10 bg-base-950 transition-[max-height,opacity] duration-300 md:hidden",
          open
            ? "max-h-[28rem] border-t opacity-100"
            : "max-h-0 border-transparent opacity-0",
        )}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                isActive(link.href)
                  ? "bg-white/5 text-lime-400"
                  : "text-muted hover:bg-white/5 hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 rounded-full bg-lime-400 px-5 py-3.5 text-center text-base font-bold text-base-950"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </header>
  );
}
