import { fetchPodcastFeed } from '~/server/utils/podParser/fetchPodcastFeed'

export default defineEventHandler(async (event) => {
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

  return pod
})
