-- Deferred publication invariant checks after `npm run db:reset:local`.
-- Positive and negative integrity probes run transactionally and are rolled back.

begin;

do $$
declare
  actual_tables text[];
  expected_tables constant text[] := array[
    'attribute_group_translations', 'attribute_groups',
    'attribute_option_translations', 'attribute_options',
    'attribute_translations', 'attributes', 'categories',
    'category_attributes', 'category_slug_routes', 'category_translations',
    'product_attribute_value_translations', 'product_attribute_values',
    'product_image_translations', 'product_images', 'product_slug_routes',
    'product_translations', 'products', 'profiles', 'site_settings', 'user_roles'
  ];
begin
  select array_agg(table_name order by table_name) into actual_tables
  from information_schema.tables
  where table_schema = 'public' and table_type = 'BASE TABLE';
  if actual_tables is distinct from expected_tables then
    raise exception 'public table inventory mismatch: %', actual_tables;
  end if;

  if (
    select count(*)
    from pg_constraint as constraint_row
    join pg_class as relation on relation.oid = constraint_row.conrelid
    join pg_namespace as namespace on namespace.oid = relation.relnamespace
    where namespace.nspname = 'public' and constraint_row.contype = 'p'
  ) <> cardinality(expected_tables) then
    raise exception 'primary key inventory mismatch';
  end if;
  if exists (
    select 1
    from unnest(expected_tables) as expected(table_name)
    where not exists (
      select 1
      from pg_constraint as constraint_row
      join pg_class as relation on relation.oid = constraint_row.conrelid
      join pg_namespace as namespace on namespace.oid = relation.relnamespace
      where namespace.nspname = 'public'
        and relation.relname = expected.table_name
        and constraint_row.contype = 'p'
    )
  ) then
    raise exception 'a public table is missing its primary key';
  end if;

  if exists (
    with expected(name) as (values
      ('attribute_group_translations_group_id_fkey'),
      ('attribute_option_translations_option_id_fkey'),
      ('attribute_options_attribute_id_fkey'),
      ('attribute_translations_attribute_id_fkey'),
      ('attributes_group_id_fkey'),
      ('categories_parent_id_fkey'),
      ('category_attributes_attribute_id_fkey'),
      ('category_attributes_category_id_fkey'),
      ('category_slug_routes_category_id_fkey'),
      ('category_translations_category_id_fkey'),
      ('product_attribute_value_translations_value_id_fkey'),
      ('product_attribute_values_attribute_id_fkey'),
      ('product_attribute_values_option_id_attribute_id_fkey'),
      ('product_attribute_values_product_id_fkey'),
      ('product_image_translations_image_id_fkey'),
      ('product_images_product_id_fkey'),
      ('product_slug_routes_product_id_fkey'),
      ('product_translations_product_id_fkey'),
      ('products_category_id_fkey'),
      ('profiles_id_fkey'),
      ('user_roles_user_id_fkey')
    ), actual(name) as (
      select constraint_row.conname
      from pg_constraint as constraint_row
      join pg_class as relation on relation.oid = constraint_row.conrelid
      join pg_namespace as namespace on namespace.oid = relation.relnamespace
      where namespace.nspname = 'public' and constraint_row.contype = 'f'
    )
    (select name from expected except select name from actual)
    union all
    (select name from actual except select name from expected)
  ) then
    raise exception 'foreign key inventory mismatch';
  end if;

  if exists (
    select 1 from pg_class as relation
    join pg_namespace as namespace on namespace.oid = relation.relnamespace
    where namespace.nspname = 'public' and relation.relkind = 'r'
      and not relation.relrowsecurity
  ) then
    raise exception 'RLS is disabled on a public table';
  end if;

  if (
    select count(*) from pg_policies
    where schemaname = 'public' and policyname = 'admin_all'
  ) <> cardinality(expected_tables) then
    raise exception 'admin policy inventory mismatch';
  end if;
  if (
    select count(*) from pg_policies where schemaname = 'public'
  ) <> 40 then
    raise exception 'public policy inventory mismatch';
  end if;
  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and 'anon' = any(roles)
      and cmd <> 'SELECT'
  ) then
    raise exception 'anon has a non-select public policy';
  end if;

  if not has_function_privilege(
    'authenticated', 'private.is_admin()', 'execute'
  ) or has_function_privilege('anon', 'private.is_admin()', 'execute') then
    raise exception 'private.is_admin function grants mismatch';
  end if;

  if exists (
    select 1
    from pg_default_acl as defaults
    left join pg_namespace as namespace on namespace.oid = defaults.defaclnamespace
    cross join lateral aclexplode(defaults.defaclacl) as privilege
    where defaults.defaclrole = (select oid from pg_roles where rolname = 'postgres')
      and (
        (namespace.nspname = 'public' and defaults.defaclobjtype in ('r', 'S', 'f'))
        or (defaults.defaclnamespace = 0 and defaults.defaclobjtype = 'f')
      )
      and privilege.grantee in (
        0,
        (select oid from pg_roles where rolname = 'anon'),
        (select oid from pg_roles where rolname = 'authenticated'),
        (select oid from pg_roles where rolname = 'service_role')
      )
  ) then
    raise exception 'unsafe future-object default privilege remains';
  end if;
  if (
    select count(*)
    from pg_default_acl as defaults
    left join pg_namespace as namespace on namespace.oid = defaults.defaclnamespace
    where defaults.defaclrole = (select oid from pg_roles where rolname = 'postgres')
      and (
        (namespace.nspname = 'public' and defaults.defaclobjtype in ('r', 'S'))
        or (defaults.defaclnamespace = 0 and defaults.defaclobjtype = 'f')
      )
  ) <> 3 then
    raise exception 'default privilege inventory mismatch';
  end if;

  if exists (
    select 1
    from unnest(array[
      'categories_parent_fk_idx', 'products_category_fk_idx',
      'category_attributes_attribute_fk_idx',
      'product_attribute_values_attribute_fk_idx',
      'category_slug_routes_entity_idx', 'product_slug_routes_entity_idx'
    ]) as expected(index_name)
    where not exists (
      select 1 from pg_class as index_relation
      join pg_namespace as namespace on namespace.oid = index_relation.relnamespace
      join pg_index as index_row on index_row.indexrelid = index_relation.oid
      where namespace.nspname = 'public'
        and index_relation.relname = expected.index_name
        and index_row.indisvalid
    )
  ) then
    raise exception 'required foreign-key index is missing';
  end if;

  if not exists (
    select 1 from storage.buckets
    where id = 'product-images' and name = 'product-images' and public
      and file_size_limit = 5242880
      and allowed_mime_types = array[
        'image/jpeg', 'image/png', 'image/webp', 'image/avif'
      ]::text[]
  ) then
    raise exception 'product-images bucket configuration mismatch';
  end if;
  if (
    select count(*) from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname in (
        'product_images_admin_select', 'product_images_admin_insert',
        'product_images_admin_delete'
      )
  ) <> 3 then
    raise exception 'Storage policy inventory mismatch';
  end if;

  if (select count(*) from public.category_slug_routes) <> 6
    or (select count(*) from public.product_slug_routes) <> 24
    or exists (
      select 1 from public.category_slug_routes where not is_current
    )
    or exists (
      select 1 from public.product_slug_routes where not is_current
    )
  then
    raise exception 'initial slug route backfill mismatch';
  end if;

  if not has_function_privilege(
    'anon',
    'public.search_public_catalog_product_ids(public.app_locale,uuid,text,text,public.availability_status,bigint,bigint,jsonb,text,integer,integer)',
    'execute'
  ) or has_function_privilege(
    'anon', 'private.sync_product_slug_route()', 'execute'
  ) or has_function_privilege(
    'authenticated', 'private.sync_category_slug_route()', 'execute'
  ) then
    raise exception 'Stage 4 function grants mismatch';
  end if;
