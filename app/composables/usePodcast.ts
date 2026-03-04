import type { Podcast } from '~~/shared/types/index'

export function usePodcast(podcast: MaybeRefOrGetter<Podcast | undefined>) {
  const p = computed(() => toValue(podcast))

  const title = computed(() => p.value?.title || p.value?.itunesSubtitle || 'Unknown Podcast')
  const image = computed(() => p.value?.image?.url || p.value?.itunesImage || undefined)
  const description = computed(() => p.value?.contentEncoded || p.value?.description || undefined)
  const author = computed(() => p.value?.itunesAuthor || p.value?.itunesOwner?.name || undefined)
  const encodedFeedUrl = computed(() => (p.value?.feedUrl ? encodeURIComponent(p.value.feedUrl) : ''))
  const podcastRoute = computed(() => (encodedFeedUrl.value ? `/podcast?url=${encodedFeedUrl.value}` : ''))

  return {
    title,
    image,
    description,
    author,
    encodedFeedUrl,
    podcastRoute
  }
}
