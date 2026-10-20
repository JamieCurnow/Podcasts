---
trigger: always_on
---

# Fetching Data |

There is no auth and no database, so there are no authed fetch helpers. Don't add auth headers or tokens.

- Use `$fetch` for our own server routes, e.g. `$fetch('/api/podcast/feed', { query: { url, start, limit } })`.
- Third-party URLs (feed assets, chapters JSON, images) can fail on CORS. Wrap them with `getProxyUrl(url)` from `app/utils/` so they go through `/api/proxy`.
- If several components need the same data, put the fetch in a store action (see /app/stores/STORES.md) rather than repeating it.
- Persisted state lives in Pinia stores, so check the store before fetching data the app may already have.
