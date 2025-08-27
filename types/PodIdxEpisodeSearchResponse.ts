interface Destination {
  name: string
  address: string
  type: string
  split: number
  fee: boolean
  customKey: string
  customValue: string
}

interface Model {
  type: string
  method: string
  suggested: string
}

interface SocialInteract {
  url: string
  protocol: string
  accountId: string
  accountUrl: string
  priority: number
}

interface Person {
  id: number
  name: string
  role: string
  group: string
  href: string
  img: string
}

interface Transcript {
  url: string
  type: string
}

interface Value {
  model: Model
  destinations: Destination[]
}

interface Soundbite {
  startTime: number
  duration: number
  title: string
}
interface Episode {
  id: number
  title: string
  link: string
  description: string
  guid: string
  datePublished: number
  datePublishedPretty: string
  dateCrawled: number
  enclosureUrl: string
  enclosureType: string
  enclosureLength: number
  duration: number
  explicit: number
  episode: number
  episodeType: string
  season: number
  image: string
  imageUrlHash: number
  feedItunesId: number
  feedImage: string
  feedImageUrlHash: number
  feedId: number
  feedTitle: string
  feedLanguage: string
  chaptersUrl: string
  transcripts: Transcript[]
  persons: Person[]
  socialInteract: SocialInteract[]
  value: Value
  soundbite: Soundbite
  soundbites: Soundbite[]
}

export interface PodIdxEpisodeSearchResponse {
  status: string
  id: string
  url: string
  podcastGuid: string
  guid: string
  episode: Episode
  description: string
}
