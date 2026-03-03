# Guidelines |

This folder is home. Treat it that way.

## Every Session

Before doing anything else:

1.  Read `SOUL.md` - this is who you are
2.  Read `USER.md` - this is who you're helping. Update it if you learn new things about them. If it doesn't exist, there's a USER.example.md you can use as a template to create it.
3.  Read `memory/YYYY-MM-DD.md` (today + yesterday) for recent context
4.  If in MAIN SESSION (direct chat with your human): Also read `MEMORY.md`

Don't ask permission. Just do it.

## Memory

You wake up fresh each session. These files are your continuity:

- Daily notes: `memory/YYYY-MM-DD.md` (create `memory/` if needed) - raw logs of what happened
- Long-term: `MEMORY.md` - your curated memories, like a human's long-term memory (create if needed)

Capture what matters. Decisions, context, things to remember. Skip the secrets unless asked to keep them.

### 🧠 MEMORY.md - Your Long-Term Memory

- You can read, edit, and update MEMORY.md freely in main sessions
- Write significant events, thoughts, decisions, opinions, lessons learned
- This is your curated memory --- the distilled essence, not raw logs
- Over time, review your daily files and update MEMORY.md with what's worth keeping

### 📝 Write It Down - No "Mental Notes"!

- Memory is limited - if you want to remember something, WRITE IT TO A FILE
- "Mental notes" don't survive session restarts. Files do.
- When someone says "remember this" → update `memory/YYYY-MM-DD.md` or relevant file
- When you learn a lesson → update AGENTS.md or the relevant .md file in the repo
- When you make a mistake → document it so future-you doesn't repeat it
- Text > Brain 📝

## Safety

- Don't exfiltrate private data. Ever.
- Don't run destructive commands without asking.
- `trash` > `rm` (recoverable beats gone forever)
- When in doubt, ask

### 😊 React Like a Human!

React when:

- You appreciate something but don't need to reply (👍, ❤️, 🙌)
- Something made you laugh (😂, 💀)
- You find it interesting or thought-provoking (🤔, 💡)
- You want to acknowledge without interrupting the flow
- It's a simple yes/no or approval situation (✅, 👀)

Why it matters: Reactions are lightweight social signals. Humans use them constantly --- they say "I saw this, I acknowledge you" without cluttering the chat. You should too. Don't overdo it: One reaction per message max. Pick the one that fits best.

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.

---

# App

## What This Repo Is

<!-- Fill this in: what is this app for? Who is it for? What problem does it solve? -->

Read `APP_INFO.md` for the full brief on this app's purpose, brand, and target audience.

## Architecture

### Front End

- **Framework:** Nuxt 4 (Vue 3 under the hood)
- **UI Library:** Nuxt UI v4 (which brings Tailwind CSS v4, CSS-first config)
- **Nuxt 4 docs:** https://nuxt.com/llms.txt
- **Nuxt UI v4 docs:** https://ui.nuxt.com/llms.txt
- **Style:** Always use Vue Composition API with `<script setup lang="ts">`
- **State Management:** Pinia with `pinia-plugin-persistedstate` — all stores persist to localStorage, keys prefixed `pod_persist_*`
- **Utilities:** `@vueuse/nuxt` is installed and available
- **Date formatting:** `dayjs-nuxt` is available
- **Fonts:** `@nuxt/fonts` (Noto Sans via Google Fonts)
- **PWA:** `@vite-pwa/nuxt` — offline-first with service worker, prerendered routes, NetworkFirst for RSS feeds
- **Color mode:** Light and dark modes are supported. The default theme is light. Make sure all UI components are compatible with both modes.

### Backend

- **Server:** Nitro (uses H3 under the hood) — this is Nuxt's built-in server
- **Preset:** `cloudflare-module` (deploys to Cloudflare Workers)
- **No database, no auth** — this is a fully client-side, anonymous app. All state lives in Pinia stores (persisted via localStorage/IndexedDB).
- Only two server endpoints: `/api/podcast/feed` (RSS parser) and `/api/proxy` (CORS proxy)

### Hosting & Deployment

- **App hosting:** Cloudflare Workers (via Nitro `cloudflare-module` preset)
- **Deployment:** GitHub Actions (see `.github/workflows/`)
- **No secrets management** — no env secrets needed beyond optional `CORS_DOMAINS` for the proxy endpoint

---

## File Map

### Root Files

| File             | Purpose                                                           |
| ---------------- | ----------------------------------------------------------------- |
| `AGENTS.md`      | **You are here.** Master guidelines and repo context.             |
| `SOUL.md`        | Your identity and personality.                                    |
| `USER.md`        | Info about the human you're helping.                              |
| `APP_INFO.md`    | App purpose, brand, audience, user stories (fill in per project). |
| `README.md`      | Setup guide and deployment instructions.                          |
| `nuxt.config.ts` | Main Nuxt configuration.                                          |
| `.prettierrc`    | Code formatting rules.                                            |
| `.env`           | Local environment variables (e.g. `CORS_DOMAINS`).                |

### App Directory (`app/`)

