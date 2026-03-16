# Roadmap

A comprehensive feature list for **Podcasts** — a privacy-first, open-source PWA podcast client.

> Checked items are implemented. Unchecked items are planned or aspirational.

---

## Playback

- [x] Play / pause / seek
- [x] Skip forward (+30s) and backward (-10s)
- [x] Adjustable playback speed (0.8x–2.0x, 0.1 step increments)
- [x] Preset speed buttons (0.8, 1.0, 1.2, 1.5, 2.0x)
- [x] Resume from saved position (per-episode progress tracking)
- [x] Chapter navigation (Podcasting 2.0 `podcast:chapters`, PSC inline chapters, best-guess parsing from description)
- [x] Lock screen / Media Session API integration (play, pause, seek, skip, stop, artwork)
- [x] Auto-advance to next queue item on episode end
- [x] Offline playback from downloaded episodes (IndexedDB)
- [x] Persistent mini-player bar (NowPlayingBar) with seek progress indicator
- [x] Full-screen now-playing dialog with cover art, controls, and seek slider
- [x] Animated audio-playing indicator (3-bar CSS animation)
- [x] Circular progress ring on episode play chips
- [x] Ticker text animation for long episode titles in now-playing dialog
- [x] Track actual listened time per episode (throttled, capped at 3s delta to ignore seeks)
- [ ] Volume boost / audio normalization (even out volume differences between podcasts)
- [ ] Trim silence (automatically skip silent sections to save listening time)
- [ ] Configurable skip intervals (let users choose forward/back skip durations)
- [ ] Continuous playback mode (auto-play next episode from same podcast, not just queue)
- [ ] Crossfade between episodes (smooth transition between queue items)

## Sleep Timer

- [x] Timed countdown mode (5 / 10 / 15 / 20 / 30 / 45 / 60 minutes)
- [x] "End of episode" mode
- [x] iOS-style wheel-picker UI for selecting duration
- [x] Live countdown display in now-playing dialog
- [x] Auto-pause audio when timer fires
- [x] Persisted timer state (survives page refresh)

## Subscriptions

- [x] Subscribe to podcasts via RSS feed URL
- [x] Unsubscribe from podcast pages
- [x] Deduplicated subscription list
- [x] Library page with searchable podcast grid
- [x] Subscribe/unsubscribe toggle overlay on cover art
- [x] Horizontal subscription strip on home feed
- [x] Manage subscriptions dialog (remove subs, add new RSS URL)
- [x] Auto-cleanup of duplicate/empty URLs on mount

## Feed & Discovery

