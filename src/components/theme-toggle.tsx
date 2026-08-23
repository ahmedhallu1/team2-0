"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { clsx } from "@/lib/clsx";

type Theme = "light" | "dark";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

/**
 * A lime ring that leaves the control and fades — the fallback origin cue for
 * browsers without View Transitions. It is deliberately *not* used alongside
 * the circular reveal: during a transition the page is replaced by static
 * snapshots, so a live element added here would simply freeze.
 */
function ping(x: number, y: number) {
  const ring = document.createElement("span");
  ring.className = "theme-ping";
  ring.setAttribute("aria-hidden", "true");
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  document.body.append(ring);
  const anim = ring.animate(
    [
      { transform: "scale(0.4)", opacity: 0.9 },
      { transform: "scale(14)", opacity: 0 },
    ],
    { duration: 620, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
  );
  anim.finished.catch(() => {}).finally(() => ring.remove());
}

function resolveTheme(): Theme {
  const el = document.documentElement;
  if (el.classList.contains("light")) return "light";
  if (el.classList.contains("dark")) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Re-render when the OS preference or the <html> theme class changes. */
function subscribe(callback: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  const mo = new MutationObserver(callback);
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => {
    mq.removeEventListener("change", callback);
    mo.disconnect();
  };
}

/**
 * The theme swaps behind a circular reveal that grows from this control, so
 * the new surface arrives from the thing the visitor just pressed. Falls back
 * to an instant swap where View Transitions are unavailable or unwanted; text
 * is never mid-transition unreadable because both states are fully painted.
 */
export function ThemeToggle({ className }: { className?: string }) {
  // null on the server / first paint → render a neutral placeholder, no flash.
  const theme = useSyncExternalStore(subscribe, resolveTheme, () => null);

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const apply = () => {
      const el = document.documentElement;
      el.classList.remove("light", "dark");
      el.classList.add(next);
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* storage unavailable — class change alone still applies the theme */
      }
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      apply();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const doc = document as ViewTransitionDocument;
    if (typeof doc.startViewTransition !== "function") {
      // No circular reveal here, so the ring carries the origin instead.
      ping(x, y);
      apply();
      return;
    }

    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const root = document.documentElement;
    root.style.setProperty("--vt-x", `${x}px`);
    root.style.setProperty("--vt-y", `${y}px`);
    root.style.setProperty("--vt-r", `${radius}px`);
    root.classList.add("theme-swapping");
    const transition = doc.startViewTransition(apply);
    transition.finished
      .catch(() => {})
      .finally(() => root.classList.remove("theme-swapping"));
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={clsx(
        "theme-toggle inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-2 hover:text-ink",
        className,
      )}
    >
      <span className="theme-toggle__icon">
        {theme === null ? (
          <span className="block h-[18px] w-[18px]" aria-hidden />
        ) : isDark ? (
          <Sun size={18} aria-hidden />
        ) : (
          <Moon size={18} aria-hidden />
        )}
      </span>
    </button>
  );
}
