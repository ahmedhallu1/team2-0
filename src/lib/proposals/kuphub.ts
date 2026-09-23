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

/** Lead times, exactly as their own graphic prints them. */
export const linkupLeadTimes = [
  { tier: "Fast track", days: "4 days", note: "Urgent orders" },
  { tier: "Standard", days: "8 days", note: "Regular orders" },
  { tier: "Economy", days: "14 days", note: "Large orders" },
] as const;

/** What they already offer around the cup itself, from the same post. */
export const linkupServices = [
  "Photo session",
  "Product launch",
  "Brand presentation",
  "Menu design",
  "Social media content",
  "Samples & prototypes",
] as const;

/**
 * The same company, introduced four different ways.
 *
 * Each of these is a different lockup on a different surface, all currently
 * live. This is the whole argument for the rebrand, and it is entirely theirs
 * — we are only putting the four next to each other.
 */
export const linkupLockups = [
  {
    mark: "LINKUP",
    descriptor: "PAPER KUP",
    where: "Instagram profile",
    palette: "Black & amber",
  },
  {
    mark: "LINKUP",
    descriptor: "COVERING — ALL PACKING SOLUTIONS",
    where: "Facebook profile, and the custom-print posts",
    palette: "Black & amber",
  },
  {
    mark: "LINKUP®",
    descriptor: "ECO SOLUTIONS",
    where: "The reusable-cup range posts",
    palette: "Green & white",
  },
  {
    mark: "LINKUP",
    descriptor: "EGYPT — Creating Sustainable Packaging Solutions",
    where: "Facebook cover",
    palette: "Green & tan",
  },
] as const;

