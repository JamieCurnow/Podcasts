<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <div class="p-6 flex flex-col gap-4 max-h-[70dvh] overflow-auto">
        <div class="text-lg font-semibold">Add to Playlist</div>

        <button
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          @click="showNewPlaylist = true"
        >
          <div class="size-12 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
            <UIcon name="i-mdi-plus" class="size-6" />
          </div>
          <div class="font-medium">New Playlist</div>
        </button>

        <Divider v-if="playlists.length" />

        <button
          v-for="playlist in playlists"
          :key="playlist.id"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          @click="addTo(playlist.id)"
        >
          <PlaylistCover :playlist="playlist" size="sm" />
          <div class="flex-1 text-left">
            <div class="font-medium line-clamp-1">{{ playlist.name }}</div>
            <div class="text-sm text-neutral-500 dark:text-neutral-400">
              {{ playlist.items.length }} {{ playlist.items.length === 1 ? 'episode' : 'episodes' }}
            </div>
          </div>
          <UIcon v-if="isInPlaylist(playlist.id)" name="i-mdi-check" class="size-5 text-green-500" />
        </button>
      </div>
    </template>
  </UModal>

  <NewPlaylistDialog v-model="showNewPlaylist" @created="addTo" />
</template>

<script setup lang="ts">
import type { Episode, Podcast } from '~~/shared/types/index'

const isOpen = defineModel({ type: Boolean, default: false })
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

const showNewPlaylist = ref(false)
const playlistsStore = usePlaylistsStore()
const { playlists } = storeToRefs(playlistsStore)

const isInPlaylist = (playlistId: string) => {
  const playlist = playlists.value.find((p) => p.id === playlistId)
  if (!playlist) return false
  return playlist.items.some(
    (item) => item.podcast.feedUrl === props.podcast.feedUrl && item.episode.guid === props.episode.guid
  )
}

const addTo = (playlistId: string) => {
  playlistsStore.addToPlaylist(playlistId, { podcast: props.podcast, episode: props.episode })
  isOpen.value = false
}
</script>
