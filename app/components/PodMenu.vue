<template>
  <UDropdownMenu :items="items" :content="{ align: 'start', side: 'bottom' }">
    <button class="pt-1">
      <UIcon name="i-mdi-dots-vertical" class="size-7 dark:text-neutral-400 text-gray-500" />
    </button>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '#ui/types'
import type { Episode, Podcast } from '~~/shared/types/index'

const props = defineProps({
  episode: {
    type: Object as PropType<Episode>,
    required: true
  },
  podcast: {
    type: Object as PropType<Podcast>,
    required: true
  },
  extraItems: {
    type: Array as PropType<DropdownMenuItem[]>,
    default: () => []
  }
})

const downloadStore = useDownloadsStore()
const { downloads } = storeToRefs(downloadStore)
const thisEpisodeDownload = computed(() =>
  downloads.value?.find((d) => d.episodeGuid === props.episode.guid && d.feedUrl === props.podcast.feedUrl)
)

const { episodeRoute, image: episodeImage } = useEpisode(
  () => props.episode,
  () => props.podcast
)

const getShareUrl = () => {
  if (!episodeRoute.value) return props.episode.link
  const base = window.location.origin
  const url = new URL(`${base}${episodeRoute.value}`)
  if (props.episode.title) url.searchParams.set('t', props.episode.title)
  if (episodeImage.value) url.searchParams.set('img', episodeImage.value)
  const podTitle = props.podcast.title || props.podcast.itunesAuthor
  if (podTitle) url.searchParams.set('desc', podTitle)
  return url.toString()
}

const items = computed(() => {
  const group: DropdownMenuItem[] = []
  if (thisEpisodeDownload.value) {
    group.push({
      label: 'Remove Download',
      icon: 'i-mdi-delete',
      onSelect: () => {
        downloadStore.deleteDownload({ episodeGuid: props.episode.guid, feedUrl: props.podcast.feedUrl })
      }
    })
  }

  if (navigator?.share) {
    group.push({
      label: 'Share Episode',
      icon: 'i-mdi-share',
      onSelect: () => {
        navigator.share({
          title: props.episode.title,
          text: 'Listen on LovePodcasts.com — for the love of pods.',
          url: getShareUrl()
        })
      }
    })
  }

  group.push(...props.extraItems)
  return [group]
})
</script>
