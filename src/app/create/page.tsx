import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { CreateDropForm } from "@/components/create-drop-form";
import { SupabaseSetupNotice } from "@/components/supabase-setup-notice";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Create a Drop" };

export default async function CreatePage() {
  await connection();
  if (!isSupabaseConfigured()) return <SupabaseSetupNotice title="Connect DropIn to create a Drop" />;

  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/sign-in?next=%2Fcreate");

  const { data: profile } = await currentUser.supabase
    .from("profiles")
    .select("username")
    .eq("id", currentUser.userId)
    .maybeSingle();

  if (!profile || /^member_[0-9a-f]{17}$/.test(profile.username)) redirect("/profile/setup?next=%2Fcreate");

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-accent">Start something now</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">Make room for a good idea.</h1>
      <p className="mb-8 mt-4 max-w-2xl text-sm leading-6 text-muted">
        Share a simple plan, choose how long it lasts, and invite people to join. A Drop&apos;s capacity includes you.
      </p>
      <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[var(--soft-shadow)] sm:p-8">
        <CreateDropForm configured={isSupabaseConfigured()} />
      </div>
    </section>
  );
}
