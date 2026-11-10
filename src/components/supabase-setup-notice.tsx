import Link from "next/link";

export function SupabaseSetupNotice({ title = "Connect the DropIn backend" }: { title?: string }) {
  return (
    <section className="mx-auto flex min-h-[65vh] max-w-3xl flex-col justify-center px-5 py-16 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-accent">Stage 2 setup</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
        Authentication and profiles are wired to Supabase, but this environment has no project URL or publishable key yet. Copy <code>.env.example</code> to <code>.env.local</code>, fill in the project values, then restart the development server.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-background transition hover:bg-primary-hover" href="/sign-in">
          Go to sign in
        </Link>
        <Link className="inline-flex h-11 items-center rounded-full border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:bg-secondary-surface" href="/">
          Back to home
        </Link>
      </div>
      <p className="mt-5 text-xs leading-5 text-muted">
        Setup instructions: <code>docs/AUTH_SETUP.md</code>. No service-role key is needed in this app.
      </p>
    </section>
  );
}
