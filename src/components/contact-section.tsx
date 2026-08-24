"use client";

import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { services, serviceOptions } from "@/lib/services";
import { BrandLogo } from "@/components/brand-logo";
import { WhatsAppLink } from "@/components/whatsapp-link";
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

type Status = "idle" | "submitting" | "success" | "error";

export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [service, setService] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);

  const chosen = services.find((s) => s.title === service);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        throw new Error(
          json.error ?? "Something went wrong. Please try again.",
        );
      }
      setStatus("success");
      setService("");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      // Send focus to the problem rather than leaving it on a dead button.
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

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
                <div className="flex flex-col items-start gap-3.5">
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-opacity hover:opacity-80"
                  >
                    <Mail size={16} aria-hidden />
                    {contactEmail}
                  </a>
                  {phones.map((p) => (
                    <WhatsAppLink
                      key={p.e164}
                      phone={p}
                      size="lg"
                      label="Chat on WhatsApp"
                    />
                  ))}
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-opacity hover:opacity-80"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    {instagramHandle}
                  </a>
                </div>
                <BrandLogo className="mt-10 hidden h-10 lg:block" />
              </Rise>
            </div>
          </div>

          {/* Inquiry form */}
          <div className="lg:col-span-7">
            <Rise className="surface rounded-2xl p-5 shadow-[var(--shadow-md)] sm:p-8 lg:p-10">
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
                  <h2 className="mt-5 font-display text-2xl font-bold text-ink">
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
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                    <Field label="Name" htmlFor="name" required>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Email" htmlFor="email" required>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@company.com"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Company" htmlFor="company">
                      <input
                        id="company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        placeholder="Company name"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Phone" htmlFor="phone">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="Optional"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="Service of interest" htmlFor="service">
                    <select
                      id="service"
                      name="service"
                      aria-describedby={chosen ? "service-hint" : undefined}
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

                  <Field label="Message" htmlFor="message" required>
                    <textarea
                      id="message"
                      name="message"
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
                    By submitting, you agree to be contacted about your inquiry.
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
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
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
    </div>
  );
}
