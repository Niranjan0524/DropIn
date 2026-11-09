# DropIn Technical Decisions

This log records decisions that guide implementation. Product requirements live in [`../DropIn.md`](../DropIn.md); the system overview and detailed design live in [`../architecture/HLD.md`](../architecture/HLD.md) and [`../architecture/lld.md`](../architecture/lld.md).

## Accepted for the first release

### Web foundation

- **Next.js App Router with TypeScript** is the web application foundation.
- **Tailwind CSS 4** supplies styling utilities; DropIn's palette and semantic colors are CSS variables, not hard-coded per-page colors.
- **ESLint** and TypeScript type checking are available through npm scripts.
- Use a system-first font stack with Inter when locally available. Avoid a build-time Google Fonts fetch so local builds do not depend on an external font download.
- Keep current UI state in the component that owns it. Add a client-state/cache library only when the product flows demonstrate a need.

### Product boundary

- First-release product flows target online Drops. Nearby/location discovery is deferred until a separate privacy and safety design is approved.
- Navigation destinations without completed product flows are explicit foundation placeholders. They must not show fabricated Drops, memberships, messages, or notifications.
- Voice/video, social connections, push notifications, advanced recommendations, Redis, and Go services are deferred.

### Backend and source of truth

- **Supabase** is the proposed first-release backend: PostgreSQL for durable domain state and constraints, Auth for identity, and Realtime for change delivery.
- PostgreSQL is authoritative for Drop ownership, lifecycle, capacity, memberships, and messages. Realtime is delivery only and clients reconcile after reconnects.
- Business-critical writes must be validated at a trusted server/database boundary and protected by RLS/transactions. The exact mix of SQL RPCs, Next.js server handlers, and Edge Functions is not yet selected.
- A dedicated **Go** service is not part of Stage 1 or the first deployment baseline. Revisit only when measured concurrency, realtime, or worker requirements justify it.
- Candidate schema migrations belong under `supabase/migrations/`. During the backend stage, use the Supabase CLI/local stack with Docker for reproducible local migrations; configure a hosted project separately for preview/production.

### Hosting and operations

- Cloudflare Pages is the preferred hosting candidate from the product specification, not yet a confirmed deployment decision.
- Before selecting the production host, verify the needed Next.js rendering/server features and Auth callback behavior work with its current runtime/adapter and free tier. Keep an alternate compatible free-tier host available if they do not.
- No Redis, custom Go server, paid API, or external platform credential is required to run Stage 1.

### Theme behavior

- The theme preference values are `system`, `light`, and `dark`; the default is system preference.
- Store the user preference in local storage under `dropin-theme`. An early root script applies the correct palette before hydration to avoid a visible theme flash.
- The accepted palette is the token table in `DropIn.md`; semantic CSS variables map those values into shared Tailwind colors.

## Deferred provider setup

Stage 1 requires no Supabase account or project and no OAuth configuration. When Stage 2 begins, configure the Supabase project, Auth providers, site/callback URLs, local CLI workflow, and browser-safe project values in local/deployment environments. Keep service-role credentials server-only. Do not commit project secrets.

## Open decisions before dependent implementation

- Does `max_participants` include the creator, and is creator membership automatic?
- Are unlisted/private Drops in the first release? What access does a share link grant?
- Can a departed user rejoin, and how is membership history retained?
- Can a creator change capacity/timing after participants join?
- Which exact Next.js server integration and deployment adapter will be supported?
- For each sensitive write, which trusted boundary will own the transaction and authorization?
- What message retention and report-review process will be supported at launch?

## Decision history

| Date | Decision | Reason |
|---|---|---|
| 2026-11-09 | Use the provided DropIn product specification and teal/coral palette as product source of truth. | Preserve the requested product direction and visual identity. |
| 2026-11-09 | Build Stage 1 without Supabase credentials or external provider setup. | The app shell and design foundation can be completed locally before account configuration. |
| 2026-11-09 | Keep unfinished destinations as explicit placeholders with no mock activity data. | Avoid presenting planned functionality as implemented. |
