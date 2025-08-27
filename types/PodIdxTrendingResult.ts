import type { Feed } from './PodIdxSearchResult'

export interface PodIdxTrendingResult {
  status: string
  feeds: Feed[]
  count: number
  max: number
  since: number
  description: string
}
