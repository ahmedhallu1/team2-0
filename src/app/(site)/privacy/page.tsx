import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { contactEmail } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How 2.0 collects, uses and protects the information you share with us — through our website and on WhatsApp.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage label="Legal" title="Privacy policy" updated="12 October 2026">
      <LegalSection title="Who we are">
        <p>
          2.0 (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a B2B growth and
          marketing partner. This policy explains what personal information we
          handle when you visit elevate2point0.com, fill in our contact form,
          or message us on WhatsApp.
        </p>
      </LegalSection>

      <LegalSection title="What we collect">
        <p>
          <strong className="text-ink">Contact form.</strong> Your name, email
          address, company, phone number, the service you&rsquo;re interested
          in, and the message you write.
        </p>
        <p>
          <strong className="text-ink">WhatsApp.</strong> When you message us,
          we receive your WhatsApp phone number, the profile name you&rsquo;ve
          set on WhatsApp, and the content of your messages (text, and any
          media or documents you send).
        </p>
        <p>
          <strong className="text-ink">Technical data.</strong> Our hosting
          provider keeps standard server logs (IP address, browser, pages
          requested) for security and reliability. We don&rsquo;t run
          advertising trackers on this site.
        </p>
      </LegalSection>

      <LegalSection title="How we use it">
        <p>
          We use your information only to respond to your enquiry, provide the
          services you ask us about, and keep our site and systems secure. We
          don&rsquo;t sell your information.
        </p>
      </LegalSection>

      <LegalSection title="WhatsApp and Meta">
        <p>
          We use the WhatsApp Business Platform, provided by Meta Platforms,
          Inc., to send and receive WhatsApp messages. Messages you send us
          travel through Meta&rsquo;s infrastructure and are subject to{" "}
          <a
            className="text-brand underline underline-offset-4"
            href="https://www.whatsapp.com/legal/privacy-policy"
            rel="noopener noreferrer"
            target="_blank"
          >
            WhatsApp&rsquo;s privacy policy
          </a>
          . You can stop receiving messages from us at any time by telling us
          so in the chat.
        </p>
      </LegalSection>

      <LegalSection title="Who else sees it">
        <p>
          Only the 2.0 team, and the service providers that run our website,
          email and messaging (for example our hosting provider, our email
          delivery provider and Meta). They process information on our behalf
          and only for those purposes.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          We keep enquiries and conversations for as long as needed to deal
          with your request and the relationship that follows from it, and then
          delete them. You can ask us to delete your information sooner at any
          time.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You can ask us to access, correct or delete the information we hold
          about you. See{" "}
          <Link
            className="text-brand underline underline-offset-4"
            href="/data-deletion"
          >
            how to request deletion
          </Link>
          , or write to{" "}
          <a
            className="text-brand underline underline-offset-4"
            href={`mailto:${contactEmail}`}
          >
            {contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
