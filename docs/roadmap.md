# Roadmap Tehnosklad

## Этап 1 — архитектура и каркас — завершён

Коммит `9e52bac`.

## Этап 2 — публичная demo-витрина — завершён

Коммит `8a250f6`. Адаптивный RU/RO storefront, каталог, карточки, контакты и форма без серверной отправки.

## Этап 3 — Supabase foundation — завершён

- Официальные migrations/config/seed.
- Нормализованный каталог, money minor units, strict RU/RO.
- Явные grants, RLS, Storage bucket и verification matrix.
- Server-only repository с Supabase/demo source selection.
- Реальные server reads для home/catalog/category/product/similar/settings.
- Supabase SSR Auth, `proxy.ts`, admin role guard, login/logout и защищённый shell.
- Mapper/repository/security/env unit tests.

Подробности: [stage-3.md](stage-3.md).

## Этап 4 — каталог и SEO

- Перенести клиентские фильтры в URL/server query по мере роста каталога.
- Пагинация, server search, metadata/canonical/hreflang/schema.org.
- Redirect history для безопасной будущей смены опубликованных slug.
- On-demand cache invalidation после будущих mutations.

## Этап 5 — заявки и Telegram

- Валидируемый server endpoint, honeypot, rate limit и idempotency.
- Leads/status history/delivery logs отдельной migration после утверждения модели.
- Сохранение до Telegram delivery и безопасные retry.

## Этап 6 — административный CRUD

- CRUD категорий, характеристик и товаров вертикальными срезами.
- Storage upload workflow, orphan cleanup и revalidation tags.
- Заявки и публичные настройки без фиктивных кнопок.

## Этап 7 — AI-ассистент

Grounded provider interface, rate limit, короткая история и fallback-поиск. AI schema появится только после определения контракта.

## Этап 8 — production hardening/deploy

E2E, SEO, legal review, performance, CSP, backup/restore drill, Vercel smoke test и наблюдаемость.
