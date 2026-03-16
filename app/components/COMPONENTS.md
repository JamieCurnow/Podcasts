# Components

This file lists all components used in the app, what they do, and how to use them.

---

## `<AddToPlaylistDialog>`

A `UModal` that lets the user add an episode to an existing playlist or create a new one. Shows all playlists with a check icon for playlists that already contain the episode. Includes a "New Playlist" button that opens `<NewPlaylistDialog>`.

### Props

| Prop         | Type      | Required | Description            |
| ------------ | --------- | -------- | ---------------------- |
| `modelValue` | Boolean   | Yes      | Controls open state    |
| `episode`    | `Episode` | Yes      | Episode to add         |
| `podcast`    | `Podcast` | Yes      | Parent podcast         |

### Example

```vue
<AddToPlaylistDialog v-model="isOpen" :episode="episode" :podcast="podcast" />
```

---

## `<AudioPlaying>`

Animated three-bar equaliser icon indicating audio is currently playing.

### Props

None

### Example

```vue
<AudioPlaying />
```

---

## `<BookmarkMarkers>`

Renders bookmark position markers over the seek slider in `<CurrentPodcastDialog>`. Reads the current episode's bookmarks from `useBookmarksStore` and the track duration from `useNowPlayingStore`, then maps each bookmark timestamp to a pixel position aligned with the Reka UI slider thumb bounds. Clicking a marker seeks to that timestamp.

### Props

None

### Example

```vue
<BookmarkMarkers />
```

---

## `<BottomNav>`

Fixed bottom navigation bar with links to Home (`/`), Add (`/add-podcast`), and Library (`/library`). Highlights the active route. Renders rounded corners at the top when no audio is playing.

### Props

None

### Example

```vue
<BottomNav />
```

---

## `<CurrentPodcastDialog>`

Full-screen slide-up player dialog. Shows podcast cover art, episode title, podcast title (with ticker if overflowing), play/pause, 10-second back skip, 30-second forward skip, seek slider (with `<BookmarkMarkers>` overlaid), playback speed button, and bookmark toggle. Opens `<PlaybackSpeedDialog>` and `<NewBookmarkDialog>` as nested dialogs.

### Props

None (reads state from `useNowPlayingStore`)

### Example

```vue
<CurrentPodcastDialog />
```

---

## `<DarkModeToggle>`

A ghost icon button that toggles between light and dark colour mode using `useColorMode()`.

### Props

None

### Example

```vue
<DarkModeToggle />
```

---

## `<Divider>`

A full-width horizontal rule styled with `border-b`.

### Props

None

### Example

```vue
<Divider />
```

---

## `<ExportOPMLDialog>`

A `UModal` that lets the user export their podcast subscriptions as an OPML file. Fetches each subscribed feed on open, shows a checklist of podcasts using `<PodcastListItem>`, and downloads the OPML via `createOpml()` when the user confirms.

### Props

| Prop         | Type    | Required | Description         |
| ------------ | ------- | -------- | ------------------- |
| `modelValue` | Boolean | Yes      | Controls open state |

### Example

```vue
<ExportOPMLDialog v-model="isOpen" />
```

---

## `<FullScreenLoading>`

Centres a large `<Loading>` spinner in 50% of the viewport height.

### Props

None

### Example

```vue
<FullScreenLoading />
```

---

## `<ImportOPMLDialog>`

A `UModal` that imports podcast subscriptions from an `.opml` / `.xml` file. Parses the file using `parseOpml()`, fetches each feed, and shows a selectable list using `<PodcastListItem>`. Confirmed selections are added via `useSubsStore().addSubscription()` and the user is navigated to `/library`.

### Props

| Prop         | Type    | Required | Description         |
| ------------ | ------- | -------- | ------------------- |
| `modelValue` | Boolean | Yes      | Controls open state |

### Example

```vue
<ImportOPMLDialog v-model="isOpen" />
```

---

## `<Loading>`

Spinning `i-mdi-loading` icon that fills its parent dimensions.

### Props

None

### Example

```vue
<Loading class="size-16" />
```

---

## `<LoadMore>`

A simple "More..." button styled as a primary trailing `UButton`.

### Props

None

### Example

```vue
<LoadMore />
```

---

## `<ManageSubsDialog>`

A `UModal` for managing podcast subscriptions. Lists all subscribed podcasts (loaded from the feed API on open) with a remove button per entry, plus an input to add a new RSS feed URL.

### Props

| Prop         | Type    | Required | Description         |
| ------------ | ------- | -------- | ------------------- |
| `modelValue` | Boolean | Yes      | Controls open state |

### Example

