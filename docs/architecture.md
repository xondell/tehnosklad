# Архитектура Tehnosklad

## Границы

- React Server Components используются по умолчанию.
- Публичные URL всегда содержат `/ru` или `/ro`.
- `/admin` имеет отдельный root layout, Auth proxy и защищённую route group.
- UI не импортирует Supabase и demo fixtures. Все чтения идут через `CatalogRepository`.
- Browser, user-server, public-server и service-role clients разделены по доверительным зонам.
- Service role находится в отдельном leaf module с `server-only` и не экспортируется через barrel.

## Data flow каталога

```text
Public page (Server Component)
  -> cached query function (locale является аргументом/cache key)
    -> CatalogRepository
      -> DemoCatalogRepository (явный local/test режим)
      -> SupabaseCatalogRepository
        -> SupabaseCatalogTransport (bulk queries)
          -> mapper DB rows -> locale-resolved domain DTO
            -> UI components / CatalogClient local filtering
```

Supabase transport получает списки товаров одним bulk query и характеристики вторым bulk query. Slug lookup использует точечную цепочку translation→id→entity, а similar применяет category/exclude/limit до bulk-запроса характеристик. Запросов на товар/атрибут в цикле нет. DB row shapes остаются в `features/catalog/supabase`; компоненты получают только `CatalogProduct`, `CatalogCategory`, `CatalogFacets` и `PublicSiteSettings`.

## Доменные решения

- Деньги: integer minor units (`priceMinor`), валюта фиксирована как MDL.
- Переводы: strict. Для опубликованной сущности обязательны RU и RO; mapper не подставляет другой язык.
- Slug локализован в БД и уникален внутри locale. Domain DTO содержит текущий и alternate slug.
- Публикация, availability, archive, popular и new независимы.
- Характеристики нормализованы по group/attribute/type/options/value. DTO отделяет локализованный `displayValue` от canonical `filterValue`; category binding может переопределить filterability/sort. UI строит динамические facets для canonical number/boolean/select/color; локализованный free-text намеренно не может быть filterable.
- Для category/product proxy передаёт только pathname в request header, layout точечно резолвит alternate slug и уже в SSR формирует правильный language-switch href.
- Реальные Storage images опциональны; при отсутствии изображения сохраняется CSS fallback Этапа 2.

## Рендеринг и cache

- Public locale shell и все public страницы request-rendered (`force-dynamic`), поэтому build не требует доступного remote Supabase и не замораживает demo-data в production artifact.
- Category/product slug обслуживаются on demand.
- Публичные repository queries кэшируются на 300 секунд. Все locale/slug/category параметры входят в ключ.
- В будущем admin mutations смогут использовать tags `catalog`, `products`, `categories`, `site-settings` для on-demand invalidation.
- `/admin` и `/admin/login` — `force-dynamic`; auth responses получают `private, no-store`.

## Auth flow

1. Лёгкий `src/proxy.ts` исключает static assets. На public routes он только передаёт pathname для SSR locale links; на `/admin/:path*` вызывает `getClaims()` для refresh/оптимистического redirect и синхронизирует cookies/anti-cache headers.
2. Login Server Action вызывает `signInWithPassword` пользовательским SSR client.
3. После входа сервер запрашивает свежего пользователя через `getUser()` и читает собственные `profiles`/`user_roles` под RLS.
4. Protected layout и dashboard повторно вызывают `requireAdmin()`.
5. RLS остаётся последней линией защиты будущих catalog mutations.

Proxy не запрашивает роль из БД и не является единственной защитой.

## Структура

```text
src/
  app/(public)/[locale]/
  app/(backoffice)/admin/login/
  app/(backoffice)/admin/(protected)/
  features/catalog/
    data.ts, repository.ts, demo-repository.ts
    supabase/{transport,repository,mapper,rows}.ts
  features/admin/auth/
  lib/env/
  lib/supabase/{browser,server,public-server,service,proxy}.ts
  proxy.ts
supabase/
  config.toml
  migrations/
  seed.sql
  verification/
```

## Следующие внешние границы

Route Handlers появятся только для заявок/Telegram/AI. Прямой anon INSERT в будущие заявки не предусматривается. CRUD и Storage upload UI относятся к следующему административному этапу.
