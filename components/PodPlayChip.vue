<template>
  <button
    class="flex gap-2 border border-gray-400 dark:border-neutral-400 rounded-lg h-9 items-center w-min pl-2 pr-4"
    @click="togglePlay()"
  >
    <!-- play btn -->
    <div>
      <!-- circle -->
      <Loading v-if="loadingPod" class="size-5" />
      <!-- playing -->
      <AudioPlaying v-else-if="isPlaying" />
      <!-- completed -->
      <div v-else-if="hasFinished">
        <UIcon name="i-mdi-check" class="size-5 dark:text-green-700 text-green-500 mt-1" />
      </div>
      <PlayRing v-else-if="!isPlaying" :percentage="percentage" class="size-5 h-5 w-5">
        <UIcon name="i-mdi-play" class="size-4 dark:text-neutral-400 text-gray-500" />
      </PlayRing>
    </div>
    <!-- time -->
    <div class="text-nowrap text-sm">
      {{
        isPlaying
          ? timeLeftText
          : hasFinished
            ? 'Completed'
            : hasStarted
              ? timeLeftText
              : durationText || 'Loading...'
      }}
    </div>

    <ClientOnly>
      <audio
        v-if="mountAudio"
        ref="audioEl"
        :src="audioUrl"
        preload="metadata"
        @loadedmetadata="loadMetaData"
      />
    </ClientOnly>
  </button>
</template>

<script setup lang="ts">
import type { Episode, Podcast } from '~/types/index'
import AudioPlaying from './AudioPlaying.vue'
import { getTimeLeftText } from '~/utils/getTimeLeftText'

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

const { getEpisodeMeta } = useSubsStore()
const episodeMeta = getEpisodeMeta({ feedUrl: props.podcast.feedUrl, guid: props.episode.guid })

const audioEl = ref<null | HTMLAudioElement>(null)

const mountAudio = computed(() => {
  return !props.episode?.itunesDuration
})

const audioMetaDuration = ref(0)
const loadMetaData = (e: Event) => {
  const t = e?.target as HTMLAudioElement
  audioMetaDuration.value = t?.duration || 0
}

// seconds in number
const duration = computed(
  () => props.episode?.itunesDuration || audioMetaDuration.value || episodeMeta.value?.duration || 0
)
// text in hrs and mins based on duration like 1 hr 11 min or 11 min
const durationText = computed(() => {
  const seconds = duration.value
  if (!seconds) return ''
  const mins = Math.floor(seconds / 60)
  const hrs = Math.floor(mins / 60)
  const roundedMins = Math.round(mins)
  const min = roundedMins % 60
  return `${hrs ? `${hrs} hr` : ''} ${min ? `${min} min` : ''}`.trim()
})

const audioUrl = computed(() => props.episode.enclosure?.url)

const nowPlayingStore = useNowPlayingStore()
const { audioState, src } = storeToRefs(nowPlayingStore)

const isLoaded = computed(() => {
  return src.value === audioUrl.value
})

const currentTime = computed(() => episodeMeta.value?.currentTime || 0)

const timeLeft = computed(() => {
  return duration.value - currentTime.value
})

const percentage = computed(() => {
  return (currentTime.value / duration.value) * 100
})

const hasStarted = computed(() => episodeMeta.value?.started)
const hasFinished = computed(() => episodeMeta.value?.finished)

const timeLeftText = computed(() => {
  return getTimeLeftText(timeLeft.value)
})

const isPlaying = computed(() => {
  return isLoaded.value && audioState.value === 'playing'
})

const loadingPod = ref(false)
const loadPodcast = async (opts?: { at?: number }) => {
  loadingPod.value = true
  await nowPlayingStore.loadPodcast({ episode: props.episode, podcast: props.podcast, at: opts?.at })
  loadingPod.value = false
}

const play = () => {
  if (!isLoaded.value) {
    const isFinished = episodeMeta.value?.finished
    const at = isFinished ? 0 : episodeMeta.value?.currentTime
    loadPodcast({ at })
  } else {
    nowPlayingStore.play()
  }
}

const pause = () => {
  if (!isLoaded.value) return
  nowPlayingStore.pause()
}

const togglePlay = () => {
  if (loadingPod.value) return
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}
</script>
