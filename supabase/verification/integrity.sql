-- Deferred publication invariant checks after `npm run db:reset:local`.
-- Every mutation is expected to fail at SET CONSTRAINTS and is rolled back.

begin;

insert into public.categories (
  id, presentation_key, is_published, sort_order
) values (
  '90000000-0000-4000-8000-000000000002', 'generic', false, 999
);

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

rollback;
