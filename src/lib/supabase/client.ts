"use client";

import { createBrowserClient as createSsrBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export function createBrowserSupabaseClient(): SupabaseClient | null {
  const env = getSupabasePublicEnv();
  if (!env) return null;

  return createSsrBrowserClient(env.url, env.publishableKey);
}
