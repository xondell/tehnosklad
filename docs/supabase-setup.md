# Настройка Supabase

Ниже нет автоматических remote-операций. Перед `db push` всегда проверьте project ref и dry run.

## 1. Создание проекта

1. Создайте проект в Supabase Dashboard.
2. В Connect/API keys скопируйте Project URL и **publishable key**.
3. Secret/service-role key копируйте только если будущая узкая server operation действительно его требует.
4. Отключите публичную регистрацию в Auth settings. Пользователей создаёт только владелец через Dashboard.

Publishable key передаётся браузеру и безопасен только вместе с grants/RLS. Service-role key является секретом и bypasses RLS.

## 2. Локальная настройка

```bash
npm ci
cp .env.example .env.local
npm run db:start
npm run db:reset:local
```

Нужен Docker-compatible runtime. Скопируйте локальные `API URL` и publishable/anon key из CLI output:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=local-publishable-or-anon-key
CATALOG_DATA_SOURCE=supabase
```

`SUPABASE_SERVICE_ROLE_KEY` для storefront/Auth не нужен.

## 3. Migration и seed

`npm run db:reset:local` применяет все `supabase/migrations/*.sql`, затем `supabase/seed.sql`. Команда имеет явный `--local` и не может сбросить linked project.

Проверки:

```bash
npm run db:lint:local
npx supabase migration list --local
npm run db:types:local > /tmp/tehnosklad-database.types.ts
```

Сравните с ручными query-shape types в `src/features/catalog/supabase/rows.ts`. Они намеренно не объявлены автоматически синхронизированными. После успешной локальной генерации замените/адаптируйте типы отдельным reviewed change, затем повторите typecheck/tests.

## 4. Storage

Migration автоматически создаёт public bucket `product-images`:

- max 5 MiB;
- JPEG/PNG/WebP/AVIF;
- admin insert/select/delete;
- immutable `<product_uuid>/<random_uuid>.<ext>`;
- оба UUID versioned, extension входит в whitelist, дополнительные path segments запрещены;
- update/upsert намеренно запрещён.

После migration откройте Storage в Dashboard и проверьте bucket settings. Не создавайте второй bucket вручную с отличающимися ограничениями.

## 5. Remote migration

Только владелец, после backup и проверки target:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push --linked --dry-run
npx supabase migration list --linked
```

Изучите dry run. Для применения migration отдельно выполните:

```bash
npx supabase db push --linked
```

Seed не добавляйте в production автоматически. Если demo catalog нужен в отдельном staging-проекте, примените seed сознательно только к staging после проверки target.

## 6. Первый Auth user/admin

1. Dashboard → Authentication → Users → Add user.
2. Создайте email/password пользователя; не сохраняйте пароль в Git/SQL.
3. Скопируйте UUID пользователя.
4. SQL Editor от доверенной database role:

```sql
begin;

insert into public.profiles (id, display_name, is_active)
values ('USER_UUID', 'Administrator', true)
on conflict (id) do update
set display_name = excluded.display_name,
    is_active = true;

insert into public.user_roles (user_id, role)
values ('USER_UUID', 'admin')
on conflict (user_id) do update
set role = excluded.role;

commit;
```

Обычный publishable/authenticated client не может выполнить bootstrap. Не используйте `user_metadata` для role.

## 7. Проверка входа

1. Запустите `npm run dev`.
2. Откройте `/admin/login`.
3. Admin должен попасть на `/admin`, увидеть email/role и выйти кнопкой.
4. Auth user без `user_roles.admin` должен получить нейтральную ошибку и не попасть в dashboard.
5. После деактивации `profiles.is_active=false` существующий пользователь должен потерять доступ при следующей server check.

## 8. Проверка RLS

Запустите `supabase/verification/rls.sql` и `supabase/verification/integrity.sql` в локальном SQL Editor, затем сценарии из [rls-access-matrix.md](rls-access-matrix.md). В hosted Dashboard дополнительно запустите Security/Performance Advisors.

## 9. Vercel

Для Preview/Production задайте отдельно:

```dotenv
NEXT_PUBLIC_SITE_URL=https://your-domain.example
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
CATALOG_DATA_SOURCE=supabase
```

Service-role key добавляйте только когда появится использующая его server-only операция. Проверьте Supabase Auth Site URL/allowed redirects, `/ru`, `/ro`, catalog, product и `/admin/login`. Docker/local filesystem в production не требуются.

## 10. Что не проверено в Codex

- чистое применение migration/seed;
- повторный local reset;
- Postgres/Supabase DB lint/advisors;
- реальные anon/authenticated/admin RLS запросы;
- Storage upload denial/allow;
- реальный email/password login и cookie refresh;
- автоматически generated Database types.

Причина: в среде отсутствует Docker binary. Remote-проект не подключался и не изменялся.