/** Lines LinkUp already uses on its own artwork. We'd build on these. */
export const linkupLines = [
  "Sustainability starts with one cup.",
  "Sustainable by choice. Better by design.",
  "Designed for reuse. Built for a greener future.",
  "Your brand, our passion.",
  "Let's build a greener future together.",
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

/**
 * Five, deliberately.
 *
 * Two more were cut rather than trimmed: LinkUp's competing lockups and the
 * Smouha partnership each now have a chapter of their own, and hearing the
 * same observation twice makes the audit read as padding.
 */
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

/* ------------------------------------------------------------------ */
/*  What is running now                                               */
/* ------------------------------------------------------------------ */

export type CurrentPost = {
  src: string;
  alt: string;
  /** When it was published, as the channel shows it. */
  date: string;
  /** What the frame is doing, described plainly. Never a verdict on taste. */
  note: string;
  width: number;
  height: number;
};

/**
 * Real posts, downloaded from the public channels.
 *
 * Shown to the people who published them, in a document prepared for them —
 * their own work, not repurposed for anyone else. The notes describe what each
 * frame is carrying, which is a design observation, and stop there. Nothing
 * here grades the work, and nothing claims a post was generated unless the
 * channel itself says so.
 */
export const kuphubCurrent: CurrentPost[] = [
  {
    src: "/proposals/kuphub/current/business-morning-2sep.jpg",
    alt: "KUPHUB's Business Morning post: a storefront scene behind a headline, three numbered offers, a cup and a brownie, an hours badge and a branch line",
    date: "2 September",
    note: "Three offers, two languages, the hours, a branch, five badges and the social handles — all in one frame.",
    width: 360,
    height: 640,
  },
  {
    src: "/proposals/kuphub/current/ibn-el-nady-12aug.jpg",
    alt: "KUPHUB's Ibn El Nady post: the Smouha Sporting Club crest on a blue stadium background with a 50% badge and three drinks",
    date: "12 August",
    note: "The club partnership, in the club's blue rather than KUPHUB's green.",
    width: 360,
    height: 640,
  },
  {
    src: "/proposals/kuphub/current/bogo-19jul.jpg",
    alt: "KUPHUB's buy-one-get-one post: large BUY 1 GET 1 type over coffee and dessert photography",
    date: "19 July",
    note: "A strong offer, set in a different type system from the one before it.",
    width: 360,
    height: 640,
  },
  {
    src: "/proposals/kuphub/current/match-mix-10aug.jpg",
    alt: "KUPHUB's Match & Mix post showing seven iced-tea flavours and a three-for-two offer",
    date: "10 August",
    note: "Seven flavours and a price rule, competing for the same space.",
    width: 360,
    height: 640,
  },
  {
    src: "/proposals/kuphub/current/away-27aug.jpg",
    alt: "KUPHUB's 'we'll be away' post: a single green cup photographed against a plain wall",
    date: "27 August",
    note: "The quietest frame on the feed, and the one that looks most like a brand.",
    width: 360,
    height: 640,
  },
  {
    src: "/proposals/kuphub/current/club-juice-18sep.jpg",
    alt: "KUPHUB's Smouha club juice post with fruit imagery and a Good Drinks Better Games headline",
    date: "18 September",
    note: "A third visual world again, for the same club, five weeks later.",
    width: 360,
    height: 640,
  },
];

export const linkupCurrent: CurrentPost[] = [
  {
    src: "/proposals/linkup/current/post-a.jpg",
    alt: "LinkUp's custom-print post: a photo-studio scene with a blank cup on a plinth, lead times and a row of sample cups",
    date: "Custom print",
    note: "Under the LINKUP COVERING mark. Real information — one-cup minimum, 4/8/14-day lead times — inside a generated studio scene.",
    width: 414,
    height: 414,
  },
  {
    src: "/proposals/linkup/current/post-b.jpg",
    alt: "LinkUp's reusable cup range post showing PP and rice-husk collections against a leafy background",
    date: "Reusable range",
    note: "Under a different mark again — LINKUP ECO SOLUTIONS, in green.",
    width: 414,
    height: 414,
  },
  {
    src: "/proposals/linkup/current/post-c.jpg",
    alt: "A LinkUp product post showing a branded reusable cup",
    date: "Product",
    note: "Good product photography, with no system around it.",
    width: 414,
    height: 414,
  },
  {
    src: "/proposals/linkup/current/post-d.jpg",
    alt: "A LinkUp post showing branded cups for a client",
    date: "Client work",
    note: "The strongest asset they have — other people's brands on their cups.",
    width: 414,
    height: 414,
  },
];

/* ------------------------------------------------------------------ */
/*  Campaigns                                                          */
/* ------------------------------------------------------------------ */

export type Campaign = {
  id: string;
  name: string;
  arabic?: string;
  /** One line: what it is. */
  line: string;
  /** Why it is possible — always something both businesses already have. */
  because: string;
  /** What would actually be made. */
  outputs: string[];
  season: string;
  /** Which businesses it runs across. */
  brands: BrandKey[];
};

/**
 * Campaigns, not posts.
 *
 * Every one of these is built out of something the two businesses already
 * own — the club partnership, the rice-husk range, the four branches, the
 * no-minimum print. None of it needs a new product or a new partner to start.
 *
 * The first is the one to lead with: it is the only idea on this page that
 * only works *because* the same owner has both companies.
 */
export const campaigns: Campaign[] = [
  {
    id: "one-cup",
    name: "One Cup",
    arabic: "كوباية واحدة",
    line: "Smouha members drink from a reusable KUPHUB cup that LinkUp makes. Bring it back, it gets refilled cheaper.",
    because:
      "LinkUp already manufactures reusable PP and rice-husk cups with no minimum order. KUPHUB already has a club partnership and a branch inside the ground. Nobody has to buy anything new to run this.",
    outputs: [
      "A club-edition cup — LinkUp's rice husk, KUPHUB's print",
      "Refill pricing for anyone carrying one",
      "Launch film shot at Green Corner",
      "In-ground signage and a members' card",
      "A counter: cups saved, published monthly",
    ],
    season: "Launch with the season",
    brands: ["kuphub", "linkup"],
  },
  {
    id: "morning",
    name: "Business Morning",
    arabic: "ابدأ يومك صح",
    line: "The offer that already runs, given a fixed frame, a fixed slot and a reason to be there.",
    because:
      "It is already the most repeated post on the feed. It has never had a look it keeps.",
    outputs: [
      "One template, filled in weekly",
      "A takeaway sleeve for the 7–9am window",
      "Office-building drops around Smouha",
    ],
    season: "Weekdays, all year",
    brands: ["kuphub"],
  },
  {
    id: "roasters",
    name: "Kup Roasters",
    line: "The coffee itself, treated as the product — origin, roast, the people making it.",
    because:
      "They already call themselves Coffee Roasters on half their artwork. The story exists and has never been told.",
    outputs: [
      "A short film per branch",
      "Bean cards customers can take",
      "The barista series",
    ],
    season: "Quarterly",
    brands: ["kuphub"],
  },
  {
    id: "your-brand",
    name: "Your Brand, Our Passion",
    line: "LinkUp's own line, run as a campaign: one customer's cup, start to finish, every month.",
    because:
      "It is already written on their artwork, and their best asset is other people's brands on their cups.",
    outputs: [
      "A monthly customer story",
      "The mockup service, shown as a service",
      "A sample pack a buyer can request in one tap",
    ],
    season: "Monthly",
    brands: ["linkup"],
  },
];

/** A month of content, as the calendar would actually be built. */
export const contentMonth = [
  { week: "Week 1", kuphub: "Product — the Turkish, shot properly", linkup: "Customer story" },
  { week: "Week 2", kuphub: "Offer — Business Morning", linkup: "Spec explainer — PP vs rice husk" },
  { week: "Week 3", kuphub: "Place — a branch film", linkup: "Behind the mould — IML printing" },
  { week: "Week 4", kuphub: "People — the baristas", linkup: "Sustainability — the counter" },
] as const;
