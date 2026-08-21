import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Layers,
  MonitorSmartphone,
  Sparkles,
  Target,
} from "lucide-react";

export type Service = {
  id: string;
  title: string;
  /** One-line promise — used in cards and the services list. */
  summary: string;
  /** The fuller "what you actually get" paragraph. */
  description: string;
  /** Concrete deliverables inside this service — shown as chips. */
  includes: string[];
  icon: LucideIcon;
};

/**
 * Five services, deliberately. Everything we do fits in one of these — the
 * specifics live in `includes` so the page stays readable instead of
 * reading like a menu of twenty line items.
 */
export const services: Service[] = [
  {
    id: "brand",
    title: "Brand & Content",
    summary: "Look like the company you're trying to become.",
    description:
      "We shape how your business is seen and understood — a clear identity and voice, then the words, visuals and video that carry it. Everything ships as assets your team can actually use: a deck for the meeting, a catalogue for the buyer, product copy that sells on its own.",
    includes: [
      "Brand identity & positioning",
      "Copy, photography & video",
      "Decks, brochures & catalogues",
      "Product descriptions",
    ],
    icon: Sparkles,
  },
  {
    id: "web",
    title: "Websites & Platforms",
    summary: "Custom-built, then kept running.",
    description:
      "Marketing sites, online stores and the internal systems that run behind them — designed and built from scratch, fast and on-brand. We don't hand over a folder and disappear: hosting, updates and day-to-day changes stay with us for as long as you want them to.",
    includes: [
      "Custom websites",
      "Online stores & ordering",
      "Internal tools & dashboards",
      "Hosting, upkeep & support",
    ],
    icon: MonitorSmartphone,
  },
  {
    id: "marketing",
    title: "Growth Marketing",
    summary: "Get found, get remembered, get replies.",
    description:
      "The demand side, run end to end: search rankings, paid campaigns on Google and Meta, promotions with a reason to act, and the daily work of keeping your channels alive. We also answer the inbox — because a lead nobody replies to is a lead you paid for twice.",
    includes: [
      "SEO",
      "Google & Meta ads",
      "Promotions & campaigns",
      "Social media management",
      "Customer communication",
    ],
    icon: Target,
  },
  {
    id: "leads",
    title: "Lead Generation",
    summary: "Qualified buyers, not lists.",
    description:
      "We find the companies that should be buying from you — at home and in markets you haven't entered yet — reach the person who actually decides, and hand your sales team a warm conversation with the research already done.",
    includes: [
      "B2B prospecting",
      "International outreach",
      "Sales team support & materials",
    ],
    icon: Layers,
  },
  {
    id: "events",
    title: "Events",
    summary: "Put your brand in the room.",
    description:
      "Launches, activations and conferences built as brand moments — concept and identity, the sponsors and partners who fund them, the production on the day, and the site people register through. We run it end to end and hand you the audience afterwards.",
    includes: [
      "Concept & event branding",
      "Sponsors & partnerships",
      "Production & on-site delivery",
      "Registration platforms",
    ],
    icon: CalendarDays,
  },
];

/** Service titles — used by the contact form dropdown. */
export const serviceOptions: string[] = services.map((s) => s.title);

export const totalServices = services.length;

/** Every concrete deliverable, flattened — feeds the home-page ticker. */
export const capabilities: string[] = services.flatMap((s) => s.includes);
