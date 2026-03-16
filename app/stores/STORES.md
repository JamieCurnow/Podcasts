# Stores

Documentation for the Pinia stores used to manage global state.

All stores use the Composition API setup style and are persisted to `localStorage` via `pinia-plugin-persistedstate` (key prefixes: `pod_persist_*`).

---

## `useNowPlayingStore`

The core audio playback store. Owns the global `<audio>` element ref (mounted in `<NowPlayingBar>`), manages playback state, position tracking, Media Session API integration, and queue auto-advance.

On mount it rehydrates the last episode/podcast from persistence and loads the audio element without auto-playing.

### State

| Key                        | Type                                        | Description                            |
| -------------------------- | ------------------------------------------- | -------------------------------------- |
| `audio`                    | `Ref<HTMLAudioElement \| undefined>`        | Global audio element ref               |
| `src`                      | `Ref<string \| undefined>`                  | Currently loaded audio src URL         |
| `episode`                  | `Ref<Episode \| undefined>`                 | Currently loaded episode               |
| `podcast`                  | `Ref<Podcast \| undefined>`                 | Currently loaded podcast               |
| `audioState`               | `Ref<'playing' \| 'paused' \| 'idle' \| 'loading'>` | Playback state              |
| `duration`                 | `Ref<number>`                               | Track duration in seconds              |
| `currentTime`              | `Ref<number>`                               | Current playback position in seconds   |
| `currentTimePercentage`    | `ComputedRef<number>`                       | Progress percentage 0–100              |
| `timeLeft`                 | `ComputedRef<number>`                       | Seconds remaining                      |
| `timeLeftText`             | `ComputedRef<string>`                       | Human-readable time left (e.g. "5min left") |
| `timeLeftFormatted`        | `ComputedRef<string>`                       | `HH:MM:SS` formatted time remaining   |
| `currentTimeFormatted`     | `ComputedRef<string>`                       | `HH:MM:SS` formatted current time     |
| `currentPodcastDialogOpen` | `Ref<boolean>`                              | Controls `<CurrentPodcastDialog>`      |
| `isError`                  | `Ref<boolean>`                              | Error state                            |
| `errorMessage`             | `Ref<string>`                               | Error message                          |

### Methods

| Method          | Signature                                                                              | Description                                              |
| --------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `loadPodcast`   | `(opts: { episode, podcast, dontPlay?, at? }) => Promise<void>`                        | Loads and plays an episode, optionally at a given time   |
| `play`          | `() => void`                                                                           | Resumes playback                                         |
| `pause`         | `() => void`                                                                           | Pauses playback                                          |
| `skipForwards`  | `() => void`                                                                           | Skips forward 30 seconds                                 |
| `skipBackwards` | `() => void`                                                                           | Skips back 10 seconds                                    |
| `seekTo`        | `(time: number) => void`                                                               | Seeks to a specific second                               |

### Persistence

Key: `pod_persist_now_playing` — persists `episode`, `podcast`, `currentTime`.

### Usage

```ts
const store = useNowPlayingStore()
const { audioState, currentTime, episode, podcast } = storeToRefs(store)
await store.loadPodcast({ episode, podcast, at: 120 })
```

---

## `useSubsStore`

Manages the user's podcast subscription URLs and episode listening metadata (progress, finished state, etc.).

### State

| Key              | Type                            | Description                                 |
| ---------------- | ------------------------------- | ------------------------------------------- |
| `urls`           | `Ref<string[] \| undefined>`    | Array of subscribed RSS feed URLs           |
| `episodes`       | `Ref<EpisodeMeta[] \| undefined>` | Per-episode listening metadata             |
| `showManageSubs` | `Ref<boolean>`                  | Controls the manage subs dialog (legacy)    |
| `lastPersisted`  | `Ref<number \| undefined>`      | Timestamp of last persist                   |

### Methods

| Method               | Signature                                                                           | Description                                      |
| -------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------ |
| `addSubscription`    | `(url: string) => void`                                                             | Adds a feed URL (no-ops if already subscribed)   |
| `updateEpisodeMeta`  | `(meta: Pick<EpisodeMeta, 'feedUrl' \| 'guid' \| 'currentTime' \| 'duration'>) => void` | Upserts listen progress for an episode      |
| `getEpisodeMeta`     | `(opts: { feedUrl, guid }) => ComputedRef<EpisodeMeta \| undefined>`                | Returns reactive metadata for a specific episode |

### Persistence

Key: `pod_persist_subs` — persists `urls`, `lastPersisted`, `episodes`.

### Usage

