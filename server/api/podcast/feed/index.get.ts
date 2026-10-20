import { fetchPodcastFeed } from '~~/server/utils/podParser/fetchPodcastFeed'

export default defineEventHandler(async (event) => {
  const cached = await matchEdgeCache({ event })
  if (cached) return cached

  const urlParam = getQuery<{ url: string; start: number; limit: number }>(event)
  const { url = '', start = 0, limit = 1 } = urlParam

  if (!urlParam) throw createError({ status: 400, message: 'URL is required' })

  const pod = await fetchPodcastFeed(new URL(decodeURIComponent(url)), {
    limit: parseInt(`${limit}`),
    start: parseInt(`${start}`)
  }).catch((e) => {
    console.error(e)
    return undefined
  })

  if (!pod) {
    console.error(`Failed to fetch ${url.toString()}`)
    throw createError({ status: 500, message: 'Failed to fetch podcast feed' })
  }

  // same as the routeRules header in nuxt.config.ts
  const cacheControl = 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600'
  putEdgeCache({
    event,
    response: new Response(JSON.stringify(pod), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': cacheControl }
    })
  })

  return pod
})
