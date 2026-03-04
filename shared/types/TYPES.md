# Types

This file lists all types used in the app and what they are for.

> **Note:** This app has no MongoDB backend — there are no `Doc` variants or `BaseDocument` types. All types are pure frontend types.

---

## Core Domain Types

### `Podcast`

Represents a parsed podcast from an RSS feed.

| Field          | Type               | Description                                    |
| -------------- | ------------------ | ---------------------------------------------- |
| `feedUrl`      | `string`           | The RSS feed URL (unique identifier)           |
| `title`        | `string`           | Podcast title                                  |
| `description`  | `string`           | Feed description                               |
| `contentEncoded` | `string`         | `<content:encoded>` field                      |
| `copyright`    | `string`           | Copyright text                                 |
| `link`         | `string`           | Podcast website URL                            |
| `language`     | `string`           | Feed language code                             |
| `image`        | `{ link, title, url }` | RSS `<image>` block                       |
| `itunesAuthor` | `string`           | iTunes author name                             |
| `itunesCategory` | `string`         | Primary iTunes category                        |
| `itunesExplicit` | `boolean`        | Explicit content flag                          |
| `itunesImage`  | `string`           | iTunes image URL (`<itunes:image @href>`)      |
| `itunesOwner`  | `{ name, email }` | iTunes owner info                              |
| `itunesSubtitle` | `string`         | iTunes subtitle                                |
| `itunesSummary` | `string`          | iTunes summary                                 |
| `itunesType`   | `string`           | iTunes podcast type (e.g. `'episodic'`)        |
| `persons?`     | `PodcastPerson[]`  | Podcast-namespace people                       |
| `funding?`     | `PodcastFunding[]` | Podcast-namespace funding links                |

---

### `Episode`

Represents a single episode parsed from a podcast RSS feed.

| Field              | Type                          | Description                                    |
| ------------------ | ----------------------------- | ---------------------------------------------- |
| `guid`             | `string`                      | Unique episode identifier                      |
| `title`            | `string`                      | Episode title                                  |
| `description`      | `string`                      | Episode description (may contain HTML)         |
| `contentEncoded`   | `string`                      | `<content:encoded>` (full HTML body)           |
| `pubDate`          | `string`                      | Publish date string                            |
| `link`             | `string`                      | Episode web page URL                           |
| `author`           | `string`                      | Author name                                    |
| `enclosure`        | `{ url: string, type: string }` | Audio file URL and MIME type               |
| `itunesAuthor`     | `string`                      | iTunes author                                  |
| `itunesDuration`   | `number`                      | Duration in seconds                            |
| `itunesEpisode`    | `number \| null`              | Episode number                                 |
| `itunesEpisodeType`| `string`                      | Episode type (e.g. `'full'`, `'trailer'`)      |
| `itunesExplicit`   | `boolean`                     | Explicit content flag                          |
| `itunesImage`      | `string`                      | Episode-level iTunes image URL                 |
| `itunesSeason`     | `number \| null`              | Season number                                  |
| `itunesSubtitle`   | `string`                      | iTunes subtitle                                |
| `itunesSummary`    | `string`                      | iTunes summary                                 |
| `itunesTitle`      | `string`                      | iTunes title                                   |
| `persons?`         | `PodcastPerson[]`             | Episode-level podcast:person entries           |
| `chapters?`        | See below                     | Chapter data (Podcasting 2.0 or PSC)           |

**`chapters` structure:**

```ts
{
  podcastChapter?: { url: string; type: string }  // JSON chapters URL
  pscChapters?: { start: string; title: string; href?: string; image?: string }[]
}
```

---

### `EpisodeMeta`

Per-episode listening progress metadata, stored in `useSubsStore`.

