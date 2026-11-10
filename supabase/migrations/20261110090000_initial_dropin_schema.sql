-- DropIn first-release schema. PostgreSQL owns durable membership and access state.
begin;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create type public.profile_visibility as enum ('public', 'private');
create type public.drop_category as enum (
  'gaming',
  'technology',
  'learning',
  'sports',
  'social',
  'discussions',
  'entertainment',
  'lifestyle',
  'other'
);
create type public.drop_activity_type as enum ('online');
create type public.drop_visibility as enum ('public', 'private');
create type public.drop_status as enum (
  'scheduled',
  'active',
  'cancelled',
  'expired',
  'archived'
);
create type public.drop_participant_role as enum ('creator', 'participant');
create type public.drop_participant_status as enum ('active', 'left');
create type public.drop_message_type as enum ('text', 'system');
create type public.report_reason as enum (
  'spam',
  'harassment',
  'inappropriate_content',
  'safety_concern',
  'other'
);
create type public.report_status as enum ('open', 'in_review', 'resolved', 'dismissed');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  display_name text not null default 'New member',
  bio text,
  visibility public.profile_visibility not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_normalized check (username = lower(username)),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,24}$'),
  constraint profiles_display_name_length check (
    char_length(btrim(display_name)) between 1 and 60
  ),
  constraint profiles_bio_length check (bio is null or char_length(bio) <= 160)
);
create unique index profiles_username_unique on public.profiles (username);

create table public.user_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  interest text not null,
  created_at timestamptz not null default now(),
  constraint user_interests_length check (char_length(interest) between 1 and 40),
  constraint user_interests_normalized check (interest = lower(btrim(interest)))
);
create unique index user_interests_unique on public.user_interests (user_id, interest);
create index user_interests_by_interest on public.user_interests (interest, user_id);

create table public.drops (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles (id) on delete restrict,
  title text not null,
  description text,
  category public.drop_category not null,
  activity_type public.drop_activity_type not null default 'online',
  visibility public.drop_visibility not null default 'public',
  max_participants smallint not null,
  status public.drop_status not null default 'active',
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint drops_title_length check (char_length(btrim(title)) between 3 and 100),
  constraint drops_description_length check (
    description is null or char_length(description) <= 1000
  ),
  constraint drops_capacity_bounds check (max_participants between 2 and 20),
  constraint drops_expiry_after_start check (expires_at > starts_at)
);
create index drops_discovery_by_status_time
  on public.drops (status, starts_at, expires_at, id);
create index drops_discovery_by_category
  on public.drops (category, status, starts_at, id);
create index drops_by_creator
  on public.drops (creator_id, created_at desc, id);
comment on column public.drops.max_participants is
  'Includes the creator. Fullness is derived from active memberships, never trusted from a client count.';
comment on column public.drops.status is
  'Full is derived from membership count. expires_at remains authoritative even before a status cleanup job runs.';

create table public.drop_participants (
  id uuid primary key default gen_random_uuid(),
  drop_id uuid not null references public.drops (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.drop_participant_role not null default 'participant',
  status public.drop_participant_status not null default 'active',
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  constraint drop_participants_left_time check (
    (status = 'active' and left_at is null)
    or (status = 'left' and left_at is not null)
  )
);
create unique index drop_participants_one_active_membership
  on public.drop_participants (drop_id, user_id)
  where status = 'active';
create unique index drop_participants_one_creator
  on public.drop_participants (drop_id)
  where role = 'creator' and status = 'active';
create index drop_participants_by_user
  on public.drop_participants (user_id, status, joined_at desc);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  drop_id uuid not null references public.drops (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete restrict,
  content text not null,
  message_type public.drop_message_type not null default 'text',
  created_at timestamptz not null default now(),
  constraint messages_content_length check (char_length(btrim(content)) between 1 and 2000)
);
create index messages_by_drop_time on public.messages (drop_id, created_at, id);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  reported_user_id uuid references public.profiles (id) on delete set null,
  reported_drop_id uuid references public.drops (id) on delete set null,
  reason public.report_reason not null,
  description text,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  constraint reports_has_target check (
    reported_user_id is not null or reported_drop_id is not null
  ),
  constraint reports_not_self check (
    reported_user_id is null or reported_user_id <> reporter_id
  ),
  constraint reports_description_length check (
    description is null or char_length(description) <= 2000
  )
);
create index reports_by_reporter on public.reports (reporter_id, created_at desc);
create index reports_open_queue on public.reports (status, created_at)
  where status in ('open', 'in_review');

create table public.user_blocks (
  blocker_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint user_blocks_no_self check (blocker_id <> blocked_id)
);
create index user_blocks_by_blocked on public.user_blocks (blocked_id, blocker_id);

create function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function private.touch_updated_at();
create trigger drops_touch_updated_at
  before update on public.drops
  for each row execute function private.touch_updated_at();
revoke all on function private.touch_updated_at() from public, anon, authenticated, service_role;

create function private.create_profile_for_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    'member_' || right(replace(new.id::text, '-', ''), 17),
    'New member'
  );
  return new;
end;
$$;
revoke all on function private.create_profile_for_new_auth_user() from public, anon, authenticated;
create trigger on_auth_user_created_create_profile
  after insert on auth.users
  for each row execute function private.create_profile_for_new_auth_user();

