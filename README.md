# Tehnosklad

Production-сайт магазина бытовой техники в Комрате. Завершён **Этап 3: безопасный Supabase foundation, серверный каталог и Auth**.

## Реализовано

- Next.js 16.3, React 19, TypeScript, App Router и Tailwind CSS 4.
- Публичная адаптивная витрина на русском и румынском.
- Версионируемая PostgreSQL-схема, seed, RLS, явные grants и Storage bucket.
- Server-only repository/data layer с Supabase и demo implementations.
- Strict RU/RO mapping без скрытой подмены отсутствующего перевода.
- Supabase SSR Auth, `proxy.ts`, защищённый `/admin` и проверка роли на сервере.
- 5-минутный cache публичных запросов с locale в аргументах; admin всегда dynamic.

Полный admin CRUD, загрузчик изображений, заявки/Telegram и AI намеренно не реализованы.

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

- `SUPABASE_SERVICE_ROLE_KEY` — зарезервирован для узких серверных операций следующих этапов и не используется для чтения каталога/Auth;
- будущие Telegram/AI secrets.

`CATALOG_DATA_SOURCE` принимает только `demo` или `supabase`. В development/test отсутствие значения означает demo. Production принимает только явный `supabase`: и отсутствие значения, и `demo` завершаются ошибкой конфигурации. Ошибка Supabase никогда не переключает источник на demo.

## Полезные команды

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build

npm run db:start
npm run db:reset:local
npm run db:lint:local
npm run db:types:local
npm run db:stop
```

`db:reset:local` содержит явный `--local`; scripts для remote reset нет.

## Supabase source of truth

- `supabase/config.toml` — локальный CLI/Auth/Storage config;
- `supabase/migrations/20260805111516_initial_schema.sql` — исходная production migration;
- `supabase/seed.sql` — детерминированные 3 категории, 12 товаров, RU/RO, характеристики и настройки;
- `supabase/verification/rls.sql` — безопасная read-only/rollback проверка anon;
- `supabase/schema.sql` — только сохранённый исторический draft Этапа 1.

## Документация

- [docs/stage-3.md](docs/stage-3.md) — результат этапа и ограничения;
- [docs/supabase-setup.md](docs/supabase-setup.md) — локальная/remote настройка и первый admin;
- [docs/rls-access-matrix.md](docs/rls-access-matrix.md) — матрица доступа и ручная проверка;
- [docs/architecture.md](docs/architecture.md) — приложение и data layer;
- [docs/security.md](docs/security.md) — границы доверия и threat decisions;
- [docs/roadmap.md](docs/roadmap.md) — последующие этапы.

Production build использует `--webpack`, потому что Turbopack в управляемой среде разработки не может открыть внутренний PostCSS-порт.
