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
export function ProposalTheme({ ground }: { ground?: string } = {}) {
  useEffect(() => {
    const root = document.documentElement;
    // `ground` names a second class for proposals that aren't on KUPHUB's
    // forest — see `html.proposal-route--*` in globals.css.
    const classes = ["proposal-route", ...(ground ? [`proposal-route--${ground}`] : [])];
    root.classList.add(...classes);
    return () => root.classList.remove(...classes);
  }, [ground]);

  return null;
}
