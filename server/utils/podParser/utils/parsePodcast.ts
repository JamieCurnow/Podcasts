import { getDuration, parseXml, ensureArray, getAttribute, toBoolean, toNumber, parsePersons } from '.'
import type { ParsedPodcastXML, Podcast, Episode, EpisodeItem, Funding } from '../types'

/**
 * Inspired by
 * https://github.com/krestaino/podcast-xml-parser
 *
 * Parses a podcast XML feed and returns a structured representation of the podcast and its episodes.
 *
 */
export const parsePodcast = (xmlText: string): { podcast: Podcast; episodes: Episode[] } => {
  const parsedXML = parseXml(xmlText) as ParsedPodcastXML
  const channel = parsedXML.rss?.channel

  if (!channel) {
    throw new Error('No podcast feed available to parse.')
  }

  let atomLink = channel['atom:link']
  if (Array.isArray(atomLink)) {
    atomLink = atomLink.find((link) => link['@_rel'] === 'self')
  }
  const feedUrl = atomLink?.['@_href'] ?? ''

  const podcast: Podcast = {
    contentEncoded: getAttribute(channel, 'content:encoded'),
    copyright: getAttribute(channel, 'copyright'),
    description: getAttribute(channel, 'description'),
    feedUrl,
    image: {
      link: getAttribute(channel, 'image.link'),
      title: getAttribute(channel, 'image.title'),
      url: getAttribute(channel, 'image.url')
    },
    itunesAuthor: getAttribute(channel, 'itunes:author'),
    itunesCategory: getAttribute(channel, 'itunes:category.@_text'),
    itunesExplicit: toBoolean(getAttribute(channel, 'itunes:explicit', 'false')),
    itunesImage: getAttribute(channel, 'itunes:image.@_href'),
    itunesOwner: {
      email: getAttribute(channel, 'itunes:owner.itunes:email'),
      name: getAttribute(channel, 'itunes:owner.itunes:name')
    },
    itunesSubtitle: getAttribute(channel, 'itunes:subtitle'),
    itunesSummary: getAttribute(channel, 'itunes:summary'),
    itunesType: getAttribute(channel, 'itunes:type'),
    language: getAttribute(channel, 'language'),
    link: getAttribute(channel, 'link'),
    title: getAttribute(channel, 'title'),
    persons: parsePersons(channel),
    funding: ensureArray<Funding[]>(channel['podcast:funding']).map((funding) => {
      return {
        url: funding['@_url'],
        text: funding['#text']
      }
    })
  }

  const episodes: Episode[] = ensureArray<EpisodeItem[]>(channel.item).map((item) => {
    const pscChaptersRaw = item['psc:chapters']?.['psc:chapter'] || []

    const pscChapters = ensureArray(pscChaptersRaw).map((chapter: any) => ({
      start: getAttribute(chapter, '@_start'),
      title: getAttribute(chapter, '@_title'),
      href: getAttribute(chapter, '@_href'),
      image: getAttribute(chapter, '@_image')
    }))

    const podcastChapterUrl = getAttribute(item, 'podcast:chapters.@_url')
    const podcastChapterType = getAttribute(item, 'podcast:chapters.@_type')

    const chapters: Episode['chapters'] = {}

    if (podcastChapterUrl && podcastChapterType) {
      chapters.podcastChapter = {
        url: podcastChapterUrl,
        type: podcastChapterType
      }
    }

    if (pscChapters.length > 0) {
      chapters.pscChapters = pscChapters
    }

    return {
      title: getAttribute(item, 'title'),
      description: getAttribute(item, 'description'),
      pubDate: getAttribute(item, 'pubDate'),
      enclosure: {
        url: getAttribute(item, 'enclosure.@_url'),
        type: getAttribute(item, 'enclosure.@_type')
      },
      itunesAuthor: getAttribute(item, 'itunes:author'),
      itunesDuration: getDuration(getAttribute(item, 'itunes:duration')),
      itunesEpisode: toNumber(getAttribute(item, 'itunes:episode')),
      itunesEpisodeType: getAttribute(item, 'itunes:episodeType'),
      itunesExplicit: toBoolean(getAttribute(item, 'itunes:explicit', 'false')),
      itunesImage: getAttribute(item, 'itunes:image.@_href'),
      itunesSeason: toNumber(getAttribute(item, 'itunes:season')),
      itunesSubtitle: getAttribute(item, 'itunes:subtitle'),
      itunesSummary: getAttribute(item, 'itunes:summary'),
      itunesTitle: getAttribute(item, 'itunes:title'),
      link: getAttribute(item, 'link'),
      guid: getAttribute(item, 'guid'),
      author: getAttribute(item, 'author'),
      contentEncoded: getAttribute(item, 'content:encoded'),
      persons: parsePersons(item),
      ...(Object.keys(chapters).length > 0 && { chapters })
    }
  })

  return { podcast, episodes }
}
