import { ensureArray } from './ensureArray'
import type { PodcastPerson } from '../../../../types/PodcastPerson'
import type { EpisodeItem, Channel, PodcastPersonRaw as RawPodcastPerson } from '../types/ParsedPodcastXML'

export const parsePersons = (item: Channel | EpisodeItem): PodcastPerson[] => {
  const personOrPersons = item['podcast:person']
  if (!personOrPersons) return []

  const personsArray = ensureArray<RawPodcastPerson[]>(personOrPersons)

  return personsArray.map((person: RawPodcastPerson) => ({
    name: person['#text'],
    role: person['@_role'] ?? 'host',
    group: person['@_group'] ?? 'cast',
    img: person['@_img'],
    href: person['@_href']
  }))
}
