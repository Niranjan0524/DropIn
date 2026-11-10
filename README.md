# DropIn

**Don’t plan. Just Drop In.**

DropIn is a real-time activity discovery platform for finding people to do something with right now. Its core unit is a temporary, capacity-limited activity called a **Drop**.

## Project status

The repository includes the **Stage 1 foundation** and **Stage 2 implementation**: a Supabase schema with row-level security, cookie-based email/Google authentication, and protected profile setup. ESLint, TypeScript, and all 29 local pgTAP assertions pass. Drop discovery/creation/joining, chat, and notifications are later stages.

Read [`DropIn.md`](./DropIn.md) for the product requirements and [`architecture/HLD.md`](./architecture/HLD.md) and [`architecture/lld.md`](./architecture/lld.md) for proposed architecture and implementation details. [`docs/DECISIONS.md`](./docs/DECISIONS.md) records the current technical decisions and open questions.

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer (the lockfile was generated with npm 11)

The app shell runs without Supabase credentials. To exercise Stage 2 authentication, use the local setup described in [`docs/AUTH_SETUP.md`](./docs/AUTH_SETUP.md). A hosted Supabase project and Google OAuth credentials are not configured in this repository.

## Local development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the theme control in the header to cycle between system, light, and dark appearance. The selection is stored in browser local storage.

## Available scripts

```bash
npm run dev       # Start the local Next.js development server
npm run lint      # Run ESLint
npm run typecheck # Run the TypeScript compiler without emitting files
npm run build     # Create a production build
npm run start     # Serve a production build
npm run db:start  # Start the local Supabase stack (requires Docker)
npm run db:reset  # Recreate the local database and apply migrations
npm run db:test   # Run database schema and RLS tests (requires Docker)
```

## Environment configuration

`.env*` files are ignored; copy `.env.example` to `.env.local` when connecting a Supabase project. The browser uses only the project URL and publishable key, protected by database RLS. Never put a Supabase service-role key or another secret in a `NEXT_PUBLIC_` variable or in source control.

Hosted project creation, Auth provider settings, callback URLs, and deployment environment values are still user setup tasks. See [`docs/AUTH_SETUP.md`](./docs/AUTH_SETUP.md) for local and hosted setup steps and [`docs/DATABASE.md`](./docs/DATABASE.md) for the schema and migration workflow.

## Scope boundary

The first usable release is planned around email/Google authentication, online Drop creation and discovery, safe joining/leaving, participant-only text chat, shareable Drop links, and essential safety controls. Nearby activity, location access, voice/video, a social graph, advanced recommendations, Redis, and a dedicated Go backend are deferred. The full roadmap is in the local `DROPIN_IMPLEMENTATION_PLAN.md` file, which is intentionally ignored by Git.
