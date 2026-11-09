# DropIn — Low-Level Design

**Status:** Proposed implementation design for the first usable release  
**High-level design:** [`HLD.md`](./HLD.md)  
**Product requirements:** [`../DropIn.md`](../DropIn.md)

> This document describes planned modules, data contracts, flows, and invariants. It is not a claim that they already exist. Final schema names and provider integrations should be validated in migrations before feature implementation.

## 1. Scope boundary

The initial implementation covers authenticated profiles, online Drops, discovery, membership, participant-only text chat, share links, and essential report/block behavior. Nearby activities, precise location, voice/video, user connections, a notification center, Redis, and a Go API are deferred.

Current repository status: only a Next.js scaffold exists. The paths below are proposed; create them as each stage is implemented rather than creating empty folders for every future feature.

## 2. Proposed source layout

```text
src/
  app/
    (public)/
      page.tsx                    # Home/live discovery
      explore/page.tsx             # Discovery filters
      drop/[dropId]/page.tsx       # Public-safe landing / activity room gate
      sign-in/page.tsx
    (protected)/
      create/page.tsx
      activities/page.tsx
      profile/page.tsx
    auth/callback/route.ts         # OAuth callback, if required by chosen SSR flow
    api/                           # Only for operations assigned to Next server layer
    layout.tsx
  components/
    ui/                            # Accessible shared primitives
    app-shell/                     # Header/nav/responsive navigation
    drops/                         # Drop card, status, capacity, participant list
    chat/                          # Message list/composer/system event
  features/
    auth/
    profiles/
    drops/
    memberships/
    chat/
    moderation/
  lib/
    supabase/                      # Browser/server client factories
    validation/                    # Shared Zod schemas
    auth/                          # Session and authorization helpers
    errors/                        # Typed domain and presentation errors
  types/                           # Generated database types and shared contracts
supabase/
  migrations/                      # Ordered, committed schema and policy migrations
  seed.sql                          # Non-sensitive local development data only
```

Do not create a separate generic repository abstraction for every table by default. Feature modules should expose domain operations and schemas; direct data access belongs in those modules or trusted SQL functions, not scattered through page components.

## 3. Data model proposal