| Field            | Type      | Description                                   |
| ---------------- | --------- | --------------------------------------------- |
| `feedUrl`        | `string`  | RSS feed URL                                  |
| `guid`           | `string`  | Episode GUID                                  |
| `currentTime`    | `number`  | Playback position in seconds                  |
| `duration`       | `number`  | Total duration in seconds                     |
| `finished`       | `boolean` | True if listened to ≥ 99%                     |
| `started`        | `boolean` | True if the user has started the episode      |
| `startedAt`      | `number`  | Unix timestamp (ms) of first play             |
| `lastListenedAt` | `number`  | Unix timestamp (ms) of most recent listen     |

---

### `PodcastResponse`

The shape returned by `/api/podcast/feed`.

| Field      | Type        | Description           |
| ---------- | ----------- | --------------------- |
| `podcast`  | `Podcast`   | Parsed podcast data   |
| `episodes` | `Episode[]` | Paginated episode list |

---

### `PodcastPerson`

Represents a person (host, guest, etc.) attached to a podcast or episode via the `podcast:person` namespace.

| Field   | Type     | Description                                   |
| ------- | -------- | --------------------------------------------- |
| `name`  | `string` | Person's name                                 |
| `role`  | `string` | Role (e.g. `'host'`, `'guest'`)               |
| `group` | `string` | Group (e.g. `'cast'`, `'crew'`)               |
| `img?`  | `string` | Image URL                                     |
| `href?` | `string` | Link URL (person's website/social)            |

---

### `PodcastFunding`

A Podcasting 2.0 `podcast:funding` entry.

| Field   | Type      | Description        |
| ------- | --------- | ------------------ |
| `url?`  | `string`  | Funding link URL   |
| `text?` | `string`  | Button label text  |

---

### `PodcastChapterJson`

The root of a Podcasting 2.0 chapters JSON file (fetched from the `podcast:chapters` URL).

| Field      | Type                          | Description          |
| ---------- | ----------------------------- | -------------------- |
| `version`  | `string`                      | Spec version string  |
| `chapters` | `PodcastChapterJsonChapter[]` | Array of chapters    |

### `PodcastChapterJsonChapter`

A single chapter entry in a chapters JSON file.

| Field       | Type     | Required | Description                         |
| ----------- | -------- | -------- | ----------------------------------- |
| `startTime` | `number` | Yes      | Chapter start time in seconds       |
| `title?`    | `string` | No       | Chapter title                       |
| `number?`   | `number` | No       | Chapter number                      |
| `url?`      | `string` | No       | Chapter link URL                    |
| `endTime?`  | `number` | No       | Chapter end time in seconds         |
| `img?`      | `string` | No       | Chapter image URL                   |

---

## Podcast Index API Types

These types represent responses from the [Podcast Index API](https://podcastindex.org/). They are defined but not currently used by active endpoints.

### `PodIdxSearchResult`

Response shape for a Podcast Index feed search. Contains `status`, `feeds` (`Feed[]`), `count`, `query`, `description`.

### `PodIdxTrendingResult`

Response shape for Podcast Index trending feeds. Contains `status`, `feeds` (`Feed[]`), `count`, `max`, `since`, `description`.

### `PodIdxEpisodeSearchResponse`

Response shape for a Podcast Index episode lookup by GUID. Contains the full episode object with Podcast Index-specific fields (value splits, soundbites, transcripts, etc.).

### `Feed`

A podcast feed record from the Podcast Index API. Fields include `id`, `podcastGuid`, `title`, `url`, `image`, `artwork`, `author`, `episodeCount`, `language`, `categories`, etc.

---

## Patterns & Learnings

- `Podcast` and `Episode` are the primary domain types. Everything else derives from or references them.
- `EpisodeMeta` is client-generated (not from the feed) — it tracks listening progress per episode.
- Use `feedUrl` as the unique identifier for a podcast and `guid` as the unique identifier for an episode.
- The `PodIdx*` types are defined but not yet connected to active endpoints — they're ready for Podcast Index API integration.
- This app has no MongoDB. The `ToMongoDoc`/`BaseDocument` patterns from the template don't apply here.
