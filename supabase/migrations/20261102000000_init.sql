-- Tapwe schema. Accounts live in Supabase Auth; every access rule is a row-level security policy.

create type public.user_role as enum ('owner', 'admin');
create type public.card_status as enum ('draft', 'active', 'paused');
create type public.destination_type as enum ('profile', 'url', 'menu', 'form');
create type public.card_request_status as enum ('new', 'contacted', 'fulfilled');
create type public.change_request_status as enum ('open', 'done');

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name varchar(120) not null,
  email varchar(190) not null unique,
  role public.user_role not null default 'owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  user_id uuid primary key references public.users (id) on delete cascade,
  business_name varchar(120),
  description varchar(200),
  phone varchar(10) check (phone ~ '^[6-9][0-9]{9}$'),
  website varchar(500) check (website ~* '^https?://'),
  updated_at timestamptz not null default now()
);

create function public.new_card_code() returns varchar
language plpgsql volatile set search_path = '' as $$
declare
  alphabet constant text := '0123456789abcdefghijklmnopqrstuvwxyz';
  candidate varchar(6);
begin
  for attempt in 1..5 loop
    candidate := '';
    for i in 1..6 loop
      candidate := candidate || substr(alphabet, 1 + get_byte(extensions.gen_random_bytes(1), 0) % 36, 1);
    end loop;
    if not exists (select 1 from public.cards where code = candidate) then
      return candidate;
    end if;
  end loop;
  raise exception 'Could not create a unique card code. Please try again.';
end $$;

create table public.cards (
  code varchar(6) primary key default public.new_card_code() check (code ~ '^[0-9a-z]{6}$'),
  user_id uuid references public.users (id) on delete set null,
  owner_email varchar(190),
  name varchar(120) not null check (btrim(name) <> ''),
  status public.card_status not null default 'draft',
  destination_type public.destination_type not null default 'profile',
  destination_url varchar(500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint cards_destination_check check (
    (destination_type = 'profile' and destination_url is null) or coalesce(destination_url ~* '^https?://', false)
  )
);
create index cards_user_id_idx on public.cards (user_id);
create index cards_owner_email_idx on public.cards (owner_email);

create table public.tap_events (
  id bigint generated always as identity primary key,
  card_code varchar(6) not null references public.cards (code) on delete cascade,
  happened_at timestamptz not null default now(),
  user_agent varchar(300)
);
create index tap_events_card_code_happened_at_idx on public.tap_events (card_code, happened_at);

create table public.card_requests (
  id bigint generated always as identity primary key,
  name varchar(120) not null check (btrim(name) <> ''),
  business_name varchar(120) not null check (btrim(business_name) <> ''),
  email varchar(190) not null,
  phone varchar(10) not null check (phone ~ '^[6-9][0-9]{9}$'),
  business_type varchar(60) not null,
  quantity varchar(30) not null,
  destinations jsonb not null check (jsonb_typeof(destinations) = 'array' and jsonb_array_length(destinations) > 0),
  city varchar(120),
  note varchar(2000),
  agreed boolean not null check (agreed),
  status public.card_request_status not null default 'new',
  created_at timestamptz not null default now()
);

create table public.change_requests (
  id bigint generated always as identity primary key,
  card_code varchar(6) not null references public.cards (code) on delete cascade,
  message varchar(500) not null check (btrim(message) <> ''),
  status public.change_request_status not null default 'open',
  created_at timestamptz not null default now()
);
create index change_requests_card_code_idx on public.change_requests (card_code);

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.users where id = (select auth.uid()) and role = 'admin')
$$;

-- Triggers

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger users_touch before update on public.users for each row execute function public.touch_updated_at();
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();

-- A new account gets a profile and claims every card the team already made for its email.
create function public.handle_new_auth_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(nullif(left(btrim(new.raw_user_meta_data ->> 'name'), 120), ''), split_part(new.email, '@', 1)),
    lower(new.email)
  );
  insert into public.profiles (user_id) values (new.id);
  update public.cards set user_id = new.id where owner_email = lower(new.email) and user_id is null;
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_auth_user();

create function public.handle_auth_user_updated() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.users
  set email = lower(new.email),
      name = coalesce(nullif(left(btrim(new.raw_user_meta_data ->> 'name'), 120), ''), name)
  where id = new.id;
  return new;
end $$;

create trigger on_auth_user_updated after update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_auth_user_updated();

-- Cards follow their owner email: setting or changing it links the card to that account, if one exists.
create function public.prepare_card() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  new.owner_email := nullif(lower(btrim(new.owner_email)), '');
  new.name := btrim(new.name);
  if new.destination_type = 'profile' then
    new.destination_url := null;
  end if;
  if tg_op = 'INSERT' or new.owner_email is distinct from old.owner_email then
    new.user_id := (select id from public.users where email = new.owner_email);
  end if;
  new.updated_at := now();
  return new;
end $$;

create trigger cards_prepare before insert or update on public.cards
for each row execute function public.prepare_card();

-- Row-level security

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.cards enable row level security;
alter table public.tap_events enable row level security;
alter table public.card_requests enable row level security;
alter table public.change_requests enable row level security;