```vue
<ManageSubsDialog v-model="isOpen" />
```

---

## `<NavMenu>`

A `USlideover` side navigation menu with links to: Subscriptions, Queue, Bookmarks, Downloads, History, and Settings. Closes on navigation.

### Props (via `v-model`)

| Prop         | Type    | Description          |
| ------------ | ------- | -------------------- |
| `modelValue` | Boolean | Open/close the panel |

### Example

```vue
<NavMenu v-model="menuOpen" />
```

---

## `<NewPlaylistDialog>`

A `UModal` for creating a new playlist with a name and optional description. Emits `created` with the new playlist ID on success.

### Props

| Prop         | Type    | Required | Description         |
| ------------ | ------- | -------- | ------------------- |
| `modelValue` | Boolean | Yes      | Controls open state |

### Events

| Event     | Payload  | Description                    |
| --------- | -------- | ------------------------------ |
| `created` | `string` | Emitted with new playlist ID  |

### Example

```vue
<NewPlaylistDialog v-model="isOpen" @created="onCreated" />
```

---

## `<NewBookmarkDialog>`

A `<SlideUpDialog>` for creating a new bookmark at the current playback position. Shows the formatted current time and a textarea for optional notes. Saves via `useBookmarksStore().addBookmark()`.

### Props (via `v-model`)

| Prop         | Type    | Description          |
| ------------ | ------- | -------------------- |
| `modelValue` | Boolean | Open/close the panel |

### Example

```vue
<NewBookmarkDialog v-model="isOpen" />
```

---

## `<NowPlayingBar>`

Fixed mini-player bar rendered above the `<BottomNav>`. Shows podcast cover, episode title, play/pause button, and a thin progress bar. Slides up from below when audio is active; hidden when idle. Clicking opens `<CurrentPodcastDialog>`.

Contains the global `<audio>` element — its `ref` is wired into `useNowPlayingStore`.

### Props

None

### Example

```vue
<NowPlayingBar />
```

---

## `<PlaylistCover>`

A 2x2 grid of podcast cover images from a playlist's episodes. Shows up to 4 unique podcast covers. Falls back to a playlist icon when empty.

### Props

| Prop       | Type       | Required | Default | Description           |
| ---------- | ---------- | -------- | ------- | --------------------- |
| `playlist` | `Playlist` | Yes      | —       | Playlist to display   |
| `size`     | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant         |

### Example

```vue
<PlaylistCover :playlist="playlist" size="lg" />
```

---

## `<PlaybackSpeedDialog>`

A `<SlideUpDialog>` with a `USlider` (0.8–2.0x, step 0.1) and preset speed buttons (0.8, 1.0, 1.2, 1.5, 2.0) for adjusting playback speed. Writes directly to `useUserConfigStore().playbackSpeed`.

### Props (via `v-model`)

| Prop         | Type    | Description          |
| ------------ | ------- | -------------------- |
| `modelValue` | Boolean | Open/close the panel |

### Example

```vue
<PlaybackSpeedDialog v-model="isOpen" />
```

---

## `<PlayRing>`

An SVG circular progress ring with a centred default slot for icon content. Used to show download progress and episode listen progress.

### Props

| Prop         | Type    | Required | Default     | Description                              |
| ------------ | ------- | -------- | ----------- | ---------------------------------------- |
| `percentage` | Number  | Yes      | —           | Progress fill 0–100                      |
| `stroke`     | String  | No       | `'stroke-[3]'` | Tailwind stroke-width class           |
| `invert`     | Boolean | No       | `false`     | Inverts the light/dark colour assignment |

### Example

```vue
<PlayRing :percentage="50" class="size-5">
  <UIcon name="i-mdi-play" class="size-4" />
</PlayRing>
```

---

## `<PodAddToQueue>`

Icon button that adds or removes an episode from the queue. Icon and colour change based on whether the episode is already queued.

### Props

| Prop      | Type      | Required | Description     |
| --------- | --------- | -------- | --------------- |
| `episode` | `Episode` | Yes      | Episode to queue |
| `podcast` | `Podcast` | Yes      | Parent podcast  |

### Example

```vue
<PodAddToQueue :episode="episode" :podcast="podcast" />
```

---

## `<PodCover>`

Displays a podcast cover image routed through `/api/proxy` for caching (4-week cache). Rounded corners default to `rounded-lg`; `less-rounded` uses `rounded-md`.

### Props

| Prop          | Type    | Required | Default | Description              |
| ------------- | ------- | -------- | ------- | ------------------------ |
| `img`         | String  | No       | `''`    | Image URL                |
| `width`       | Number  | No       | `100`   | Image width (px)         |
| `height`      | Number  | No       | `100`   | Image height (px)        |
| `lessRounded` | Boolean | No       | `false` | Use `rounded-md` instead |

