<template>
  <!-- <button class="pt-1" @click="localStartDownload()">
    <UIcon name="i-mdi-arrow-down-circle-outline" class="size-6 dark:text-neutral-400 text-gray-500" />
  </button> -->
  <ClientOnly>
    <button class="pt-1" @click="localStartDownload()">
      <PlayRing
        :invert="downloadStatus === 'inProgress'"
        :percentage="downloadPercentage"
        class="w-6 h-6"
        stroke="stroke-[3]"
      >
        <UIcon
          :name="icon"
          class="dark:text-neutral-400 text-gray-500"
          :class="{
            'size-6': downloadStatus === 'not-downloaded',
            'size-3': downloadStatus === 'inProgress',
            'size-4': downloadStatus === 'completed'
          }"
        />
      </PlayRing>
    </button>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { Episode, Podcast } from '~/types/index'
import { useDownloadsStore } from '~/stores/downloadsStore'

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

const { getDownload, startDownload } = useDownloadsStore()

const download = getDownload({ episodeGuid: props.episode.guid, feedUrl: props.podcast.feedUrl })
const downloadStatus = computed(() => download.value?.status || 'not-downloaded')
const downloadPercentage = computed(() => download.value?.progress || 0)

const icon = computed(() => {
  const status = downloadStatus.value
  if (status === 'completed') return 'i-ic-twotone-download-done'
  if (status === 'inProgress') return 'i-ic-baseline-cloud-download'
  return 'i-heroicons-arrow-small-down-20-solid'
})

const localStartDownload = () => {
  if (downloadStatus.value === 'not-downloaded') {
    startDownload({
      episode: props.episode,
      podcast: props.podcast
    })
  }
}
</script>
