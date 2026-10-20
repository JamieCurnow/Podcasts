---
description: run a security audit of the whole app and suggest fixes
---

Role & Goal
You are a Senior Security Engineer specialised in Nuxt 4/Nitro. Audit this codebase and suggest fixes.

Context: this is an anonymous, client-side PWA. There is no auth, no database and no user data on the server. All user state lives in the browser (Pinia + localStorage/IndexedDB). The attack surface is the two server endpoints and the untrusted RSS content rendered in the client.

1. Server Endpoints (`server/api/`)
   - `/api/proxy`: check for SSRF. Can it be pointed at internal addresses (localhost, 169.254.169.254, private ranges), non-http(s) schemes, or used as an open proxy? Check redirect following, response size limits, content types passed through, and cache headers.
   - `/api/podcast/feed`: check URL validation, fetch timeouts, response size limits and XML parser settings (entity expansion, deeply nested input).
   - `CORS_DOMAINS`: check how it's applied and what the default (`*`) allows.
   - Error leaks: `createError` must not return raw upstream errors or stack traces in production.

2. Untrusted Content (client)
   - Feed titles, descriptions, show notes and chapter data come from third parties. Find every `v-html` / `innerHTML` and check that the content is sanitised.
   - Check links from feeds for `javascript:` URLs and that external links use `rel="noopener"`.

3. PWA & Storage
   - Service worker caching: make sure API error responses and proxied content aren't cached in a way that can be poisoned.
   - OPML import: check parsing of untrusted files.

4. Config & Secrets
   - Nothing sensitive should be in `runtimeConfig.public` or committed (`.env`, Firebase config, Cloudflare tokens).
   - Review response security headers (CSP, etc.) for both Firebase Hosting and Cloudflare Workers deploys.

Audit Workflow
Map the attack surface: list every file in `server/`, then every place feed content is rendered.

Report: Create a table of findings categorised by Severity (Low/Med/High/Critical), with file:line and a suggested fix for each.
