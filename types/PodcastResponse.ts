import type { Episode, Podcast } from '~/types/index'

export interface PodcastResponse {
  podcast: Podcast
  episodes: Episode[]
}
