<template>
  <button @click="loadPodcast()" class="flex gap-4 px-3 py-1 text-left hover:opacity-80 w-full">
    <!-- <div class="">{{ index + 1 }}</div> -->
    <div class="flex flex-col gap-1 pb-2">
      <div>
        {{ chapter.title || 'Untitled chapter' }}
      </div>
      <div v-if="chapter.url" class="">
        <a
          :href="chapter.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-light line-clamp-1"
        >
          {{ chapter.url }}
        </a>
      </div>
    </div>
    <!-- gap -->
    <div class="flex-1"></div>
    <div class="flex flex-col justify-center pl-4">
      <div v-if="!loadingPod">{{ startTime }}</div>
      <Loading v-else class="size-5"></Loading>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { PodcastChapterJsonChapter } from '~/types/PodcastChapterJson'

const props = defineProps({
  chapter: {
    type: Object as PropType<PodcastChapterJsonChapter>,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  episode: {
    type: Object as PropType<Episode>,
    required: true
  },
  podcast: {
    type: Object as PropType<Podcast>,
    required: true
  }
})

const startTime = computed(() => {
  const totalSeconds = props.chapter.startTime || 0
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = []
  if (hours > 0) parts.push(hours.toString().padStart(2, '0'))
  parts.push(minutes.toString().padStart(2, '0'))
  parts.push(seconds.toString().padStart(2, '0'))

  return parts.join(':')
})

const nowPlayingStore = useNowPlayingStore()

const loadingPod = ref(false)
const loadPodcast = async (opts?: { at?: number }) => {
  loadingPod.value = true
  await nowPlayingStore.loadPodcast({
    episode: props.episode,
    podcast: props.podcast,
    at: props.chapter.startTime
  })
  loadingPod.value = false
}
</script>
