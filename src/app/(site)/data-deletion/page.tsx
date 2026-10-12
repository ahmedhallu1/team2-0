import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { contactEmail, phones } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Data deletion",
  description:
    "How to ask 2.0 to delete the personal information we hold about you, including your WhatsApp conversations.",
  alternates: { canonical: "/data-deletion" },
};

export default function DataDeletionPage() {
  return (
    <LegalPage label="Legal" title="Data deletion" updated="12 October 2026">
      <LegalSection title="Ask us to delete your data">
        <p>
          If you&rsquo;ve contacted 2.0 through our website or on WhatsApp, you
          can ask us to delete everything we hold about you. There&rsquo;s no
          form to fill in and no reason required.
        </p>
      </LegalSection>

      <LegalSection title="How">
        <p>
          Email{" "}
          <a
            className="text-brand underline underline-offset-4"
            href={`mailto:${contactEmail}?subject=Data%20deletion%20request`}
          >
            {contactEmail}
          </a>{" "}
          with the subject &ldquo;Data deletion request&rdquo;, from the
          address you used with us. If you contacted us on WhatsApp, include
          the phone number you messaged from.
        </p>
        <p>
          Or message us on WhatsApp at {phones[0].display} and say
          &ldquo;delete my data&rdquo;.
        </p>
      </LegalSection>

      <LegalSection title="What happens next">
        <p>
          We&rsquo;ll confirm your request and delete the enquiries, messages
          and contact details linked to you from our systems within 30 days.
          Copies held by Meta on WhatsApp are governed by{" "}
          <a
            className="text-brand underline underline-offset-4"
            href="https://www.whatsapp.com/legal/privacy-policy"
            rel="noopener noreferrer"
            target="_blank"
          >
            WhatsApp&rsquo;s own policy
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