### Example

```vue
<PodCover :img="podcast.image?.url" class="size-16" />
```

---

## `<PodDownload>`

Icon button that triggers episode download via `useDownloadsStore().startDownload()`. Shows a `<PlayRing>` with progress while downloading and a "done" icon when complete.

### Props

| Prop      | Type      | Required | Description         |
| --------- | --------- | -------- | ------------------- |
| `episode` | `Episode` | Yes      | Episode to download |
| `podcast` | `Podcast` | Yes      | Parent podcast      |

### Example

```vue
<PodDownload :episode="episode" :podcast="podcast" />
```

---

## `<PodListItem>`

Full episode list item. Combines `<PodTitle>`, an episode title + description snippet (links to `/podcast/episode`), and a `<PodPlayRow>`. Used on the home feed, queue, downloads, and history pages.

### Props

| Prop        | Type                                  | Required | Default | Description                          |
| ----------- | ------------------------------------- | -------- | ------- | ------------------------------------ |
| `episode`   | `Episode`                             | Yes      | —       | Episode data                         |
| `podcast`   | `Podcast`                             | Yes      | —       | Podcast data                         |
| `subHeader` | `'timeAgo' \| 'date' \| 'podcastTitle'` | No     | `''`    | Sub-header style passed to `<PodTitle>` |
| `noCover`   | Boolean                               | No       | `false` | Hide the cover image                 |
| `noTitle`   | Boolean                               | No       | `false` | Hide the podcast title               |

### Example

```vue
<PodListItem :episode="episode" :podcast="podcast" sub-header="date" />
```

---

## `<PodMenu>`

A `UDropdownMenu` (vertical dots icon) with contextual actions: "Remove Download" (if downloaded) and "Share Episode" (if `navigator.share` is available).

### Props

| Prop      | Type      | Required | Description    |
| --------- | --------- | -------- | -------------- |
| `episode` | `Episode` | Yes      | Episode data   |
| `podcast` | `Podcast` | Yes      | Podcast data   |

### Example

```vue
<PodMenu :episode="episode" :podcast="podcast" />
```

---

## `<PodPlayChip>`

A play/pause chip button that shows episode progress via `<PlayRing>`, animated bars via `<AudioPlaying>` when playing, a check icon when finished, or a loading spinner. Reads episode metadata from `useSubsStore` and triggers playback via `useNowPlayingStore`.

### Props

| Prop      | Type      | Required | Description    |
| --------- | --------- | -------- | -------------- |
| `episode` | `Episode` | Yes      | Episode data   |
| `podcast` | `Podcast` | Yes      | Podcast data   |

### Example

```vue
<PodPlayChip :episode="episode" :podcast="podcast" />
```

---

## `<PodPlayRow>`

A row of episode action buttons: `<PodPlayChip>`, `<PodAddToQueue>`, `<PodDownload>`, and `<PodMenu>`.

### Props

| Prop      | Type      | Required | Description    |
| --------- | --------- | -------- | -------------- |
| `episode` | `Episode` | Yes      | Episode data   |
| `podcast` | `Podcast` | Yes      | Podcast data   |

### Example

```vue
<PodPlayRow :episode="episode" :podcast="podcast" />
```

---

## `<PodcastChapter>`

A single chapter row button. Clicking loads the podcast at the chapter's start time via `useNowPlayingStore().loadPodcast()`.

### Props

| Prop      | Type                       | Required | Description             |
| --------- | -------------------------- | -------- | ----------------------- |
| `chapter` | `PodcastChapterJsonChapter` | Yes     | Chapter data            |
| `index`   | Number                     | Yes      | Zero-based index        |
| `episode` | `Episode`                  | Yes      | Parent episode          |
| `podcast` | `Podcast`                  | Yes      | Parent podcast          |

### Example

```vue
<PodcastChapter :chapter="chapter" :index="0" :episode="episode" :podcast="podcast" />
```

---

## `<PodcastChapters>`

Collapsible chapters section for an episode. Tries three strategies in order: remote `podcast:chapters` JSON URL, PSC `<psc:chapter>` tags embedded in the feed, and `useBestGuessChapters()` from the episode description. Renders a list of `<PodcastChapter>` items.

### Props

| Prop      | Type      | Required | Description    |
| --------- | --------- | -------- | -------------- |
| `episode` | `Episode` | Yes      | Episode data   |
| `podcast` | `Podcast` | Yes      | Podcast data   |

### Example

