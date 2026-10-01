/**
 * Everything kuphub.elevate2point0.com says about KUPHUB.
 *
 * Same house rule as the proposal: nothing here is invented. Products, prices,
 * options and app features are read off KUPHUB's own App Store and Google Play
 * listings (screenshots and descriptions, read 1 October 2026) and its public
 * feed; branches are the four the bio lists. Where we don't know something — a
 * dessert's name, a branch's opening hours — the page sends people to the app,
 * which does know, rather than guessing.
 */

export const site = {
  name: "KUPHUB",
  tagline: "Less is more",
  ownWords: "Premium Koffee & Kup To Go",
  city: "Alexandria",
  url: "https://kuphub.elevate2point0.com",
} as const;

export const stores = {
  appStore: "https://apps.apple.com/eg/app/kuphub-less-is-more/id6773118243",
  googlePlay: "https://play.google.com/store/apps/details?id=com.rmz.kuphub&hl=en",
  /**
   * Sends a phone to the right store; see app/kuphub/app/route.ts. `smart` is
   * the pretty address the QR code carries; `path` is what on-page links use,
   * because it resolves on the subdomain and on the main domain alike.
   */
  smart: "https://kuphub.elevate2point0.com/app",
  path: "/kuphub/app",
} as const;

export const social = {
  instagram: { handle: "@kuphub_", url: "https://www.instagram.com/kuphub_/" },
  /** The support address on the Google Play listing. */
  email: "kuphub.app@gmail.com",
} as const;

/* ------------------------------------------------------------------ */
/*  The board                                                         */
/* ------------------------------------------------------------------ */

export type MenuItem = {
  name: string;
  arabic: string;
  /** EGP. Absent where the app doesn't show us one. */
  price?: number;
  note?: string;
  tag?: string;
};

export type MenuGroup = {
  id: string;
  label: string;
  arabic: string;
  /** The line the board opens with. */
  line: string;
  items: MenuItem[];
};

/**
 * Prices are the ones the app lists. The app prices per branch, so the board
 * says so rather than pretending one number holds everywhere.
 */
