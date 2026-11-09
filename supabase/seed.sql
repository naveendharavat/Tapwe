-- Demo data with published passwords. Never run this on the live project.
do $$
declare
  account record;
  new_id uuid;
begin
  for account in
    select * from (values
      ('admin01@tapwe.in', 'admin@0123', 'Tapwe Admin'),
      ('demo@tapwe.in', 'demo12345', 'Demo User')
    ) as a (email, password, name)
  loop
    if exists (select 1 from auth.users where email = account.email) then
      continue;
    end if;
    new_id := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change, email_change_token_new
    ) values (
      '00000000-0000-0000-0000-000000000000', new_id, 'authenticated', 'authenticated', account.email,
      extensions.crypt(account.password, extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', jsonb_build_object('name', account.name), now(), now(),
      '', '', '', ''
    );
    insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values (new_id::text, new_id, jsonb_build_object('sub', new_id::text, 'email', account.email), 'email', now(), now(), now());
  end loop;
end $$;

update public.users set role = 'admin' where email = 'admin01@tapwe.in';

update public.profiles
set business_name = 'Your Business', description = 'Café · Open until 10 pm', phone = '9876543210', website = 'https://example.com'
where user_id = (select id from public.users where email = 'demo@tapwe.in');

insert into public.cards (code, owner_email, name, status, destination_type, destination_url) values
  ('ab12cd', 'demo@tapwe.in', 'Front desk card', 'active', 'profile', null),
  ('k9f2xq', 'demo@tapwe.in', 'Table menu', 'active', 'menu', 'https://example.com/menu'),
  ('m4t8zr', 'demo@tapwe.in', 'Feedback card', 'draft', 'form', 'https://forms.example.com/feedback')
on conflict (code) do nothing;

-- The design's sample week, oldest first: taps at noon IST, a minute apart, alternating between the two live cards.
insert into public.tap_events (card_code, happened_at, user_agent)
select
  case when n % 2 = 1 then 'k9f2xq' else 'ab12cd' end,
  (((now() at time zone 'Asia/Kolkata')::date - (6 - day_index)) + time '12:00') at time zone 'Asia/Kolkata' + n * interval '1 minute',
  'seed'
from unnest(array[12, 18, 9, 24, 30, 38, 21]) with ordinality as week (taps, day_number)
cross join lateral (select (day_number - 1)::int as day_index) d
cross join lateral generate_series(0, taps - 1) as n
where not exists (select 1 from public.tap_events where user_agent = 'seed');