Use UUID primary keys (including Supabase Auth's UUID for `auth.users`). Timestamps are stored in UTC (`timestamptz`) and formatted in the user's locale. Prefer database constraints for invariants that must hold under concurrency.

### 3.1 `profiles`

| Column | Type | Rules / purpose |
|---|---|---|
| `id` | `uuid` | PK and FK to `auth.users(id)` with deliberate delete behavior |
| `username` | `text` | Required, normalized lowercase, unique; validate allowed characters/length |
| `display_name` | `text` | Required, bounded length |
| `avatar_path` | `text` nullable | Storage object path, not arbitrary trusted URL where avoidable |
| `bio` | `text` nullable | Bounded length; plain text, escaped on rendering |
| `visibility` | enum/text | Public/private fields policy to be finalized |
| `created_at` | `timestamptz` | Default database time |
| `updated_at` | `timestamptz` | Maintained by trusted update path/trigger |

### 3.2 `user_interests`

Suggested columns: `user_id uuid`, `interest text`, `created_at timestamptz`. Use a composite uniqueness rule on normalized `(user_id, interest)`; bound interest count and length. Defer elaborate taxonomy until discovery needs it.

### 3.3 `drops`

| Column | Type | Rules / purpose |
|---|---|---|
| `id` | `uuid` | PK; stable share identifier |
| `creator_id` | `uuid` | FK to profiles; never trusted from client input |
| `title` | `text` | Required, trimmed, bounded |
| `description` | `text` | Required or optional per final form decision; bounded, plain text |
| `category` | enum/text | Allow-listed category from product taxonomy |
| `activity_type` | enum/text | `online` in release one |
| `visibility` | enum/text | `public` and optionally `unlisted/private` after semantics decision |
| `max_participants` | `smallint`/`integer` | Positive bounded value; includes/excludes creator per final decision |
| `status` | enum/text | Suggested: `scheduled`, `active`, `cancelled`, `expired`; fullness derived from membership, not permanent status |
| `starts_at` | `timestamptz` | Required or default now; validate scheduling window |
| `expires_at` | `timestamptz` | Must be after start; authoritative join check |
| `created_at` | `timestamptz` | Database time |
| `updated_at` | `timestamptz` | Trusted update path/trigger |

Do not persist participant count as authority. Derive it from active membership or maintain a transactionally correct counter only if later measured query needs justify it. “Full” is derived from active count versus capacity, so a member leaving can reopen a slot before expiry.

### 3.4 `drop_participants`

Suggested columns: `id uuid PK`, `drop_id uuid FK`, `user_id uuid FK`, `role text`, `status text`, `joined_at timestamptz`, `left_at timestamptz nullable`.

The model must allow membership history while preventing multiple active rows. Prefer a partial unique index on `(drop_id, user_id) WHERE status = 'active'` (or equivalent finalized state design). Define whether creator membership is inserted automatically and whether leaving then rejoining creates a new historical row.

### 3.5 `messages`

Suggested columns: `id uuid PK`, `drop_id uuid FK`, `sender_id uuid FK`, `content text`, `message_type text`, `created_at timestamptz`. Initial user message type is text; participant join/leave events may be derived or stored as system records by trusted code. Add a bounded content constraint, index `(drop_id, created_at, id)`, and no broad public read policy.

### 3.6 `reports` and blocks

`reports`: `id`, `reporter_id`, optional `reported_user_id`, optional `reported_drop_id`, reason, bounded description, status, created timestamp. Enforce that a report targets at least one supported entity. Restrict reading to reporter and authorized moderators; no client update to moderation status.

Blocking: for a minimal first release, define the blocked relationship and its impact on discovery, joining, and messaging before implementation. A user must not be able to bypass a block by changing client state. If block tables are deferred, do not expose a pretend block control.

## 4. Indexes and database invariants

Initial index candidates, to confirm against actual queries:

- `drops(status, starts_at, expires_at)` for active/time filters.
- `drops(category, status, starts_at)` for category discovery.
- `drops(creator_id, created_at DESC)` for creator activity history.
- `drop_participants(drop_id, status)` and `drop_participants(user_id, status, joined_at DESC)`.
- Unique active membership index on `(drop_id, user_id)`.
- `messages(drop_id, created_at, id)` for bounded chronological history.
- `user_interests(user_id, interest)` unique.
- Unique normalized username index.

Required invariants:

1. `expires_at > starts_at` and all limits are within agreed bounds.
2. At most one active membership per user per Drop.
3. A join cannot commit if the Drop is cancelled/expired/not yet joinable or has no capacity.
4. Only authorized creator/moderator path can edit Drop configuration.
5. Only authorized members can read/send room messages.
6. Client cannot set role, status, timestamps, participant count, or owner arbitrarily.
7. RLS is enabled for every user-data table exposed through Supabase APIs.

## 5. Trusted operation contracts

These are logical operations; whether each is a SQL RPC, Next.js route handler, or Edge Function is a deployment/security decision. Do not implement the same write in multiple paths with divergent rules.

### `create_drop(input)`

Input: `title`, `description`, `category`, `maxParticipants`, `duration`, optional `startsAt`, `visibility`. Identity comes from the validated session. Server/database sets IDs and timestamps.

Rules: validate bounded values and allow-listed category; reject unsupported `activityType`; compute expiry consistently; optionally insert creator membership within the same transaction. Return the persisted Drop projection.

### `join_drop(dropId)`

Input: `dropId`; identity from session.

Atomic behavior:

1. Lock or otherwise serialize the relevant Drop/capacity decision.
2. Confirm it exists and is visible/joinable to this user.
3. Confirm status and database current time permit joining.
4. Confirm no active membership exists (return a stable already-joined result if appropriate).
5. Count active members and reject at capacity.
6. Insert active membership and commit.

The serialization strategy must prevent two simultaneous joins from both taking the last slot. A pre-check in UI or separate non-locking count query is insufficient.

### `leave_drop(dropId)`

Input: `dropId`; identity from session.

Rules: mark current active membership left and set `left_at` in one operation; define creator departure semantics; preserve history if required. Subsequent join behavior follows the agreed rejoin rule.

### `send_message(dropId, content)`

Input: `dropId`, bounded plain-text content; sender from session.

Rules: verify Drop state and participant authorization; reject blocked relationships if implemented; persist with database time; return stable message ID. The client subscribes for delivery but does not optimistically imply persistence success.

### `report_entity(target, reason, description)`

Input: target Drop and/or user, allow-listed reason, bounded optional description. Identity from session. Prevent self-report where inappropriate and rate-limit. Do not reveal moderation case state to the reported party.

## 6. RLS and authorization matrix (target)

| Resource | Anonymous | Authenticated nonparticipant | Participant | Creator / moderator |
|---|---|---|---|---|
| Public Drop summary | Read only fields explicitly marked public | Read | Read | Read |
| Unlisted/private Drop summary | No read unless invitation semantics allow it | No read unless authorized | Read | Read/edit per policy |
| Participant list | Minimal public-safe fields for public Drop, if product approves | Same policy | Read room roster | Read/manage under defined controls |
| Messages | No | No | Read and send while eligible | Participant policy; moderation powers only if explicitly designed |
| Profile | Public fields only | Public fields only | Public fields; private fields by owner policy | Own profile update |
| Membership | No private roster access | Own membership state only | Room roster policy | No arbitrary role mutation from client |
| Reports | Create own report | Create own report | Create own report | Moderator-only queue; never general client update |

RLS policies must be exercised with tests for both allow and deny cases. A server key bypasses RLS, so server operations must perform explicit validation and authorization and must never be called with unchecked client data.

## 7. API and query shapes

Prefer typed feature functions over raw database queries from components. Example logical contracts:

- `list_discoverable_drops({ cursor, category?, availableOnly?, startingSoon? }) -> { items, nextCursor }`
- `get_drop_landing(dropId) -> public-safe DropSummary | not-found`
- `get_drop_room(dropId, cursor?) -> authorized DropRoomData | forbidden`
- `createDrop(input) -> Drop`
- `joinDrop(dropId) -> MembershipResult`
- `leaveDrop(dropId) -> MembershipResult`
- `sendMessage(dropId, input) -> Message`

Use cursor pagination based on stable ordering (for example `(starts_at, id)` or `(created_at, id)` according to discovery ranking). Validate all parameters with shared schemas and cap page size. Return typed domain errors (`not_found`, `forbidden`, `expired`, `full`, `already_joined`, `validation_error`, `rate_limited`) that UI can map to clear states without exposing SQL/provider internals.

## 8. Next.js module responsibilities

- `app/**/page.tsx`: route composition and server-renderable initial data; avoid placing domain rules in JSX.
- Feature modules: input schemas, domain operations, mapping/provider adapters, and typed errors.
- `lib/supabase/server`: server-side session-aware client only; never exports a service key to browser modules.
- `lib/supabase/browser`: browser client using only publishable credentials and RLS.
- Shared components: presentational and accessible; receive typed data/actions rather than owning backend authorization assumptions.
- Server actions/route handlers, if selected: authenticate, validate input, call one trusted domain operation, return bounded typed result.
- Client state: keep short-lived UI state only. PostgreSQL remains authority; do not use Zustand as a duplicate domain database without a specific need.
- TanStack Query/Zustand are optional dependencies in the product vision, not automatically required in the first scaffold. Add when actual cache/client-state complexity warrants them.

## 9. Realtime behavior

### Channels

- Discovery availability channel(s) scoped to relevant public Drops, not one global stream of private room data.
- Per-Drop participant and message subscriptions gated by authenticated session and database/channel authorization.
- Avoid broadcasting entire profile rows or private message data to broad audiences.

### Client behavior

1. Fetch authoritative initial state.
2. Subscribe using the selected Supabase Realtime mode.
3. Deduplicate events by stable row/message ID and apply only relevant changes.
4. On disconnect/reconnect, refetch current Drop availability/participants and message history after last cursor.
5. Unsubscribe when route changes/unmounts; avoid one subscription per card where possible.
6. Treat event delivery as at-least-once/best-effort; don't depend on exactly-once delivery.

Final event payloads, channel names, and authorization need verification against the selected Supabase setup before production use.

## 10. Validation and error handling

- Use shared Zod schemas at form/server boundaries; database constraints remain the final invariant check.
- Trim strings and normalize usernames/categories where applicable.
- Restrict text content to plain text initially; escape on render and avoid raw HTML rendering.
- Distinguish validation errors from authorization, capacity, expiry, rate limit, and transient network failures.
- Show retry for safe transient reads; only retry writes when operation is idempotent or has a dedupe key.
- Do not display raw database errors, stack traces, tokens, or provider details to users.

## 11. Security and abuse controls

- RLS on all exposed tables with deny-by-default posture.
- Session-derived identity for creator, sender, reporter, and participant.
- Transactional writes for membership and capacity invariants.
- Rate limits on account creation/sign-in support where available, Drop creation, joining churn, message sending, and reports.
- Server-side message size and frequency limits; consider duplicate/spam heuristics only when actionable.
- Block/report actions must have defined outcomes in discovery, joining, and messaging.
- Safe OAuth `next`/return path allow-list; prevent open redirects.
- Storage upload MIME/size rules and controlled public/private access if avatars are implemented.
- Keep telemetry free of message content and auth secrets.

## 12. Observability and operations

Log operation name, safe actor ID where appropriate, outcome category, latency, and correlation/request ID. Do not log access tokens, service keys, precise user data, or message bodies. Monitor database errors, auth failures, join conflicts/full rejections, realtime disconnect rates, rate limiting, and quota usage. Establish simple procedures for reviewing reports and responding to abuse before opening broad public access.

## 13. Testing targets

These tests should be added as functionality is implemented; they have not been run or created by this design document.

- Unit: input schemas, expiry and status mapping, error mapping, cursor parsing.
- Database integration: RLS allow/deny matrix, join race/capacity, duplicate membership, leave/rejoin, private message reads, creator-only updates.
- Realtime integration/manual: new message delivery, participant changes, reconnect reconciliation, unsubscribe behavior.
- End-to-end: sign-in → create Drop → discover/open → join as another user → chat → leave; shared link survives auth redirect.
- Accessibility/responsive: keyboard flow, focus states, contrast, reduced motion, mobile viewport without horizontal overflow.

## 14. Open decisions

Do not silently encode these assumptions; settle them before implementing dependent behavior:

1. Does capacity count the creator? Is creator membership mandatory?
2. Are unlisted/private Drops in first release, and what exactly grants link-based access?
3. Can a departed member rejoin? Is membership history retained indefinitely or pruned?
4. Does a scheduled Drop accept joins before start? Can creator edit title/capacity/timing after members join?
5. Are participant names/avatars visible on a public landing page before authentication?
6. What is the initial message retention and moderation/delete policy?
7. Which hosting runtime supports the required Next.js session/server behavior without paid infrastructure?
8. For each write, is the trusted implementation a Postgres RPC, Next.js server action/route, or Edge Function?

## 15. Implementation status

No database schema, Supabase client, auth flow, RLS policy, API operation, realtime channel, or business feature described here is implemented yet. Update this section and the relevant design when implementation establishes verified behavior.
