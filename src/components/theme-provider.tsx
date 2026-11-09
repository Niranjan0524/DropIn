"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ThemePreference = "system" | "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  cycleTheme: () => void;
};

const STORAGE_KEY = "dropin-theme";
const preferences: ThemePreference[] = ["system", "light", "dark"];
const ThemeContext = createContext<ThemeContextValue | null>(null);
const listeners = new Set<() => void>();
let memoryPreference: ThemePreference = "system";

function applyTheme(preference: ThemePreference) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolvedTheme =
    preference === "system" ? (prefersDark ? "dark" : "light") : preference;

  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;
}

function readPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    memoryPreference = preferences.includes(stored as ThemePreference)
      ? (stored as ThemePreference)
      : "system";
    return memoryPreference;
  } catch {
    return memoryPreference;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useSyncExternalStore<ThemePreference>(
    subscribe,
    readPreference,
    () => "system",
  );

  useEffect(() => {
    applyTheme(preference);

    if (preference !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => applyTheme("system");
    media.addEventListener("change", updateTheme);
    return () => media.removeEventListener("change", updateTheme);
  }, [preference]);

  const cycleTheme = useCallback(() => {
    const current = readPreference();
    const currentIndex = preferences.indexOf(current);
    const next = preferences[(currentIndex + 1) % preferences.length];
    memoryPreference = next;

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Keep the current tab usable when browser storage is unavailable.
    }
    for (const listener of listeners) listener();
    applyTheme(next);
  }, []);

  const value = { preference, cycleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider.");
  return context;
}
