"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

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

export function ThemeToggle({ className }: { className?: string }) {
  // null on the server / first paint → render a neutral placeholder, no flash.
  const theme = useSyncExternalStore(subscribe, resolveTheme, () => null);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const el = document.documentElement;
    el.classList.remove("light", "dark");
    el.classList.add(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable — class change alone still applies the theme */
    }
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-2 hover:text-ink " +
        (className ?? "")
      }
    >
      {theme === null ? (
        <span className="h-[18px] w-[18px]" aria-hidden />
      ) : isDark ? (
        <Sun size={18} aria-hidden />
      ) : (
        <Moon size={18} aria-hidden />
      )}
    </button>
  );
}
