import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CancelDropButton } from "@/components/cancel-drop-button";
import { LocalizedDateTime } from "@/components/localized-date-time";
import { SupabaseSetupNotice } from "@/components/supabase-setup-notice";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "My Activities" };

type Activity = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  visibility: "public" | "private";
  max_participants: number;
  current_status: "scheduled" | "active" | "cancelled" | "expired" | "archived";
  starts_at: string;
  expires_at: string;
};

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string; error?: string }>;
}) {
  await connection();
  if (!isSupabaseConfigured()) return <SupabaseSetupNotice title="Your activities will appear here" />;
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/sign-in?next=%2Factivities");

  const [{ data }, params] = await Promise.all([
    currentUser.supabase
      .from("drop_details")
      .select("id, title, description, category, visibility, max_participants, current_status, starts_at, expires_at")
      .eq("creator_id", currentUser.userId)
      .order("starts_at", { ascending: false })
      .limit(100),
    searchParams,
  ]);

  const activities = (data ?? []) as Activity[];
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-accent">Your DropIn activity</p>
      <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">My Activities</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">See the Drops you’ve created, check when they end, and manage their availability.</p>
        </div>
        <Link className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-background transition hover:bg-primary-hover" href="/create">Create a Drop</Link>
      </div>

      {params.cancelled === "1" && <p className="mt-7 rounded-2xl border border-success/30 bg-success/5 px-4 py-3 text-sm text-success" role="status">Your Drop was cancelled. Its history is still available here.</p>}
      {params.error && <p className="mt-7 rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">We couldn’t cancel that Drop. Refresh the list and try again.</p>}

      <h2 className="mb-4 mt-10 text-xl font-semibold tracking-tight text-foreground">Created by you</h2>
      {activities.length === 0 ? (
        <div className="rounded-[26px] border border-dashed border-border bg-surface px-6 py-12 text-center">
          <h3 className="text-lg font-semibold text-foreground">Your first Drop starts here.</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">Create a small activity and it will show up here with its schedule and status.</p>
          <Link className="mt-5 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-background" href="/create">Create a Drop</Link>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {activities.map((activity) => {
            const status = activity.current_status[0].toUpperCase() + activity.current_status.slice(1);
            const canCancel = status === "Active" || status === "Scheduled";
            return (
              <li className="rounded-[24px] border border-border bg-surface p-5 shadow-[var(--soft-shadow)]" key={activity.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary-accent">{activity.category} · {activity.visibility}</p>
                    <h3 className="mt-2 text-lg font-semibold text-foreground"><Link className="hover:text-primary" href={`/drop/${activity.id}`}>{activity.title}</Link></h3>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${status === "Active" ? "bg-success/10 text-success" : status === "Scheduled" ? "bg-secondary-surface text-primary" : "bg-background text-muted"}`}>{status}</span>
                </div>
                {activity.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{activity.description}</p>}
                <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
                  <div><dt className="text-muted">Starts</dt><dd className="mt-1 font-semibold text-foreground"><LocalizedDateTime iso={activity.starts_at} /></dd></div>
                  <div><dt className="text-muted">Ends</dt><dd className="mt-1 font-semibold text-foreground"><LocalizedDateTime iso={activity.expires_at} /></dd></div>
                  <div><dt className="text-muted">Capacity</dt><dd className="mt-1 font-semibold text-foreground">{activity.max_participants} including you</dd></div>
                </dl>
                {canCancel && <div className="mt-4 flex justify-end"><CancelDropButton dropId={activity.id} /></div>}
              </li>
            );
          })}
        </ul>
      )}

      <section aria-labelledby="joined-title" className="mt-12 rounded-[26px] border border-border bg-secondary-surface/50 p-6 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight text-foreground" id="joined-title">Drops you’ve joined</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Joining other activities is coming in the next stage. Your joined Drops will appear here.</p>
      </section>
    </section>
  );
}
