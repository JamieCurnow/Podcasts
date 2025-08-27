import type { PodcastFunding } from '~/types/PodcastFunding'
import type { PodcastPerson } from '../../../../types/PodcastPerson'

export interface Podcast {
  copyright: string
  contentEncoded: string
  description: string
  feedUrl: string
  image: {
    link: string
    title: string
    url: string
  }
  itunesAuthor: string
  itunesCategory: string
  itunesExplicit: boolean
  itunesImage: string
  itunesOwner: {
    name: string
    email: string
  }
  itunesSubtitle: string
  itunesSummary: string
  itunesType: string
  language: string
  link: string
  title: string
  persons?: PodcastPerson[]
  funding?: PodcastFunding[]
}
