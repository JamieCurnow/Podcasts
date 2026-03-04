interface Categories {
  '104': string
  '105': string
  '107': string
}

export interface Feed {
  id: number
  podcastGuid: string
  title: string
  url: string
  originalUrl: string
  link: string
  description: string
  author: string
  ownerName: string
  image: string
  artwork: string
  lastUpdateTime: number
  lastCrawlTime: number
  lastParseTime: number
  lastGoodHttpStatusTime: number
  lastHttpStatus: number
  contentType: string
  itunesId: number
  generator: string
  language: string
  explicit: boolean
  type: number
  medium: string
  dead: number
  episodeCount: number
  crawlErrors: number
  parseErrors: number
  categories: Categories
  locked: number
  imageUrlHash: number
  newestItemPubdate: number
}

export interface PodIdxSearchResult {
  status: string
  feeds: Feed[]
  count: number
  query: string
  description: string
}
