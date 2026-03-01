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
  }
})

const downloadStore = useDownloadsStore()
const { downloads } = storeToRefs(downloadStore)
const thisEpisodeDownload = computed(() =>
  downloads.value?.find((d) => d.episodeGuid === props.episode.guid && d.feedUrl === props.podcast.feedUrl)
)

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
          text: props.episode.description,
          url: props.episode.link
        })
      }
    })
  }

  return [group]
})
</script>
