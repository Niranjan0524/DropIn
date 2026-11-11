import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { SupabaseSetupNotice } from "@/components/supabase-setup-notice";
import { LocalizedDateTime } from "@/components/localized-date-time";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Drop" };

type DropPageProps = {
  params: Promise<{ dropId: string }>;
  searchParams: Promise<{ created?: string }>;
};

export default async function DropPage({ params, searchParams }: DropPageProps) {
  await connection();
  if (!isSupabaseConfigured()) return <SupabaseSetupNotice title="Connect DropIn to view this Drop" />;
  const [{ dropId }, query, currentUser] = await Promise.all([params, searchParams, getCurrentUser()]);
  const validId = z.string().uuid().safeParse(dropId);
  if (!validId.success) notFound();

  const supabase = currentUser?.supabase ?? await createServerSupabaseClient();
  if (!supabase) return <SupabaseSetupNotice title="Connect DropIn to view this Drop" />;

  const { data: drop } = await supabase
    .from("drop_details")
    .select("id, title, description, category, activity_type, visibility, max_participants, current_status, starts_at, expires_at, creator_id")
    .eq("id", validId.data)
    .maybeSingle();

  if (!drop) notFound();

  const status = drop.current_status[0].toUpperCase() + drop.current_status.slice(1);
  const created = query.created === "1" && currentUser?.userId === drop.creator_id;

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      {created && (
        <p className="mb-6 rounded-2xl border border-success/30 bg-success/5 px-4 py-3 text-sm text-success" role="status">
          Your Drop was created successfully. You can view and manage it from My Activities.
        </p>
      )}
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-accent">{drop.category} · {drop.activity_type} · {drop.visibility}</p>
      <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">{drop.title}</h1>
          <p className="mt-5 whitespace-pre-wrap text-base leading-7 text-muted">{drop.description}</p>
        </div>
        <span className={`w-fit shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold ${status === "Active" ? "bg-success/10 text-success" : status === "Scheduled" ? "bg-secondary-surface text-primary" : "bg-background text-muted"}`}>{status}</span>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-medium text-muted">Starts</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-foreground"><LocalizedDateTime iso={drop.starts_at} variant="full" /></p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-medium text-muted">Ends</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-foreground"><LocalizedDateTime iso={drop.expires_at} variant="full" /></p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-medium text-muted">Maximum group size</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-foreground">{drop.max_participants} people, including the creator</p>
        </div>
      </div>

      <div className="mt-8 rounded-[24px] border border-border bg-secondary-surface/50 p-6">
        <h2 className="text-lg font-semibold text-foreground">The activity room comes next</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Joining and participant chat are being added in later stages. This page shows the Drop details and current lifecycle state.</p>
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-background transition hover:bg-primary-hover" href="/activities">My Activities</Link>
        <Link className="inline-flex h-11 items-center rounded-full border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:bg-secondary-surface" href="/create">Create another Drop</Link>
      </div>
    </section>
  );
}
