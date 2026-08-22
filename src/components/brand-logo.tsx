import Image from "next/image";
import { clsx } from "@/lib/clsx";

/**
 * The official 2.0 logo lockup (exact artwork from the brand sheet), swapped
 * by theme via CSS: the white+lime mark on dark, the black+purple mark on
 * light. Size it by setting a height on `className` (e.g. "h-7").
 *
 * Both variants are in the layout and cross-faded (see `.brand-logo` in
 * globals.css), so their alt text would be announced twice. The images are
 * marked decorative and the lockup is named once, here.
 */
export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={clsx("brand-logo inline-flex items-center", className)}>
      <Image
        src="/brand/logo-mark-dark.png"
        alt=""
        width={720}
        height={362}
        priority={priority}
        sizes="(min-width: 640px) 72px, 64px"
        className="logo-dark h-full w-auto"
      />
      <Image
        src="/brand/logo-mark-light.png"
        alt=""
        width={720}
        height={362}
        priority={priority}
        sizes="(min-width: 640px) 72px, 64px"
        className="logo-light h-full w-auto"
      />
      <span className="sr-only">2.0 — Elevate your vision</span>
    </span>
  );
}
