import { eyebrow, h1 } from "@/lib/ui";
import { measure, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";

/** Shell for long-form legal text: eyebrow, h1, then sections of prose. */
export function LegalPage({
  label,
  title,
  updated,
  children,
}: {
  label: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="h-14 sm:h-16" aria-hidden />
      <article className={clsx(shell, "py-16 sm:py-20 lg:py-24")}>
        <p className={eyebrow}>{label}</p>
        <h1 className={clsx(h1, "mt-4")}>{title}</h1>
        <p className="mt-5 text-sm text-faint">Last updated {updated}</p>
        <div className={clsx(measure, "mt-12 space-y-10")}>{children}</div>
      </article>
    </>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}
