interface AtomLink {
  '@_rel'?: string
  '@_href'?: string
}

interface Enclosure {
  '@_url'?: string
  '@_type'?: string
}

interface PscChapter {
  '@_start'?: string
  '@_title'?: string
  '@_href'?: string
  '@_image'?: string
}

export interface PodcastPersonRaw {
  '#text': string
  '@_role'?: string
  '@_group'?: string
  '@_img'?: string
  '@_href'?: string
}

interface PodcastChapters {
  '@_url'?: string
  '@_type'?: string
}

export interface EpisodeItem {
  title?: string
  description?: string
  pubDate?: string
  enclosure?: Enclosure
  'itunes:author'?: string
  'itunes:duration'?: string
  'itunes:episode'?: string
  'itunes:episodeType'?: string
  'itunes:explicit'?: string | boolean
  'itunes:image'?: { '@_href'?: string }
  'itunes:season'?: string
  'itunes:subtitle'?: string
  'itunes:summary'?: string
  'itunes:title'?: string
  link?: string
  guid?: string
  author?: string
  'content:encoded'?: string
  'podcast:chapters'?: PodcastChapters
  'psc:chapters'?: {
    'psc:chapter'?: PscChapter[] | PscChapter
  }
  'podcast:person'?: PodcastPersonRaw[] | PodcastPersonRaw
}

interface Image {
  link?: string
  title?: string
  url?: string
}

interface ItunesOwner {
  'itunes:email'?: string
  'itunes:name'?: string
}

export interface Funding {
  '@_url'?: string
  '#text'?: string
}

export interface Channel {
  'atom:link'?: AtomLink | AtomLink[]
  title?: string
  description?: string
  link?: string
  language?: string
  'content:encoded'?: string
  copyright?: string
  'itunes:author'?: string
  'itunes:category'?: { '@_href'?: string }
  'itunes:explicit'?: string
  'itunes:image'?: { '@_href'?: string }
  'itunes:owner'?: ItunesOwner
  'itunes:subtitle'?: string
  'itunes:summary'?: string
  'itunes:type'?: string
  'podcast:funding'?: Funding | Funding[]
  image?: Image
  item?: EpisodeItem[]
  'podcast:person'?: PodcastPersonRaw[] | PodcastPersonRaw
}

interface Rss {
  channel?: Channel
}

export interface ParsedPodcastXML {
  rss?: Rss
}
