"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { serviceOptions } from "@/lib/services";
import { BrandLogo } from "@/components/brand-logo";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { contactEmail, contactPhone, whatsappHref } from "@/lib/contact";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
        throw new Error(json.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <section className="relative overflow-hidden bg-surface-2/40 px-5 py-20 sm:px-8 sm:py-28">
      <div
        aria-hidden
        className="glow-violet absolute top-0 left-1/2 -z-10 h-72 w-[40rem] max-w-[90vw] -translate-x-1/2 rounded-full blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Left: pitch */}
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-brand uppercase">
            Contact us
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-5xl">
            Let&apos;s build your{" "}
            <span className="text-gradient-brand">2.0</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-pretty text-muted">
            Tell us where you want to grow. We&apos;ll get back to you with how
            we can help — usually within one business day.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-muted">
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
          </ul>

          <div className="mt-8 flex flex-col items-start gap-3">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-opacity hover:opacity-80"
            >
              <Mail size={16} aria-hidden />
              {contactEmail}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chat with 2.0 on WhatsApp at ${contactPhone}`}
              className="group relative inline-flex items-center gap-2.5 text-sm font-medium text-brand transition-colors hover:text-[#25D366]"
            >
              <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                <span
                  aria-hidden
                  className="absolute inset-0 scale-50 rounded-full bg-[#25D366]/20 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-hover:motion-safe:animate-ping"
                />
                <WhatsAppIcon className="relative h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </span>
              <span className="tabular-nums">{contactPhone}</span>
              <span className="inline-flex max-w-0 -translate-x-1 items-center gap-1 overflow-hidden whitespace-nowrap text-xs font-semibold text-[#25D366] opacity-0 transition-all duration-300 group-hover:max-w-[12rem] group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none">
                <span aria-hidden>·</span>
                Chat on WhatsApp
                <ArrowRight size={13} aria-hidden />
              </span>
            </a>
          </div>

          <div className="mt-10 hidden items-center gap-3 lg:flex">
            <BrandLogo className="h-11" />
          </div>
        </div>

        {/* Right: form */}
        <div className="surface rounded-3xl p-5 shadow-[var(--shadow-md)] sm:p-8">
          {status === "success" ? (
            <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
              <CheckCircle2 size={48} className="text-brand" aria-hidden />
              <h3 className="mt-5 font-display text-2xl font-bold text-ink">
                Message sent
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                Thanks for reaching out. We&apos;ve received your message and
                will be in touch shortly.
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
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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

              <div className="grid gap-5 sm:grid-cols-2">
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

              <div className="grid gap-5 sm:grid-cols-2">
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
                  defaultValue=""
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
                  role="alert"
                  className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-200"
                >
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-on-accent transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={17} className="animate-spin" aria-hidden />
                    Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-faint">
                By submitting, you agree to be contacted about your inquiry.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink placeholder:text-faint transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25 focus:outline-none";

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
    <div>
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
      {children}
    </div>
  );
}
