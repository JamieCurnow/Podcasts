import { parsePodcast } from './utils'

export interface FetchPodcastFeedConfig {
  /**
   * The starting index for episode pagination.
   * Combined with the limit option, this allows you to paginate through the
   * episodes in the feed.
   */
  start: number
  /**
   * The maximum number of episodes to return.
   */
  limit: number
}

export const fetchPodcastFeed = async (url: URL | string, config: FetchPodcastFeedConfig) => {
  const { limit, start } = config
  const urlString = typeof url === 'string' ? url : url.toString()

  const response = await fetch(urlString)

  // response will be an XML string.
  // We turn this into JSON
  const xmlText = await response.text()
  const { podcast, episodes } = parsePodcast(xmlText)

  return {
    podcast,
    episodes: episodes.slice(start, start + limit)
  }
}
