# 🏠 Tehnosklad

<div align="center">

### Production-ready bilingual appliance storefront for Moldova

![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright&logoColor=white)

</div>

A full-stack e-commerce lead-generation platform for **Comrat, Moldova**, with a public catalog, protected administration, Telegram delivery, Supabase backend, and a grounded RU/RO AI catalog assistant.

## ✨ Core capabilities

### Public storefront
- 🇷🇺 / 🇷🇴 Russian and Romanian catalog
- 🔎 URL-driven search, filters, sorting and pagination
- 🧩 Categories, subcategories and configurable product attributes
- 🔗 Stable localized product URLs with historical slug redirects
- 📱 Responsive storefront
- 🖼 Product and category media
- 🔍 Canonical/hreflang, JSON-LD, sitemap, robots and Open Graph
- 🤖 Grounded catalog AI assistant

### Lead pipeline
- localized contact forms;
- product context;
- server-side validation and honeypot;
- rate limiting and idempotency;
- durable lead storage;
- Telegram delivery queue/history;
- audited Telegram requeue.

### Administration

Protected `/admin` includes dashboard, category/subcategory management, attribute builder, product CRUD, images, leads, public settings, and storage/metadata reconciliation.

## 🤖 Grounded AI assistant

The RU/RO assistant uses bounded **published catalog context**. A deterministic fallback works without a paid external AI provider:

```env
AI_PROVIDER=fallback
```

The assistant does not receive customer lead records.

## 🏗 Architecture

```mermaid
flowchart LR
    U[Customer] --> N[Next.js storefront]
    A[Admin] --> AD[/admin]
    N --> S[Server data layer]
    AD --> S
    S --> DB[(Supabase PostgreSQL)]
    S --> ST[Supabase Storage]
    N --> L[Lead endpoint]
    L --> DB
    L --> T[Telegram outbox]
    N --> AI[Grounded AI assistant]
    AI --> C[Published catalog]
```

## 🛠 Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16.3 / App Router |
| UI | React 19 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4 |
| Database | Supabase PostgreSQL |
| Authentication | Supabase SSR Auth |
| Storage | Supabase Storage |
| Tests | Vitest + Playwright |
| Deployment target | Vercel |

## 🚀 Quick start

Requires Node.js 22.x and npm 10+.

```bash
git clone https://github.com/xondell/tehnosklad.git
cd tehnosklad
npm ci
cp .env.example .env.local
```

For demo mode:

```env
CATALOG_DATA_SOURCE=demo
```

Then:

```bash
npm run dev
```

The root redirects to `/ru`; Romanian is available at `/ro`.

## 🗄 Local Supabase

A Docker-compatible runtime is required.

```bash
npm run db:start
npm run db:reset:local
```

Then configure `.env.local` with local Supabase values and set:

```env
CATALOG_DATA_SOURCE=supabase
```

See `docs/supabase-setup.md` for the complete flow.

## 🔐 Environment model

Browser-safe variables include:

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Server-only configuration includes the service-role key, lead hashing secret, Telegram credentials, AI rate-limit secret, and optional AI-provider credentials. Never expose server secrets through `NEXT_PUBLIC_*`.

## 🧪 Validation

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run test:e2e
npm run build
```

Database tooling:

```bash
npm run db:start
npm run db:reset:local
npm run db:lint:local
npm run db:types:local
npm run test:integration:local
npm run db:stop
```

## 🔒 Security model

The project includes RLS, explicit grants, server-only privileged operations, admin role re-checks, atomic RPCs, media validation, lead rate limiting/idempotency, privacy-preserving HMAC identifiers, assistant rate limiting, retention procedures, and a durable Telegram outbox.

## 🔍 SEO

The storefront implements localized metadata, canonical URLs, `hreflang`, JSON-LD, sitemap, robots, Open Graph images, and permanent redirects from historical product slugs.

## 📁 Repository map

```text
tehnosklad/
├── docs/                  # Architecture, security and deployment docs
├── e2e/                   # Playwright tests
├── scripts/               # Integration/build helpers
├── src/                   # Next.js application
├── supabase/
│   ├── migrations/        # Versioned production schema
│   ├── verification/      # RLS assertions
│   └── seed.sql           # Deterministic data
├── ADMIN_GUIDE.md
├── .env.example
└── package.json
```

## 📚 Documentation

The repository includes dedicated documentation for Supabase setup, architecture, security, RLS, catalog/SEO, leads and Telegram, admin CRUD, AI assistant, deployment/rollback, and roadmap. `ADMIN_GUIDE.md` contains the detailed administrator workflow.

## ⚖️ Production privacy configuration

Before real customer leads are enabled, the deployment expects the operator's real legal details through the documented `LEGAL_*` environment variables. The code intentionally does not invent production legal identities.

---

<div align="center">

**Tehnosklad — a catalog built as a real production system, not just a storefront mockup.**

</div>
