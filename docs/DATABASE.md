# Stage 2–3 database

The first Supabase migration is [`../supabase/migrations/20261110090000_initial_dropin_schema.sql`](../supabase/migrations/20261110090000_initial_dropin_schema.sql). It creates the first-release domain tables, constraints, indexes, profile bootstrap trigger, and row-level security policies. `supabase/config.toml` defines the local Supabase stack; `supabase/seed.sql` is intentionally empty so local resets do not fabricate activity.

## Schema and access rules

- `profiles` and `user_interests` hold member profile data. New profiles default to private; public interests are readable only when their profile is public.
- `drops` stores online activity metadata. Public, unexpired, active/scheduled Drops are discoverable without authentication. Creators and active participants can read their authorized Drops.
- `drop_participants` preserves active/left membership history. A partial unique index allows only one active membership per user per Drop and at most one active creator membership. Clients cannot write membership rows directly; `create_drop` inserts the creator membership, while joining is a later stage.
- `messages` are readable only to active participants. No client insert policy exists yet; message sending is a later stage.
- `reports` and `user_blocks` have owner-scoped policies. Reports are insertable by signed-in users and only their reporter can read them. Moderation tools are out of scope here.
- `save_my_profile` is a transactional RPC. It derives the account identity from `auth.uid()` and replaces profile fields/interests atomically.
- `create_drop` validates title, description, category, capacity, duration, schedule window, and profile completion; it creates the Drop and creator membership in one transaction. Only authenticated users can call it; direct Drop and membership inserts are denied.
- `cancel_my_drop` locks and cancels only the caller's own scheduled/active Drop. The record remains available to its creator for activity history.

The creator counts toward `max_participants` (2–20). Drops last 15–240 minutes and may be scheduled up to 7 days ahead. The form converts the browser-local scheduled time into an ISO timestamp before sending it; PostgreSQL stores UTC `timestamptz` values. Fullness is derived from active membership; it is not stored as a client-controlled count. A user who leaves can later rejoin by creating a new active history row when joining is implemented. First-release visibility is `public` or `private`; share-link access does not bypass private Drop authorization.

Expired Drops are hidden from public reads based on `expires_at`, even when the stored lifecycle value is still `active`. The creator can still read their own cancelled/expired history. No scheduled job is needed to keep expired Drops out of active results.

## Local workflow

Install Docker Desktop and ensure its Linux container engine is running, then:

```bash
npm run db:start
npm run db:reset
npm run db:test
```

`db:reset` drops and recreates the **local** database, applies committed migrations, and runs the seed file. `db:test` runs the pgTAP assertions in `supabase/tests/database/`. Do not use `db:reset` for a hosted database. After schema changes, add a new timestamped migration; do not edit a migration that has already been applied to a shared/hosted project.

Optionally generate client types after the local stack is up:

```bash
npm run db:types
```

The generated file is not checked in yet; the current application reads only the profile/Auth surface and has no generated database type dependency.

## Current verification status

The local stack successfully applied both migrations during reset. The last successful pgTAP run had 47 assertions, before the final lifecycle-status view assertion was added. The current suite contains 48 assertions and was not rerun in this pass at the user's request. Repeat `npm run db:reset` and `npm run db:test` after future migration or policy changes before applying them to a hosted project.
