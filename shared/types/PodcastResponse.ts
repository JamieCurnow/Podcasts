import type { Episode, Podcast } from '~~/shared/types/index'

export interface PodcastResponse {
  podcast: Podcast
  episodes: Episode[]
}
