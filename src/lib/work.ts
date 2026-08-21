import type { LucideIcon } from "lucide-react";
import {
  CalendarHeart,
  ClipboardCheck,
  Dumbbell,
  Globe2,
  ScanSearch,
  Users,
} from "lucide-react";

export type Project = {
  slug: string;
  /** Product or project name. */
  name: string;
  /** Who it was built for — omitted when the project name is the client. */
  client?: string;
  /** Short category chip. */
  category: string;
  year: string;
  /** One line: what this thing actually is. */
  tagline: string;
  /** What we built — the substance, 2–3 sentences. */
  summary: string;
  /** Why it matters to the business that owns it. */
  impact: string;
  /** Concrete things it does. */
  highlights: string[];
  /** Hard numbers / defining facts. */
  facts: { label: string; value: string }[];
  /** What we did on the project. */
  tags: string[];
  icon: LucideIcon;
  /** Live URL, when there is a public one. */
  href?: string;
  /** Caveat shown next to the link (e.g. sign-in required). */
  hrefNote?: string;
  /** Shown instead of a link when nothing is public. */
  status?: string;
  /** Screenshot / artwork under /public. */
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  /** Secondary artwork for the featured card. */
  aside?: string;
  asideAlt?: string;
  asideWidth?: number;
  asideHeight?: number;
  /** Centred logo used when there's no screenshot. */
  logo?: string;
  logoWidth?: number;
  logoHeight?: number;
};

/**
 * Real work, newest and most illustrative first. The first entry is rendered
 * as the featured case study on /work and on the home page.
 */
