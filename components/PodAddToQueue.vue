<template>
  <button class="pt-1" @click="toggle()">
    <UIcon :name="icon" class="size-7" :class="iconColor" />
  </button>
</template>

<script setup lang="ts">
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

const { addToQueue, removeFromQueue } = useQueueStore()
const { queue } = storeToRefs(useQueueStore())
const isInQueue = computed(() => {
  return !!queue.value?.find(
    (item) => item.episode.guid === props.episode.guid && item.podcast.feedUrl === props.podcast.feedUrl
  )
})

const icon = computed(() => (isInQueue.value ? 'i-mdi-playlist-check' : 'i-mdi-playlist-plus'))
const iconColor = computed(() =>
  isInQueue.value ? 'text-green-500 dark:text-green-700' : 'text-gray-500 dark:text-neutral-400'
)

const toggle = () => {
  console.log('toggle', isInQueue.value)
  if (isInQueue.value) {
    removeFromQueue({ episode: props.episode, podcast: props.podcast })
  } else {
    addToQueue({ episode: props.episode, podcast: props.podcast })
  }
}
</script>
