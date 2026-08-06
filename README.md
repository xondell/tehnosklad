# Tehnosklad

Production-сайт магазина бытовой техники в Комрате. Завершены безопасный Supabase foundation, серверный каталог/SEO, заявки/Telegram delivery, защищённый административный CRUD и **Этап 7: grounded AI-ассистент каталога**.

## Реализовано

- Next.js 16.3, React 19, TypeScript, App Router и Tailwind CSS 4.
- Публичная адаптивная витрина на русском и румынском.
- Версионируемая PostgreSQL-схема, seed, RLS, явные grants и Storage bucket.
- Server-only repository/data layer с Supabase и demo implementations.
- Strict RU/RO mapping без скрытой подмены отсутствующего перевода.
- Supabase SSR Auth, `proxy.ts`, защищённый `/admin` и проверка роли на сервере.
- 5-минутный cache публичных запросов с locale в аргументах; admin всегда dynamic.
- URL-driven server search, фильтры, сортировка и пагинация без client-only состояния.
- Localized metadata, canonical/hreflang, JSON-LD, sitemap, robots и Open Graph images.
- История опубликованных slug с постоянным redirect на актуальный URL.
- Реальная RU/RO форма заявки с product context, server validation, honeypot, rate limit и idempotency.
- Durable leads/status history и Telegram outbox: заявка фиксируется до внешней отправки, а каждый результат доставки журналируется.
- Полный `/admin`: dashboard, категории/подкатегории, группы и конструктор характеристик, товары, изображения, заявки и whitelist публичных настроек.
- Все административные изменения выполняются через Server Actions и узкие atomic RPC, повторно проверяют активную admin-роль и инвалидируют нужные cache tags.
- Безопасная загрузка изображений без overwrite с MIME/magic/size-проверкой, compensating delete и отдельным экраном сверки Storage/metadata orphan-файлов.

- RU/RO grounded AI-ассистент: bounded published-catalog context, provider-neutral server boundary, fallback без внешнего AI и HMAC rate limit.
- Category image upload, explicit audited Telegram requeue and privacy-preserving assistant technical logs.

## Требования

- Node.js 22+ и npm 10+.
- Docker-compatible runtime только для локального Supabase stack.

## Быстрый запуск в demo-режиме

```bash
npm ci
cp .env.example .env.local
npm run dev
```

В `.env.local` установите `CATALOG_DATA_SOURCE=demo` (example намеренно настроен на production-safe `supabase`). Корневой URL перенаправляет на `/ru`, румынская версия доступна на `/ro`.

## Запуск с Supabase

```bash
npm run db:start
npm run db:reset:local
```

Скопируйте локальные URL и publishable key из вывода CLI в `.env.local`, установите `CATALOG_DATA_SOURCE=supabase` и перезапустите Next.js. Полная инструкция: [docs/supabase-setup.md](docs/supabase-setup.md).

## Переменные окружения

Browser-safe:

- `NEXT_PUBLIC_SITE_URL`;
- `NEXT_PUBLIC_SUPABASE_URL`;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Server-only:

- `SUPABASE_SERVICE_ROLE_KEY` — используется только server-only хранилищем заявок/очереди и не используется для чтения каталога/Auth;
- `LEAD_IP_HASH_SECRET` — отдельный случайный секрет не короче 32 символов для HMAC IP/телефона и idempotency payload;
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — парная server-only конфигурация доставки; локально может отсутствовать, в production нужна для уведомлений.

`CATALOG_DATA_SOURCE` принимает только `demo` или `supabase`. В development/test отсутствие значения означает demo. Production принимает только явный `supabase`: и отсутствие значения, и `demo` завершаются ошибкой конфигурации. Ошибка Supabase никогда не переключает источник на demo.

## Полезные команды

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run test:e2e
npm run build

