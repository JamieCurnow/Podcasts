<template>
  <button
    class="pressable pt-1"
    :aria-label="isInQueue ? 'Remove from queue' : 'Add to queue'"
    @click="toggle()"
  >
    <IconSwap :name="icon" class="size-7 transition-colors duration-150" :class="iconColor" />
  </button>
</template>

<script setup lang="ts">
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
  if (isInQueue.value) {
    removeFromQueue({ episode: props.episode, podcast: props.podcast })
  } else {
    addToQueue({ episode: props.episode, podcast: props.podcast })
  }
}
</script>
