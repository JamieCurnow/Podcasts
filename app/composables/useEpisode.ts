import type { Episode, Podcast } from '~~/shared/types/index'
import { decode } from 'html-entities'
import { getTimeLeftText } from '~/utils/getTimeLeftText'

export function useEpisode(episode: MaybeRefOrGetter<Episode | undefined>, podcast?: MaybeRefOrGetter<Podcast | undefined>) {
  const e = computed(() => toValue(episode))
  const p = computed(() => (podcast ? toValue(podcast) : undefined))

  const dayjs = useDayjs()

  const title = computed(
    () => decode(e.value?.title) || decode(e.value?.itunesTitle) || decode(e.value?.itunesSubtitle) || 'No Title'
  )

  const description = computed(() => e.value?.contentEncoded || e.value?.description || undefined)

  const image = computed(
    () => e.value?.itunesImage || p.value?.image?.url || p.value?.itunesImage || undefined
  )

  const author = computed(
    () => e.value?.itunesAuthor || e.value?.author || p.value?.itunesAuthor || undefined
  )

  const audioUrl = computed(() => e.value?.enclosure?.url || undefined)

  const encodedGuid = computed(() => e.value?.guid ? encodeURIComponent(e.value.guid) : '')

  const uniqueId = computed(() => {
    const feedUrl = p.value?.feedUrl
    const guid = e.value?.guid
    if (!feedUrl || !guid) return undefined
    return `${feedUrl}${guid}`
  })

  const episodeRoute = computed(() => {
    const feedUrl = p.value?.feedUrl
    if (!feedUrl || !encodedGuid.value) return undefined
    return `/podcast/episode?url=${encodeURIComponent(feedUrl)}&episodeGuid=${encodedGuid.value}`
  })

  const pubDate = computed(() => (e.value?.pubDate ? new Date(e.value.pubDate) : undefined))

  const formattedDate = computed(() => {
    if (!pubDate.value) return ''
    return pubDate.value.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  })

  const getPlural = (value: number, text: string) => `${value} ${text}${value > 1 ? 's' : ''} ago`

  const relativeDate = computed(() => {
    if (!pubDate.value) return ''
    const now = dayjs().startOf('day')
    const pastDate = dayjs(pubDate.value).startOf('day')

    const days = now.diff(pastDate, 'day')
    const weeks = now.diff(pastDate, 'week')
    const months = now.diff(pastDate, 'month')
    const years = now.diff(pastDate, 'year')

    if (days <= 0) return 'Today'
    if (years > 0) return getPlural(years, 'year')
    if (months > 0) return getPlural(months, 'month')
    if (weeks > 0) return getPlural(weeks, 'week')
    return getPlural(days, 'day')
  })

  const formattedDuration = computed(() => {
    const seconds = e.value?.itunesDuration
    if (!seconds) return ''
    const mins = Math.floor(seconds / 60)
    const hrs = Math.floor(mins / 60)
    const min = Math.round(mins) % 60
    return `${hrs ? `${hrs} hr` : ''} ${min ? `${min} min` : ''}`.trim()
  })

  const timeLeftText = (opts: { currentTime: number; duration: number }) => {
    const timeLeft = opts.duration - opts.currentTime
    return getTimeLeftText(timeLeft)
  }

  return {
    title,
    description,
    image,
    author,
    audioUrl,
    uniqueId,
    encodedGuid,
    episodeRoute,
    pubDate,
    formattedDate,
    relativeDate,
    formattedDuration,
    timeLeftText
  }
}