npm run db:start
npm run db:reset:local
npm run db:lint:local
npm run db:types:local
npm run test:integration:local
npm run db:stop
```

`db:reset:local` содержит явный `--local`; scripts для remote reset нет.

## Supabase source of truth

- `supabase/config.toml` — локальный CLI/Auth/Storage config;
- `supabase/migrations/20260805111516_initial_schema.sql` — исходная production migration;
- `supabase/migrations/20260805190000_stage_4_catalog_seo.sql` — server search RPC и slug route history;
- `supabase/migrations/20260805213000_stage_5_leads_telegram.sql` — заявки, статусы, rate limit и Telegram outbox;
- `supabase/migrations/20260805213001_stage_6_admin_crud.sql` — atomic admin RPC, дополнительные integrity guards, grants/indexes и компенсирующий Storage workflow;
- `supabase/migrations/20260806053422_stage_6_7_completion_security.sql` — category media, audited Telegram requeue, assistant telemetry и RLS/rate-limit hardening;
- `supabase/migrations/20260806120000_privacy_retention.sql` — удаление заявок старше 24 месяцев, AI-логов старше 90 дней и истёкших rate-limit записей;
- `supabase/seed.sql` — детерминированные 3 категории, 12 товаров, RU/RO, характеристики и настройки;
- `supabase/verification/rls.sql` — transactional/rollback assertions для RLS;
- `supabase/schema.sql` — только сохранённый исторический draft Этапа 1.

## Документация

- [docs/stage-3.md](docs/stage-3.md) — результат этапа и ограничения;
- [docs/stage-3-runtime-validation.md](docs/stage-3-runtime-validation.md) — фактические local runtime-проверки Этапа 3.5;
- [docs/stage-4.md](docs/stage-4.md) — URL-контракт каталога, SEO, slug redirects и cache invalidation;
- [docs/stage-5.md](docs/stage-5.md) — контракт заявок, защита endpoint и модель Telegram delivery;
- [docs/stage-6.md](docs/stage-6.md) — административные разделы, mutation/storage boundaries, cache invalidation и проверки;
- [docs/supabase-setup.md](docs/supabase-setup.md) — локальная/remote настройка и первый admin;
- [docs/rls-access-matrix.md](docs/rls-access-matrix.md) — матрица доступа и ручная проверка;
- [docs/architecture.md](docs/architecture.md) — приложение и data layer;
- [docs/security.md](docs/security.md) — границы доверия и threat decisions;
- [docs/deployment.md](docs/deployment.md) — production/Preview deployment, переменные окружения и безопасный rollback;
- [docs/roadmap.md](docs/roadmap.md) — последующие этапы.

Production build использует `--webpack`, потому что Turbopack в управляемой среде разработки не может открыть внутренний PostCSS-порт.

# Grounded AI assistant

The optional RU/RO catalog helper is enabled by the public shell and uses `POST /api/assistant`. It never receives leads, uses published catalog records only, and falls back to deterministic catalog search when no provider is configured. Set `AI_RATE_LIMIT_SECRET` for every deployed environment. `AI_PROVIDER=fallback` is free and safe by default; `openai-compatible` additionally requires `AI_PROVIDER_BASE_URL`, `AI_PROVIDER_API_KEY` and `AI_MODEL`. The local integration harness forcibly uses `fallback`, so it never calls a paid provider. See [docs/stage-7.md](docs/stage-7.md).

## Обязательный pre-deploy checklist: оператор и приватность

До включения публичной формы заявок владелец обязан задать в Vercel Production и Preview (если Preview принимает реальные заявки):

- `LEGAL_OPERATOR_NAME` — точное юридическое наименование оператора;
- `LEGAL_OPERATOR_IDNO` — IDNO оператора;
- `LEGAL_OPERATOR_ADDRESS` — юридический/почтовый адрес для запросов субъектов данных;
- `LEGAL_PRIVACY_EMAIL` — рабочий email для таких запросов;
- `LEGAL_RESPONSIBLE_PERSON` — только если ответственное лицо действительно назначено и его имя следует публиковать.

Дополнительно до production:

- практикующий юрист Республики Молдова должен проверить RU/RO редакции политик, реквизиты и правовые основания с учётом перехода от Закона №133/2011 к Закону №195/2024 23 августа 2026 года;
- проверить DPA, фактические регионы и субпроцессоров Supabase/Vercel/Telegram/настроенного AI-провайдера и допустимый механизм трансграничной передачи; внешний AI оставить в `fallback`, пока проверка не завершена;
- настроить в Supabase Cron не реже одного раза в сутки `select * from private.enforce_privacy_retention();`, сначала проверив backup/restore и результат на staging;
- подтвердить, что runtime/security logs Vercel ограничены целевым сроком 30 дней, а административные доступы отключаются сразу после прекращения полномочий;
- выполнить `npm run test:e2e` в Chromium и WebKit и ручную проверку карты, формы и юридических страниц на реальном production-домене.

Если четыре обязательных `LEGAL_*` значения отсутствуют, юридические страницы честно показывают предупреждение, а production-запуск формы считается заблокированным процессом развёртывания. Код не подставляет фиктивные реквизиты.
