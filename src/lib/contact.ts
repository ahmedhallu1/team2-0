/** Shared contact details for the site (footer + contact section). */

export const contactEmail = "info@elevate2point0.com";

/** Human-readable phone, grouped for legibility. */
export const contactPhone = "+962 79 608 0454";

/** E.164 form (e.g. for tel: links and schema.org structured data). */
export const contactPhoneE164 = `+${contactPhone.replace(/\D/g, "")}`;

/** Digits only, without the leading "+", for wa.me / WhatsApp. */
const whatsappNumber = contactPhone.replace(/\D/g, "");

/** Pre-filled message that lands in WhatsApp when the number is tapped. */
const whatsappMessage =
  "Hi 2.0 👋 I found your number on your website and I'd like to get in touch.";

/** Deep link that opens a WhatsApp chat with the message ready to send. */
export const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  whatsappMessage,
)}`;
