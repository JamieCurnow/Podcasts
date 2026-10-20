<template>
  <div class="flex flex-col gap-4 pt-4 pb-40 px-4">
    <div class="text-lg font-semibold">Bookmarks</div>
    <EmptyState
      v-if="!bookmarks.length"
      class="pt-12!"
      icon="i-mdi-bookmark-multiple-outline"
      title="No bookmarks yet"
      body="Tap the bookmark in the player to save a moment you want to come back to."
    />
    <div v-else class="flex flex-col gap-4">
      <div
        v-for="bookmark in bookmarks"
        :key="`${bookmark.episode.guid}-${bookmark.timestamp}`"
        class="pressable flex cursor-pointer items-center gap-4"
        @click="playBookmark(bookmark)"
      >
        <img
          :src="bookmark.podcast.image?.url || bookmark.podcast.itunesImage"
          class="w-16 h-16 rounded-md select-none [-webkit-touch-callout:none]"
          draggable="false"
        />
        <div class="flex-1">
          <div class="font-semibold line-clamp-1">
            {{ bookmark.episode.title }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">
            {{ bookmark.podcast.title }}
          </div>
          <div v-if="bookmark.notes" class="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">
            {{ bookmark.notes }}
          </div>
          <div class="text-xs text-neutral-500 dark:text-neutral-400">
            {{ formatTime(bookmark.timestamp) }}
          </div>
        </div>
        <UButton variant="ghost" @click.stop="removeBookmark(bookmark)">
          <UIcon name="i-mdi-close" />
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookmarksStore, type Bookmark } from '~/stores/bookmarksStore'

const bookmarksStore = useBookmarksStore()
const { bookmarks } = storeToRefs(bookmarksStore)
const { removeBookmark } = bookmarksStore

const nowPlayingStore = useNowPlayingStore()

const playBookmark = (bookmark: Bookmark) => {
  nowPlayingStore.loadPodcast({
    podcast: bookmark.podcast,
    episode: bookmark.episode,
    at: bookmark.timestamp
  })
  nowPlayingStore.currentPodcastDialogOpen = true
}
</script>
