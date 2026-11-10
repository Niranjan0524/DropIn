begin;
select plan(14);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('10000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'owner@example.test', '', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('10000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'participant@example.test', '', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('10000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'private@example.test', '', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now());

update public.profiles
set visibility = 'public'
where id in (
  '10000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000002'
);

insert into public.drops (
  id, creator_id, title, category, visibility, max_participants,
  status, starts_at, expires_at
) values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Public Drop', 'learning', 'public', 4, 'active', now(), now() + interval '1 hour'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Private Drop', 'social', 'private', 4, 'active', now(), now() + interval '1 hour');

insert into public.drop_participants (drop_id, user_id, role)
values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'creator'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', 'participant'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'creator');

insert into public.messages (drop_id, sender_id, content)
values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Public room message'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Private room message');

set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select is((select count(*)::integer from public.profiles where id = '10000000-0000-4000-8000-000000000003'), 0, 'anonymous users cannot read a private profile');
select is((select count(*)::integer from public.profiles where id = '10000000-0000-4000-8000-000000000001'), 1, 'anonymous users can read a public profile');
select is((select count(*)::integer from public.drops where id = '20000000-0000-4000-8000-000000000002'), 0, 'anonymous users cannot read a private Drop');
select is((select count(*)::integer from public.drops where id = '20000000-0000-4000-8000-000000000001'), 1, 'anonymous users can read an unexpired public Drop');

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000002', true);
select is((select count(*)::integer from public.profiles where id = '10000000-0000-4000-8000-000000000003'), 0, 'an authenticated user cannot read another private profile');
select is((select count(*)::integer from public.profiles where id = '10000000-0000-4000-8000-000000000002'), 1, 'a user can read their own profile');
select is((select count(*)::integer from public.drops where id = '20000000-0000-4000-8000-000000000002'), 0, 'a nonparticipant cannot read a private Drop');
select is((select count(*)::integer from public.messages where drop_id = '20000000-0000-4000-8000-000000000001'), 1, 'an active participant can read room messages');
select is((select count(*)::integer from public.messages where drop_id = '20000000-0000-4000-8000-000000000002'), 0, 'a nonparticipant cannot read private room messages');

select lives_ok(
  $$ select public.save_my_profile('participant_2', 'Participant Two', 'Here to learn.', 'public', array['Learning', 'Chess']) $$,
  'a user can save their own profile and interests'
);
select is((select username from public.profiles where id = '10000000-0000-4000-8000-000000000002'), 'participant_2', 'profile updates apply to the signed-in user');
select is((select count(*)::integer from public.user_interests where user_id = '10000000-0000-4000-8000-000000000002'), 2, 'profile save replaces interests atomically');
select lives_ok(
  $$ insert into public.reports (reported_drop_id, reason, description) values ('20000000-0000-4000-8000-000000000001', 'spam', 'Test report') $$,
  'a signed-in user can submit a report'
);
select is((select count(*)::integer from public.reports where reporter_id = '10000000-0000-4000-8000-000000000002'), 1, 'report ownership is derived from the authenticated user');

select * from finish();
rollback;
