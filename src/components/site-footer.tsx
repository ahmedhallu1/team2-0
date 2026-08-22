import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { FooterStatement } from "@/components/footer-statement";
import { contactEmail, phones } from "@/lib/contact";
import { actionText } from "@/lib/ui";
import { shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

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
    <footer className="relative overflow-hidden border-t border-line bg-bg pt-16 pb-8 sm:pt-20">
      <div
        aria-hidden
        className="glow -bottom-64 left-1/2 h-[34rem] w-[46rem] max-w-[130vw] -translate-x-1/2"
        style={{ ["--glow" as string]: "var(--violet-500)" }}
      />

      <div className={clsx(shell, "relative")}>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1.1fr] md:gap-12">
          {/* Brand */}
          <div className="max-w-sm">
            <BrandLogo className="h-8" />
            <p className="mt-5 text-sm leading-relaxed text-muted">
              A B2B growth partner helping ambitious businesses promote, sell
              and expand — at home and across borders.
            </p>
            <span className="mt-6 inline-block text-xs tracking-[0.25em] text-faint uppercase">
              Elevate your vision
            </span>
          </div>

          {/* Navigate */}
          <nav aria-label="Footer">
            <h2 className="text-[11px] font-semibold tracking-[0.25em] text-faint uppercase">
              Navigate
            </h2>
            <ul className="mt-5 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    // Same six routes as the dock — no need to fetch them twice.
                    prefetch={false}
                    className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-brand"
                  >
                    <span
                      aria-hidden
                      className="h-px w-0 bg-accent transition-[width] duration-300 group-hover:w-4"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-[11px] font-semibold tracking-[0.25em] text-faint uppercase">
              Get in touch
            </h2>
            <ul className="mt-5 space-y-2.5">
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
              <li className="pt-1.5">
                <Link href="/contact" className={actionText}>
                  Start a conversation
                  <ArrowUpRight
                    size={15}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <FooterStatement />

        <div className="hairline mt-8" />

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
