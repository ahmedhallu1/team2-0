/** Shared contact details for the site (footer + contact section). */

export const contactEmail = "contact@elevate2point0.com";

export type PhoneContact = {
  /** Where this line rings — shown next to the number. */
  region: string;
  /** Human-readable, grouped for legibility. */
  display: string;
  /** E.164 form, for tel: links and schema.org structured data. */
  e164: string;
  /** Deep link that opens WhatsApp with our message ready to send. */
  whatsappHref: string;
};

/** Pre-filled message that lands in WhatsApp when a number is tapped. */
// Plain text only: the waving-hand emoji was arriving as a replacement
// character on some clients, and the sentence reads fine without it.
const whatsappMessage =
  "Hi 2.0, I found your number on your website and I'd like to get in touch.";

function phone(region: string, display: string): PhoneContact {
  const digits = display.replace(/\D/g, "");
  return {
    region,
    display,
    e164: `+${digits}`,
    whatsappHref: `https://wa.me/${digits}?text=${encodeURIComponent(
      whatsappMessage,
    )}`,
  };
}

/** Every number we answer on. The first is the primary. */
export const phones: PhoneContact[] = [
  phone("Jordan", "+962 79 608 0454"),
  phone("Egypt", "+20 109 901 9374"),
];

/** Primary number — used where a single value is required. */
export const contactPhone = phones[0].display;
export const contactPhoneE164 = phones[0].e164;
export const whatsappHref = phones[0].whatsappHref;

/** All numbers in E.164, for structured data. */
export const contactPhonesE164 = phones.map((p) => p.e164);