create function private.is_drop_creator(p_drop_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.drops d
    where d.id = p_drop_id
      and d.creator_id = (select auth.uid())
  );
$$;

create function private.is_active_drop_participant(p_drop_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.drop_participants dp
    where dp.drop_id = p_drop_id
      and dp.user_id = (select auth.uid())
      and dp.status = 'active'
  );
$$;

revoke all on function private.is_drop_creator(uuid) from public, anon, authenticated, service_role;
revoke all on function private.is_active_drop_participant(uuid) from public, anon, authenticated, service_role;
grant execute on function private.is_drop_creator(uuid) to anon, authenticated;
grant execute on function private.is_active_drop_participant(uuid) to anon, authenticated;

create function public.save_my_profile(
  p_username text,
  p_display_name text,
  p_bio text,
  p_visibility public.profile_visibility,
  p_interests text[]
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_username text := lower(btrim(p_username));
  v_display_name text := btrim(p_display_name);
  v_bio text := nullif(btrim(p_bio), '');
  v_interests text[] := coalesce(p_interests, array[]::text[]);
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'Authentication required';
  end if;

  if v_username !~ '^[a-z0-9_]{3,24}$' then
    raise exception using errcode = '22023', message = 'Username must be 3–24 lowercase letters, numbers, or underscores';
  end if;
  if char_length(v_display_name) not between 1 and 60 then
    raise exception using errcode = '22023', message = 'Display name must be 1–60 characters';
  end if;
  if v_bio is not null and char_length(v_bio) > 160 then
    raise exception using errcode = '22023', message = 'Bio must be at most 160 characters';
  end if;
  if cardinality(v_interests) > 10 then
    raise exception using errcode = '22023', message = 'Choose no more than 10 interests';
  end if;
  if exists (
    select 1
    from unnest(v_interests) as i(value)
    where i.value is null
      or char_length(btrim(i.value)) not between 1 and 40
  ) then
    raise exception using errcode = '22023', message = 'Each interest must be 1–40 characters';
  end if;

  update public.profiles
  set username = v_username,
      display_name = v_display_name,
      bio = v_bio,
      visibility = p_visibility
  where id = v_user_id;

  if not found then
    raise exception using errcode = 'P0002', message = 'Profile not found';
  end if;

  delete from public.user_interests where user_id = v_user_id;
  insert into public.user_interests (user_id, interest)
  select v_user_id, lower(btrim(i.value))
  from (
    select distinct btrim(value) as value
    from unnest(v_interests) as input(value)
  ) as i
  where btrim(i.value) <> ''
  on conflict (user_id, interest) do nothing;
end;
$$;
revoke all on function public.save_my_profile(text, text, text, public.profile_visibility, text[]) from public, anon, authenticated, service_role;
grant execute on function public.save_my_profile(text, text, text, public.profile_visibility, text[]) to authenticated;

alter table public.profiles enable row level security;
alter table public.user_interests enable row level security;
alter table public.drops enable row level security;
alter table public.drop_participants enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.user_blocks enable row level security;

create policy "Public profiles are readable; private profiles are owner-only"
  on public.profiles for select to anon, authenticated
  using (visibility = 'public' or id = (select auth.uid()));
create policy "Users update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Interests follow profile visibility"
  on public.user_interests for select to anon, authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = user_interests.user_id and p.visibility = 'public'
    )
  );

create policy "Discoverable public Drops and authorized private Drops"
  on public.drops for select to anon, authenticated
  using (
    (
      visibility = 'public'
      and status in ('scheduled', 'active')
      and expires_at > now()
    )
    or creator_id = (select auth.uid())
    or (select private.is_active_drop_participant(id))
  );

create policy "Participants and creator can read membership rows"
  on public.drop_participants for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select private.is_drop_creator(drop_id))
    or (select private.is_active_drop_participant(drop_id))
  );

create policy "Active participants can read room messages"
  on public.messages for select to authenticated
  using ((select private.is_active_drop_participant(drop_id)));

create policy "Reporters can read their own reports"
  on public.reports for select to authenticated
  using (reporter_id = (select auth.uid()));
create policy "Authenticated users can submit reports"
  on public.reports for insert to authenticated
  with check (reporter_id = (select auth.uid()));

create policy "Users can read their own block list"
  on public.user_blocks for select to authenticated
  using (blocker_id = (select auth.uid()));
create policy "Users can block another account"
  on public.user_blocks for insert to authenticated
  with check (blocker_id = (select auth.uid()) and blocked_id <> (select auth.uid()));
create policy "Users can remove their own blocks"
  on public.user_blocks for delete to authenticated
  using (blocker_id = (select auth.uid()));

revoke all on public.profiles, public.user_interests, public.drops,
  public.drop_participants, public.messages, public.reports, public.user_blocks
  from public, anon, authenticated, service_role;
grant select on public.profiles, public.user_interests, public.drops to anon, authenticated;
grant update (username, display_name, bio, visibility) on public.profiles to authenticated;
grant select on public.drop_participants, public.messages to authenticated;
grant select, insert (reported_user_id, reported_drop_id, reason, description)
  on public.reports to authenticated;
grant select, insert (blocked_id), delete on public.user_blocks to authenticated;

commit;
