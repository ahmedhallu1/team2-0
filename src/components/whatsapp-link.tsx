import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import type { PhoneContact } from "@/lib/contact";
import { clsx } from "@/lib/clsx";

/**
 * One phone number as a WhatsApp deep link, with the ping/reveal hover.
 * `size="lg"` is the contact page treatment; the default suits the footer.
 */
export function WhatsAppLink({
  phone,
  size = "sm",
  label = "WhatsApp",
}: {
  phone: PhoneContact;
  size?: "sm" | "lg";
  label?: string;
}) {
  const lg = size === "lg";
  return (
    <a
      href={phone.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with 2.0 on WhatsApp — ${phone.region}, ${phone.display}`}
      className={clsx(
        "group inline-flex items-center text-sm font-medium text-muted transition-colors hover:text-[#25D366]",
        lg ? "relative gap-2.5 text-brand" : "gap-2",
      )}
    >
      <span
        className={clsx(
          "relative flex shrink-0 items-center justify-center",
          lg ? "h-6 w-6" : "h-5 w-5",
        )}
      >
        <span
          aria-hidden
          className="absolute inset-0 scale-50 rounded-full bg-[#25D366]/20 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-hover:motion-safe:animate-ping"
        />
        <WhatsAppIcon
          className={clsx(
            "relative transition-transform duration-300 group-hover:scale-110",
            lg ? "h-4 w-4" : "h-3.5 w-3.5",
          )}
        />
      </span>
      <span className="tabular-nums">{phone.display}</span>
      <span className="text-xs text-faint">{phone.region}</span>
      <span
        className={clsx(
          "inline-flex max-w-0 -translate-x-1 items-center gap-1 overflow-hidden whitespace-nowrap text-xs font-semibold text-[#25D366] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none",
          lg ? "group-hover:max-w-[12rem]" : "group-hover:max-w-[10rem]",
        )}
      >
        <span aria-hidden>·</span>
        {label}
        {lg && <ArrowRight size={13} aria-hidden />}
      </span>
    </a>
  );
}
