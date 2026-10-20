import type { H3Event } from 'h3'

/**
 * Edge cache for API responses on Cloudflare Workers.
 *
 * Firebase Hosting's CDN caches API responses from their Cache-Control headers. Cloudflare doesn't do that
 * for Worker responses, so we use the Workers Cache API (`caches.default`) ourselves.
 * Outside Workers (Firebase / node / nuxt dev) there's no `caches.default`, so these are no-ops.
 * Note: the Cache API only works on custom domains, not *.workers.dev.
 */
const getEdgeCache = () => (globalThis as { caches?: { default?: Cache } }).caches?.default

/** Returns the cached Response for this request, if there is one */
export const matchEdgeCache = async ({ event }: { event: H3Event }) => {
  const cache = getEdgeCache()
  if (!cache) return
  return cache.match(getRequestURL(event).toString())
}

/** Caches the response for this request in the background. Needs a `max-age` in its Cache-Control header */
export const putEdgeCache = ({ event, response }: { event: H3Event; response: Response }) => {
  const cache = getEdgeCache()
  if (!cache || !/max-age=\d+/.test(response.headers.get('Cache-Control') || '')) return
  const put = cache
    .put(getRequestURL(event).toString(), response)
    .catch((e) => console.error('edge cache put failed', e))
  event.waitUntil(put)
}
