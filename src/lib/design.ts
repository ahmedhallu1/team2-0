export type DesignPiece = {
  src: string;
  alt: string;
  /** The brand the work was made for. */
  brand: string;
  /** What the piece is. */
  caption: string;
};

/**
 * A cut of the day-to-day brand and content work — the campaigns, product
 * features and content series that never become a "platform" but are most of
 * what a brand actually publishes. Deliberately a selection, not an archive.
 */
export const designPieces: DesignPiece[] = [
  {
    src: "/work/design/rose-berry-gift-set.jpg",
    alt: "Rose Berry gift set — an open pink makeup box with mirror, styled among blossom",
    brand: "Rose Berry",
    caption: "Gift-set launch creative",
  },
  {
    src: "/work/design/rose-berry-golden-box.jpg",
    alt: "The Rose Berry Golden Box — an open makeup case shot against dark gold fluting",
    brand: "Rose Berry",
    caption: "Golden Box campaign",
  },
  {
    src: "/work/design/rose-berry-queen.jpg",
    alt: "A model wearing a crown beside Arabic campaign copy reading 'wake up a queen every morning'",
    brand: "Rose Berry",
    caption: "“Wake up a queen” campaign",
  },
  {
    src: "/work/design/rose-berry-national-day.jpg",
    alt: "A green Saudi National Day layout with the full Rose Berry product range laid out",
    brand: "Rose Berry",
    caption: "Saudi National Day offer",
  },
  {
    src: "/work/design/rose-berry-bridal-box.jpg",
    alt: "A bride holding a bouquet beside the Rose Berry Pink Box bridal makeup set",
    brand: "Rose Berry",
    caption: "Bridal Pink Box",
  },
  {
    src: "/work/design/rose-berry-makeup-kit.jpg",
    alt: "An open Rose Berry makeup kit with brushes and palettes, styled with blossom",
    brand: "Rose Berry",
    caption: "Product feature — full kit",
  },
  {
    src: "/work/design/vherb-bikini-mask.jpg",
    alt: "The VHerb Bikini Mask skincare set on a soft pink set with a red sphere",
    brand: "VHerb Skincare",
    caption: "Bikini Mask launch",
  },
  {
    src: "/work/design/vherb-range.jpg",
    alt: "The VHerb skincare range arranged on pink plinths",
    brand: "VHerb Skincare",
    caption: "Range on set",
  },
  {
    src: "/work/design/food-content-series.jpg",
    alt: "An overhead food shot arranged around a large letter R, from an alphabet content series",
    brand: "Food & lifestyle",
    caption: "Alphabet content series",
  },
];

export const totalDesignPieces = designPieces.length;
