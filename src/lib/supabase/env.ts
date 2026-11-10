export type SupabasePublicEnv = {
  url: string;
  publishableKey: string;
};

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  } catch {
    return null;
  }

  return { url, publishableKey };
}

export function getPublicSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

  try {
    const parsed = new URL(configuredUrl);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.origin;
  } catch {
    // Fall through to the local development origin when configuration is malformed.
  }

  return "http://localhost:3000";
}

export function isSupabaseConfigured() {
  return getSupabasePublicEnv() !== null;
}