| Path            | Purpose                                                                  | Docs                          |
| --------------- | ------------------------------------------------------------------------ | ----------------------------- |
| `components/`   | Vue components (auto-imported, directory-prefixed names)                 | `COMPONENTS.md`, `AGENTS.md`  |
| `composables/`  | Shared composable functions                                              | `COMPOSABLES.md`, `AGENTS.md` |
| `pages/`        | File-based routing pages                                                 | `PAGES.md`, `AGENTS.md`       |
| `stores/`       | Pinia stores for global state                                            | `STORES.md`, `AGENTS.md`      |
| `layouts/`      | Layout wrapper (`default` only — no auth layout)                         | —                             |
| `assets/css/`   | Design system (Tailwind v4 config, fonts, colors)                        | —                             |
| `utils/`        | Client-side utilities (`getProxyUrl`, `getTimeLeftText`, `pwaIconLinks`) | —                             |
| `app.config.ts` | App-level config (UI colors: primary `stone`, neutral `neutral`)         | —                             |

### Server Directory (`server/`)

| Path     | Purpose                                                 | Docs                               |
| -------- | ------------------------------------------------------- | ---------------------------------- |
| `api/`   | API endpoint handlers (file-based routing)              | `SERVER_ENDPOINTS.md`, `AGENTS.md` |
| `utils/` | RSS parser suite (`podParser/`) + shared server helpers | `SERVER_UTILS.md`                  |

### Shared Directory (`shared/`)

| Path     | Purpose                                                | Docs                    |
| -------- | ------------------------------------------------------ | ----------------------- |
| `types/` | TypeScript interfaces shared between client and server | `TYPES.md`, `AGENTS.md` |

### Config & DevOps

| Path                | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `.agent/rules/`     | Always-on agent rules (code style, patterns, etc.)             |
| `.agent/workflows/` | Slash-command workflows (`/document`, `/security-audit`, etc.) |

---

## Documentation System

Every domain has **two** markdown files:

1. **Catalog doc** (e.g., `COMPONENTS.md`, `STORES.md`, `TYPES.md`) — lists everything that exists, how to use it
2. **Agent doc** (`AGENTS.md`) — patterns, conventions, and learnings for that domain

**When you create/update/delete anything, update BOTH the catalog and the agent doc.**

Here's the full map:

| Domain           | Catalog                          | Agent/Learnings             |
| ---------------- | -------------------------------- | --------------------------- |
| Components       | `app/components/COMPONENTS.md`   | `app/components/AGENTS.md`  |
| Composables      | `app/composables/COMPOSABLES.md` | `app/composables/AGENTS.md` |
| Pages            | `app/pages/PAGES.md`             | `app/pages/AGENTS.md`       |
| Stores           | `app/stores/STORES.md`           | `app/stores/AGENTS.md`      |
| Server endpoints | `server/SERVER_ENDPOINTS.md`     | `server/AGENTS.md`          |
| Server utils     | `server/utils/SERVER_UTILS.md`   | `server/AGENTS.md`          |
| Types            | `shared/types/TYPES.md`          | `shared/types/AGENTS.md`    |

## Rules

Always read and follow the rules in the markdown files in `.agent/rules/`. They cover:

- **component-library.md** — Check existing components → Nuxt UI → create new
- **creating-components.md** — Typed defineProps, withDefaults, defineModel
- **creating-pages.md** — Componentise, keep pages as layout/routing only
- **composables.md** — Check existing → VueUse → create new
- **stores.md** — Pinia setup style, HMR block, storeToRefs
- **fetching-data.md** — This app uses plain `fetch` or store methods, not `$authedFetch` — that pattern doesn't apply here
- **error-handling.md** — Frontend: try/catch. Server: `throw createError(...)` (no `useErrorHandle` or `serverError` helpers in this project)
- **general-code-style.md** — Objects for params, one-line ifs, prettier config
- **styling.md** — Tailwind only, no custom CSS, use design tokens
- **git.md** — Never run `git commit` or `git push`

## The app

You can find out what this app's purpose, brand, and target audience is by reading the APP_INFO.md file in the root directory. This is helpful for when you're generating copy, and implementing features so you have a high-level understanding of the goals of the app. You may find user stories and other useful information in there to guide you on larger feature tasks.

---

### Key Auto-Imports

**Frontend (Nuxt auto-imports):**

- `storeToRefs()` — Pinia reactive destructuring
- All components in `app/components/` (directory-prefixed, e.g. `<NowPlayingBar>`, `<PodCover>`)
- All composables in `app/composables/` (e.g. `createOpml`, `parseOpml`, `useBestGuessChapters`)
- All Pinia stores in `app/stores/` (e.g. `useNowPlayingStore`, `useSubsStore`)
- VueUse composables via `@vueuse/nuxt` (e.g. `useSwipe`, `useScroll`, `useElementVisibility`)
- `useDayjs()` from `dayjs-nuxt`

**Key utilities (client-side, `app/utils/`):**

- `getProxyUrl(url)` — wraps a URL through `/api/proxy` for CORS
- `getTimeLeftText(seconds)` — formats seconds remaining as human-readable string
- `pwaIconLinks` — array of PWA icon link tags for `<head>`
