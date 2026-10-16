/**
 * The contact form's contract, shared by the form (instant feedback) and
 * /api/contact (the check that actually counts). Pure — no Node or DOM APIs —
 * so both sides and the unit tests import the same rules.
 */

export const INQUIRY_LIMITS = {
  name: 120,
  email: 254,
  company: 160,
  phone: 40,
  service: 120,
  message: 5000,
} as const;

export type InquiryField = keyof typeof INQUIRY_LIMITS;

export type Inquiry = Record<InquiryField, string>;

export type InquiryErrors = Partial<Record<InquiryField, string>>;

export type ParsedInquiry =
  | { ok: true; inquiry: Inquiry }
  /** The honeypot was filled: accept quietly, send nothing. */
  | { ok: true; spam: true }
  | { ok: false; error: string; fields: InquiryErrors };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Control characters, which have no business in a name or a subject line. */
const CONTROL_RE = /[\u0000-\u001f\u007f]+/g;
const CONTROL_KEEP_NEWLINES_RE = /[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f]+/g;

function text(value: unknown, multiline = false): string {
  if (typeof value !== "string") return "";
  const cleaned = multiline
    ? value.replace(/\r\n?/g, "\n").replace(CONTROL_KEEP_NEWLINES_RE, "")
    : value.replace(CONTROL_RE, " ");
  return cleaned.trim();
}

/** Per-field problems, worded for the person filling the form in. */
export function validateInquiry(inquiry: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!inquiry.name) errors.name = "Please tell us your name.";
  if (!inquiry.email) errors.email = "Please add your email address.";
  else if (!EMAIL_RE.test(inquiry.email))
    errors.email = "That email address doesn’t look right.";
  if (!inquiry.message) errors.message = "Please tell us a little about what you need.";

  for (const field of Object.keys(INQUIRY_LIMITS) as InquiryField[]) {
    if (!errors[field] && inquiry[field].length > INQUIRY_LIMITS[field]) {
      errors[field] =
        field === "message"
          ? "Your message is a little too long — please keep it under 5,000 characters."
          : "That’s longer than we can take here.";
    }
  }
  return errors;
}

/** Turn an untrusted request body into a clean inquiry, or say why not. */
export function parseInquiry(body: unknown): ParsedInquiry {
  const data = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  if (text(data.website) !== "") return { ok: true, spam: true };

  const inquiry: Inquiry = {
    name: text(data.name),
    email: text(data.email),
    company: text(data.company),
    phone: text(data.phone),
    service: text(data.service),
    message: text(data.message, true),
  };

  const fields = validateInquiry(inquiry);
  const first = Object.values(fields)[0];
  if (first) return { ok: false, error: first, fields };
  return { ok: true, inquiry };
}
