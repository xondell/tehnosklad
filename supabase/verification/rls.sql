-- Transactional RLS verification after `npm run db:reset:local`.
-- The script creates temporary rows, performs real assertions and rolls back.

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

insert into public.products (
  id, category_id, brand, model, sku, price_minor, is_published, sort_order
) values (
  '90000000-0000-4000-8000-000000000003',
  '10000000-0000-4000-8000-000000000001',
  'Draft', 'Draft', 'RLS-DRAFT-PRODUCT', 100, false, 999
);
insert into public.product_translations (
  product_id, locale, name, slug, short_description, description
) values
  (
    '90000000-0000-4000-8000-000000000003', 'ru', 'Черновой товар',
    'rls-draft-product-ru', 'Не виден', 'Не виден'
  ),
  (
    '90000000-0000-4000-8000-000000000003', 'ro', 'Produs schiță',
    'rls-draft-product-ro', 'Nu este vizibil', 'Nu este vizibil'
  );

set local role anon;

do $$
begin
  if (select count(*) from public.products) <> 12 then
    raise exception 'anon published product count is not 12';
  end if;
  if (select count(*) from public.categories) <> 3 then
    raise exception 'anon published category count is not 3';
  end if;
  if (select count(*) from public.site_settings) <> 14 then
    raise exception 'anon public settings count is not 14';
  end if;
  if (select count(*) from public.category_translations) <> 6 then
    raise exception 'anon category translation count is not 6';
  end if;
  if (select count(*) from public.product_translations) <> 24 then
    raise exception 'anon product translation count is not 24';
  end if;
  if (select count(*) from public.category_attributes) <> 9 then
    raise exception 'anon category attribute count is not 9';
  end if;
  if (select count(*) from public.product_attribute_values) <> 36 then
    raise exception 'anon product attribute value count is not 36';
  end if;
  if exists (select 1 from public.category_slug_routes)
    or exists (select 1 from public.product_slug_routes)
  then
    raise exception 'anon can read current or draft slug routes';
  end if;

  if (
    select max(total_count)
    from public.search_public_catalog_product_ids('ru')
  ) <> 12 then
    raise exception 'anon catalog search count is not 12';
  end if;
  if exists (
    select 1
    from public.search_public_catalog_product_ids(
      p_locale => 'ru', p_brand => 'Draft'
    )
    where product_id is not null or total_count <> 0
  ) then
    raise exception 'anon catalog search exposes draft products';
  end if;

  if exists (
    select 1 from public.categories
    where id = '90000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'anon can read a draft category';
  end if;

  if exists (
    select 1 from public.products
    where id = '90000000-0000-4000-8000-000000000003'
  ) or exists (
    select 1 from public.product_translations
    where product_id = '90000000-0000-4000-8000-000000000003'
  ) then
    raise exception 'anon can read a draft product or child translation';
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
  if has_table_privilege('anon', 'public.products', 'insert')
    or has_table_privilege('anon', 'public.products', 'update')
    or has_table_privilege('anon', 'public.products', 'delete')
  then
    raise exception 'anon has catalog write grants';
  end if;
  if has_table_privilege('anon', 'public.product_slug_routes', 'insert')
    or has_table_privilege('authenticated', 'public.category_slug_routes', 'update')
  then
    raise exception 'slug route write grants are public';
  end if;
end;
$$;

set local role authenticated;

do $$
begin
  if (select count(*) from public.products) <> 12
    or (select count(*) from public.categories) <> 3
  then
    raise exception 'authenticated non-admin catalog differs from anon';
  end if;
  if exists (select 1 from public.profiles)
    or exists (select 1 from public.user_roles)
  then
    raise exception 'authenticated request without uid can read identity rows';
  end if;
  begin
    insert into public.user_roles (user_id, role)
    values ('90000000-0000-4000-8000-000000000099', 'admin');
    raise exception 'authenticated non-admin self-role insert succeeded';
  exception when insufficient_privilege then
    null;
  end;
end;
$$;

reset role;

rollback;

-- Authenticated non-admin/admin tests require real local Auth JWTs so auth.uid()
-- is populated. Follow docs/rls-access-matrix.md for the exact dashboard steps.
