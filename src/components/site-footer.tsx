import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "How we work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-base-950 px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-7 md:flex-row md:justify-between md:gap-6">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <BrandMark className="text-2xl" />
          <span className="text-xs tracking-[0.25em] text-faint uppercase">
            Elevate your vision
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-lime-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="text-center text-xs text-faint">
          © {year} 2.0. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
