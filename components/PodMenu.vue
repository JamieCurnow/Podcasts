<template>
  <UDropdown :items="items" mode="click" :popper="{ placement: 'bottom-start', offsetDistance: 0 }">
    <button class="pt-1">
      <UIcon name="i-mdi-dots-vertical" class="size-7 dark:text-neutral-400 text-gray-500" />
    </button>
  </UDropdown>
</template>

<script setup lang="ts">
import type { DropdownItem } from '#ui/types'
import type { Episode, Podcast } from '~/types/index'

const props = defineProps({
  episode: {
    type: Object as PropType<Episode>,
    required: true
  },
  podcast: {
    type: Object as PropType<Podcast>,
    required: true
  }
})

const downloadStore = useDownloadsStore()
const { downloads } = storeToRefs(downloadStore)
const thisEpisodeDownload = computed(() =>
  downloads.value?.find((d) => d.episodeGuid === props.episode.guid && d.feedUrl === props.podcast.feedUrl)
)

const items = computed(() => {
  const i: DropdownItem[][] = [[]]
  if (thisEpisodeDownload.value) {
    i[0].push({
      label: 'Remove Download',
      icon: 'i-mdi-delete',
      click: () => {
        downloadStore.deleteDownload({ episodeGuid: props.episode.guid, feedUrl: props.podcast.feedUrl })
      }
    })
  }

  if (navigator?.share) {
    i[0].push({
      label: 'Share Episode',
      icon: 'i-mdi-share',
      click: () => {
        navigator.share({
          title: props.episode.title,
          text: props.episode.description,
          url: props.episode.link
        })
      }
    })
  }

  return i
})
</script>
