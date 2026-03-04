# Composables

Documentation for the composables used throughout the application.

---

## `createOpml`

Generates an OPML 2.0 XML string from a list of RSS feed URLs. Fetches podcast metadata for each URL via `/api/podcast/feed` to populate `<outline>` attributes (title, description, image). All attribute values are XML-escaped.

Note: this is a plain async function, not a `use*` composable. It is auto-imported.

### Usage

```ts
const opml = await createOpml(['https://example.com/feed.rss'])
```

### Parameters

| Param     | Type       | Description                  |
| --------- | ---------- | ---------------------------- |
| `rssUrls` | `string[]` | Array of podcast RSS feed URLs |

### Returns

`Promise<string>` — OPML 2.0 XML string ready to download.

---

## `parseOpml`

Parses an OPML string (v1.0 or v2.0) and returns an array of RSS feed URLs extracted from `xmlUrl` attributes on `<outline>` elements. Uses the browser's native `DOMParser`.

Note: this is a plain function, not a `use*` composable. It is auto-imported.

### Usage

```ts
const urls = parseOpml(opmlString)
```

### Parameters

| Param        | Type     | Description             |
| ------------ | -------- | ----------------------- |
| `opmlString` | `string` | OPML file content       |

### Returns

`string[]` — Array of RSS feed URLs.

---

## `useBestGuessChapters`

Attempts to extract chapters from an episode's description text by running it through a list of parsing strategies (from `chapterStrategies/`). Returns the first successful result or an empty array.

Current strategies:
- **lexStyle** — Matches timestamps in `(HH:MM:SS) – Title` or `(MM:SS) – Title` format, including the HTML-entity variant (`&#8211;`).

### Usage

```ts
const chapters = useBestGuessChapters(episode.description)
```

### Parameters

| Param         | Type     | Description                   |
| ------------- | -------- | ----------------------------- |
| `description` | `string` | Episode description text/HTML |

### Returns

`PodcastChapterJsonChapter[]` — Array of parsed chapters with `startTime` (seconds) and `title`.

---

## `usePodcast`

Derives commonly needed computed values from a `Podcast` object. Accepts `MaybeRefOrGetter<Podcast>` so it works with plain objects, refs, and computed values.

### Usage

```ts
const { title, image, description, author, encodedFeedUrl, podcastRoute } = usePodcast(podcast)
// or with a getter
const { title, image } = usePodcast(() => props.podcast)
```

### Parameters

| Param     | Type                        | Description          |
| --------- | --------------------------- | -------------------- |
| `podcast` | `MaybeRefOrGetter<Podcast>` | Podcast data source  |

### Returned computed refs

| Name             | Type                        | Logic                                                        |
| ---------------- | --------------------------- | ------------------------------------------------------------ |
| `title`          | `ComputedRef<string>`       | `podcast.title \|\| podcast.itunesSubtitle \|\| 'Unknown Podcast'` |
| `image`          | `ComputedRef<string \| undefined>` | `podcast.image?.url \|\| podcast.itunesImage`          |
| `description`    | `ComputedRef<string \| undefined>` | `podcast.contentEncoded \|\| podcast.description`      |
| `author`         | `ComputedRef<string \| undefined>` | `podcast.itunesAuthor \|\| podcast.itunesOwner?.name`  |
| `encodedFeedUrl` | `ComputedRef<string>`       | `encodeURIComponent(podcast.feedUrl)`                        |
| `podcastRoute`   | `ComputedRef<string>`       | `/podcast?url=${encodedFeedUrl}`                             |

---

## `useEpisode`

Derives commonly needed computed values from an `Episode` object, with optional podcast context for image/author fallback and route building. Accepts `MaybeRefOrGetter` for both params.

### Usage

```ts
const { title, image, episodeRoute, formattedDate, relativeDate } = useEpisode(
  () => props.episode,
  () => props.podcast
)
```

### Parameters

| Param     | Type                                 | Required | Description                              |
| --------- | ------------------------------------ | -------- | ---------------------------------------- |
| `episode` | `MaybeRefOrGetter<Episode>`          | Yes      | Episode data source                      |
| `podcast` | `MaybeRefOrGetter<Podcast>`          | No       | Podcast context for fallbacks and routes |

### Returned computed refs

| Name               | Type                              | Logic                                                           |
| ------------------ | --------------------------------- | --------------------------------------------------------------- |
| `title`            | `ComputedRef<string>`             | `decode(title) \|\| decode(itunesTitle) \|\| decode(itunesSubtitle) \|\| 'No Title'` |
| `description`      | `ComputedRef<string \| undefined>`| `contentEncoded \|\| description`                               |
| `image`            | `ComputedRef<string \| undefined>`| `episode.itunesImage \|\| podcast.image?.url \|\| podcast.itunesImage` |
| `author`           | `ComputedRef<string \| undefined>`| `episode.itunesAuthor \|\| episode.author \|\| podcast.itunesAuthor` |
| `audioUrl`         | `ComputedRef<string \| undefined>`| `episode.enclosure?.url`                                        |
| `encodedGuid`      | `ComputedRef<string>`             | `encodeURIComponent(episode.guid)`                              |
| `uniqueId`         | `ComputedRef<string \| null>`     | `feedUrl + guid` (null if no podcast)                           |
| `episodeRoute`     | `ComputedRef<string \| null>`     | `/podcast/episode?url=...&episodeGuid=...` (null if no podcast) |
| `pubDate`          | `ComputedRef<Date \| null>`       | Parsed `episode.pubDate`                                        |
| `formattedDate`    | `ComputedRef<string>`             | `en-GB` format: "3 Mar 2026"                                   |
| `relativeDate`     | `ComputedRef<string>`             | "Today", "2 days ago", "3 weeks ago", etc.                      |
| `formattedDuration`| `ComputedRef<string>`             | "1 hr 11 min" from `itunesDuration`                             |

### Returned methods

| Name           | Signature                                           | Description                              |
| -------------- | --------------------------------------------------- | ---------------------------------------- |
| `timeLeftText` | `(opts: { currentTime, duration }) => string`       | Returns "Xhr Xmin left" for given times  |

---

## Patterns & Learnings

- Not all composables use the `use` prefix — `createOpml` and `parseOpml` are plain async/sync functions that are auto-imported. Reserve `use*` for composables with reactive state.
- Chapter-parsing strategies live in `chapterStrategies/` and are consumed by `useBestGuessChapters`. To add a new strategy, add it to the `bestGuessChaptersStrategies` array in `chapterStrategies/index.ts`.
- There is no `useErrorHandle` composable in this app (no auth/backend). Errors are handled inline with `try/catch` + `console.error`.
- `usePodcast` and `useEpisode` accept `MaybeRefOrGetter` — pass plain objects, refs, or getters (`() => props.podcast`). In components with required props, use getter syntax for reactivity.
- `useEpisode` and `usePodcast` work best in components that receive podcast/episode as props. For pages/components with nullable store refs (e.g. `Ref<Podcast | undefined>`), use inline computed values instead — the composables require non-null values.
- Time formatting utilities live in `app/utils/formatTime.ts`: `formatTime()` (trimmed, for player display) and `formatTimePadded()` (zero-padded, for chapter timestamps). Both are auto-imported.
- Use `export function` (not `export const fn = () => {}`) for composables. Nuxt's auto-import scanner misreads arrow function parameters as separate exports, causing phantom imports like `podcast` from `useEpisode.ts`.
