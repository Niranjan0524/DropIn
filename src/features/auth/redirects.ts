import { getPublicSiteUrl } from "@/lib/supabase/env";

const FALLBACK_PATH = "/profile/setup";

export function getSafeAuthReturnPath(value: unknown, fallback = FALLBACK_PATH) {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  if (/[\u0000-\u001f]/.test(value) || value.startsWith("/auth/")) return fallback;
  return value;
}

export function buildAuthCallbackUrl(nextPath: unknown) {
  const url = new URL("/auth/callback", getPublicSiteUrl());
  url.searchParams.set("next", getSafeAuthReturnPath(nextPath));
  return url.toString();
}
