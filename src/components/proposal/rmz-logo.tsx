import Image from "next/image";
import { rmz } from "@/lib/proposals/rmz";
import { clsx } from "@/lib/clsx";

/**
 * RMZtech's lockup for dark grounds. Their published logo is navy type on
 * white, which disappears on a night-navy page, so the mark sits on a white
 * disc — exactly as it does on their own Facebook avatar — and the name is set
 * in light type beside it. The mark itself is their artwork, untouched.
 */
export function RmzLogo({
  className,
  tagline = true,
  priority = false,
}: {
  className?: string;
  tagline?: boolean;
  priority?: boolean;
}) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-[1.9em] w-[1.9em] shrink-0 items-center justify-center rounded-full bg-white">
        <Image
          src={rmz.mark}
          alt=""
          width={64}
          height={64}
          priority={priority}
          className="h-[78%] w-[78%]"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display font-extrabold tracking-tight text-ink">
          RMZ<span style={{ color: "#7ea6ec" }}>tech</span>
        </span>
        {tagline ? (
          <span className="mt-[0.3em] text-[0.55em] font-medium tracking-[0.04em] text-faint">
            {rmz.tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
