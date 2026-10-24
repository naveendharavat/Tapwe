-- Tapwe tables for the Supabase SQL Editor. Same schema as tapwe-server/src/database/migrations/1792838598391-Init.ts.
begin;

create type "public"."users_role_enum" as enum ('owner', 'admin');
create table "users" (
  "id" serial not null,
  "name" character varying(120) not null,
  "email" character varying(190) not null,
  "password_hash" character varying(100) not null,
  "role" "public"."users_role_enum" not null default 'owner',
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  constraint "UQ_97672ac88f789774dd47f7c8be3" unique ("email"),
  constraint "PK_a3ffb1c0c8416b9fc6f907b7433" primary key ("id")
);

create type "public"."cards_status_enum" as enum ('draft', 'active', 'paused');
create type "public"."cards_destination_type_enum" as enum ('profile', 'url', 'menu', 'form');
create table "cards" (
  "code" character varying(6) not null,
  "user_id" integer,
  "owner_email" character varying(190),
  "name" character varying(120) not null,
  "status" "public"."cards_status_enum" not null default 'draft',
  "destination_type" "public"."cards_destination_type_enum" not null default 'profile',
  "destination_url" character varying(500),
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  "deleted_at" timestamp with time zone,
  constraint "PK_af8c1e25df58bc35de84c8e54e8" primary key ("code")
);
create index "IDX_1c54b595af68cc3870b651e11c" on "cards" ("user_id");
create index "IDX_7107fcf8f93d725547e11f903d" on "cards" ("owner_email");

create table "tap_events" (
  "id" serial not null,
  "card_code" character varying(6) not null,
  "happened_at" timestamp with time zone not null default now(),
  "user_agent" character varying(300),
  constraint "PK_72a09013ce23e42dadb57622d09" primary key ("id")
);
create index "IDX_ecb4d676a394039c260fd77c9c" on "tap_events" ("card_code", "happened_at");

create type "public"."card_requests_status_enum" as enum ('new', 'contacted', 'fulfilled');
create table "card_requests" (
  "id" serial not null,
  "name" character varying(120) not null,
  "business_name" character varying(120) not null,
  "email" character varying(190) not null,
  "phone" character varying(10) not null,
  "business_type" character varying(60) not null,
  "quantity" character varying(30) not null,
  "destinations" jsonb not null,
  "city" character varying(120),
  "note" text,
  "agreed" boolean not null default false,
  "status" "public"."card_requests_status_enum" not null default 'new',
  "created_at" timestamp with time zone not null default now(),
  constraint "PK_9338dfcc37c364cdd78c191da07" primary key ("id")
);

create type "public"."change_requests_status_enum" as enum ('open', 'done');
create table "change_requests" (
  "id" serial not null,
  "card_code" character varying(6) not null,
  "message" character varying(500) not null,
  "status" "public"."change_requests_status_enum" not null default 'open',
  "created_at" timestamp with time zone not null default now(),
  constraint "PK_e3f28255a6e818820f18f6d5956" primary key ("id")
);
create index "IDX_dbcf510c3b94d544c26286bf23" on "change_requests" ("card_code");

create table "profiles" (
  "id" serial not null,
  "user_id" integer not null,
  "business_name" character varying(120),
  "description" character varying(200),
  "phone" character varying(20),
  "website" character varying(500),
  "updated_at" timestamp with time zone not null default now(),
  constraint "REL_9e432b7df0d182f8d292902d1a" unique ("user_id"),
  constraint "PK_8e520eb4da7dc01d0e190447c8e" primary key ("id")
);

alter table "cards" add constraint "FK_1c54b595af68cc3870b651e11c9" foreign key ("user_id") references "users"("id") on delete set null on update no action;
alter table "tap_events" add constraint "FK_e1106d4be5d9da619b3d5d09cc5" foreign key ("card_code") references "cards"("code") on delete cascade on update no action;
alter table "change_requests" add constraint "FK_dbcf510c3b94d544c26286bf23e" foreign key ("card_code") references "cards"("code") on delete cascade on update no action;
alter table "profiles" add constraint "FK_9e432b7df0d182f8d292902d1a2" foreign key ("user_id") references "users"("id") on delete cascade on update no action;

-- Records the migration as done so `yarn migration:run` won't create these tables again.
create table "migrations" (
  "id" serial not null,
  "timestamp" bigint not null,
  "name" character varying not null,
  constraint "PK_8c82d7f526340ab734260ea46be" primary key ("id")
);
insert into "migrations" ("timestamp", "name") values (1792838598391, 'Init1792838598391');

alter table "users" enable row level security;
alter table "cards" enable row level security;
alter table "tap_events" enable row level security;
alter table "card_requests" enable row level security;
alter table "change_requests" enable row level security;
alter table "profiles" enable row level security;
alter table "migrations" enable row level security;

commit;
