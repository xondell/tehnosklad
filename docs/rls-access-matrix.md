# Матрица RLS и ручная проверка

| Ресурс                              |                           anon read | anon write | authenticated non-admin |                admin |
| ----------------------------------- | ----------------------------------: | ---------: | ----------------------: | -------------------: |
| published, non-archived products    |                                 yes |         no |               read only |                 CRUD |
| drafts/archived products            |                                  no |         no |                      no |                 CRUD |
| published categories                |                                 yes |         no |               read only |                 CRUD |
| draft/archived categories           |                                  no |         no |                      no |                 CRUD |
| translations                        |                  public parent only |         no |      public parent only |                 CRUD |
| product image metadata              |                  public parent only |         no |      public parent only |                 CRUD |
| attribute groups/attributes/options | reachable from public category only |         no |            same as anon |                 CRUD |
| product attribute values            |                 public product only |         no |            same as anon |                 CRUD |
| public site settings whitelist      |                                 yes |         no |               read only |                 CRUD |
| own profile/role                    |                                  no |         no |      own safe rows only |      controlled CRUD |
| other profiles/roles                |                                  no |         no |                      no |      controlled CRUD |
| Storage public object URL           |                    yes if URL known |         no |           read URL only | insert/select/delete |

Leads/private settings/technical logs отсутствуют в фактической schema Этапа 3, поэтому Data API surface для них не существует.

## Автоматизируемая anon-проверка

После local reset выполните `supabase/verification/rls.sql`. Ожидаются 12 products, 3 categories, 14 settings rows; script также проверяет отсутствие draft leakage в таблицах и server-search RPC, недоступность current/draft slug routes, достижимость seeded attribute group, отсутствие anon EXECUTE на role helper и запрет anon insert. Transaction полностью откатывается.

Затем выполните `supabase/verification/integrity.sql`: он принудительно переводит deferred constraints в immediate и доказывает отказ при удалении перевода, назначении draft-категории, image без alt, отсутствии required attribute, несовместимой смене attribute type и попытке превратить category override в filterable text. Все изменения также откатываются.

## Non-admin

Создайте Auth user через локальный Studio, но не добавляйте profile/role. В браузере/REST с его access token проверьте:

- published catalog читается;
- drafts не читаются;
- `profiles`/`user_roles` возвращают 0 rows;
- insert/update/delete catalog rows запрещены;
- insert собственной `user_roles` запрещён;
- `/admin` возвращает redirect на login/нейтральный отказ.

После добавления только `profiles` без role пользователь видит свой `is_active`, но всё ещё не является admin.

## Admin

Назначьте admin по процедуре setup. Проверьте под его JWT:

- чтение draft rows;
- create/update/delete тестовой catalog row;
- publication без RU/RO отклоняется;
- `old_price_minor <= price_minor` отклоняется;
- option другого attribute отклоняется composite FK;
- attribute чужой категории отклоняется trigger;
- создание/изменение role обычным пользователем невозможно.

Используйте тестовые rows и rollback; не проводите destructive checks в production.

## Storage

Проверьте REST/SDK:

1. anon и non-admin upload/delete запрещены;
2. admin upload JPEG/WebP до 5 MiB в `<existing-product-uuid>/<random-uuid>.webp` разрешён;
3. неправильный UUID, extension, вложенный path, MIME или размер запрещены;
4. overwrite того же path запрещён, потому что UPDATE policy отсутствует;
5. public URL загруженного object читается без Auth;
6. после удаления metadata/object проверьте отсутствие orphan вручную.

## Advisor checklist

- Все public tables показывают RLS enabled.
- Нет public `SECURITY DEFINER` functions.
- `private.is_admin()` имеет `search_path=''` и execute только authenticated.
- Нет broad grants/default privileges для anon/authenticated.
- Нет anon INSERT policy.
- Views/RPC отсутствуют, поэтому отдельного RLS-bypass surface нет.
