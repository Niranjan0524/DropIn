begin;
select plan(18);

select has_function('public', 'create_drop', ARRAY[
  'text', 'text', 'public.drop_category', 'integer', 'integer', 'timestamp with time zone', 'public.drop_visibility'
], 'Drop creation is a trusted database operation');
select ok(
  has_function_privilege('authenticated', 'public.create_drop(text,text,public.drop_category,integer,integer,timestamp with time zone,public.drop_visibility)', 'EXECUTE'),
  'signed-in users can call the create operation'
);
select ok(
  not has_function_privilege('anon', 'public.create_drop(text,text,public.drop_category,integer,integer,timestamp with time zone,public.drop_visibility)', 'EXECUTE'),
  'anonymous users cannot create Drops'
);
select ok(
  not has_table_privilege('authenticated', 'public.drops', 'INSERT'),
  'clients cannot insert Drops directly'
);
select ok(
  not has_table_privilege('authenticated', 'public.drops', 'UPDATE'),
  'clients cannot change Drop ownership, status, capacity, or timing directly'
);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('30000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'drop-creator@example.test', '', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('30000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'other-creator@example.test', '', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now());

update public.profiles set username = 'drop_creator' where id = '30000000-0000-4000-8000-000000000001';
update public.profiles set username = 'other_creator' where id = '30000000-0000-4000-8000-000000000002';

set local role authenticated;
select set_config('request.jwt.claim.sub', '30000000-0000-4000-8000-000000000001', true);
select lives_ok(
  $$ select public.create_drop('Study sprint', 'A focused study session.', 'learning', 6, 90, now() + interval '1 hour', 'public') $$,
  'a signed-in user can create a scheduled Drop'
);
select is(
  (select count(*)::integer from public.drops where creator_id = '30000000-0000-4000-8000-000000000001'),
  1,
  'creator identity comes from the signed-in user'
);
select is(
  (select count(*)::integer from public.drop_participants dp join public.drops d on d.id = dp.drop_id
   where d.creator_id = '30000000-0000-4000-8000-000000000001' and dp.user_id = d.creator_id and dp.role = 'creator' and dp.status = 'active'),
  1,
  'creator membership is inserted atomically'
);
select is(
  (select status::text from public.drops where creator_id = '30000000-0000-4000-8000-000000000001'),
  'scheduled',
  'a future start is stored as scheduled'
);
select is(
  (select extract(epoch from expires_at - starts_at)::integer / 60 from public.drops where creator_id = '30000000-0000-4000-8000-000000000001'),
  90,
  'expiry is calculated from the requested duration'
);
select throws_ok(
  $$ select public.create_drop('Too many people', 'This exceeds the supported group size.', 'gaming', 21, 60, now(), 'public') $$,
  '22023',
  'Capacity must be between 2 and 20',
  'the database rejects capacity outside the product limit'
);
select lives_ok(
  $$ select public.cancel_my_drop((select id from public.drops where creator_id = '30000000-0000-4000-8000-000000000001')) $$,
  'the creator can cancel their scheduled Drop'
);
select is(
  (select status::text from public.drops where creator_id = '30000000-0000-4000-8000-000000000001'),
  'cancelled',
  'cancellation preserves the Drop record and history'
);

select set_config('request.jwt.claim.sub', '30000000-0000-4000-8000-000000000002', true);
select throws_ok(
  $$ select public.cancel_my_drop((select id from public.drops where creator_id = '30000000-0000-4000-8000-000000000001')) $$,
  '42501',
  'Drop not found or you are not its creator',
  'another user cannot cancel the creator''s Drop'
);

reset role;
insert into public.drops (
  id, creator_id, title, description, category, visibility, max_participants,
  status, starts_at, expires_at
) values (
  '40000000-0000-4000-8000-000000000001',
  '30000000-0000-4000-8000-000000000001',
  'Expired activity', 'This Drop has ended.', 'social', 'public', 4,
  'active', now() - interval '2 hours', now() - interval '1 hour'
);

set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select is(
  (select count(*)::integer from public.drops where creator_id = '30000000-0000-4000-8000-000000000001'),
  0,
  'cancelled public Drops are not discoverable to anonymous users'
);
select is(
  (select count(*)::integer from public.drops where id = '40000000-0000-4000-8000-000000000001'),
  0,
  'expired public Drops are not discoverable even if stored status is still active'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '30000000-0000-4000-8000-000000000001', true);
select is(
  (select count(*)::integer from public.drops where creator_id = '30000000-0000-4000-8000-000000000001' and title = 'Study sprint'),
  1,
  'the creator retains access to cancelled Drop history'
);
select is(
  (select current_status from public.drop_details where id = '40000000-0000-4000-8000-000000000001'),
  'expired',
  'the read model derives expiration from the timestamp, not a cleanup job'
);

select * from finish();
rollback;
