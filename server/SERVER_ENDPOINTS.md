# Server Endpoints

Documentation for the API endpoints in the application.

> **Note:** This app has no authentication or database. All endpoints are public.

---

## /api/podcast/feed

### GET /api/podcast/feed

Fetches and parses a podcast RSS feed URL, returning structured podcast metadata and a paginated slice of episodes.

- **Auth Required:** No
- **Query Params:**

| Param   | Type   | Required | Default | Description                                |
| ------- | ------ | -------- | ------- | ------------------------------------------ |
| `url`   | string | Yes      | —       | The RSS feed URL (URL-encoded)             |
| `start` | number | No       | `0`     | Zero-based episode offset for pagination   |
| `limit` | number | No       | `1`     | Number of episodes to return               |

- **Response:** `PodcastResponse`

```ts
{
  podcast: Podcast,
  episodes: Episode[]
}
```

- **Errors:**
  - `400` — `url` param missing
  - `500` — Feed fetch or parse failed

### Example

```
GET /api/podcast/feed?url=https%3A%2F%2Flexfridman.com%2Ffeed%2Fpodcast%2F&start=0&limit=5
```

---

## /api/proxy

### GET /api/proxy

A general-purpose proxy for external URLs. Intended for images and other media that need CORS headers or caching. Follows up to 10 redirects. Streams the response body back to the client.

- **Auth Required:** No
- **Query Params:**

| Param         | Type   | Required | Description                                               |
| ------------- | ------ | -------- | --------------------------------------------------------- |
| `url`         | string | Yes      | The URL to proxy                                          |
| `cacheMaxAge` | number | No       | Sets `Cache-Control: public, max-age=N` on the response   |

- **Cache behaviour:**
  - If `cacheMaxAge` is provided, uses that value.
  - If the URL looks like an image (`.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, etc.), defaults to a 30-day cache.
  - Otherwise no `Cache-Control` header is set.

- **CORS:** Controlled via `CORS_DOMAINS` env var (comma-separated). If unset, allows all origins (`*`).

- **Response:** Streams the proxied resource with its original `Content-Type`.

- **Errors:**
  - `400` — `url` param missing

### Example

```
GET /api/proxy?url=https%3A%2F%2Fexample.com%2Fimage.jpg&cacheMaxAge=604800
```
