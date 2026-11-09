"use client";

import { useTheme } from "@/components/theme-provider";
import { Icon } from "@/components/icon";

const labels = {
  system: "System",
  light: "Light",
  dark: "Dark",
} as const;

const icons = {
  system: "monitor",
  light: "sun",
  dark: "moon",
} as const;

export function ThemeToggle() {
  const { preference, cycleTheme } = useTheme();
  const nextTheme =
    preference === "system" ? "light" : preference === "light" ? "dark" : "system";

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={`Theme is ${labels[preference]}. Switch to ${labels[nextTheme].toLowerCase()} theme.`}
      title={`Theme: ${labels[preference]}`}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm font-medium text-foreground transition hover:bg-secondary-surface"
    >
      <Icon name={icons[preference]} className="size-4" />
      <span className="hidden sm:inline">{labels[preference]}</span>
    </button>
  );
}