```ts
const { urls } = storeToRefs(useSubsStore())
const { addSubscription, getEpisodeMeta } = useSubsStore()
const meta = getEpisodeMeta({ feedUrl: pod.feedUrl, guid: episode.guid })
```

---

## `useQueueStore`

Manages the playback queue (ordered list of `{ podcast, episode }` pairs). The now-playing store auto-advances to the next queue item when an episode ends.

### State

| Key     | Type                                             | Description             |
| ------- | ------------------------------------------------ | ----------------------- |
| `queue` | `Ref<{ podcast: Podcast; episode: Episode }[] \| undefined>` | Ordered queue |

### Methods

| Method              | Signature                                                 | Description                                |
| ------------------- | --------------------------------------------------------- | ------------------------------------------ |
| `addToQueue`        | `(opts: { podcast, episode }) => void`                    | Appends if not already present             |
| `removeFromQueue`   | `(opts: { podcast, episode }) => void`                    | Removes by feedUrl + guid                  |
| `findEpisodeInQueue`| `(opts: { podcast, episode }) => { index, item }`         | Finds an episode's index in the queue      |

### Persistence

Key: `pod_persist_queue` — persists `queue`.

### Usage

```ts
const { queue } = storeToRefs(useQueueStore())
const { addToQueue, removeFromQueue } = useQueueStore()
```

---

## `useDownloadsStore`

Manages offline episode downloads. Files are stored as `ArrayBuffer` in IndexedDB (`podcasts` DB, `audioFiles` object store). The now-playing store checks IndexedDB first before loading from a remote URL.

### State

| Key         | Type                          | Description              |
| ----------- | ----------------------------- | ------------------------ |
| `downloads` | `Ref<Download[] \| undefined>` | Array of download records |

The `Download` interface is exported from the store file:

```ts
interface Download {
  src: string
  progress: number        // 0–100
  feedUrl: string
  episodeGuid: string
  status: 'completed' | 'inProgress' | 'failed' | 'paused'
  mimeType: string
  timeStamp: number
  podcast: Podcast
  episode: Episode
}
```

### Methods

| Method          | Signature                                              | Description                                              |
| --------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| `getDownload`   | `(opts: { feedUrl, episodeGuid }) => ComputedRef<Download \| undefined>` | Returns reactive download record |
| `startDownload` | `(opts: { episode, podcast }) => Promise<void>`        | Downloads via XHR with progress, saves to IndexedDB     |
| `deleteDownload`| `(opts: { feedUrl, episodeGuid }) => Promise<void>`    | Removes from IndexedDB and the downloads array          |

### Persistence

Key: `pod_persist_downloads` — persists `downloads`.

### Usage

```ts
const { downloads } = storeToRefs(useDownloadsStore())
const { startDownload, deleteDownload, getDownload } = useDownloadsStore()
const download = getDownload({ feedUrl, episodeGuid })
```

---

## `useBookmarksStore`

Stores timestamped bookmarks for episodes, with optional notes. Bookmarks are matched by `episode.guid + timestamp`.

### State

| Key         | Type             | Description          |
| ----------- | ---------------- | -------------------- |
| `bookmarks` | `Ref<Bookmark[]>` | Array of bookmarks  |

The `Bookmark` interface is exported from the store file:

```ts
interface Bookmark {
  podcast: Podcast
  episode: Episode
  timestamp: number   // seconds
  notes?: string
}
```

### Methods

| Method          | Signature                            | Description                         |
| --------------- | ------------------------------------ | ----------------------------------- |
| `addBookmark`   | `(bookmark: Bookmark) => void`       | Prepends to the bookmarks list      |
| `removeBookmark`| `(bookmark: Bookmark) => void`       | Removes by guid + timestamp         |
| `isBookmarked`  | `(episodeGuid, timestamp) => boolean` | Checks if a timestamp is bookmarked |

### Persistence

Key: `pod_persist_bookmarks` — persists all state.

### Usage

```ts
const { bookmarks } = storeToRefs(useBookmarksStore())
const { addBookmark, removeBookmark, isBookmarked } = useBookmarksStore()
```

---

## `useHistoryStore`

Stores the list of played episodes in reverse-chronological order. Re-playing an episode moves it to the front.

### State

| Key       | Type                                                              | Description                     |
| --------- | ----------------------------------------------------------------- | ------------------------------- |
| `history` | `Ref<{ podcast: Podcast; episode: Episode }[] \| undefined>`      | Recently played episodes        |

### Methods

