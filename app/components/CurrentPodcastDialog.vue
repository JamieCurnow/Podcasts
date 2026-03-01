<template>
  <SlideUpDialog
    v-model="currentPodcastDialogOpen"
    height="668px"
    :prevent-swipe="preventSwipe || playbackSpeedDialog"
  >
    <!-- swipe down to close section -->
    <div v-if="episode" class="flex flex-col justify-center px-12">
      <div class="self-center">
        <UIcon name="i-ic-round-horizontal-rule" class="size-10 text-neutral-300 dark:text-neutral-600" />
      </div>
      <PodCover :img="podImage" class="size-[300px] self-center" :width="400" :height="400" />
      <div class="pt-10 text-center text-lg font-semibold" @click="goToPodcast">
        <TickerText :text="episodeTitle || ''" />
      </div>
      <div class="text-center text-sm line-clamp-1">
        {{ podcastTitle }}
      </div>
    </div>
    <!-- no swipe to close -->
    <div class="flex flex-col justify-center px-12">
      <!-- play buttons -->
      <div class="flex items-center justify-center gap-10 pt-8">
        <UButton variant="ghost" @click="skipBackwards()">
          <UIcon name="i-ic-round-replay-10" class="size-10" />
        </UButton>
        <UButton variant="ghost" @click="togglePlay()">
          <UIcon :name="playIcon" class="size-14" />
        </UButton>
        <UButton variant="ghost" @click="skipForwards()">
          <UIcon name="i-ic-round-forward-30" class="size-10" />
        </UButton>
      </div>
      <!-- seek -->
      <div class="pt-8 relative">
        <div class="absolute inset-0 w-full">
          <BookmarkMarkers />
        </div>
        <URange
          v-model="seek"
          size="xs"
          :min="0"
          :max="duration"
          @touchstart="startPreventingSwipe"
          @mousedown="startPreventingSwipe"
        />
      </div>
      <div class="mt-1 flex justify-between">
        <div class="text-xs font-light">
          {{ seekFormatted }}
        </div>
        <div class="text-xs font-light">-{{ timeLeftFormatted }}</div>
      </div>
      <div class="h-20">
        <div class="flex items-center justify-between pt-4">
          <div class="flex w-1/3 justify-start">
            <UButton size="lg" variant="ghost" @click="playbackSpeedDialog = true">
              <span class="text-base">{{ userConfigStore.playbackSpeed }}x</span>
            </UButton>
          </div>
          <div class="flex w-1/3 justify-center">
            <UButton size="lg" variant="ghost" @click="toggleBookmark">
              <UIcon class="size-6" :name="bookmarkIcon" />
            </UButton>
          </div>
          <div class="w-1/3" />
        </div>
      </div>
    </div>
    <PlaybackSpeedDialog v-model="playbackSpeedDialog" />

    <NewBookmarkDialog v-model="newBookmarkDialogOpen" />
  </SlideUpDialog>
</template>

<script setup lang="ts">
import PlaybackSpeedDialog from '~/components/PlaybackSpeedDialog.vue'
import { useUserConfigStore } from '~/stores/userConfigStore'
import SlideUpDialog from '~/components/SlideUpDialog.vue'
import { useBookmarksStore } from '~/stores/bookmarksStore'
import NewBookmarkDialog from '~/components/NewBookmarkDialog.vue'
import TickerText from '~/components/TickerText.vue'
import { decode } from 'html-entities'

const router = useRouter()

const bookmarksStore = useBookmarksStore()
const { removeBookmark, isBookmarked } = bookmarksStore

const userConfigStore = useUserConfigStore()
const playbackSpeedDialog = ref(false)
const newBookmarkDialogOpen = ref(false)

const store = useNowPlayingStore()
const { currentPodcastDialogOpen, podcast, episode, audioState, duration, currentTime, timeLeftFormatted } =
  storeToRefs(store)

const goToPodcast = () => {
  if (!podcast.value?.feedUrl) return
  if (!episode.value?.guid) return
  currentPodcastDialogOpen.value = false
  router.push(
    `/podcast/episode?url=${encodeURIComponent(podcast.value.feedUrl)}&episodeGuid=${encodeURIComponent(episode.value.guid)}`
  )
}

const podImage = computed(() => podcast.value?.image?.url || podcast.value?.itunesImage)
const podcastTitle = computed(() => {
  const title = podcast.value?.title || podcast.value?.itunesSubtitle
  return title ? decode(title) : ''
})
const episodeTitle = computed(() => {
  const title = episode.value?.title || episode.value?.itunesTitle
  return title ? decode(title) : ''
})

const bookmarked = computed(() => {
  if (!episode.value) return false
  return isBookmarked(episode.value.guid, currentTime.value)
})

const bookmarkIcon = computed(() => {
  return bookmarked.value ? 'i-mdi-bookmark' : 'i-mdi-bookmark-outline'
})

const toggleBookmark = () => {
  if (!episode.value || !podcast.value) return

  const bookmark = {
    podcast: podcast.value,
    episode: episode.value,
    timestamp: currentTime.value
  }

  if (bookmarked.value) {
    removeBookmark(bookmark)
  } else {
    newBookmarkDialogOpen.value = true
  }
}

const preventSwipe = ref(false)
const startPreventingSwipe = () => {
  preventSwipe.value = true
  window.addEventListener('mouseup', enableSwipe)
  window.addEventListener('touchend', enableSwipe)
}
const enableSwipe = () => {
  preventSwipe.value = false
  seekTo(seek.value)
  window.removeEventListener('mouseup', enableSwipe)
  window.removeEventListener('touchend', enableSwipe)
}

const togglePlay = () => {
  if (audioState.value === 'playing') return store.pause()
  if (audioState.value === 'paused') return store.play()
}

const playIcon = computed(() => {
  if (audioState.value === 'playing') return 'i-mdi-pause-circle'
  return 'i-mdi-play-circle'
})

const { skipBackwards, skipForwards, seekTo, formatTime } = store

const seek = ref(currentTime.value)
const seekFormatted = computed(() => formatTime(seek.value))
watch(
  [currentTime, currentPodcastDialogOpen],
  ([val]) => {
    if (preventSwipe.value) return
    nextTick(() => {
      seek.value = val
    })
  },
  { immediate: true }
)
</script>
