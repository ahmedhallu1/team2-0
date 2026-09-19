/**
 * Everything the KUPHUB × LinkUp proposal says about the two businesses.
 *
 * House rule for this file: nothing in it is invented. Every fact was read off
 * the public channels on 19–20 September 2026 — the two Instagram profiles, the
 * two Facebook pages, and a direct request to each domain — and the source is
 * named next to it. Where the brands describe themselves, we quote them rather
 * than paraphrase. There are no performance figures, no invented locations,
 * prices or claims, and nothing that could be contradicted in the meeting by
 * opening a phone.
 *
 * Concept work is kept in a separate shape (`ConceptPost`, `ConceptSpec`) and
 * is always labelled as a proposal on screen, never as existing client work.
 */

/* ------------------------------------------------------------------ */
/*  Brand facts                                                       */
/* ------------------------------------------------------------------ */

export type BrandKey = "kuphub" | "linkup";

export type BrandProfile = {
  key: BrandKey;
  name: string;
  /** The line the business uses for itself, verbatim. */
  ownWords: string;
  ownWordsSource: string;
  role: string;
  city: string;
  channels: { label: string; detail: string }[];
};

export const kuphub: BrandProfile = {
  key: "kuphub",
  name: "KUPHUB",
  ownWords: "Kuphub Premium Koffee & Kup To Go.",
  ownWordsSource: "Facebook page intro",
  role: "Coffee, iced tea and desserts to go — four addresses in Alexandria.",
  city: "Alexandria",
  channels: [
    { label: "Instagram", detail: "@kuphub_ · 3,302 followers" },
    { label: "Facebook", detail: "Kuphub · 1.9K followers · listed as a Café" },
  ],
};

export const linkup: BrandProfile = {
  key: "linkup",
  name: "LinkUp Egypt",
  ownWords:
    "Creating Sustainable Packaging Solutions. Specialized in Reusable PP Cups, IML Packaging & Circular Economy Programs.",
  ownWordsSource: "Facebook page intro",
  role: "Cups and packaging, printed with the buyer's own logo — no minimum order.",
  city: "Alexandria — Smouha",
  channels: [
    { label: "Facebook", detail: "Linkupegypt · 36K followers" },
    { label: "Instagram", detail: "@linkupegy · 490 followers · last post June 2024" },
  ],
};

/** KUPHUB's four addresses, as the bio and the hiring post list them. */
export const kuphubBranches = [
  {
    name: "Smouha",
    detail: "Opposite Mubarak Olympic Club",
    arabic: "سموحة — أمام نادي مبارك الأوليمبي",
  },
  {
    name: "Smouha Club",
    detail: "Green Corner",
    arabic: "نادي سموحة — ممر جرين كورنر",
  },
  {
    name: "Mostafa Kamel",
    detail: "Omarat El Zobat, Edmond Fremon",
    arabic: "مصطفى كامل — عمارات الضباط",
  },
  { name: "El Shatby", detail: "Kobri El Gamaa St.", arabic: "الشاطبي — شارع كوبري الجامعة" },
] as const;

/** Products and offers seen on the KUPHUB feed. Prices are theirs, not ours. */
export const kuphubMenu = [
  {
    group: "Koffee",
    items: [
      { name: "Turkish coffee", note: "Their own price point — 20 EGP" },
      { name: "Hot & cold coffee", note: "Served in PP cups" },
    ],
  },
  {
    group: "Match & Mix — iced tea",
    items: [
      { name: "Seven flavours", note: "Lemon · peach · strawberry · pineapple · passion fruit · blueberry · vanilla" },
      { name: "Any three for the price of two", note: "Smouha Club & Edmond Fremon" },
    ],
  },
  {
    group: "Juice",
    items: [
      { name: "Santarosa", note: "A seasonal launch on the feed" },
      { name: "Fresh juice", note: "The Smouha Club range" },
    ],
  },
  { group: "Dessert", items: [{ name: "Desserts", note: "The other half of every offer" }] },
] as const;