| Method                | Signature                                | Description                                          |
| --------------------- | ---------------------------------------- | ---------------------------------------------------- |
| `addToHistory`        | `(opts: { podcast, episode }) => void`   | Moves existing entry to front or prepends new entry  |
| `removeFromHistory`   | `(opts: { podcast, episode }) => void`   | Removes by feedUrl + guid                            |
| `findEpisodeInHistory`| `(opts: { podcast, episode }) => { index, item }` | Finds an episode's index                  |
| `clearAllHistory`     | `() => void`                             | Empties the history array                            |

### Persistence

Key: `pod_persist_history` — persists `history`.

### Usage

```ts
const { history } = storeToRefs(useHistoryStore())
const { clearAllHistory } = useHistoryStore()
```

---

## `useUserConfigStore`

Stores user-configurable preferences for the app UI and behaviour.

### State

| Key                          | Type          | Default | Description                                   |
| ---------------------------- | ------------- | ------- | --------------------------------------------- |
| `swipeDownBeforeCloseAmount` | `Ref<number>` | `150`   | Pixels of swipe needed to close a bottom sheet |
| `amountOfPodsToInitiallyFetch` | `Ref<number>` | `5`  | Episodes to fetch per batch on initial load   |
| `playbackSpeed`              | `Ref<number>` | `1`     | Audio playback rate multiplier                |
| `pullDownWeight`             | `Ref<number>` | `0.85`  | Exponential damping factor for pull-to-refresh |

### Persistence

Key: `pod_persist_user_config` — persists all four values.

### Usage

```ts
const { playbackSpeed, amountOfPodsToInitiallyFetch } = storeToRefs(useUserConfigStore())
```

---

## `useGlobalStateStore`

Minimal store for app-level UI state that doesn't warrant persistence.

### State

| Key               | Type           | Description                                                       |
| ----------------- | -------------- | ----------------------------------------------------------------- |
| `bodyScrollLock`  | `Ref<boolean>` | Whether a bottom sheet has locked the body scroll                 |

### Usage

```ts
const { bodyScrollLock } = storeToRefs(useGlobalStateStore())
```

---

## `useLoadingStore`

Simple global loading flag, wired to the home page's main loading state.

### State

| Key         | Type           | Description               |
| ----------- | -------------- | ------------------------- |
| `isLoading` | `Ref<boolean>` | Global loading indicator  |

### Usage

```ts
const { isLoading } = storeToRefs(useLoadingStore())
```

---

## `useSleepTimerStore`

Timestamp-based sleep timer. Stores `endTimestamp` (Unix ms) and compares against `Date.now()` on each `timeupdate` tick from the audio element. Supports two modes: timed (pauses after N minutes) and end-of-episode (prevents queue auto-advance when episode ends).

### State

| Key               | Type                                      | Description                          |
| ----------------- | ----------------------------------------- | ------------------------------------ |
| `endTimestamp`    | `Ref<number \| null>`                     | Unix ms when timed timer fires       |
| `mode`            | `Ref<'timed' \| 'endOfEpisode' \| null>`  | Active timer type                    |
| `selectedMinutes` | `Ref<number \| null>`                     | Original selection (for display)     |
| `now`             | `Ref<number>`                             | Reactive clock updated by checkTimer |
| `isActive`        | `ComputedRef<boolean>`                    | Whether any timer is active          |
| `remainingSeconds`| `ComputedRef<number>`                     | Seconds left on timed timer          |
| `remainingFormatted` | `ComputedRef<string>`                  | HH:MM:SS formatted remaining time   |

### Methods

| Method       | Signature                                                    | Description                                              |
| ------------ | ------------------------------------------------------------ | -------------------------------------------------------- |
| `start`      | `(opts: { minutes: number } \| { endOfEpisode: true }) => void` | Starts a timed or end-of-episode timer               |
| `cancel`     | `() => void`                                                 | Clears all timer state                                   |
| `checkTimer` | `() => void`                                                 | Called from timeupdate; pauses audio if timed timer expired |

### Persistence

Key: `pod_persist_sleep_timer` — persists `endTimestamp`, `mode`, `selectedMinutes`. Stale timestamps trigger immediate pause+cancel on first `checkTimer`.

### Usage

```ts
const sleepTimerStore = useSleepTimerStore()
sleepTimerStore.start({ minutes: 30 })
sleepTimerStore.start({ endOfEpisode: true })
sleepTimerStore.cancel()
```

---

## `useStatsStore`

A read-only derived store that aggregates listening statistics from other stores. Has **no persisted state** — all values are computed from `useSubsStore`, `useHistoryStore`, `useBookmarksStore`, `useDownloadsStore`, `useQueueStore`, and `useUserConfigStore`.

### Computed Values

