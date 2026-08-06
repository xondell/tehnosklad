# Этап 7 — grounded AI-ассистент каталога

## Результат

Добавлен публичный RU/RO виджет и `POST /api/assistant`. Браузер передаёт только locale, вопрос и не более шести коротких реплик; история остаётся в памяти вкладки и не пишется в БД/localStorage. Endpoint проверяет same-origin, JSON, 8 KiB body, whitelist полей/ролей и `Cache-Control: no-store`.

## Grounding и provider boundary

`AssistantProvider` изолирует внешний adapter. Сейчас поддерживаются `fallback` (default, без сети) и `openai-compatible` adapter с server-only `AI_PROVIDER_BASE_URL`; автоматические тесты используют только deterministic fallback и никогда не вызывают provider. Перед provider сервер через публичный RLS-safe catalog repository выполняет bounded search (5 published products), allowlist-ит ID, localized name/category/brand/model/price/stock/specifications и canonical local URL. Service-role и tables leads/outbox не используются.

Ответ provider — strict JSON; HTML, links и price tokens убираются. Ссылки, карточки, цены и availability UI собирает исключительно из authoritative DTO. При отсутствии ключа, timeout, 429/5xx или malformed response fallback возвращает результаты deterministic search, каталог и телефонный путь.

## Threat model

System instruction запрещает disclosure/role changes/admin operations/sensitive data и считает catalog text untrusted. Пользователь не может передать system prompt, model, tools or provider options. Нет PII leads в prompt; raw IP не сохраняется и не логируется. Лог: random request ID, outcome category, provider category, duration bucket, fallback flag and reference count only. Existing CSP is not changed.

## Rate limit и secrets

Migration создаёт закрытую `private.assistant_rate_limits` и узкий `SECURITY DEFINER` RPC, который принимает только HMAC-SHA256 subject hash. Лимит: 8 запросов/минуту. Нужен отдельный `AI_RATE_LIMIT_SECRET` (>=32 chars), не `LEAD_IP_HASH_SECRET`. `AI_PROVIDER`, `AI_PROVIDER_BASE_URL`, `AI_PROVIDER_API_KEY`, `AI_MODEL`, `AI_TIMEOUT_MS` server-only; no key is bundled.

## Known limitations

Current catalog RPC has substring search primarily for localized name/brand/model/SKU; natural-language specs may fall back to a broader catalog search. No conversation persistence, analytics or provider billing is enabled. Before production set `AI_RATE_LIMIT_SECRET`; for external AI also set provider/key/model, review provider data-processing terms and cost caps.
