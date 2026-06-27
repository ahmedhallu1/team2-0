export type Partner = {
  name: string;
  /** Path under /public */
  logo: string;
  width: number;
  height: number;
  /** What 2.0 does for them */
  blurb: string;
  /** Short category chip */
  tag?: string;
  url?: string;
};

export const partners: Partner[] = [
  {
    name: "World Fit",
    logo: "/partners/world-fit.png",
    width: 600,
    height: 198,
    tag: "Gym group",
    blurb:
      "Website design, build and ongoing management for a growing gym group — from the main site to careers and sub-brand pages.",
    url: "https://worldfitgym.info",
  },
];