| Key | Type | Description |
| --- | ---- | ----------- |
| `totalListeningTimeSeconds` | `ComputedRef<number>` | Sum of `currentTime` across all episodes |
| `totalListeningTimeFormatted` | `ComputedRef<string>` | Human-readable total time (e.g. "2d 5h") |
| `episodesStarted` | `ComputedRef<number>` | Count of started episodes |
| `episodesCompleted` | `ComputedRef<number>` | Count of finished episodes |
| `podcastsSubscribed` | `ComputedRef<number>` | Number of subscribed feeds |
| `completionRate` | `ComputedRef<number>` | Percentage of started episodes completed |
| `averageEpisodeLengthFormatted` | `ComputedRef<string>` | Mean duration of started episodes |
| `timeSavedFormatted` | `ComputedRef<string>` | Time saved at current playback speed |
| `bookmarkCount` | `ComputedRef<number>` | Total bookmarks |
| `completedDownloads` | `ComputedRef<number>` | Completed download count |
| `queueSize` | `ComputedRef<number>` | Current queue length |
| `historyCount` | `ComputedRef<number>` | History entry count |
| `topPodcasts` | `ComputedRef<{ feedUrl, count }[]>` | Top 5 podcasts by started episode count |
| `longestStreak` | `ComputedRef<number>` | Longest consecutive listening day streak |
| `currentStreak` | `ComputedRef<number>` | Current consecutive day streak |
| `listeningByDayOfWeek` | `ComputedRef<number[]>` | Episode counts by day (Sun–Sat) |
| `mostActiveHour` | `ComputedRef<string \| null>` | Peak listening hour (e.g. "9AM") |
| `hasAnyData` | `ComputedRef<boolean>` | Whether any listening data exists |

### Usage

```ts
const statsStore = useStatsStore()
const { totalListeningTimeFormatted, episodesCompleted } = storeToRefs(statsStore)
```

---

## `usePlaylistsStore`

Manages user-created playlists — custom collections of episodes across different podcasts.

### State

| Key         | Type              | Description          |
| ----------- | ----------------- | -------------------- |
| `playlists` | `Ref<Playlist[]>` | Array of playlists   |

The `Playlist` interface is exported from the store file:

```ts
interface Playlist {
  id: string
  name: string
  description?: string
  items: { podcast: Podcast; episode: Episode }[]
  createdAt: number
  updatedAt: number
}
```

### Methods

| Method               | Signature                                                          | Description                                |
| -------------------- | ------------------------------------------------------------------ | ------------------------------------------ |
| `getPlaylist`        | `(id: string) => ComputedRef<Playlist \| undefined>`               | Returns reactive playlist by ID            |
| `createPlaylist`     | `(opts: { name, description? }) => Playlist`                       | Creates and returns a new playlist         |
| `deletePlaylist`     | `(id: string) => void`                                             | Removes a playlist                         |
| `updatePlaylist`     | `(id: string, opts: { name?, description? }) => void`              | Updates playlist metadata                  |
| `addToPlaylist`      | `(id: string, opts: { podcast, episode }) => void`                 | Adds an episode (deduped by feedUrl+guid)  |
| `removeFromPlaylist` | `(id: string, opts: { feedUrl, guid }) => void`                    | Removes an episode from a playlist         |
| `reorderPlaylist`    | `(id: string, fromIndex: number, toIndex: number) => void`         | Moves an item within the playlist          |

### Persistence

Key: `pod_persist_playlists` — persists `playlists`.

### Usage

```ts
const { playlists } = storeToRefs(usePlaylistsStore())
const { createPlaylist, addToPlaylist, deletePlaylist } = usePlaylistsStore()
const playlist = createPlaylist({ name: 'My Favourites' })
addToPlaylist(playlist.id, { podcast, episode })
```

---

## Patterns & Learnings

- All stores are persisted via `pinia-plugin-persistedstate`. Use `persist: { key: 'pod_persist_*', pick: [...] }`. Always prefix keys with `pod_persist_`.
- Stores ARE the source of truth — there is no server sync. Don't add server sync unless the architecture changes.
- `useNowPlayingStore` owns the `<audio>` element. Other stores must not touch audio directly.
- Cross-store calls are common (e.g. `nowPlayingStore` calls `subsStore.updateEpisodeMeta`). In setup syntax you can call `useOtherStore()` directly inside another store — no need to pass the pinia instance.
- `useDownloadsStore` is the only store that touches IndexedDB. Its helpers (`getBlobFromIndexedDB`, `saveBlobToIndexedDB`) are exported from the store file and used by `nowPlayingStore` to load downloaded audio.
- `formatTime` was moved out of `nowPlayingStore` into `app/utils/formatTime.ts`. It's now auto-imported everywhere. The store still uses it internally for `timeLeftFormatted` and `currentTimeFormatted`.
