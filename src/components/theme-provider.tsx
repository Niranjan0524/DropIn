"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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

function applyTheme(preference: ThemePreference) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolvedTheme =
    preference === "system" ? (prefersDark ? "dark" : "light") : preference;

  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;
}

function readPreference(): ThemePreference {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return preferences.includes(stored as ThemePreference)
    ? (stored as ThemePreference)
    : "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPreference(readPreference());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    applyTheme(preference);

    if (preference !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => applyTheme("system");
    media.addEventListener("change", updateTheme);
    return () => media.removeEventListener("change", updateTheme);
  }, [preference, ready]);

  const cycleTheme = useCallback(() => {
    const current = readPreference();
    const currentIndex = preferences.indexOf(current);
    const next = preferences[(currentIndex + 1) % preferences.length];

    window.localStorage.setItem(STORAGE_KEY, next);
    setPreference(next);
    applyTheme(next);
  }, []);

  const value = useMemo(() => ({ preference, cycleTheme }), [preference, cycleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider.");
  return context;
}