/** Campaigns the feed already runs. Used to show the system, not to replace it. */
export const kuphubCampaigns = [
  {
    title: "Business Morning",
    line: "7am – 5pm. Start the day right.",
    arabic: "ابدأ يومك صح مع كاب هب",
  },
  {
    title: "Ibn El Nady",
    line: "With Smouha Sporting Club. Thursday, Friday, Saturday.",
    arabic: "عرض ابن النادي",
  },
  { title: "Match & Mix", line: "Any three flavours, pay for two.", arabic: "اختار 3 نكهات وادفع تمن 2" },
] as const;

/** LinkUp's product facts, all taken off their own product graphics. */
export type ConceptSpec = { label: string; value: string };

export const linkupProducts = [
  {
    name: "Reusable PP",
    sub: "The core range",
    specs: [
      { label: "Material", value: "PP5, food grade" },
      { label: "Use", value: "Hot & cold · microwave safe" },
      { label: "Life", value: "Designed for repeat use" },
    ] satisfies ConceptSpec[],
  },
  {
    name: "Rice-husk composite",
    sub: "Announced 12 August as a first for Egypt and the Middle East",
    specs: [
      { label: "Base", value: "Rice husk composite" },
      { label: "Position", value: "Circular economy range" },
      { label: "Status", value: "Their claim, their post" },
    ] satisfies ConceptSpec[],
  },
  {
    name: "IML printing",
    sub: "In-mould labelling",
    specs: [
      { label: "Finish", value: "Premium graphics, in the mould" },
      { label: "Durability", value: "Print that lasts the cup" },
      { label: "Minimum", value: "None — their own bio" },
    ] satisfies ConceptSpec[],
  },
] as const;

export const linkupSizes = ["6 oz", "8 oz", "12 oz", "16 oz"] as const;

/** Lines LinkUp already uses on its own artwork. We'd build on these. */
export const linkupLines = [
  "Sustainability starts with one cup.",
  "Sustainable by choice. Better by design.",
  "Designed for reuse. Built for a greener future.",
] as const;

/* ------------------------------------------------------------------ */
/*  The audit                                                         */
/* ------------------------------------------------------------------ */

export type Observation = {
  id: string;
  /** What is true today. */
  title: string;
  /** The evidence, phrased so it can be checked live in the room. */
  seen: string;
  /** What that makes possible — never a criticism, always a next step. */
  opportunity: string;
  /** Which brand it belongs to. */
  brand: BrandKey | "both";
  /** Where we read it. */
  source: string;
};