```vue
<PodcastChapters :episode="episode" :podcast="podcast" />
```

---

## `<PodcastFunding>`

Renders a list of `<PodcastFundingCard>` items from `podcast.funding`.

### Props

| Prop      | Type      | Required | Description  |
| --------- | --------- | -------- | ------------ |
| `podcast` | `Podcast` | Yes      | Podcast data |

### Example

```vue
<PodcastFunding :podcast="podcast" />
```

---

## `<PodcastFundingCard>`

A small bordered button chip displaying a funding option's label text.

### Props

| Prop      | Type             | Required | Description    |
| --------- | ---------------- | -------- | -------------- |
| `funding` | `PodcastFunding` | Yes      | Funding object |

### Example

```vue
<PodcastFundingCard :funding="fund" />
```

---

## `<PodcastListItem>`

A selectable podcast row (checkbox + cover + title). Uses `defineModel` for the `selected` boolean. Used in import/export dialogs.

### Props (via `v-model` + regular)

| Prop      | Type      | Required | Description          |
| --------- | --------- | -------- | -------------------- |
| `podcast` | `Podcast` | Yes      | Podcast to display   |
| `v-model` | Boolean   | Yes      | Selection state      |

### Example

```vue
<PodcastListItem v-model="podcast.selected" :podcast="podcast" />
```

---

## `<PodcastPeople>`

Renders a wrapping flex row of `<PodcastPerson>` components.

### Props

| Prop     | Type              | Required | Description  |
| -------- | ----------------- | -------- | ------------ |
| `people` | `PodcastPerson[]` | Yes      | People array |

### Example

```vue
<PodcastPeople :people="podcast.persons" />
```

---

## `<PodcastPerson>`

A linked person card showing avatar image, name, and role. Links to `person.href` in a new tab.

### Props

| Prop     | Type            | Required | Description   |
| -------- | --------------- | -------- | ------------- |
| `person` | `PodcastPerson` | Yes      | Person object |

### Example

```vue
<PodcastPerson :person="person" />
```

---

## `<PodTitle>`

A `NuxtLink` to the podcast page (`/podcast?url=...`) showing the podcast cover (optional), episode title, and a sub-header. Used inside `<PodListItem>`.

### Props

| Prop             | Type                                    | Required | Default    | Description                          |
| ---------------- | --------------------------------------- | -------- | ---------- | ------------------------------------ |
| `episode`        | `Episode`                               | Yes      | —          | Episode data                         |
| `podcast`        | `Podcast`                               | Yes      | —          | Podcast data                         |
| `subHeader`      | `'timeAgo' \| 'date' \| 'podcastTitle'` | No       | `''`       | Which sub-header to display          |
| `subHeaderAbove` | Boolean                                 | No       | `false`    | Renders sub-header above main title  |
| `noTitle`        | Boolean                                 | No       | `false`    | Hide the podcast title               |
| `noCover`        | Boolean                                 | No       | `false`    | Hide the cover image                 |

### Example

```vue
<PodTitle :episode="episode" :podcast="podcast" sub-header="timeAgo" />
```

---

## `<PullToRefesh>`

Pull-to-refresh wrapper. Detects downward swipe while scrolled to top and emits `refresh` once the threshold is passed. Uses `useSwipe`, `useScroll`, and `useElementSize` from VueUse. The `#pull-content` slot is shown above the main content during the pull.

### Props

| Prop               | Type    | Default  | Description                                        |
| ------------------ | ------- | -------- | -------------------------------------------------- |
| `disable`          | Boolean | `false`  | Disables pull-to-refresh entirely                  |
| `pullDownWeight`   | Number  | `0.85`   | Exponential damping for the pull-down feel         |
| `maxPull`          | Number  | `0`      | Max pixels to pull (defaults to pull-content height) |
| `refreshThreshold` | Number  | `0`      | Pixels to trigger refresh (defaults to 80% of max) |
| `minCloseHeight`   | Number  | `0`      | Minimum height to sit at after release             |

### Events

| Event                | Payload  | Description                              |
| -------------------- | -------- | ---------------------------------------- |
| `pull`               | `number` | Emitted continuously with pull amount    |
| `refresh`            | —        | Emitted when threshold is crossed        |
| `release`            | —        | Emitted when finger lifts               |
| `releaseAfterRefresh`| —        | Emitted when released after triggering  |

### Example

```vue
<PullToRefesh @refresh="reload()">
  <template #pull-content>
    <div>Pull to refresh</div>
  </template>
  <div>...page content...</div>
</PullToRefesh>
```

---

## `<SearchPods>`

