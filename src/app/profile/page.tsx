import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/features/auth/actions";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SupabaseSetupNotice } from "@/components/supabase-setup-notice";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  await connection();
  if (!isSupabaseConfigured()) return <SupabaseSetupNotice title="Your profile will live here" />;

  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/sign-in?next=%2Fprofile");

  const { data: profile } = await currentUser.supabase
    .from("profiles")
    .select("username, display_name, bio, visibility")
    .eq("id", currentUser.userId)
    .maybeSingle();

  if (!profile) {
    return <SupabaseSetupNotice title="We couldn't load your profile" />;
  }

  const { data: interests } = await currentUser.supabase
    .from("user_interests")
    .select("interest")
    .eq("user_id", currentUser.userId)
    .order("interest");

  const email = typeof currentUser.claims.email === "string" ? currentUser.claims.email : "Signed-in account";

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-accent">Your DropIn profile</p>
      <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">{profile.display_name}</h1>
          <p className="mt-2 text-sm text-muted">@{profile.username} · {email}</p>
          <p className="mt-5 max-w-xl text-base leading-7 text-foreground">{profile.bio || "Add a short bio when you’re ready."}</p>
          <p className="mt-3 text-xs font-medium text-muted">Profile visibility: {profile.visibility}</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Interests">
            {interests?.map(({ interest }) => (
              <li className="rounded-full border border-border bg-secondary-surface px-3 py-1.5 text-xs font-medium text-primary" key={interest}>
                {interest}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-background transition hover:bg-primary-hover" href="/profile/setup">
            Edit profile
          </Link>
          <form action={signOutAction}>
            <button className="inline-flex h-11 items-center rounded-full border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:bg-secondary-surface" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>
      <p className="mt-12 rounded-2xl border border-border bg-surface p-5 text-sm leading-6 text-muted">
        Your profile is ready. Drop creation, live discovery, and activity rooms are being built in later stages.
      </p>
    </section>
  );
}
