"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { services, serviceOptions } from "@/lib/services";
import { BrandLogo } from "@/components/brand-logo";
import { ContactLink } from "@/components/contact-link";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { InstagramIcon } from "@/components/instagram-icon";
import { Rise, RiseGroup } from "@/components/motion/reveal";
import { AscentHeading } from "@/components/motion/ascent-heading";
import {
  contactEmail,
  instagramHandle,
  instagramUrl,
  phones,
} from "@/lib/contact";
import { eyebrow, h1 } from "@/lib/ui";
import { sectionY, shell } from "@/lib/layout";
import { clsx } from "@/lib/clsx";
import {
  INQUIRY_LIMITS,
  validateInquiry,
  type Inquiry,
  type InquiryErrors,
  type InquiryField,
} from "@/lib/inquiry";

type Status = "idle" | "submitting" | "success" | "error";

const GENERIC_ERROR = "Something went wrong. Please try again.";
const NETWORK_ERROR =
  "We couldn’t reach the server — check your connection and try again, or email us directly.";

/** The order fields appear in, so focus lands on the first problem. */
const FIELD_ORDER: InquiryField[] = ["name", "email", "company", "phone", "service", "message"];

export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [service, setService] = useState("");
  const [fieldErrors, setFieldErrors] = useState<InquiryErrors>({});
  const errorRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const chosen = services.find((s) => s.title === service);

  /** Points focus at the first field that needs attention. */
  function focusFirst(form: HTMLFormElement, errors: InquiryErrors) {
    const first = FIELD_ORDER.find((field) => errors[field]);
    if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const value = (key: string) => String(data[key] ?? "").trim();
    const inquiry: Inquiry = {
      name: value("name"),
      email: value("email"),
      company: value("company"),
      phone: value("phone"),
      service: value("service"),
      message: value("message"),
    };

    // The same rules the server applies — caught here, a mistake costs no
    // round trip and is pinned to the field it belongs to.
    const errors = validateInquiry(inquiry);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("idle");
      setErrorMsg("");
      focusFirst(form, errors);
      return;
    }

    setFieldErrors({});
    setStatus("submitting");
    setErrorMsg("");

    let res: Response;
    try {
      res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      fail(NETWORK_ERROR);
      return;
    }
    const json = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      fields?: InquiryErrors;
    };

    if (!res.ok || !json.ok) {
      if (json.fields && Object.keys(json.fields).length > 0) {
        setFieldErrors(json.fields);
        setStatus("idle");
        focusFirst(form, json.fields);
        return;
      }
      fail(json.error ?? GENERIC_ERROR);
      return;
    }

    setStatus("success");
    setService("");
    form.reset();
    // The form is replaced by the confirmation; take focus with it rather
    // than dropping it on <body>.
    requestAnimationFrame(() => successRef.current?.focus());
  }

  function fail(message: string) {
    setStatus("error");
    setErrorMsg(message);
    // Send focus to the problem rather than leaving it on a dead button.
    requestAnimationFrame(() => errorRef.current?.focus());
  }

  /** A field's error clears as soon as the visitor starts fixing it. */
  function clearFieldError(e: React.FormEvent<HTMLFormElement>) {
    const name = (e.target as HTMLInputElement).name as InquiryField;
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  /** aria wiring for one control: invalid state plus its message (and hint). */
  const describe = (field: InquiryField, hint?: string) => ({
    "aria-invalid": fieldErrors[field] ? true : undefined,
    "aria-describedby":
      [hint, fieldErrors[field] ? `${field}-error` : undefined].filter(Boolean).join(" ") ||
      undefined,
  });

  // `overflow-x-clip`, not `overflow-hidden`: the latter would make this
  // section a scroll container and quietly kill the sticky contact column.
  return (
    <section className={clsx("relative overflow-x-clip", sectionY)}>
      <div
        aria-hidden
        className="glow -z-10 top-0 left-1/2 h-[30rem] w-[46rem] max-w-[130vw] -translate-x-1/2"
        style={{ ["--glow" as string]: "var(--violet-500)" }}
      />

      <div className={shell}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Direct contact */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Rise as="p" className={eyebrow} eager index={0}>
                Contact us
              </Rise>
              <AscentHeading
                as="h1"
                eager
                className={clsx(h1, "mt-5")}
                lines={[
                  "Let’s build",
                  <>
                    your <span className="text-gradient-brand">2.0</span>
                  </>,
                ]}
              />

              <Rise
                as="p"
                eager
                index={2}
                className="mt-6 max-w-md text-base leading-relaxed text-pretty text-muted sm:text-lg"
              >
                Tell us where you want to grow. We&apos;ll get back to you with
                how we can help — usually within one business day.
              </Rise>

              <RiseGroup
                as="ul"
                delay={0.08}
                distance="sm"
                className="mt-9 space-y-3 text-sm text-muted"
              >
                {[
                  "A clear, no-pressure first conversation",
                  "Recommendations tailored to your goals",
                  "Flexible scope — one service or the full engine",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-brand"
                      aria-hidden
                    />
                    {line}
                  </li>
                ))}
              </RiseGroup>

              <Rise delay={0.1} className="mt-9 border-t border-line pt-8">
                <div className="flex flex-col items-start gap-4">
                  <ContactLink
                    size="lg"
                    href={`mailto:${contactEmail}`}
                    icon={<Mail size={18} />}
                    label={contactEmail}
                  />
                  {phones.map((p) => (
                    <ContactLink
                      key={p.e164}
                      size="lg"
                      href={p.whatsappHref}
                      external
                      srPrefix="Chat with 2.0 on WhatsApp — "
                      icon={<WhatsAppIcon className="h-4 w-4" />}
                      label={p.display}
                      meta={p.region}
                    />
                  ))}
                  <ContactLink
                    size="lg"
                    href={instagramUrl}
                    external
                    icon={<InstagramIcon className="h-[18px] w-[18px]" />}
                    label={instagramHandle}
                  />
                </div>
                <BrandLogo className="mt-10 hidden h-10 lg:block" />
              </Rise>
            </div>
          </div>

          {/* Inquiry form */}
          <div className="lg:col-span-7">
            <Rise
              id="contact-form"
              className="surface scroll-mt-28 rounded-2xl p-5 shadow-[var(--shadow-md)] sm:p-8 lg:p-10"
            >
              {/* Progress and success are announced here; a failure instead
                  moves focus to the message, so it is never read twice. */}
              <p className="sr-only" role="status" aria-live="polite">
                {status === "submitting"
                  ? "Sending your message…"
                  : status === "success"
                    ? "Message sent."
                    : ""}
              </p>

              {status === "success" ? (
                <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
                  <CheckCircle2 size={44} className="text-brand" aria-hidden />
                  <h2
                    ref={successRef}
                    tabIndex={-1}
                    className="mt-5 font-display text-2xl font-bold text-ink focus:outline-none"
                  >
                    Message sent
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                    Thanks for reaching out. We&apos;ve received your message
                    and will be in touch shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-sm font-semibold text-brand hover:opacity-80"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  onInput={clearFieldError}
                  className="space-y-6"
                  noValidate
                >
                  {/* Honeypot */}
                  <div className="absolute -left-[9999px]" aria-hidden>
                    <label htmlFor="website">Leave this field empty</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Name" htmlFor="name" error={fieldErrors.name} required>
                      <input
                        id="name"
                        name="name"
                        maxLength={INQUIRY_LIMITS.name}
                        {...describe("name")}
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Email" htmlFor="email" error={fieldErrors.email} required>
                      <input
                        id="email"
                        name="email"
                        maxLength={INQUIRY_LIMITS.email}
                        {...describe("email")}
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@company.com"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Company" htmlFor="company" error={fieldErrors.company}>
                      <input
                        id="company"
                        name="company"
                        maxLength={INQUIRY_LIMITS.company}
                        {...describe("company")}
                        type="text"
                        autoComplete="organization"
                        placeholder="Company name"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Phone" htmlFor="phone" error={fieldErrors.phone}>
                      <input
                        id="phone"
                        name="phone"
                        maxLength={INQUIRY_LIMITS.phone}
                        {...describe("phone")}
                        type="tel"
                        autoComplete="tel"
                        placeholder="Optional"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="Service of interest" htmlFor="service" error={fieldErrors.service}>
                    <select
                      id="service"
                      name="service"
                      {...describe("service", chosen ? "service-hint" : undefined)}
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className={`${inputClass} appearance-none bg-[length:1rem] bg-[right_0.9rem_center] bg-no-repeat pr-10`}
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238a8a92' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                      }}
                    >
                      <option value="" disabled className="bg-surface">
                        Select a service…
                      </option>
                      <option value="Not sure yet" className="bg-surface">
                        Not sure yet — help me choose
                      </option>
                      {serviceOptions.map((s) => (
                        <option key={s} value={s} className="bg-surface">
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {/* What that choice actually means, in the words already on
                      the services page. */}
                  {chosen && (
                    <p
                      id="service-hint"
                      className="-mt-3 flex items-start gap-2 text-sm text-brand"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.45em] h-px w-4 shrink-0 bg-accent"
                      />
                      {chosen.summary}
                    </p>
                  )}

                  <Field label="Message" htmlFor="message" required error={fieldErrors.message}>
                    <textarea
                      id="message"
                      name="message"
                      maxLength={INQUIRY_LIMITS.message}
                      {...describe("message")}
                      required
                      rows={5}
                      placeholder="Tell us a little about your business and what you're hoping to achieve."
                      className={`${inputClass} resize-y`}
                    />
                  </Field>

                  {status === "error" && (
                    <p
                      ref={errorRef}
                      tabIndex={-1}
                      className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-200"
                    >
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-7 py-4 text-sm font-bold tracking-tight text-on-accent transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                          aria-hidden
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send message
                        <ArrowRight
                          size={17}
                          aria-hidden
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-faint">
                    By submitting, you agree to be contacted about your
                    inquiry. See our{" "}
                    <Link
                      href="/privacy"
                      className="underline decoration-line-2 underline-offset-2 transition-colors hover:text-brand"
                    >
                      privacy policy
                    </Link>
                    .
                  </p>
                </form>
              )}
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-lg border border-line bg-bg/60 px-4 py-3 text-sm text-ink transition-colors placeholder:text-faint focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]";

/**
 * A field whose focus is drawn by a lime→violet rule scaling out from the left
 * — the same rising-line motif the rest of the site uses for progress. The
 * label, the required marker and the hint stay plain, static text.
 */
function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  /** Shown under the control and referenced by its aria-describedby. */
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-medium tracking-wide text-muted"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-brand" aria-hidden>
            *
          </span>
        )}
      </label>
      <div className="relative">
        {children}
        <span aria-hidden className="field__line" />
      </div>
      {error && (
        <p
          id={`${htmlFor}-error`}
          className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-300"
        >
          {error}
        </p>
      )}
    </div>
  );
}