A grid of podcast cover tiles with subscribe/unsubscribe toggle buttons. Links to `/podcast?url=...` on click. The subscribe indicator can be hidden with `hide-sub-indicator`.

### Props

| Prop               | Type        | Required | Default | Description                    |
| ------------------ | ----------- | -------- | ------- | ------------------------------ |
| `podcasts`         | `Podcast[]` | Yes      | —       | Podcasts to display            |
| `hideSubIndicator` | Boolean     | No       | `false` | Hides the subscribe/check badge |

### Example

```vue
<SearchPods :podcasts="results" hide-sub-indicator />
```

---

## `<SleepTimerDialog>`

A `<SlideUpDialog>` with two views: an inactive state showing a vertical wheel picker (CSS scroll-snap) for selecting a sleep duration (5–60 min or "End of episode"), and an active state showing a countdown display with a cancel button. Reads/writes `useSleepTimerStore`.

### Props (via `v-model`)

| Prop         | Type    | Description          |
| ------------ | ------- | -------------------- |
| `modelValue` | Boolean | Open/close the panel |

### Example

```vue
<SleepTimerDialog v-model="isOpen" />
```

---

## `<SlideUpDialog>`

A reusable slide-up bottom sheet with swipe-to-close. Uses `useSwipe` on the dialog element. Locks body scroll while open via `useGlobalStateStore().bodyScrollLock`. The `preventSwipe` prop disables swipe-to-close (used when the seek slider is being dragged inside).

### Props (via `v-model`)

| Prop           | Type    | Required | Description                          |
| -------------- | ------- | -------- | ------------------------------------ |
| `modelValue`   | Boolean | Yes      | Open/close state                     |
| `preventSwipe` | Boolean | No       | Disable swipe-down-to-close          |
| `height`       | String  | No       | CSS height of the panel (e.g. `'668px'`) |

### Example

```vue
<SlideUpDialog v-model="isOpen" height="400px">
  <div>Content here</div>
</SlideUpDialog>
```

---

## `<SubsHorizontalScroll>`

A horizontally scrollable strip of podcast cover images. Only shows podcasts that have an image. Each cover links to `/podcast?url=...`.

### Props

| Prop       | Type        | Required | Description             |
| ---------- | ----------- | -------- | ----------------------- |
| `podcasts` | `Podcast[]` | Yes      | Subscribed podcasts     |

### Example

```vue
<SubsHorizontalScroll :podcasts="pods" />
```

---

## `<TickerText>`

Auto-scrolling ticker text. Checks if the text overflows its container and, if so, applies a 20-second CSS `ticker-animation` loop. A duplicate span is appended for seamless looping.

### Props

| Prop   | Type   | Required | Description         |
| ------ | ------ | -------- | ------------------- |
| `text` | String | Yes      | Text to display     |

### Example

```vue
<TickerText :text="episodeTitle" />
```

---

## `<TopNav>`

Top navigation bar with `<DarkModeToggle>` on the left, the app logo in the centre (links to `/`), and a menu button on the right that opens `<NavMenu>`. Logo swaps between dark/light variants based on colour mode.

### Props

None

### Example

```vue
<TopNav />
```

---

## Patterns & Learnings

- This app has no auth. Use plain `$fetch` for all API calls.
- The global `<audio>` element lives in `<NowPlayingBar>`. Its `ref` is wired into `useNowPlayingStore`. Never create additional persistent audio elements.
- `<SlideUpDialog>` is the base for all bottom sheets. Use it instead of `UModal` for fullscreen mobile overlays.
- Episode action buttons follow a consistent prop signature: `{ episode: Episode, podcast: Podcast }`.
- Use `<PodCover>` (not `<img>` or `<NuxtImg>`) for all podcast images — it routes through `/api/proxy` automatically.
- `<PodPlayRow>` composes `<PodPlayChip>`, `<PodAddToQueue>`, `<PodDownload>`, and `<PodMenu>` — use it on list items, not individual buttons.
- `defineModel` is used for boolean open/close state on dialogs instead of explicit `modelValue` prop + emit.
- Components that receive `episode`/`podcast` as required props should use `usePodcast()` and `useEpisode()` composables for derived values (title, image, routes, dates) instead of inline fallback chains. Pass props via getter: `usePodcast(() => props.podcast)`.
- `PodListItem`, `PodTitle`, `PodPlayChip`, `PodcastListItem`, and `SubsHorizontalScroll` use the new composables. `CurrentPodcastDialog` and `NowPlayingBar` use inline computed values because their store refs are nullable.
- `PodcastChapter` uses `formatTimePadded()` from `app/utils/formatTime.ts` for zero-padded chapter timestamps.
