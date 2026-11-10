begin;
select plan(16);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'user_interests', 'interests table exists');
select has_table('public', 'drops', 'drops table exists');
select has_table('public', 'drop_participants', 'drop participants table exists');
select has_table('public', 'messages', 'messages table exists');
select has_table('public', 'reports', 'reports table exists');
select has_table('public', 'user_blocks', 'user blocks table exists');

select ok((select relrowsecurity from pg_class where oid = 'public.profiles'::regclass), 'profiles has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.drops'::regclass), 'drops has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.messages'::regclass), 'messages has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.reports'::regclass), 'reports has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.user_blocks'::regclass), 'blocks has RLS enabled');

select has_index('public', 'drop_participants', 'drop_participants_one_active_membership', 'active membership uniqueness is indexed');
select has_function('public', 'save_my_profile', ARRAY[
  'text', 'text', 'text', 'public.profile_visibility', 'text[]'
], 'profile update is one transactional RPC');
select has_function('public', 'create_drop', ARRAY[
  'text', 'text', 'public.drop_category', 'integer', 'integer', 'timestamp with time zone', 'public.drop_visibility'
], 'Drop creation is one trusted transactional RPC');
select ok(
  not has_table_privilege('authenticated', 'public.drop_participants', 'INSERT'),
  'clients cannot write membership rows directly'
);

select * from finish();
rollback;
