import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with 2.0. Tell us where you want to grow and we'll get back to you, usually within one business day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <div className="h-6 sm:h-10" aria-hidden />
      <ContactSection />
    </>
  );
}