create policy "Read own account, admins read all" on public.users
for select to authenticated using (id = (select auth.uid()) or (select public.is_admin()));

create policy "Read own profile, admins read all" on public.profiles
for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "Create own profile" on public.profiles
for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Update own profile" on public.profiles
for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "Owners read their cards, admins read all" on public.cards
for select to authenticated using ((user_id = (select auth.uid()) and deleted_at is null) or (select public.is_admin()));
create policy "Admins create cards" on public.cards
for insert to authenticated with check ((select public.is_admin()));
create policy "Admins update cards" on public.cards
for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Anyone can request a card" on public.card_requests
for insert to anon, authenticated with check (status = 'new');
create policy "Admins read card requests" on public.card_requests
for select to authenticated using ((select public.is_admin()));
create policy "Admins update card requests" on public.card_requests
for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Owners ask to change their cards" on public.change_requests
for insert to authenticated with check (
  status = 'open'
  and exists (
    select 1 from public.cards c
    where c.code = card_code and c.user_id = (select auth.uid()) and c.deleted_at is null
  )
);
create policy "Admins read change requests" on public.change_requests
for select to authenticated using ((select public.is_admin()));
create policy "Admins update change requests" on public.change_requests
for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Read models

create view public.admin_users with (security_invoker = true) as
select
  u.id,
  u.name,
  u.email,
  u.role,
  p.business_name,
  p.phone,
  (select count(*)::int from public.cards c where c.user_id = u.id and c.deleted_at is null) as card_count,
  u.created_at
from public.users u
left join public.profiles p on p.user_id = u.id;

-- Functions the app calls with supabase.rpc()

-- What a tap or scan of this card should open. Only resolvable cards count as a tap.
create function public.resolve_card(p_code text, p_user_agent text default null) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare
  card public.cards;
  profile public.profiles;
  result jsonb;
begin
  select * into card from public.cards where code = lower(p_code) and deleted_at is null;
  if not found then
    return jsonb_build_object('state', 'not-found');
  end if;
  if card.status <> 'active' or card.user_id is null then
    return jsonb_build_object('state', 'inactive');
  end if;

  if card.destination_type = 'profile' then
    select * into profile from public.profiles where user_id = card.user_id;
    result := jsonb_build_object('state', 'profile', 'profile', jsonb_build_object(
      'businessName', profile.business_name,
      'description', profile.description,
      'phone', profile.phone,
      'website', profile.website
    ));
  elsif card.destination_url is not null then
    result := jsonb_build_object('state', 'redirect', 'url', card.destination_url);
  else
    return jsonb_build_object('state', 'inactive');
  end if;

  insert into public.tap_events (card_code, user_agent) values (card.code, left(p_user_agent, 300));
  return result;
end $$;

create function public.delete_my_card(p_code text) returns void
language plpgsql volatile security definer set search_path = '' as $$
begin
  update public.cards set deleted_at = now()
  where code = p_code and user_id = (select auth.uid()) and deleted_at is null;
  if not found then
    raise exception 'Card not found.';
  end if;
end $$;

-- Taps per IST day for the signed-in owner's cards over the last 7 days, plus card totals.
create function public.my_analytics() returns jsonb
language sql stable security definer set search_path = '' as $$
  with today as (
    select (now() at time zone 'Asia/Kolkata')::date as day
  ),
  days as (
    select today.day - offs as day from today, generate_series(6, 0, -1) as offs
  ),
  my_cards as (
    select code, status from public.cards where user_id = (select auth.uid()) and deleted_at is null
  ),
  counts as (
    select (t.happened_at at time zone 'Asia/Kolkata')::date as day, count(*)::int as n
    from public.tap_events t
    join my_cards c on c.code = t.card_code
    where t.happened_at >= ((select day from today) - 6)::timestamp at time zone 'Asia/Kolkata'
    group by 1
  )
  select jsonb_build_object(
    'perDay', (
      select jsonb_agg(jsonb_build_object('date', to_char(d.day, 'YYYY-MM-DD'), 'count', coalesce(c.n, 0)) order by d.day)
      from days d left join counts c on c.day = d.day
    ),
    'totals', jsonb_build_object(
      'cards', (select count(*) from my_cards),
      'active', (select count(*) from my_cards where status = 'active'),
      'drafts', (select count(*) from my_cards where status = 'draft'),
      'taps', (select coalesce(sum(n), 0) from counts)
    )
  )
$$;

-- Admin card list with an optional status filter and a search across name, code and owner email.
create function public.search_cards(p_status public.card_status default null, p_search text default null)
returns setof public.cards
language sql stable set search_path = '' as $$
  select c.* from public.cards c
  cross join lateral (
    select '%' || replace(replace(replace(btrim(p_search), '\', '\\'), '%', '\%'), '_', '\_') || '%' as pattern
  ) s
  where c.deleted_at is null
    and (p_status is null or c.status = p_status)
    and (
      coalesce(btrim(p_search), '') = ''
      or c.name ilike pattern or c.code ilike pattern or c.owner_email ilike pattern
    )
  order by c.created_at desc, c.code asc
$$;

revoke execute on function public.delete_my_card(text) from public, anon;
revoke execute on function public.my_analytics() from public, anon;
