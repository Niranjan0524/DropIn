import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/sign-in-form";
import { getSafeAuthReturnPath } from "@/features/auth/redirects";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Sign in" };

type SignInPageProps = {
  searchParams: Promise<{ next?: string | string[]; error?: string | string[] }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  await connection();
  const params = await searchParams;
  const nextPath = getSafeAuthReturnPath(params.next);
  const supabase = await createServerSupabaseClient();

  if (supabase) {
    const { data } = await supabase.auth.getClaims();
    if (data?.claims?.sub) redirect(getSafeAuthReturnPath(params.next, "/profile"));
  }

  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <section className="mx-auto grid min-h-[76vh] max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
      <div className="max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-accent">Your next shared moment</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-foreground sm:text-6xl">
          Come as you are.
          <br />
          <span className="text-primary">Find your people.</span>
        </h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-muted">
          Sign in to set up your DropIn profile. Activity creation, discovery, and chat are coming in later stages.
        </p>
        <div className="mt-8 flex flex-wrap gap-2 text-xs font-medium text-muted">
          <span className="rounded-full border border-border bg-surface px-3 py-2">No password to remember</span>
          <span className="rounded-full border border-border bg-surface px-3 py-2">Email link or Google</span>
        </div>
      </div>

      <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[var(--soft-shadow)] sm:p-9">
        <div className="mb-7">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Sign in or create an account</h2>
          <p className="mt-2 text-sm leading-6 text-muted">We’ll send a one-time sign-in link to your email.</p>
        </div>
        <SignInForm
          nextPath={nextPath}
          configured={isSupabaseConfigured()}
          initialError={error}
        />
      </div>
    </section>
  );
}
