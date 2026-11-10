import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { SupabaseSetupNotice } from "@/components/supabase-setup-notice";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Set up your profile" };

export default async function ProfileSetupPage() {
  if (!isSupabaseConfigured()) return <SupabaseSetupNotice title="Finish connecting Supabase first" />;

  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/sign-in?next=%2Fprofile%2Fsetup");

  const { data: profile } = await currentUser.supabase
    .from("profiles")
    .select("username, display_name, bio, visibility")
    .eq("id", currentUser.userId)
    .maybeSingle();

  if (!profile) return <SupabaseSetupNotice title="Your profile is not ready yet" />;

  const { data: rows } = await currentUser.supabase
    .from("user_interests")
    .select("interest")
    .eq("user_id", currentUser.userId)
    .order("interest");

  return (
    <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-accent">A quick introduction</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">Set up your profile.</h1>
      <p className="mb-8 mt-4 max-w-2xl text-sm leading-6 text-muted">
        Choose a username and a few interests. Your profile starts private; you can make it public whenever you choose.
      </p>
      <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[var(--soft-shadow)] sm:p-8">
        <ProfileForm profile={profile} interests={(rows ?? []).map(({ interest }) => interest)} />
      </div>
    </section>
  );
}
