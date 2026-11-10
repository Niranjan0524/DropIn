"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { buildAuthCallbackUrl, getSafeAuthReturnPath } from "@/features/auth/redirects";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthActionState = {
  kind: "idle" | "success" | "error";
  message: string;
};

const emailSchema = z.string().trim().email().max(254);

export async function sendMagicLinkAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) {
    return { kind: "error", message: "Enter a valid email address." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      kind: "error",
      message: "Supabase is not configured yet. Add the project URL and publishable key to .env.local.",
    };
  }

  const nextPath = getSafeAuthReturnPath(formData.get("next"));
  const { error } = await supabase.auth.signInWithOtp({
    email: email.data.toLowerCase(),
    options: {
      emailRedirectTo: buildAuthCallbackUrl(nextPath),
      shouldCreateUser: true,
    },
  });

  if (error) {
    return {
      kind: "error",
      message: "We couldn't send a sign-in link. Check the Auth email settings and try again.",
    };
  }

  return {
    kind: "success",
    message: "If this address can receive DropIn sign-in mail, a secure link is on its way.",
  };
}

export async function signInWithGoogleAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      kind: "error",
      message: "Supabase is not configured yet. Add the project URL and publishable key to .env.local.",
    };
  }

  const nextPath = getSafeAuthReturnPath(formData.get("next"));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: buildAuthCallbackUrl(nextPath) },
  });

  if (error || !data.url) {
    return {
      kind: "error",
      message: "Google sign-in isn't ready. Confirm the Google provider is enabled in Supabase.",
    };
  }

  redirect(data.url);
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
