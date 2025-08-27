<template>
  <div class="flex flex-col gap-4 pt-4 pb-40 px-4">
    <div class="text-lg font-semibold">Bookmarks</div>
    <div v-if="!bookmarks.length" class="text-center text-neutral-500 dark:text-neutral-400">
      You don't have any bookmarks yet.
    </div>
    <div v-else class="flex flex-col gap-4">
      <div
        v-for="bookmark in bookmarks"
        :key="`${bookmark.episode.guid}-${bookmark.timestamp}`"
        class="flex items-center gap-4"
        @click="playBookmark(bookmark)"
      >
        <img
          :src="bookmark.podcast.image?.url || bookmark.podcast.itunesImage"
          class="w-16 h-16 rounded-md"
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
import { useNowPlayingStore, formatTime } from '~/stores/nowPlayingStore'

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