export const menu: MenuGroup[] = [
  {
    id: "hot",
    label: "Hot",
    arabic: "مشروبات ساخنة",
    line: "Pulled short, poured properly.",
    items: [
      { name: "Turkish coffee", arabic: "قهوة تركي", price: 20, note: "The one Alexandria starts the day with." },
      { name: "Cappuccino", arabic: "كابتشينو", price: 35, note: "Espresso under a deep cap of foam." },
      { name: "Café Latte", arabic: "كافيه لاتيه", price: 38, note: "Espresso, a lot of steamed milk, a little art." },
    ],
  },
  {
    id: "iced",
    label: "Iced",
    arabic: "مشروبات باردة",
    line: "Built over ice, built to travel.",
    items: [
      { name: "Iced Latte", arabic: "آيس لاتيه", price: 40, note: "Chilled espresso with cold milk over ice." },
      { name: "Cold Brew", arabic: "كولد برو", price: 44, note: "Steeped slow, served cold." },
      { name: "Match & Mix", arabic: "ماتش آند ميكس", note: "Iced tea in seven flavours.", tag: "3 for 2" },
    ],
  },
  {
    id: "fresh",
    label: "Juice",
    arabic: "عصائر وسموذي",
    line: "Fruit, pressed and blended.",
    items: [
      { name: "Santarosa", arabic: "سانتا روزا", note: "New on the board.", tag: "New" },
      { name: "Fresh juices", arabic: "عصائر فريش", note: "The seasonal range, branch by branch." },
      { name: "Smoothies", arabic: "سموذي", note: "Thick, cold, and in the app." },
    ],
  },
  {
    id: "food",
    label: "Bites",
    arabic: "ساندويتشات وحلويات",
    line: "Something to go with it.",
    items: [
      { name: "Sandwiches", arabic: "ساندويتشات", note: "Made for the walk to work." },
      { name: "Desserts", arabic: "حلويات", note: "The other half of every good offer." },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Make it yours — the options the app offers on an Iced Latte        */
/* ------------------------------------------------------------------ */

export type Option = { id: string; label: string; price: number };

export const builder = {
  base: {
    name: "Iced Latte",
    arabic: "آيس لاتيه",
    price: 40,
    note: "Chilled espresso with cold milk over ice",
  },
  sizes: [
    { id: "s", label: "Small", price: 0 },
    { id: "m", label: "Medium", price: 10 },
    { id: "l", label: "Large", price: 24 },
  ] satisfies Option[],
  milks: [
    { id: "regular", label: "Regular", price: 0 },
    { id: "oat", label: "Oat", price: 10 },
    { id: "almond", label: "Almond", price: 12 },
  ] satisfies Option[],
  addons: [
    { id: "shot", label: "Extra shot", price: 8 },
    { id: "cream", label: "Whipped cream", price: 5 },
    { id: "caramel", label: "Caramel drizzle", price: 6 },
    { id: "vanilla", label: "Vanilla syrup", price: 5 },
    { id: "hazelnut", label: "Hazelnut syrup", price: 5 },
    { id: "chocolate", label: "Chocolate sauce", price: 6 },
  ] satisfies Option[],
} as const;

export type SizeId = (typeof builder.sizes)[number]["id"];
export type MilkId = (typeof builder.milks)[number]["id"];
export type AddonId = (typeof builder.addons)[number]["id"];

/* ------------------------------------------------------------------ */
/*  Match & Mix                                                        */
/* ------------------------------------------------------------------ */

export type Flavour = {
  id: string;
  name: string;
  arabic: string;
  /** The tea, in the glass. */
  color: string;
  /** A lighter tone for the swatch's highlight. */
  light: string;
};

/** The seven flavours, as the Match & Mix post lists them. */
export const flavours: Flavour[] = [
  { id: "lemon", name: "Lemon", arabic: "ليمون", color: "#e9c93a", light: "#f8e88a" },
  { id: "peach", name: "Peach", arabic: "خوخ", color: "#f08a5d", light: "#ffc2a1" },
  { id: "strawberry", name: "Strawberry", arabic: "فراولة", color: "#d8344a", light: "#ff8a98" },
  { id: "pineapple", name: "Pineapple", arabic: "أناناس", color: "#f2a524", light: "#ffd77a" },
  { id: "passion", name: "Passion fruit", arabic: "باشن فروت", color: "#8f3a86", light: "#d38acb" },
  { id: "blueberry", name: "Blueberry", arabic: "توت أزرق", color: "#4a55c9", light: "#9aa3ff" },
  { id: "vanilla", name: "Vanilla", arabic: "فانيليا", color: "#e8d3a8", light: "#fff3d8" },
];

/* ------------------------------------------------------------------ */
/*  Branches                                                           */
/* ------------------------------------------------------------------ */

export type Branch = {
  id: string;
  name: string;
  detail: string;
  arabic: string;
  /** Position on the schematic map, as % of its box. Not to scale. */
  at: { x: number; y: number };
  maps: string;
};

const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/** The four addresses, as the bio and the hiring post list them. */
export const branches: Branch[] = [
  {
    id: "shatby",
    name: "El Shatby",
    detail: "Kobri El Gamaa St.",
    arabic: "الشاطبي — شارع كوبري الجامعة",
    at: { x: 22, y: 40 },
    maps: maps("KUPHUB El Shatby Alexandria"),
  },
  {
    id: "smouha",
    name: "Smouha",
    detail: "Opposite Mubarak Olympic Club",
    arabic: "سموحة — أمام نادي مبارك الأوليمبي",
    at: { x: 58, y: 70 },
    maps: maps("KUPHUB Smouha Alexandria"),
  },
  {
    id: "club",
    name: "Smouha Club",
    detail: "Green Corner",
    arabic: "نادي سموحة — ممر جرين كورنر",
    at: { x: 47, y: 80 },
    maps: maps("KUPHUB Smouha Club Green Corner Alexandria"),
  },
  {
    id: "kamel",
    name: "Mostafa Kamel",
    detail: "Omarat El Zobat, Edmond Fremon",
    arabic: "مصطفى كامل — عمارات الضباط",
    at: { x: 74, y: 44 },
    maps: maps("KUPHUB Mostafa Kamel Alexandria"),
  },
];

/* ------------------------------------------------------------------ */
/*  The app                                                            */
/* ------------------------------------------------------------------ */

export type AppFeature = {
  id: string;
  title: string;
  line: string;
  screen: string;
  alt: string;
};

/** Each one is a line from the store listing, paired with its own screenshot. */
export const appFeatures: AppFeature[] = [
  {
    id: "order",
    title: "Order ahead",
    line: "Pickup at your branch or delivery to your door. Live tracking from placed to delivered.",
    screen: "/kup/app/home.webp",
    alt: "The KUPHUB app home screen: a greeting, the wallet balance, a live order tracker and the offers slider",
  },
  {
    id: "menu",
    title: "The whole board",
    line: "Hot, cold, smoothies, sandwiches and desserts — with your branch's prices.",
    screen: "/kup/app/menu.webp",
    alt: "The KUPHUB app menu: category circles for hot drinks, cold drinks, smoothies, sandwiches and desserts above the most popular drinks",
  },
  {
    id: "yours",
    title: "Make it yours",
    line: "Size, milk, sugar, ice and the extras. Your cup, your rules.",
    screen: "/kup/app/customize.webp",
    alt: "An Iced Latte in the KUPHUB app with size, milk and add-on options",
  },
  {
    id: "wallet",
    title: "KUPHUB Wallet",
    line: "Top up once, pay in a tap, earn rewards and cashback as you go.",
    screen: "/kup/app/wallet.webp",
    alt: "The KUPHUB Wallet screen showing the available balance, total orders and member-since date",
  },
  {
    id: "store",
    title: "The Cup Store",
    line: "Signature ceramic and glass cups, to carry KUPHUB past the counter.",
    screen: "/kup/app/cup-store.webp",
    alt: "The KUPHUB Cup Store with ceramic and glass categories and a glass cup",
  },
  {
    id: "checkout",
    title: "Pay your way",
    line: "Cash, card or wallet. Promo codes at checkout, three saved addresses.",
    screen: "/kup/app/checkout.webp",
    alt: "The KUPHUB checkout with delivery or pickup, an order summary and a delivery address",
  },
];

/** The four stages the in-app tracker walks through. */
export const trackerSteps = ["Placed", "Processing", "Ready", "Delivering"] as const;
