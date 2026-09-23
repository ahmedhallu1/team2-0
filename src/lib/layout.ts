/**
 * The shared spatial system. Every page composes from the same three measures
 * so the editorial grid reads as one system across routes.
 */

/** Standard content column — headings, copy, most sections. */
export const shell = "mx-auto w-full max-w-[78rem] px-5 sm:px-8 xl:px-12";

/** Comfortable reading measure for long-form paragraphs. */
export const measure = "max-w-[42rem]";

/** Vertical rhythm for a standard section. */
export const sectionY = "py-20 sm:py-24 lg:py-32";

/**
 * Tighter rhythm for the proposal routes. The page is presented by scrolling
 * through it in a meeting, where the site's generous section spacing turns
 * into seconds of empty screen between every point being made.
 */
export const proposalY = "py-14 sm:py-16 lg:py-20";
