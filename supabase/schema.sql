-- Tehnosklad Stage 1 schema design.
-- This file is not an applied migration yet. In Stage 3 create a migration with
-- `supabase migration new initial_schema`, copy this reviewed SQL into it, then
-- run the local database, advisors and RLS tests before linking production.

create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public;

create type public.stock_status as enum ('in_stock', 'out_of_stock', 'on_order');
create type public.attribute_data_type as enum (
  'text',
  'number',
  'boolean',
  'single_select',
  'multi_select',
  'range',
  'color'
);
create type public.lead_status as enum (
  'new',
  'processing',
  'contacted',
  'successful',
  'rejected'
);
create type public.delivery_status as enum ('pending', 'sent', 'failed');

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles (
  code text primary key check (code ~ '^[a-z][a-z0-9_]*$'),
  description text not null,
  created_at timestamptz not null default now()
);

insert into public.roles (code, description)
values ('admin', 'Full administration'), ('editor', 'Catalog management');

create table public.user_roles (
  user_id uuid not null references public.users (id) on delete cascade,
  role_code text not null references public.roles (code) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (user_id, role_code)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories (id) on delete restrict,
  image_path text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (parent_id is null or parent_id <> id)
);

create table public.category_translations (
  category_id uuid not null references public.categories (id) on delete cascade,
  locale text not null check (locale in ('ru', 'ro')),
  name text not null check (char_length(name) between 1 and 160),
  description text,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  seo_title text,
  seo_description text,
  primary key (category_id, locale),
  unique (locale, slug)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  brand text not null check (char_length(brand) between 1 and 120),
  model text,
  sku text unique,
  price numeric(12, 2) not null check (price >= 0),
  old_price numeric(12, 2) check (old_price is null or old_price >= price),
  currency char(3) not null default 'MDL' check (currency = upper(currency)),
  stock_status public.stock_status not null default 'in_stock',
  quantity integer check (quantity is null or quantity >= 0),
  is_featured boolean not null default false,
  is_popular boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_translations (
  product_id uuid not null references public.products (id) on delete cascade,
  locale text not null check (locale in ('ru', 'ro')),
  name text not null check (char_length(name) between 1 and 240),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  short_description text,
  description text,
  seo_title text,
  seo_description text,
  primary key (product_id, locale),
  unique (locale, slug)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null unique,
  alt_ru text,
  alt_ro text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index product_images_one_primary_idx
  on public.product_images (product_id)
  where is_primary;

create table public.attribute_groups (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z][a-z0-9_]*$'),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.attribute_group_translations (
  group_id uuid not null references public.attribute_groups (id) on delete cascade,
  locale text not null check (locale in ('ru', 'ro')),
  name text not null,
  primary key (group_id, locale)
);

create table public.attributes (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.attribute_groups (id) on delete set null,
  code text not null unique check (code ~ '^[a-z][a-z0-9_]*$'),
  data_type public.attribute_data_type not null,
  unit_code text,
  is_filterable boolean not null default false,
  is_comparable boolean not null default true,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.attribute_translations (
  attribute_id uuid not null references public.attributes (id) on delete cascade,
  locale text not null check (locale in ('ru', 'ro')),
  name text not null,
  help_text text,
  primary key (attribute_id, locale)
);

create table public.attribute_options (
  id uuid primary key default gen_random_uuid(),
  attribute_id uuid not null references public.attributes (id) on delete cascade,
  code text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  unique (attribute_id, code)
);

create table public.attribute_option_translations (
  option_id uuid not null references public.attribute_options (id) on delete cascade,
  locale text not null check (locale in ('ru', 'ro')),
  label text not null,
  primary key (option_id, locale)
);

create table public.category_attributes (
  category_id uuid not null references public.categories (id) on delete cascade,
  attribute_id uuid not null references public.attributes (id) on delete restrict,
  is_required boolean not null default false,
  is_filterable boolean,
  sort_order integer not null default 0,
  primary key (category_id, attribute_id)
);

create table public.product_attribute_values (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  attribute_id uuid not null references public.attributes (id) on delete restrict,
  ordinal integer not null default 0 check (ordinal >= 0),
  text_value text,
  number_value numeric,
  boolean_value boolean,
  option_id uuid references public.attribute_options (id) on delete restrict,
  color_value text check (color_value is null or color_value ~ '^#[0-9A-Fa-f]{6}$'),
  range_min numeric,
  range_max numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, attribute_id, ordinal),
  check (range_min is null = (range_max is null)),
  check (range_min is null or range_min <= range_max),
  check (
    (text_value is not null)::integer
    + (number_value is not null)::integer
    + (boolean_value is not null)::integer
    + (option_id is not null)::integer
    + (color_value is not null)::integer
    + (range_min is not null)::integer = 1
  )
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  client_request_id uuid not null unique,
  product_id uuid references public.products (id) on delete set null,
  product_name text,
  product_price numeric(12, 2),
  product_url text,
  customer_name text not null check (char_length(customer_name) between 1 and 120),
  phone text not null check (char_length(phone) between 7 and 32),
  telegram_username text,
  comment text check (comment is null or char_length(comment) <= 2000),
  locale text not null check (locale in ('ru', 'ro')),
  source text not null check (char_length(source) between 1 and 80),
  consent_accepted boolean not null check (consent_accepted),
  consent_version text not null,
  consented_at timestamptz not null,
  status public.lead_status not null default 'new',
  internal_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_status_history (
  id bigint generated always as identity primary key,
  lead_id uuid not null references public.leads (id) on delete cascade,
  from_status public.lead_status,
  to_status public.lead_status not null,
  changed_by uuid references public.users (id) on delete set null,
  comment text,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assistant_knowledge (
  id uuid primary key default gen_random_uuid(),
  locale text not null check (locale in ('ru', 'ro')),
  title text not null,
  content text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assistant_logs (
  id bigint generated always as identity primary key,
  request_id uuid not null unique,
  locale text not null check (locale in ('ru', 'ro')),
  provider text,
  model text,
  mode text not null,
  success boolean not null,
  latency_ms integer check (latency_ms is null or latency_ms >= 0),
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  error_code text,
  session_hash text,
  created_at timestamptz not null default now()
);

create table public.telegram_delivery_logs (
  id bigint generated always as identity primary key,
  lead_id uuid not null references public.leads (id) on delete cascade,
  attempt_no integer not null check (attempt_no > 0),
  status public.delivery_status not null default 'pending',
  http_status integer,
  error_code text,
  error_message text,
  created_at timestamptz not null default now(),
  delivered_at timestamptz,
  unique (lead_id, attempt_no)
);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'users', 'categories', 'products', 'attribute_groups', 'attributes',
    'product_attribute_values', 'leads', 'site_settings', 'assistant_knowledge'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function private.set_updated_at()',
      table_name
    );
  end loop;
end;
$$;

create or replace function private.has_app_role(required_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles as user_role
    join public.users as app_user on app_user.id = user_role.user_id
    where user_role.user_id = (select auth.uid())
      and app_user.is_active
      and user_role.role_code = any(required_roles)
  );
$$;

revoke all on function private.has_app_role(text[]) from public;
grant usage on schema private to authenticated;
grant execute on function private.has_app_role(text[]) to authenticated;

create index categories_parent_sort_idx on public.categories (parent_id, sort_order)
where archived_at is null;
create index categories_public_sort_idx on public.categories (is_published, sort_order)
where archived_at is null;
create index products_category_public_idx
on public.products (category_id, is_published, sort_order)
where archived_at is null;
create index products_price_idx on public.products (price);
create index products_stock_idx on public.products (stock_status);
create index products_featured_idx on public.products (is_featured, sort_order)
where is_published and archived_at is null;
create index product_images_product_sort_idx on public.product_images (product_id, sort_order);
create index attributes_group_sort_idx on public.attributes (group_id, sort_order);
create index category_attributes_sort_idx on public.category_attributes (category_id, sort_order);
create index product_attribute_number_idx
on public.product_attribute_values (attribute_id, number_value)
where number_value is not null;
create index product_attribute_option_idx
on public.product_attribute_values (attribute_id, option_id)
where option_id is not null;
create index leads_status_created_idx on public.leads (status, created_at desc);
create index telegram_delivery_status_idx
on public.telegram_delivery_logs (status, created_at);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'users', 'roles', 'user_roles', 'categories', 'category_translations',
    'products', 'product_translations', 'product_images', 'attribute_groups',
    'attribute_group_translations', 'attributes', 'attribute_translations',
    'attribute_options', 'attribute_option_translations', 'category_attributes',
    'product_attribute_values', 'leads', 'lead_status_history', 'site_settings',
    'assistant_knowledge', 'assistant_logs', 'telegram_delivery_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end;
$$;

-- Public catalog policies always check the published parent.
create policy public_categories_select on public.categories
for select to anon, authenticated
using (is_published and archived_at is null);

create policy public_category_translations_select on public.category_translations
for select to anon, authenticated
using (exists (
  select 1 from public.categories as category
  where category.id = category_id and category.is_published and category.archived_at is null
));

create policy public_products_select on public.products
for select to anon, authenticated
using (
  is_published and archived_at is null and exists (
    select 1 from public.categories as category
    where category.id = category_id and category.is_published and category.archived_at is null
  )
);

create policy public_product_translations_select on public.product_translations
for select to anon, authenticated
using (exists (
  select 1 from public.products as product
  join public.categories as category on category.id = product.category_id
  where product.id = product_id
    and product.is_published and product.archived_at is null
    and category.is_published and category.archived_at is null
));

create policy public_product_images_select on public.product_images
for select to anon, authenticated
using (exists (
  select 1 from public.products as product
  join public.categories as category on category.id = product.category_id
  where product.id = product_id
    and product.is_published and product.archived_at is null
    and category.is_published and category.archived_at is null
));

create policy public_attribute_groups_select on public.attribute_groups
for select to anon, authenticated using (is_active);
create policy public_attribute_group_translations_select on public.attribute_group_translations
for select to anon, authenticated using (exists (
  select 1 from public.attribute_groups as attribute_group
  where attribute_group.id = group_id and attribute_group.is_active
));
create policy public_attributes_select on public.attributes
for select to anon, authenticated using (is_active);
create policy public_attribute_translations_select on public.attribute_translations
for select to anon, authenticated using (exists (
  select 1 from public.attributes as attribute
  where attribute.id = attribute_id and attribute.is_active
));
create policy public_attribute_options_select on public.attribute_options
for select to anon, authenticated using (
  is_active and exists (
    select 1 from public.attributes as attribute
    where attribute.id = attribute_id and attribute.is_active
  )
);
create policy public_attribute_option_translations_select on public.attribute_option_translations
for select to anon, authenticated using (exists (
  select 1 from public.attribute_options as attribute_option
  join public.attributes as attribute on attribute.id = attribute_option.attribute_id
  where attribute_option.id = option_id and attribute_option.is_active and attribute.is_active
));
create policy public_category_attributes_select on public.category_attributes
for select to anon, authenticated using (exists (
  select 1 from public.categories as category
  join public.attributes as attribute on attribute.id = attribute_id
  where category.id = category_id
    and category.is_published and category.archived_at is null and attribute.is_active
));
create policy public_product_attribute_values_select on public.product_attribute_values
for select to anon, authenticated using (exists (
  select 1 from public.products as product
  join public.categories as category on category.id = product.category_id
  join public.attributes as attribute on attribute.id = attribute_id
  where product.id = product_id
    and product.is_published and product.archived_at is null
    and category.is_published and category.archived_at is null
    and attribute.is_active
));
create policy public_site_settings_select on public.site_settings
for select to anon, authenticated using (is_public);

-- Catalog editors. Admins are included in every editor policy.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'categories', 'category_translations', 'products', 'product_translations',
    'product_images', 'attribute_groups', 'attribute_group_translations',
    'attributes', 'attribute_translations', 'attribute_options',
    'attribute_option_translations', 'category_attributes', 'product_attribute_values'
  ]
  loop
    execute format(
      'create policy catalog_staff_all on public.%I for all to authenticated using ((select private.has_app_role(array[''admin'', ''editor'']))) with check ((select private.has_app_role(array[''admin'', ''editor''])))',
      table_name
    );
  end loop;
end;
$$;

-- Sensitive tables are available only to admins. There is intentionally no
-- anon INSERT policy for leads; lead intake will be server-mediated.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'users', 'roles', 'user_roles', 'leads', 'lead_status_history',
    'site_settings', 'assistant_knowledge', 'assistant_logs', 'telegram_delivery_logs'
  ]
  loop
    execute format(
      'create policy admins_all on public.%I for all to authenticated using ((select private.has_app_role(array[''admin'']))) with check ((select private.has_app_role(array[''admin''])))',
      table_name
    );
  end loop;
end;
$$;

-- Explicit Data API privileges: recent Supabase projects may not expose SQL-created
-- tables automatically. RLS remains the row-level enforcement layer.
grant select on public.categories, public.category_translations, public.products,
  public.product_translations, public.product_images, public.attribute_groups,
  public.attribute_group_translations, public.attributes, public.attribute_translations,
  public.attribute_options, public.attribute_option_translations, public.category_attributes,
  public.product_attribute_values, public.site_settings to anon;

grant select on all tables in schema public to authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

revoke all on public.leads, public.lead_status_history, public.assistant_logs,
  public.telegram_delivery_logs, public.users, public.roles, public.user_roles from anon;
