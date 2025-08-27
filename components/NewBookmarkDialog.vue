<template>
  <SlideUpDialog v-model="dialog" height="568px">
    <div class="flex flex-col p-4">
      <div class="self-center">
        <UIcon name="i-ic-round-horizontal-rule" class="size-10 text-neutral-300 dark:text-neutral-600" />
      </div>
      <h3 class="text-center text-lg font-semibold">New Bookmark</h3>

      <div class="mb-4 text-center text-base">
        {{ formatTime(currentTime) }}
      </div>

      <UTextarea v-model="notes" placeholder="Add notes..." class="mb-4" />

      <div class="flex gap-4 justify-center">
        <UButton icon="i-mdi-bookmark-outline" @click="saveBookmark"> Bookmark </UButton>
      </div>
    </div>
  </SlideUpDialog>
</template>

<script setup lang="ts">
import { useBookmarksStore } from '~/stores/bookmarksStore'
import { useNowPlayingStore, formatTime } from '~/stores/nowPlayingStore'
import SlideUpDialog from '~/components/SlideUpDialog.vue'

const dialog = defineModel<boolean>()

const bookmarksStore = useBookmarksStore()
const { addBookmark } = bookmarksStore

const nowPlayingStore = useNowPlayingStore()
const { podcast, episode, currentTime } = storeToRefs(nowPlayingStore)

const notes = ref('')

const saveBookmark = () => {
  if (!podcast.value || !episode.value) return

  addBookmark({
    podcast: podcast.value,
    episode: episode.value,
    timestamp: currentTime.value,
    notes: notes.value
  })

  dialog.value = false
  notes.value = ''
}
</script>