end;
$$;

create function private.default_acl_probe()
returns void
language sql
set search_path = ''
as 'select null::void';

do $$
begin
  if has_function_privilege('anon', 'private.default_acl_probe()', 'execute')
    or has_function_privilege(
      'authenticated', 'private.default_acl_probe()', 'execute'
    )
    or has_function_privilege(
      'service_role', 'private.default_acl_probe()', 'execute'
    )
  then
    raise exception 'future private functions inherit execute privileges';
  end if;
end;
$$;

drop function private.default_acl_probe();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'user_roles', 'categories', 'category_translations',
    'products', 'product_translations', 'product_images',
    'product_image_translations', 'attribute_groups',
    'attribute_group_translations', 'attributes', 'attribute_translations',
    'attribute_options', 'attribute_option_translations',
    'category_attributes', 'product_attribute_values',
    'product_attribute_value_translations', 'site_settings',
    'category_slug_routes', 'product_slug_routes'
  ] loop
    if not has_table_privilege('service_role', format('public.%I', table_name), 'select')
      or not has_table_privilege('service_role', format('public.%I', table_name), 'insert')
      or not has_table_privilege('service_role', format('public.%I', table_name), 'update')
      or not has_table_privilege('service_role', format('public.%I', table_name), 'delete')
      or has_table_privilege('service_role', format('public.%I', table_name), 'truncate')
      or has_table_privilege('anon', format('public.%I', table_name), 'truncate')
      or has_table_privilege('authenticated', format('public.%I', table_name), 'truncate')
    then
      raise exception 'table grants mismatch for %', table_name;
    end if;
  end loop;
end;
$$;

insert into public.categories (
  id, presentation_key, is_published, sort_order
) values (
  '90000000-0000-4000-8000-000000000002', 'generic', false, 999
);

do $$
begin
  update public.products
  set model = model
  where id = '20000000-0000-4000-8000-000000000001';
  set constraints all immediate;
  set constraints all deferred;
end;
$$;

do $$
begin
  begin
    insert into public.product_images (
      id, product_id, storage_path, is_primary
    ) values (
      '91000000-0000-4000-8000-000000000010',
      '20000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001/00000000-0000-0000-0000-000000000000.webp',
      false
    );
    raise exception 'non-versioned Storage object UUID unexpectedly succeeded';
  exception when check_violation then
    null;
  end;