export const observations: Observation[] = [
  {
    id: "domains",
    title: "Two addresses, no doors",
    seen: "kuphub.com is registered and answers with a 522 — the address exists, nothing is behind it. linkupegypt.com loads a page that says “Launching Soon”. Both are printed on the profiles people are sent to.",
    opportunity:
      "Two websites, on two domains you already pay for. Nothing to buy first.",
    brand: "both",
    source: "Direct request to both domains, 20 Sep 2026",
  },
  {
    id: "audience",
    title: "Thirty-six thousand people, one channel",
    seen: "LinkUp has 36K followers on Facebook. On Instagram it has 490, and the last post is from June 2024.",
    opportunity:
      "The audience is already built. It is standing in one room out of three.",
    brand: "linkup",
    source: "Facebook & Instagram profiles",
  },
  {
    id: "identity",
    title: "One company, three introductions",
    seen: "LinkUp arrives as “PAPER KUP” on Instagram, “COVERING — ALL PACKING SOLUTIONS” on the Facebook profile, and “Creating Sustainable Packaging Solutions” on the cover — three marks, three descriptions, two colour stories.",
    opportunity:
      "One identity system, so a buyer who meets you twice meets the same company.",
    brand: "linkup",
    source: "Both profile marks and the Facebook cover",
  },
  {
    id: "tagline",
    title: "The line is already right",
    seen: "“Less is more” sits under the KUPHUB mark. It is a good line — specific, confident, and the opposite of how most coffee brands talk.",
    opportunity:
      "The rest of the brand hasn't been given the chance to agree with it yet. That's the whole design brief, and it's yours already.",
    brand: "kuphub",
    source: "KUPHUB logo",
  },
  {
    id: "rice",
    title: "A first, announced once",
    seen: "The rice-husk cup went out as a post on 12 August — described there as a first for Egypt and the Middle East. There is no page for it, no spec sheet, nowhere for a buyer to land.",
    opportunity:
      "A product story that keeps selling after the post has scrolled away.",
    brand: "linkup",
    source: "Facebook, 12 Aug 2026",
  },
  {
    id: "club",
    title: "A partnership doing a coupon's job",
    seen: "“Ibn El Nady”, with Smouha Sporting Club, runs as a weekend discount. The club, the members and the ground are all real assets already in hand.",
    opportunity:
      "The same partnership, run as a campaign with a name, a look and a season.",
    brand: "kuphub",
    source: "KUPHUB feed, August–September 2026",
  },
  {
    id: "offers",
    title: "Every post is an offer",
    seen: "The feed posts consistently and the offers are genuinely good. Almost all of them are price-led, and the photography that does appear — the cup on the green wall, the coffee and the cake — is the strongest work on the page.",
    opportunity:
      "Keep the offers. Give them a brand to sit inside, and let the photography lead more often.",
    brand: "kuphub",
    source: "Instagram grid",
  },
  {
    id: "ordering",
    title: "The link in the bio is a Drive folder",
    seen: "Four addresses, a full menu and a live offer calendar all reach the customer through captions and a shared folder.",
    opportunity:
      "One address that holds the menu, the branches and the offer that's running today.",
    brand: "kuphub",
    source: "Instagram bio",
  },
];

/* ------------------------------------------------------------------ */
/*  Concept work — clearly speculative, always labelled                */
/* ------------------------------------------------------------------ */

export type ConceptPost = {
  id: string;
  /** The content pillar this post belongs to. */
  pillar: "Product" | "Offer" | "Place" | "People" | "Campaign";
  kind: string;
  /** Headline as it would be set. */
  headline: string;
  /** Arabic line, where the real post carries one. */
  arabic?: string;
  /** Supporting line. */
  sub?: string;
  /** Layout the tile renders. */
  layout:
    | "type"
    | "product"
    | "offer"
    | "reel"
    | "branch"
    | "campaign"
    | "menu"
    | "quote"
    | "spec";
  /** Tonal weight inside the KUPHUB palette. */
  tone: "deep" | "cream" | "amber" | "ink";
};

/**
 * A proposed KUPHUB week. Same offers, same products, same branches as the
 * live feed — rebuilt as one system instead of nine separate graphics.
 */
export const kuphubFeed: ConceptPost[] = [
  {
    id: "less",
    pillar: "Campaign",
    kind: "Typographic",
    headline: "Less is more",
    sub: "The line, used as a layout",
    layout: "type",
    tone: "deep",
  },
  {
    id: "turkish",
    pillar: "Product",
    kind: "Product",
    headline: "Turkish",
    sub: "20 EGP",
    arabic: "قهوة تركي",
    layout: "product",
    tone: "cream",
  },
  {
    id: "morning",
    pillar: "Offer",
    kind: "Offer",
    headline: "Business Morning",
    sub: "7am — 5pm",
    arabic: "ابدأ يومك صح",
    layout: "offer",
    tone: "amber",
  },
  {
    id: "match",
    pillar: "Product",
    kind: "Range",
    headline: "Match & Mix",
    sub: "Seven flavours. Three for two.",
    layout: "menu",
    tone: "ink",
  },
  {
    id: "nady",
    pillar: "Campaign",
    kind: "Partnership",
    headline: "Ibn El Nady",
    arabic: "عرض ابن النادي",
    sub: "Smouha Sporting Club",
    layout: "campaign",
    tone: "deep",
  },
  {
    id: "reel",
    pillar: "People",
    kind: "Reel cover",
    headline: "The 40-second pour",
    sub: "Reel",
    layout: "reel",
    tone: "ink",
  },
  {
    id: "green",
    pillar: "Place",
    kind: "Branch",
    headline: "Green Corner",
    sub: "Smouha Club",
    layout: "branch",
    tone: "deep",
  },
  {
    id: "quote",
    pillar: "People",
    kind: "Community",
    headline: "“Kup To Go”",
    sub: "Their words, set properly",
    layout: "quote",
    tone: "cream",
  },
  {
    id: "santarosa",
    pillar: "Product",
    kind: "Launch",
    headline: "Santarosa",
    sub: "New on the board",
    layout: "product",
    tone: "amber",
  },
];

