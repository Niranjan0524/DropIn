import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const userId = claims?.sub;
  if (error || !claims || typeof userId !== "string") return null;

  return { supabase, userId, claims };
}
