import { NextResponse, type NextRequest } from "next/server";
import { getSafeAuthReturnPath } from "@/features/auth/redirects";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPublicSiteUrl } from "@/lib/supabase/env";

function signInRedirect(reason: string) {
  const target = new URL("/sign-in", getPublicSiteUrl());
  target.searchParams.set("error", reason);
  return NextResponse.redirect(target);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return signInRedirect("callback");

  const supabase = await createServerSupabaseClient();
  if (!supabase) return signInRedirect("configuration");

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return signInRedirect("callback");

  const nextPath = getSafeAuthReturnPath(request.nextUrl.searchParams.get("next"));
  return NextResponse.redirect(new URL(nextPath, getPublicSiteUrl()));
}
