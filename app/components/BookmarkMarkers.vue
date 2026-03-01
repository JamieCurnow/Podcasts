<template>
  <div ref="container" class="w-full">
    <button
      v-for="(marker, i) in bookmarkMarkers"
      :key="i"
      class="absolute"
      :style="{ left: `${marker.position - iconSize / 2}px` }"
      @click="nowPlayingStore.seekTo(marker.timestamp)"
    >
      <UIcon name="i-mdi-bookmark" :style="`width: ${iconSize}px; height: ${iconSize}px;`" />
    </button>
  </div>
</template>

<script setup lang="ts">
const nowPlayingStore = useNowPlayingStore()
const bookmarksStore = useBookmarksStore()
const { bookmarks } = storeToRefs(bookmarksStore)
const { podcast, episode, duration, currentTime } = storeToRefs(nowPlayingStore)

const iconSize = 16

const thisEpisodeBookmarks = computed(() => {
  return bookmarks.value.filter(
    (bookmark) => episode.value?.guid && bookmark.episode.guid === episode.value.guid
  )
})

const container = ref<HTMLElement | undefined>(undefined)
const containerWidth = computed(() => {
  // in px
  return container.value?.clientWidth || 0
})

// use the width and the episode duration to calculate the position of the bookmark markers
const bookmarkMarkers = computed(() => {
  if (!containerWidth.value || !duration.value) return []
  const scale = containerWidth.value / duration.value
  return thisEpisodeBookmarks.value.map((bookmark) => {
    const position = bookmark.timestamp * scale
    return { ...bookmark, position }
  })
})
</script>
