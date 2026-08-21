import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { contactEmail, phones } from "@/lib/contact";

const nav = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "How we work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-bg px-5 pt-16 pb-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <BrandLogo className="h-8" />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              A B2B growth partner helping ambitious businesses promote, sell
              and expand — at home and across borders.
            </p>
            <span className="mt-5 inline-block text-xs tracking-[0.25em] text-faint uppercase">
              Elevate your vision
            </span>
          </div>

          {/* Navigate */}
          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold tracking-[0.2em] text-faint uppercase">
              Navigate
            </h2>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-faint uppercase">
              Get in touch
            </h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-brand"
                >
                  <Mail size={15} aria-hidden />
                  {contactEmail}
                </a>
              </li>
              {phones.map((p) => (
                <li key={p.e164}>
                  <WhatsAppLink phone={p} />
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
                >
                  Start a conversation
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-12" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-faint">
            © {year} 2.0. All rights reserved.
          </p>
          <p className="text-xs text-faint">Built for growth, end to end.</p>
        </div>
      </div>
    </footer>
  );
}
