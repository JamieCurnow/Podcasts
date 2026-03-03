# Pages

This file documents all pages in the app.

---

## `/` (index)

The main home feed. Fetches episodes from all subscribed feeds in batches and displays them sorted by publish date (newest first). Shows a `<SubsHorizontalScroll>` strip of subscribed podcasts at the top. Supports pull-to-refresh (rate-limited to once every 5 minutes) and infinite scroll via `useElementVisibility`.

Redirects to `/start` if the user has no subscriptions.

### Functionality

- Layout: `default`, `keepalive: true`
- Reads subscription URLs from `useSubsStore`
- Fetches `/api/podcast/feed` per subscription in parallel batches
- Infinite scroll: loads next batch when 2nd-to-last item becomes visible
- Pull-to-refresh with configurable `pullDownWeight` from `useUserConfigStore`

---

## `/start`

Onboarding/welcome page shown to users with no subscriptions. Provides "Add by RSS" and "Import from OPML" actions.

### Functionality

- No special layout or auth requirements
- Opens `<ImportOPMLDialog>` in-page

---

## `/add-podcast`

Page for adding a new podcast by RSS URL. Validates the feed by calling `/api/podcast/feed`, then adds the URL via `useSubsStore().addSubscription()` and redirects to `/podcast?url=...`.

Also supports a pre-filled URL via `?url=` query param (auto-submits on mount).

### Functionality

- Shows an RSS URL input with Add button
- Inline error display for bad URLs

---

## `/library`

Displays the user's subscribed podcasts as a grid using `<SearchPods>` with `hide-sub-indicator`. Fetches all subscribed feeds on mount.

### Functionality

- Fetches all subscription feeds via `/api/podcast/feed`
- No subscription badge (library context)

---

## `/podcast` (index)

Podcast detail page. Fetches a feed by `?url=` query param. Shows podcast cover, title, author, subscribe/unsubscribe button, website link, share button, people (`<PodcastPeople>`), description, and funding (`<PodcastFunding>`). Lists episodes with infinite scroll and pull-to-refresh.

### Functionality

- Layout: `default`, `keepalive: true`
- Query param: `url` (encoded RSS feed URL)
- Fetches `/api/podcast/feed` with pagination
- Infinite scroll for episode list (fetches 5 more at a time)
- Pull-to-refresh (rate-limited to 5 min)

---

## `/podcast/episode`

Episode detail page. Fetches the specific episode from the feed by iterating paginated batches until the `episodeGuid` is found. Shows episode date, title, `<PodPlayRow>`, `<PodcastChapters>`, people, description, and funding.

### Functionality

- Layout: `default`, `keepalive: true`
- Query params: `url` (RSS feed URL), `episodeGuid` (episode GUID)
- Paginates through the feed until the episode is found
- Links back to the podcast page

---

## `/queue`

Displays the user's current playback queue from `useQueueStore`. Episodes are shown as `<PodListItem>` with `sub-header="date"`. Shows a placeholder message when empty.

### Functionality

- No auth required
- Reads from persisted `queueStore`

---

## `/bookmarks`

Lists all bookmarks from `useBookmarksStore`. Clicking a bookmark loads the episode at the bookmarked timestamp and opens `<CurrentPodcastDialog>`. Each bookmark shows the episode title, podcast title, optional notes, and the formatted timestamp. Bookmarks can be removed inline.

### Functionality

- No auth required
- Reads from persisted `bookmarksStore`

---

## `/downloads`

Lists all completed downloads from `useDownloadsStore`. Cleans up entries missing podcast or episode data on mount.

### Functionality

- No auth required
- Reads from persisted `downloadsStore`

---

## `/history`

Lists recently played episodes from `useHistoryStore` (most recent first). Snapshot is taken on mount so the list doesn't jump when you play an episode from within it.

### Functionality

- No auth required
- Reads from persisted `historyStore`

---

## `/settings`

App settings page. Sections: About (GitHub/sponsor links), General (initial episodes to fetch, pull-down weight), Import/Export OPML, and Danger Zone (clear all history).

### Functionality

- Configures `useUserConfigStore`
- Opens `<ImportOPMLDialog>` and `<ExportOPMLDialog>`
- `clearAllHistory()` from `useHistoryStore`

---

## Patterns & Learnings

- No auth is required for any page — there's no `authed` layout in use. This app is fully public/local.
- All data fetching is done in `onMounted` or via `watch`, not `useAsyncData`/`useFetch`. The app is a client-side PWA.
- Use `keepalive: true` in `definePageMeta` for pages with expensive feed fetches (home, podcast, episode) to avoid reloading on navigation.
- The home page redirects to `/start` when there are no subscriptions — always guard for this case.
- Episode pagination pattern: pass `start` and `limit` to `/api/podcast/feed`, increment `start` by `limit`. Trigger via `useElementVisibility` on a sentinel element near the bottom.
- Pull-to-refresh is rate-limited to 5 min — simulate a delay if within the window, do a real `noCache` fetch otherwise.