export const projects: Project[] = [
  {
    slug: "yacht-pilates",
    name: "Yacht Pilates",
    client: "World Fit × D.Diamonds",
    category: "Event & brand experience",
    year: "2026",
    tagline:
      "Alexandria's first luxury Yacht Pilates experience — conceived, branded, sponsored and staged by us.",
    summary:
      "A gym wanted more than another class, so we built them a brand moment: the event concept and identity, the sponsor wall and print collateral, and a private registration site where guests apply and every application is reviewed before an invitation goes out. We brought the partners in too — a jewellery house as title partner plus seven supporting brands funding the day.",
    impact:
      "It turned a fitness brand into a name premium partners want to stand next to — and made an invitation, rather than a discount, the reason people wanted in.",
    highlights: [
      "Event concept, name and visual identity",
      "Sponsor programme — title partner plus 7 brands",
      "Invitation-only registration site with application review",
      "Sponsor wall, VIP invitations and on-site print",
    ],
    facts: [
      { label: "Partner brands", value: "8" },
      { label: "Registration", value: "By application" },
      { label: "Setting", value: "Mediterranean" },
      { label: "Date", value: "20.6.2026" },
    ],
    tags: ["Events", "Brand & Content", "Websites & Platforms"],
    icon: CalendarHeart,
    href: "https://yacht-pilates.worldfitgym.info",
    image: "/work/yacht-pilates.jpg",
    imageAlt:
      "The Yacht Pilates registration site — 'Own your world at sea' over an aerial shot of a pilates class on a yacht deck",
    imageWidth: 1600,
    imageHeight: 1000,
    aside: "/work/yacht-pilates-poster.jpg",
    asideAlt:
      "The Yacht Pilates sponsor wall we designed — the event lockup surrounded by partner brand logos",
    asideWidth: 1200,
    asideHeight: 799,
  },
  {
    slug: "elect-i-global",
    name: "ELECT-I Global",
    category: "B2B marketplace",
    year: "2026",
    tagline:
      "A wholesale sourcing platform where buyers quote, order and ship 9,000+ products from one place.",
    summary:
      "We built the whole trading business online: a searchable catalogue of 9,056 live SKUs from 14 suppliers across 11 countries, a quotation-to-delivery flow that generates the paperwork at each step, and paid merchant tiers that unlock wholesale bands, a prepaid wallet and ordering on a customer's behalf. Elite merchants get a signed REST API and webhooks, so an order placed on their own storefront becomes an ELECT-I order automatically.",
    impact:
      "Everything a trading business needs to sell at scale sits in one place: published wholesale pricing instead of quoting one buyer at a time, subscription tiers that turn customers into recurring revenue, and an API so the biggest accounts can order without anyone lifting a finger.",
    highlights: [
      "9,056-SKU catalogue with live wholesale pricing",
      "Quotation → pro forma → payment → consolidated shipping",
      "Three membership tiers with wholesale bands and a prepaid wallet",
      "Public API with HMAC-signed, idempotent orders and webhooks",
    ],
    facts: [
      { label: "Live SKUs", value: "9,056" },
      { label: "Suppliers", value: "14" },
      { label: "Countries", value: "11" },
      { label: "Membership tiers", value: "3" },
    ],
    tags: ["Websites & Platforms", "Brand & Content", "Market & Trade"],
    icon: Globe2,
    href: "https://elect-i-global.com",
    image: "/work/elect-i-global.jpg",
    imageAlt:
      "The ELECT-I Global homepage — 'Global Wholesale Starts Here' with a product search bar over a dark globe illustration",
    imageWidth: 1600,
    imageHeight: 1000,
  },
  {
    slug: "bxo-cv-analyzer",
    name: "BXO CV Analyzer",
    client: "AIESEC in Alexandria — OGT",
    category: "AI recruitment tool",
    year: "2026",
    tagline:
      "Upload a stack of CVs, get every candidate scored against the same bar in minutes.",
    summary:
      "A private workspace where a recruiting team uploads PDF CVs and gets back an AI-generated score and breakdown for each one, synced straight to Google Drive and Sheets. Access is role-aware — team leads manage accounts and assign every member to a manager, so people only see the candidates that are theirs.",
    impact:
      "Every applicant gets scored against the same criteria in minutes rather than on whoever happened to open the file — and the results land in the Drive and Sheets the team already works from.",
    highlights: [
      "Batch PDF upload with AI-generated scoring and rationale",
      "Results synced to Google Drive and Sheets automatically",
      "Three roles — lead, manager, member — with assignment",
      "Full account lifecycle: create, disable, reactivate, archive",
    ],
    facts: [
      { label: "Input", value: "PDF CVs" },
      { label: "Scoring", value: "AI, consistent" },
      { label: "Syncs to", value: "Drive + Sheets" },
      { label: "Roles", value: "3" },
    ],
    tags: ["Websites & Platforms"],
    icon: ScanSearch,
    href: "https://bxo-cv-analyzer.vercel.app",
    hrefNote: "Sign-in required",
    image: "/work/bxo-cv-analyzer.jpg",
    imageAlt:
      "The BXO CV Analyzer sign-in screen — 'Secure access to smarter CV decisions'",
    imageWidth: 1600,
    imageHeight: 1000,
  },
  {
    slug: "sodio",
    name: "Sodio",
    client: "AIESEC in Alexandria",
    category: "CRM platform",
    year: "2026",
    tagline:
      "A full sales CRM — accounts, contacts, visits and pipeline — running at zero cost.",
    summary:
      "Sodio puts accounts, contacts, visits and pipeline in one place, with permissions deciding who reads and edits what. Booked visits land on the rep's own Google Calendar with reminders 24 hours and 1 hour ahead, a follow-up email asks whether the visit actually happened, and branded emails go out from the director's mailbox. It installs on a phone like an app.",
    impact:
      "Nothing depends on someone remembering any more. The pipeline, the reminders and the follow-ups run themselves — and the whole system costs nothing to operate.",
    highlights: [
      "Role-based access across every account and record",
      "Calendar reminders 24h and 1h before each visit",
      "Automatic follow-up prompts and branded email",
      "Two-way Google Sheets sync · installable as a phone app",
    ],
    facts: [
      { label: "Running cost", value: "EGP 0" },
      { label: "Access", value: "Role-based" },
      { label: "Reminders", value: "Automatic" },
      { label: "Mobile", value: "Installable" },
    ],
    tags: ["Websites & Platforms"],
    icon: Users,
    href: "https://sodio.vercel.app",
    hrefNote: "Sign-in required",
    image: "/work/sodio.jpg",
    imageAlt:
      "The Sodio sign-in screen, built for AIESEC in Alexandria",
    imageWidth: 1600,
    imageHeight: 1000,
  },
  {
    slug: "internal-auditing-system",
    name: "Internal Auditing System",
    client: "AIESEC in Alexandria",
    category: "Compliance & operations",
    year: "2026",
    tagline:
      "Every document a team owes, tracked, collected and packaged for audit — automatically.",
    summary:
      "The system reads the live operations sheet, works out which documents each case needs at its current stage, and tracks what's missing. Files can be uploaded through the app or simply dropped into Drive — it detects those too. Every week it builds the submission folder and ZIP for the deadline and emails and calendar-invites the people who still owe something.",
    impact:
      "Audit week stops being a scramble. The evidence pack assembles itself on schedule, and nobody has to chase colleagues document by document.",
    highlights: [
      "Reads the live source sheet and flags missing documents by stage",
      "Auto-detects files uploaded manually into Drive",
      "Builds weekly submission folders and ZIPs on a fixed cadence",
      "Calendar invites and email reminders to the right stakeholders",
    ],
    facts: [
      { label: "Functions tracked", value: "4" },
      { label: "Deadlines", value: "Weekly" },
      { label: "Packaging", value: "Automatic" },
      { label: "Running cost", value: "EGP 0" },
    ],
    tags: ["Websites & Platforms"],
    icon: ClipboardCheck,
    href: "https://aiesec-alexandria-auditing.vercel.app",
    image: "/work/internal-auditing-system.jpg",
    imageAlt:
      "The Internal Auditing System dashboard, showing the tracked programme functions",
    imageWidth: 1600,
    imageHeight: 1000,
  },
  {
    slug: "world-fit",
    name: "World Fit",
    client: "World Fit Gym",
    category: "Ongoing digital partner",
    year: "2026 —",
    tagline:
      "The whole digital side of a growing Alexandria gym group, run by us.",
    summary:
      "World Fit doesn't keep a marketing team — we are it. That covers the web properties around the main brand, including a careers portal for hiring and a site for the Self Discovery sub-brand, alongside the membership and campaign collateral: VIP invitations, scannable membership cards, coach announcements and event artwork.",
    impact:
      "Every hire, campaign and sub-brand launches on-brand and on schedule, without the cost of an in-house team — and the Yacht Pilates experience grew straight out of that relationship.",
    highlights: [
      "Careers portal and sub-brand web properties",
      "VIP membership invitations and QR membership cards",
      "Coach and campaign artwork across channels",
      "Ongoing management — not a hand-over-and-leave build",
    ],
    facts: [
      { label: "Web properties", value: "3" },
      { label: "Engagement", value: "Ongoing" },
      { label: "Scope", value: "Digital + print" },
      { label: "Since", value: "2026" },
    ],
    tags: ["Brand & Content", "Websites & Platforms", "Growth Marketing"],
    icon: Dumbbell,
    status: "Client properties — some are private",
    logo: "/work/world-fit.png",
    logoWidth: 600,
    logoHeight: 198,
  },
];

export const featuredProject = projects[0];
export const otherProjects = projects.slice(1);
export const totalProjects = projects.length;
