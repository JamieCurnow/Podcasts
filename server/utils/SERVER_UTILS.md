# Server Utilities

Documentation for the server-side utilities in `server/utils/`.

> **Note:** This app has no database or auth. The utilities here are a custom podcast RSS feed parser and an edge cache helper.

---

## `edgeCache` — Cloudflare edge cache

Located at `server/utils/edgeCache.ts` (auto-imported). Caches API responses in the Workers Cache API (`caches.default`). Firebase Hosting's CDN cached API responses from `Cache-Control`; Cloudflare doesn't for Worker responses, so we do it ourselves. No-op outside Workers (Firebase, node, `nuxt dev`) and on `*.workers.dev`, where the Cache API doesn't work.

```ts
const cached = await matchEdgeCache({ event })
if (cached) return cached
// ...build the response
putEdgeCache({ event, response: new Response(body, { headers: { 'Cache-Control': 'public, max-age=3600' } }) })
```

- The cache key is the full request URL, including the query string.
- `putEdgeCache` only stores responses whose `Cache-Control` has a `max-age`, and stores them in the background with `event.waitUntil`.
- Only cache successful responses, and don't put per-request headers (e.g. CORS) on the cached response.

---

## `podParser` — Podcast Feed Parser

Located at `server/utils/podParser/`. A custom RSS feed parser for podcast feeds, inspired by [podcast-xml-parser](https://github.com/krestaino/podcast-xml-parser). Uses `fast-xml-parser` under the hood.

---

### `fetchPodcastFeed`

Fetches a podcast RSS feed URL and returns parsed, paginated results.

```ts
import { fetchPodcastFeed } from '~~/server/utils/podParser/fetchPodcastFeed'

const { podcast, episodes } = await fetchPodcastFeed(url, { start: 0, limit: 5 })
```

**Parameters:**

| Param    | Type                      | Description                            |
| -------- | ------------------------- | -------------------------------------- |
| `url`    | `URL \| string`           | RSS feed URL                           |
| `config` | `FetchPodcastFeedConfig`  | `{ start: number, limit: number }`     |

**Returns:** `{ podcast: Podcast, episodes: Episode[] }` — episodes are sliced to `[start, start + limit]`.

---

### `parsePodcast`

Parses an RSS XML string into a structured `{ podcast, episodes }` object. Handles standard RSS, iTunes namespace fields, `podcast:` namespace (Podcasting 2.0), and `psc:` (PSC chapters).

```ts
import { parsePodcast } from '~~/server/utils/podParser/utils'

const { podcast, episodes } = parsePodcast(xmlString)
```

**Parameters:**

| Param     | Type     | Description        |
| --------- | -------- | ------------------ |
| `xmlText` | `string` | Raw RSS XML string |

**Returns:** `{ podcast: Podcast, episodes: Episode[] }`

**Throws:** `Error` if the XML has no `rss.channel`.

---

### `parseXml`

Parses an XML string into a plain JavaScript object using `fast-xml-parser` (attributes preserved).

```ts
const obj = parseXml(xmlText)
```

---

### `getAttribute`

Safely reads a dot-notation path from a parsed XML object, returning a string (or `defaultValue` if missing/null).

```ts
const title = getAttribute(channel, 'itunes:author', '')
const href = getAttribute(item, 'itunes:image.@_href')
```

---

### `getDuration`

Parses an iTunes duration value (`HH:MM:SS`, `MM:SS`, or raw seconds as string/number) into a number of seconds.

```ts
const secs = getDuration('1:23:45') // 5025
const secs = getDuration('300')     // 300
```

---

### `ensureArray`

Wraps a value in an array if it isn't one already. Returns `[]` for `null`/`undefined`. Used extensively because `fast-xml-parser` returns single items as objects, not arrays.

```ts
const items = ensureArray(channel.item) // always an array
```

---

### `toBoolean`

Converts a string or boolean to a boolean. Truthy string values: `'true'`, `'1'`, `'yes'` (case-insensitive).

```ts
toBoolean('Yes')  // true
toBoolean('false') // false
```

---

### `toNumber`

Converts a numeric-only string to a number, or returns `null` if it contains non-numeric characters.

```ts
toNumber('42')  // 42
toNumber('1a')  // null
```

---

### `parsePersons`

Extracts `podcast:person` entries from a channel or episode item, mapping them to `PodcastPerson[]`. Defaults `role` to `'host'` and `group` to `'cast'` if omitted.

```ts
const people = parsePersons(channelOrItem)
```

---

## Patterns & Learnings

- All RSS parsing logic is in `server/utils/podParser/`. It's a self-contained custom implementation — don't replace it with an npm package without a strong reason.
- Episode pagination is done by slicing in `fetchPodcastFeed` — the full feed XML is always parsed first, then sliced. This works fine for typical feeds.
