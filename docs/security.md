# Безопасность Supabase, Auth и Storage

## Роли и identity

- Наличие записи в `auth.users` не даёт административный доступ.
- Единственная прикладная роль Этапа 3 — enum `admin` в `public.user_roles`.
- Активность пользователя хранится в `profiles.is_active`.
- Пользователь может только читать собственные safe profile/role rows; self-assignment отсутствует.
- Первый admin создаётся доверенно через Dashboard + SQL Editor, не через браузер приложения.
- `user_metadata` и переданная клиентом роль не участвуют в авторизации.

`private.is_admin()` — единственная авторизационная `security definer` функция. Она имеет `search_path=''`, полностью квалифицированные имена, проверяет `auth.uid()`, активный profile и точную enum-роль. `PUBLIC` execute отозван; доступ есть только у `authenticated`.

## RLS и grants

- RLS включён на каждой таблице `public`.
- Grants перечислены по текущим таблицам; `anon/authenticated` не получают `ALL TABLES`/`ALL SEQUENCES`.
- Default privileges для будущих tables/functions/sequences отозваны.
- Публичные child policies проверяют достижимость через опубликованного неархивного родителя.
- Authenticated non-admin видит только тот же публичный каталог плюс собственный safe profile/role.
- Admin policies имеют и `USING`, и `WITH CHECK`.
- Service role bypasses RLS, хранится только server-side и не используется публичным catalog/Auth flow.

Подробная матрица: [rls-access-matrix.md](rls-access-matrix.md).

## Catalog integrity

- `price_minor bigint >= 0`; `old_price_minor` только null или строго больше текущей цены.
- Валюта ограничена MDL.
- Publication и archive не смешаны с availability.
- Deferred constraint triggers повторно проверяют publication invariants при изменении родителей и дочерних переводов/images/attributes: RU+RO, опубликованная категория, required attributes и полная локализованная metadata.
- Attribute trigger проверяет тип значения, принадлежность option к attribute и attribute к категории товара.
- Slug ограничен безопасным ASCII-форматом и уникален `(locale, slug)`.

## Auth threats

- Proxy использует `getClaims()`, но authoritative guard — свежий `getUser()` + RLS role query.
- Public proxy branch не читает Auth/DB и только перезаписывает внутренний pathname header; static assets исключены matcher-ом.
- `getSession()` не используется для решений доступа.
- Admin pages dynamic/no-store, поэтому refresh cookie не попадёт в ISR/CDN cache.
- Redirect `next` принимает только same-origin `/admin` paths; protocol-relative, external, encoded bypass и `/admin/login` отвергаются тестами.
- Login возвращает одинаковую ошибку для неправильного пароля и отсутствующей admin-role.
- Non-admin после входа локально разлогинивается.
- Server Actions рассматриваются как mutation endpoints; Next.js same-origin protection дополняет повторная проверка роли.

## Storage

Bucket `product-images` создаётся migration:

- public read URL для storefront;
- 5 MiB максимум;
- JPEG, PNG, WebP, AVIF;
- полный путь строго `<versioned-product-uuid>/<versioned-random-uuid>.<allowed-ext>` без вложенных сегментов;
- insert/select/delete только admin;
- update отсутствует намеренно: имена immutable, overwrite/upsert запрещён;
- metadata row виден публично только для опубликованного товара.

Public bucket обходит Storage SELECT RLS при чтении известного URL. Поэтому туда нельзя загружать секретные материалы; random object UUID снижает угадываемость draft URL. Если будущему workflow потребуется строго скрывать draft media, bucket нужно мигрировать в private и выдавать signed URLs.

Удаление DB row не удаляет object транзакционно. Будущий admin workflow сначала помечает запись, удаляет object, затем metadata; периодическая orphan-проверка остаётся обязательной.

## Secrets и логирование

- Publishable key безопасно используется вместе с RLS; он не является секретом.
- `SUPABASE_SERVICE_ROLE_KEY` никогда не имеет `NEXT_PUBLIC_` и доступен только leaf server module.
- Telegram/AI keys не находятся в `site_settings`.
- `site_settings` имеет закрытый whitelist публичных ключей, поэтому secret нельзя случайно переключить флагом `is_public`.
- Supabase transport отбрасывает внутренний error object и выбрасывает санитизированный application error; UI не получает SQL/stack/cookies/token.
- Server log содержит только имя ресурса и application error code; keys, cookies, tokens и user object не логируются.
