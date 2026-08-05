# Tehnosklad

Production-каркас сайта-каталога магазина бытовой техники в Комрате. Завершён **Этап 2: дизайн-система и публичная demo-витрина**.

## Что уже есть

- Next.js 16, TypeScript, App Router и Tailwind CSS 4.
- Русские и румынские URL и типизированные словари без лишней i18n-зависимости.
- Адаптивные Header, Footer, каталог с локальными фильтрами, категории, карточки и страницы demo-товаров.
- Контакты, юридические информационные страницы и доступный диалог связи без серверной отправки.
- Unit-тесты чистой логики demo-каталога и валидации формы.
- Типизированные public/server env-модули.
- Проект нормализованной Supabase-схемы, индексов, grants и RLS.
- Архитектура, безопасность и план следующих этапов в `docs/`.

Telegram-бот, AI, Supabase client, Auth, CRUD и полноценная административная панель намеренно ещё не реализованы.

Production build использует официальный флаг `--webpack`: Turbopack в текущей управляемой среде не может открыть внутренний порт PostCSS. TypeScript проверяется отдельной обязательной командой и Compiler API Next.js.

## Требования

- Node.js 22 или новее.
- npm 10 или новее.

## Локальный запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Откройте `http://localhost:3000`. Корневой URL перенаправит на `/ru`; румынская версия доступна по `/ro`.

На Этапе 1 env-модули не вызываются страницами, поэтому пустой `.env.local` не блокирует сборку. При подключении Supabase каждый используемый модуль будет проверять обязательные значения при вызове.

## Проверки

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

## Переменные окружения

Browser-safe:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Server-only:

- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `AI_PROVIDER`
- `AI_PROVIDER_API_KEY`

Никогда не добавляйте `NEXT_PUBLIC_` к server-only переменным и не сохраняйте реальные значения в Git.

## Supabase: подготовка Этапа 3

1. Создайте бесплатный проект Supabase и сохраните URL/publishable key в `.env.local`.
2. Установите Supabase CLI способом из актуальной официальной документации.
3. Выполните `supabase init` и проверьте версию через `supabase --version`.
4. Создайте миграцию командой `supabase migration new initial_schema`.
5. После ревью скопируйте содержимое `supabase/schema.sql` в созданный CLI-файл.
6. Запустите локальный Supabase, примените migration и проверьте Security/Performance Advisors.
7. Проверьте RLS как `anon`, обычный authenticated user, editor и admin.

`schema.sql` пока является проектом, а не подтверждённой production-миграцией: его нужно прогнать на реальном локальном Supabase в Этапе 3.

### Создание администратора

Это выполняется только после настройки Auth:

1. Создайте пользователя через Supabase Auth, не SQL-паролем.
2. Добавьте профиль с тем же UUID в `public.users`.
3. Добавьте `(user_id, 'admin')` в `public.user_roles` через доверенную серверную/SQL-сессию.
4. Обновите сессию и проверьте RLS. Не используйте `user_metadata` для роли.

### Storage

На Этапе 3 создайте bucket `product-images`. Ограничьте MIME и размер, задайте admin/editor policies на upload/update/delete и публичное чтение только опубликованных товаров. Service role остаётся только на сервере.

## Telegram и AI

Telegram будет настроен на Этапе 5: BotFather выдаёт token, Chat ID определяется через официальное Bot API, оба значения сохраняются только в server env. Заявка сначала фиксируется в БД, затем отправляется; ошибка доставки не удаляет заявку.

AI появится на Этапе 7 с заменяемым провайдером и fallback-поиском. API key хранится на сервере; ассистент получает только каталог и базу знаний, не административные права.

## Vercel

Деплой планируется после подключения реального Supabase:

1. Импортируйте Git-репозиторий в Vercel.
2. Добавьте env отдельно для Preview и Production.
3. Не добавляйте service-role/Telegram/AI значения в public env.
4. Выполните production build и smoke test `/ru`, `/ro`, каталога и `/admin`.
5. После подключения домена обновите `NEXT_PUBLIC_SITE_URL`, canonical и Auth redirect URLs.

## Резервное копирование

Для бесплатного тарифа предусмотрите регулярный логический экспорт PostgreSQL и отдельный экспорт Storage manifest/files. Периодически проверяйте восстановление в тестовый проект; backup без restore drill ненадёжен.

## Документация

- `docs/architecture.md` — маршруты, модули, интеграции и free-tier риски.
- `docs/security.md` — роли, RLS, секреты, заявки и Storage.
- `docs/roadmap.md` — последовательность Этапов 2–8.
- `docs/stage-2.md` — дизайн-система, demo-layer и ограничения публичной витрины.
- `supabase/schema.sql` — проект схемы данных и policies.

Полное руководство по управлению товарами будет добавлено вместе с реальным CRUD в Этапе 6, чтобы документация не описывала несуществующие функции.
