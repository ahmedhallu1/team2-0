import { notFound } from "next/navigation";

/**
 * Any URL nothing else claims.
 *
 * The app has two root layouts — 2.0's in `(site)` and KUPHUB's in `kuphub` —
 * so there is no single layout for Next's built-in 404 to render inside, and
 * it would fall back to a bare unstyled page. Catching the rest here keeps a
 * mistyped 2.0 address on a 404 that still has 2.0's header and footer.
 */
export default function Missing() {
  notFound();
}
