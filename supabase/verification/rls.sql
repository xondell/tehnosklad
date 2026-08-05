-- Manual RLS verification after `npm run db:reset:local`.
-- Run in local SQL Editor. This script is read-only and rolls back role changes.

begin;

insert into public.categories (
  id, presentation_key, is_published, sort_order
) values (
  '90000000-0000-4000-8000-000000000001', 'generic', false, 999
);
insert into public.category_translations (
  category_id, locale, name, slug, short_description, description
) values
  (
    '90000000-0000-4000-8000-000000000001', 'ru', 'Черновик',
    'rls-draft-ru', 'Не виден', 'Не виден'
  ),
  (
    '90000000-0000-4000-8000-000000000001', 'ro', 'Schiță',
    'rls-draft-ro', 'Nu este vizibil', 'Nu este vizibil'
  );

set local role anon;
select count(*) as anon_published_products from public.products;
select count(*) as anon_published_categories from public.categories;
select count(*) as anon_public_settings from public.site_settings;

do $$
begin
  if exists (
    select 1 from public.categories
    where id = '90000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'anon can read a draft category';
  end if;

  if not exists (
    select 1 from public.attribute_groups where code = 'general'
  ) then
    raise exception 'anon cannot read the published catalog attribute group';
  end if;

  begin
    insert into public.products (
      category_id, brand, model, sku, price_minor
    ) values (
      '10000000-0000-4000-8000-000000000001', 'Denied', 'Denied',
      'ANON-MUST-FAIL', 100
    );
    raise exception 'anon insert unexpectedly succeeded';
  exception when insufficient_privilege then
    null;
  end;
end;
$$;

reset role;

do $$
begin
  if has_function_privilege('anon', 'private.is_admin()', 'execute') then
    raise exception 'anon can execute private.is_admin()';
  end if;
end;
$$;

rollback;

-- Authenticated non-admin/admin tests require real local Auth JWTs so auth.uid()
-- is populated. Follow docs/rls-access-matrix.md for the exact dashboard steps.
