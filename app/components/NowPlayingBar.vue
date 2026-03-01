<template>
  <div
    class="mx-auto transform duration-300 ease-in-out fixed flex justify-center bottom-20 left-0 h-14 w-full text-neutral-500 dark:text-neutral-400"
    :class="{ 'translate-y-full': audioState === 'idle' }"
    @click="currentPodcastDialogOpen = true"
  >
    <div
      class="relative max-w-4xl lg:rounded-t-lg w-full flex justify-between bg-neutral-100 dark:bg-neutral-800 px-4 lg:px-20"
    >
      <div v-if="audioState !== 'idle'" class="flex gap-2 items-center w-full">
        <div>
          <PodCover :img="podImage" class="size-10" less-rounded />
        </div>
        <div class="truncate pr-2 text-sm grow">
          {{ episodeTitle }}
        </div>
        <div class="pt-1 pr-2">
          <button @click.stop="togglePlay()">
            <UIcon :name="icon" class="size-6" :class="{ 'animate-spin': icon === 'i-mdi-loading' }" />
          </button>
        </div>
      </div>
    </div>
    <!-- seek bar -->
    <div class="max-w-4xl absolute bottom-0 h-[1px] dark:bg-neutral-700 bg-neutral-200 w-full">
      <div
        :style="{ width: `${currentTimePercentage}%` }"
        class="bg-neutral-400 dark:bg-neutral-500 h-[1px]"
      ></div>
    </div>
  </div>
  <div class="w-full">
    <audio ref="audio"></audio>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import PodCover from './PodCover.vue'

const nowPlayingStore = useNowPlayingStore()
const { audio, audioState, currentTimePercentage, episode, podcast, currentPodcastDialogOpen } =
  storeToRefs(nowPlayingStore)

const icon = computed(() => {
  if (audioState.value === 'playing') return 'i-mdi-pause'
  if (audioState.value === 'paused') return 'i-mdi-play'
  return 'i-mdi-loading'
})

const podImage = computed(() => podcast.value?.image?.url || podcast.value?.itunesImage)
const episodeTitle = computed(() => episode.value?.title || episode.value?.itunesTitle)

const togglePlay = () => {
  if (audioState.value === 'playing') return nowPlayingStore.pause()
  if (audioState.value === 'paused') return nowPlayingStore.play()
}
</script>
