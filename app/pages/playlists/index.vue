<template>
  <div class="flex flex-col gap-4 pt-4 pb-40 px-4">
    <div class="flex items-center justify-between">
      <div class="text-lg font-semibold">Playlists</div>
      <UButton variant="ghost" @click="showNewPlaylist = true">
        <UIcon name="i-mdi-plus" class="size-6" />
      </UButton>
    </div>

    <div v-if="!playlists.length" class="text-center pt-16 text-neutral-300 dark:text-neutral-600">
      <UIcon name="i-mdi-playlist-music" class="size-16 mb-4" />
      <div class="text-2xl">No playlists yet</div>
      <div class="text-base mt-2">Create one to start collecting episodes</div>
      <UButton class="mt-6" @click="showNewPlaylist = true">Create Playlist</UButton>
    </div>

    <div v-else class="flex flex-col gap-2">
      <NuxtLink
        v-for="playlist in playlists"
        :key="playlist.id"
        :to="`/playlists/${playlist.id}`"
        class="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors no-underline!"
      >
        <PlaylistCover :playlist="playlist" />
        <div class="flex-1 min-w-0">
          <div class="font-semibold line-clamp-1">{{ playlist.name }}</div>
          <div
            v-if="playlist.description"
            class="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1"
          >
            {{ playlist.description }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">
            {{ playlist.items.length }} {{ playlist.items.length === 1 ? 'episode' : 'episodes' }}
          </div>
        </div>
        <UIcon name="i-ic-baseline-keyboard-arrow-right" class="size-6 text-neutral-400 shrink-0" />
      </NuxtLink>
    </div>

    <NewPlaylistDialog v-model="showNewPlaylist" @created="onCreated" />
  </div>
</template>

<script setup lang="ts">
const playlistsStore = usePlaylistsStore()
const { playlists } = storeToRefs(playlistsStore)
const showNewPlaylist = ref(false)
const router = useRouter()

const onCreated = (uid: string) => {
  router.push(`/playlists/${uid}`)
}
</script>