/** The same information, arranged the two ways. Used by the comparison. */
export const comparison = {
  subject: "Business Morning",
  today: {
    label: "Today",
    note: "Reconstructed from the public feed — the same offer, the same elements, arranged the way the channel arranges them now.",
  },
  proposed: {
    label: "One possible direction",
    note: "The same offer, the same price, the same two languages — inside a system that repeats next week.",
  },
} as const;

/* ------------------------------------------------------------------ */
/*  What 2.0 would run                                                */
/* ------------------------------------------------------------------ */

export type EnginePillar = {
  id: string;
  title: string;
  line: string;
  items: string[];
  /** Which of the two businesses it serves — both, unless noted. */
  applies: BrandKey[];
};

export const engine: EnginePillar[] = [
  {
    id: "identity",
    title: "Brand & content",
    line: "One system, applied everywhere either name appears.",
    items: [
      "Identity system & usage rules",
      "Art direction & photography",
      "Copy, in Arabic and English",
      "Campaign concepts",
    ],
    applies: ["kuphub", "linkup"],
  },
  {
    id: "social",
    title: "Social management",
    line: "A calendar that runs, not a queue that empties.",
    items: [
      "Monthly content calendar",
      "Design, reels & stories",
      "Publishing across both channels",
      "Comments, DMs & community",
    ],
    applies: ["kuphub", "linkup"],
  },
  {
    id: "web",
    title: "Websites",
    line: "Two sites, on the two domains already registered.",
    items: [
      "KUPHUB — menu, branches, offers",
      "LinkUp — products, specs, quote requests",
      "Hosting, updates and changes",
      "Analytics & search foundations",
    ],
    applies: ["kuphub", "linkup"],
  },
  {
    id: "growth",
    title: "Growth",
    line: "Reach the people already looking for both of you.",
    items: [
      "Meta campaigns by branch",
      "Search visibility for “paper cups Egypt”",
      "Seasonal promotions",
      "Reporting that a decision can be made from",
    ],
    applies: ["kuphub", "linkup"],
  },
  {
    id: "ops",
    title: "Automation",
    line: "Mostly for LinkUp, where the enquiries are the business.",
    items: [
      "WhatsApp enquiry routing",
      "Quote requests into one place",
      "Follow-up that doesn't rely on memory",
      "A record of who asked for what",
    ],
    applies: ["linkup"],
  },
];

/**
 * The engagement, mapped onto the four stages already published on
 * elevate2point0.com/process so the proposal and the site agree.
 */
export const engagement = [
  {
    n: "01",
    stage: "Discover",
    title: "Read everything",
    body: "Both channels, both domains, the branches, the buyers. A week, and a written read-out — most of which is already on this page.",
  },
  {
    n: "02",
    stage: "Strategize",
    title: "Build the system",
    body: "One identity system per brand, a content architecture, and the shape of both websites. Signed off before anything is published.",
  },
  {
    n: "03",
    stage: "Execute",
    title: "Make and ship",
    body: "The month's content, the photography, the two sites. KUPHUB's goes live first — it's the simpler build and the faster win.",
  },
  {
    n: "04",
    stage: "Scale",
    title: "Run and sharpen",
    body: "Publishing, community, campaigns and paid. Monthly reporting, and the next quarter planned off what actually moved.",
  },
] as const;

/** Slugs from `@/lib/work` that earn their place on this page. */
export const proofSlugs = ["yacht-pilates", "sodio", "world-fit"] as const;
