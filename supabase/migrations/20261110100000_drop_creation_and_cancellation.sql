-- Trusted Drop lifecycle writes. Creator identity, capacity, and status are database-owned.
begin;

create function private.has_drop_membership(p_drop_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.drop_participants dp
    where dp.drop_id = p_drop_id
      and dp.user_id = (select auth.uid())
  );
$$;
revoke all on function private.has_drop_membership(uuid) from public, anon, authenticated, service_role;
grant execute on function private.has_drop_membership(uuid) to anon, authenticated;

drop policy "Discoverable public Drops and authorized private Drops" on public.drops;
create policy "Discoverable Drops and member history"
  on public.drops for select to anon, authenticated
  using (
    (
      visibility = 'public'
      and status in ('scheduled', 'active')
      and expires_at > now()
    )
    or creator_id = (select auth.uid())
    or (select private.has_drop_membership(id))
  );

create function public.create_drop(
  p_title text,
  p_description text,
  p_category public.drop_category,
  p_max_participants integer,
  p_duration_minutes integer,
  p_starts_at timestamptz,
  p_visibility public.drop_visibility
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_now timestamptz := now();
  v_start timestamptz := coalesce(p_starts_at, v_now);
  v_drop_id uuid;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'Authentication required';
  end if;
  if not exists (
    select 1 from public.profiles p
    where p.id = v_user_id and p.username !~ '^member_[0-9a-f]{17}$'
  ) then
    raise exception using errcode = '42501', message = 'Complete your profile before creating a Drop';
  end if;

  if char_length(btrim(coalesce(p_title, ''))) not between 3 and 100 then
    raise exception using errcode = '22023', message = 'Title must be 3–100 characters';
  end if;
  if char_length(btrim(coalesce(p_description, ''))) not between 1 and 1000 then
    raise exception using errcode = '22023', message = 'Description must be 1–1000 characters';
  end if;
  if p_max_participants not between 2 and 20 then
    raise exception using errcode = '22023', message = 'Capacity must be between 2 and 20';
  end if;
  if p_duration_minutes not between 15 and 240 then
    raise exception using errcode = '22023', message = 'Duration must be between 15 and 240 minutes';
  end if;
  if v_start < v_now - interval '1 minute' or v_start > v_now + interval '7 days' then
    raise exception using errcode = '22023', message = 'Start time must be now or within the next 7 days';
  end if;

  insert into public.drops (
    creator_id, title, description, category, activity_type, visibility,
    max_participants, status, starts_at, expires_at
  ) values (
    v_user_id,
    btrim(p_title),
    btrim(p_description),
    p_category,
    'online',
    p_visibility,
    p_max_participants,
    case when v_start > v_now then 'scheduled'::public.drop_status else 'active'::public.drop_status end,
    v_start,
    v_start + make_interval(mins => p_duration_minutes)
  ) returning id into v_drop_id;

  insert into public.drop_participants (drop_id, user_id, role)
  values (v_drop_id, v_user_id, 'creator');

  return v_drop_id;
end;
$$;
revoke all on function public.create_drop(text, text, public.drop_category, integer, integer, timestamptz, public.drop_visibility)
  from public, anon, authenticated, service_role;
grant execute on function public.create_drop(text, text, public.drop_category, integer, integer, timestamptz, public.drop_visibility)
  to authenticated;

create function public.cancel_my_drop(p_drop_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_drop public.drops%rowtype;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'Authentication required';
  end if;

  select * into v_drop
  from public.drops d
  where d.id = p_drop_id and d.creator_id = v_user_id
  for update;

  if not found then
    raise exception using errcode = '42501', message = 'Drop not found or you are not its creator';
  end if;
  if v_drop.status not in ('scheduled', 'active') or v_drop.expires_at <= now() then
    raise exception using errcode = '22023', message = 'This Drop can no longer be cancelled';
  end if;

  update public.drops set status = 'cancelled' where id = p_drop_id;
end;
$$;
revoke all on function public.cancel_my_drop(uuid) from public, anon, authenticated, service_role;
grant execute on function public.cancel_my_drop(uuid) to authenticated;

create view public.drop_details
with (security_invoker = true)
as
select
  d.id,
  d.creator_id,
  d.title,
  d.description,
  d.category,
  d.activity_type,
  d.visibility,
  d.max_participants,
  d.status,
  d.starts_at,
  d.expires_at,
  d.created_at,
  d.updated_at,
  case
    when d.status = 'cancelled' then 'cancelled'
    when d.status = 'archived' then 'archived'
    when d.status = 'expired' or d.expires_at <= now() then 'expired'
    when d.status = 'scheduled' or d.starts_at > now() then 'scheduled'
    else 'active'
  end as current_status
from public.drops d;
revoke all on public.drop_details from public, anon, authenticated, service_role;
grant select on public.drop_details to anon, authenticated;

commit;
