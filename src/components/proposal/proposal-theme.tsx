"use client";

import { useEffect } from "react";

/**
 * Marks the document while a proposal route is mounted.
 *
 * The proposal is art-directed in the clients' colours and does not follow the
 * site's light/dark theme, so the ground behind it has to change too —
 * otherwise iOS rubber-band overscroll reveals a strip of the marketing site's
 * black above a deep-green page. Setting it on <html> rather than on a wrapper
 * is what reaches the overscroll area at all.
 *
 * Removed on unmount, so navigating back to the site restores its own theme.
 */
export function ProposalTheme() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("proposal-route");
    return () => root.classList.remove("proposal-route");
  }, []);

  return null;
}