end;
$$;

do $$
begin
  begin
    delete from public.product_translations
    where product_id = '20000000-0000-4000-8000-000000000001'
      and locale = 'ro';
    set constraints all immediate;
    raise exception 'missing product translation unexpectedly succeeded';
  exception when raise_exception then
    if sqlerrm not like '%requires ru and ro translations%' then raise; end if;
  end;
  set constraints all deferred;
end;
$$;

do $$
begin
  begin
    update public.products
    set category_id = '90000000-0000-4000-8000-000000000002'
    where id = '20000000-0000-4000-8000-000000000001';
    set constraints all immediate;
    raise exception 'draft category assignment unexpectedly succeeded';
  exception when raise_exception then
    if sqlerrm not like '%requires a published category%' then raise; end if;
  end;
  set constraints all deferred;
end;
$$;

do $$
begin
  begin
    insert into public.product_images (
      id, product_id, storage_path, is_primary
    ) values (
      '91000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001/91000000-0000-4000-8000-000000000002.webp',
      true
    );
    set constraints all immediate;
    raise exception 'image without alt translations unexpectedly succeeded';
  exception when raise_exception then
    if sqlerrm not like '%images require ru and ro alt text%' then raise; end if;
  end;
  set constraints all deferred;
end;
$$;

do $$
begin
  begin
    insert into public.attributes (
      id, group_id, code, data_type, is_filterable, sort_order
    ) values (
      '92000000-0000-4000-8000-000000000001',
      '30000000-0000-4000-8000-000000000001',
      'verification_required', 'boolean', true, 999
    );
    insert into public.attribute_translations (attribute_id, locale, name)
    values
      ('92000000-0000-4000-8000-000000000001', 'ru', 'Проверка'),
      ('92000000-0000-4000-8000-000000000001', 'ro', 'Verificare');
    insert into public.category_attributes (
      category_id, attribute_id, is_required, is_filterable, sort_order
    ) values (
      '10000000-0000-4000-8000-000000000001',
      '92000000-0000-4000-8000-000000000001', true, true, 999
    );
    set constraints all immediate;
    raise exception 'missing required attribute unexpectedly succeeded';
  exception when raise_exception then
    if sqlerrm not like '%missing a required attribute%' then raise; end if;
  end;
  set constraints all deferred;
end;
$$;

do $$
begin
  begin
    update public.attributes
    set data_type = 'number'
    where id = '31000000-0000-4000-8000-000000000002';
    set constraints all immediate;
    raise exception 'incompatible attribute type change unexpectedly succeeded';
  exception when raise_exception then
    if sqlerrm not like '%Cannot change the type%' then raise; end if;
  end;
  set constraints all deferred;
end;
$$;

do $$
begin
  begin
    insert into public.attributes (
      id, group_id, code, data_type, is_filterable, sort_order
    ) values (
      '92000000-0000-4000-8000-000000000002',
      '30000000-0000-4000-8000-000000000001',
      'verification_filter_override', 'number', false, 998
    );
    insert into public.attribute_translations (attribute_id, locale, name)
    values
      ('92000000-0000-4000-8000-000000000002', 'ru', 'Фильтр'),
      ('92000000-0000-4000-8000-000000000002', 'ro', 'Filtru');
    insert into public.category_attributes (
      category_id, attribute_id, is_required, is_filterable, sort_order
    ) values (
      '10000000-0000-4000-8000-000000000001',
      '92000000-0000-4000-8000-000000000002', false, true, 998
    );
    update public.attributes
    set data_type = 'text'
    where id = '92000000-0000-4000-8000-000000000002';
    raise exception 'filterable text override unexpectedly succeeded';
  exception when raise_exception then
    if sqlerrm not like '%cannot be used as canonical filters%' then raise; end if;
  end;
end;
$$;

insert into public.attributes (
  id, group_id, code, data_type, is_filterable, sort_order
) values (
  '92000000-0000-4000-8000-000000000003',
  '30000000-0000-4000-8000-000000000001',
  'verification_numeric', 'number', true, 997
);
insert into public.attribute_translations (attribute_id, locale, name)
values
  ('92000000-0000-4000-8000-000000000003', 'ru', 'Число'),
  ('92000000-0000-4000-8000-000000000003', 'ro', 'Număr');
insert into public.category_attributes (
  category_id, attribute_id, is_required, is_filterable, sort_order
) values (
  '10000000-0000-4000-8000-000000000001',
  '92000000-0000-4000-8000-000000000003', false, true, 997
);
insert into public.product_attribute_values (
  id, product_id, attribute_id, number_value
) values (
  '92000000-0000-4000-8000-000000000004',
  '20000000-0000-4000-8000-000000000001',
  '92000000-0000-4000-8000-000000000003', 280
);

do $$
begin
  if (
    select max(total_count)
    from public.search_public_catalog_product_ids(
      p_locale => 'ru',
      p_attributes => '{"verification_numeric":"280"}'::jsonb
    )
  ) <> 1 then
    raise exception 'numeric catalog filter changed a significant trailing zero';
  end if;
end;
$$;

rollback;
