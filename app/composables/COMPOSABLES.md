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

## Patterns & Learnings

- Not all composables use the `use` prefix — `createOpml` and `parseOpml` are plain async/sync functions that are auto-imported. Reserve `use*` for composables with reactive state.
- Chapter-parsing strategies live in `chapterStrategies/` and are consumed by `useBestGuessChapters`. To add a new strategy, add it to the `bestGuessChaptersStrategies` array in `chapterStrategies/index.ts`.
- There is no `useErrorHandle` composable in this app (no auth/backend). Errors are handled inline with `try/catch` + `console.error`.