- [x] Home feed — all subscriptions merged, sorted by date (newest first)
- [x] Infinite scroll with batch loading (configurable initial fetch amount)
- [x] Pull-to-refresh with 5-minute cooldown and exponential dampening
- [x] Configurable pull-down weight for refresh feel
- [x] Podcast detail page (cover, title, author, description, people, funding links)
- [x] Episode detail page (metadata, play controls, chapters, people, description, funding)
- [x] Onboarding/start page when no subscriptions exist
- [ ] Podcast search via Podcast Index API (discover new podcasts without needing the RSS URL)
- [ ] Episode search within a podcast (filter/search episode info in a podcast's feed)
- [ ] Trending/popular feeds from Podcast Index for new user discovery
- [ ] "Similar podcasts" suggestions based on categories/tags from subscribed feeds (local-only, no tracking)

## Queue

- [x] Add / remove episodes from queue
- [x] Dedicated queue page
- [x] Sequential auto-play on episode end
- [x] Deduplicated queue entries
- [x] Persisted queue state
- [ ] Drag-to-reorder queue items

## Offline & Downloads

- [x] Download episodes to IndexedDB with real-time progress tracking
- [x] Offline playback — player auto-loads from IndexedDB when available
- [x] Downloads page listing all downloaded episodes
- [x] Delete individual downloads (removes from IndexedDB and store)
- [x] Auto-cleanup of corrupt download entries on mount
- [x] Download progress ring indicator on download button
- [x] Persisted download metadata
- [ ] Auto-download new episodes from selected podcasts

## Bookmarks

- [x] Create timestamp bookmarks at current playback position
- [x] Optional notes on bookmarks
- [x] Visual bookmark markers on seek slider (positioned by timestamp)
- [x] Click bookmark marker to seek to that timestamp
- [x] Dedicated bookmarks page with quick-play
- [x] Remove individual bookmarks
- [x] Bookmark toggle button in now-playing dialog
- [ ] Export bookmarks as markdown or JSON

## Play History

- [x] Automatic play history tracking (most recent first)
- [x] Dedicated history page
- [x] Remove individual history entries
- [x] Clear all history
- [x] Snapshot on page mount (prevents re-ordering while browsing)
- [x] Persisted history state

## Episode Progress

- [x] Per-episode progress tracking (currentTime, duration, started, finished)
- [x] Auto-mark finished at 99%+ completion
- [x] Timestamps: `startedAt`, `lastListenedAt`
- [x] Accumulated `listenedTime` per episode
- [x] Visual indicators: progress ring, check icon (finished), time left text

## OPML Import / Export

- [x] Import from `.opml` / `.xml` files
- [x] Preview imported feeds with metadata and cover art
- [x] Select all / deselect all imported feeds
- [x] Selective import (choose which podcasts to add)
- [x] Export subscriptions to OPML 2.0 XML
- [x] Selective export (choose which podcasts to include)
- [x] Download as `podcasts.opml.xml`

## Statistics ("Stats for Nerds")

- [x] Total listening time (formatted as days / hours / minutes)
- [x] Episodes started count
- [x] Episodes completed count
- [x] Completion rate (%)
- [x] Average episode length
- [x] Time saved at current playback speed
- [x] Current listening streak (consecutive days)
- [x] Longest listening streak ever
- [x] Top 5 most-listened podcasts (by episode count)
- [x] Listening by day of week (bar chart data)
- [x] Most active listening hour (12-hour AM/PM)
- [x] Bookmark count, download count, queue size, history count

## Sharing

- [x] Share podcast via Web Share API (from podcast detail page)
- [x] Share episode via Web Share API (from episode context menu)
- [ ] Share at timestamp (share a link to a specific moment in an episode)
- [ ] Listening activity summary (weekly/monthly recap of listening stats as a shareable card)

## Podcasting 2.0 Support

- [x] `podcast:chapters` — remote JSON chapter files
- [x] PSC inline chapters (`psc:chapters`)
- [x] Best-guess chapter parsing from episode descriptions (Lex Fridman style timestamps)
- [x] `podcast:person` — people associated with podcasts and episodes
- [x] `podcast:funding` — funding/support links
- [ ] `podcast:transcript` — render transcripts when available

## Settings

- [x] Configurable initial fetch amount (episodes per subscription on home load)
- [x] Configurable pull-down weight (refresh gesture sensitivity)
- [x] Configurable swipe-to-dismiss threshold
- [x] OPML import/export access
- [x] Clear all history
- [x] About / attribution links
- [x] GitHub repo and sponsor links (Buy Me a Coffee, GitHub Sponsors)

## UI / UX

- [x] Light and dark mode with toggle
- [x] Mobile-first responsive layout (`max-w-4xl` centering on desktop)
- [x] Swipe-to-dismiss slide-up dialogs (VueUse `useSwipe`)
- [x] Body scroll lock when dialogs are open
- [x] Bottom navigation bar (Home, Add, Library)
- [x] Top navigation bar (dark mode toggle, logo, hamburger menu)
- [x] Side menu (USlideover) with full navigation links
- [x] Noto Sans typeface (Google Fonts via `@nuxt/fonts`)
- [x] Neutral colour palette — no bold brand colours
- [x] Episode context menu (three-dot dropdown: remove download, share)
- [ ] Gesture-based controls (swipe left/right on now-playing for skip forward/back)
- [ ] Keyboard shortcuts (play/pause, skip, volume for desktop/tablet users)
- [ ] Multi-language UI (i18n support with community translations)

## PWA & Offline

- [x] Installable as standalone PWA
- [x] Auto-updating service worker (`@vite-pwa/nuxt`, `registerType: 'autoUpdate'`)
- [x] Precached app shell (all 11 routes, re-fetched per build)
- [x] RSS feeds cached with NetworkFirst strategy (5s timeout, 24h TTL, max 100 entries)
- [x] Navigation cached with NetworkFirst (3s timeout, 7-day TTL, max 50 pages)
- [x] Cross-origin images cached with CacheFirst (30-day TTL, max 500 entries)
- [x] Same-origin images cached with CacheFirst (30-day TTL, max 500 entries)
- [x] Full iOS splash screen support (15+ device sizes)
- [x] Maskable icons (192px, 512px)
- [ ] New episode notifications (background check with push/badge notifications)
- [ ] Auto-add new episodes from selected podcasts to queue

## Server / Backend

- [x] RSS feed parser (`/api/podcast/feed`) with pagination (start/limit)
- [x] CORS proxy (`/api/proxy`) with configurable cache and redirect following
- [x] Custom RSS parser supporting iTunes, Podcasting 2.0, and PSC namespaces
- [x] 1-hour cache headers on feed responses (client + edge)
- [x] 30-day cache for proxied images
- [x] Deployed on Cloudflare Workers (Nitro `cloudflare-module` preset)
- [x] GitHub Actions CI/CD deployment

## Organisation

- [ ] Playlists / custom collections (group episodes across podcasts into themed playlists, sortable order, shareable via link or export)
- [ ] Folders / tags for subscriptions (organize podcasts into custom categories)
- [ ] Pin favourite podcasts to the top of the library
- [ ] Archive episodes (hide from feed without deleting progress)
- [ ] Episode notes / personal annotations (add personal notes to any episode, beyond bookmarks)

## Sync & Portability

- [ ] Cross-device sync via file export (export/import full app state as JSON — subs, progress, bookmarks, queue)
- [ ] Gpodder sync protocol (optional self-hosted sync with Gpodder-compatible servers)
- [ ] Backup to clipboard (quick copy app state for manual transfer)

## Privacy & Philosophy

- [x] No accounts, no auth, no server-side user data
- [x] No analytics, no tracking, no ads
- [x] All data stored locally on-device (localStorage + IndexedDB)
- [x] Open source (GitHub-first)
