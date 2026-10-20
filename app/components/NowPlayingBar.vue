<template>
  <div
    class="mx-auto fixed flex justify-center bottom-[calc(5rem+env(safe-area-inset-bottom))] left-0 h-14 w-full text-neutral-500 transition-transform duration-300 ease-out dark:text-neutral-400"
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
        <div class="pr-1">
          <button
            class="pressable flex size-10 items-center justify-center"
            :aria-label="audioState === 'playing' ? 'Pause' : 'Play'"
            @click.stop="togglePlay()"
          >
            <IconSwap :name="icon" class="size-6" :class="{ 'animate-spin': icon === 'i-mdi-loading' }" />
          </button>
        </div>
      </div>
    </div>
    <!-- seek bar -->
    <div class="max-w-4xl absolute bottom-0 h-px dark:bg-neutral-700 bg-neutral-200 w-full">
      <!-- scaleX rather than width: it updates every timeupdate and shouldn't cost a layout -->
      <div
        :style="{ transform: `scaleX(${currentTimePercentage / 100})` }"
        class="bg-neutral-400 dark:bg-neutral-500 h-px origin-left"
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

const { image: podImage } = usePodcast(podcast)
const { title: episodeTitle } = useEpisode(episode, podcast)

const togglePlay = () => {
  if (audioState.value === 'playing') return nowPlayingStore.pause()
  if (audioState.value === 'paused') return nowPlayingStore.play()
}
</script>
