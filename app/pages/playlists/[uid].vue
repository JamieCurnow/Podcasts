<template>
  <ClientOnly>
    <div v-if="playlist" class="flex flex-col gap-4 pt-4 pb-40 px-4">
      <!-- Header -->
      <div class="flex items-start gap-4">
        <PlaylistCover :playlist="playlist" size="lg" />
        <div class="flex flex-col min-w-0 pt-1">
          <div v-if="!isEditing" class="text-xl font-bold line-clamp-2">{{ playlist.name }}</div>
          <UInput v-else v-model="editName" class="mb-2" />
          <div
            v-if="!isEditing && playlist.description"
            class="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1"
          >
            {{ playlist.description }}
          </div>
          <UTextarea
            v-if="isEditing"
            v-model="editDescription"
            :rows="2"
            placeholder="Description"
            class="mb-2"
          />
          <div class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {{ playlist.items.length }} {{ playlist.items.length === 1 ? 'episode' : 'episodes' }}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <template v-if="!isEditing">
          <UButton variant="soft" size="sm" @click="startEditing">
            <UIcon name="i-mdi-pencil" class="size-4" />
            Edit
          </UButton>
          <UButton variant="soft" color="error" size="sm" @click="confirmDelete">
            <UIcon name="i-mdi-delete" class="size-4" />
            Delete
          </UButton>
          <UButton v-if="playlist.items.length" variant="soft" size="sm" @click="playAll">
            <UIcon name="i-mdi-play" class="size-4" />
            Play All
          </UButton>
          <UButton
            v-if="playlist.items.length > 1"
            variant="soft"
            size="sm"
            @click="isReordering = !isReordering"
          >
            <UIcon name="i-mdi-swap-vertical" class="size-4" />
            {{ isReordering ? 'Done' : 'Reorder' }}
          </UButton>
        </template>
        <template v-else>
          <UButton size="sm" @click="saveEdit">Save</UButton>
          <UButton variant="ghost" size="sm" @click="isEditing = false">Cancel</UButton>
        </template>
      </div>

      <Divider />

      <!-- Episodes -->
      <div v-if="!playlist.items.length" class="text-center pt-8 text-neutral-300 dark:text-neutral-600">
        <div class="text-xl">No episodes yet</div>
        <div class="text-sm mt-1">Add episodes from the three-dot menu on any episode</div>
      </div>

      <template v-for="(item, i) in playlist.items" :key="`${item.podcast.feedUrl}/${item.episode.guid}`">
        <div class="flex items-center gap-2">
          <div v-if="isReordering" class="flex flex-col shrink-0">
            <button :disabled="i === 0" class="p-1 disabled:opacity-20" @click="moveUp(i)">
              <UIcon name="i-mdi-chevron-up" class="size-6" />
            </button>
            <button
              :disabled="i === playlist.items.length - 1"
              class="p-1 disabled:opacity-20"
              @click="moveDown(i)"
            >
              <UIcon name="i-mdi-chevron-down" class="size-6" />
            </button>
          </div>
          <div class="flex-1 min-w-0">
            <PodListItem
              :episode="item.episode"
              :podcast="item.podcast"
              sub-header="podcastTitle"
              :extra-menu-items="getRemoveMenuItem(item)"
            />
          </div>
        </div>
        <Divider v-if="i + 1 !== playlist.items.length" />
      </template>
    </div>

    <div v-else class="text-2xl text-center pt-20 text-neutral-300 dark:text-neutral-600">
      Playlist not found
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '#ui/types'
import type { Episode, Podcast } from '~~/shared/types/index'

const route = useRoute()
const router = useRouter()
const playlistsStore = usePlaylistsStore()
const queueStore = useQueueStore()
const nowPlayingStore = useNowPlayingStore()

const playlistId = computed(() => route.params.uid as string)
const playlist = computed(() => playlistsStore.playlists.find((p) => p.id === playlistId.value))

const isEditing = ref(false)
const isReordering = ref(false)
const editName = ref('')
const editDescription = ref('')

const startEditing = () => {
  if (!playlist.value) return
  editName.value = playlist.value.name
  editDescription.value = playlist.value.description || ''
  isEditing.value = true
}

const saveEdit = () => {
  if (!editName.value.trim()) return
  playlistsStore.updatePlaylist(playlistId.value, {
    name: editName.value.trim(),
    description: editDescription.value.trim() || undefined
  })
  isEditing.value = false
}

const confirmDelete = () => {
  if (!confirm('Delete this playlist?')) return
  playlistsStore.deletePlaylist(playlistId.value)
  router.replace('/playlists')
}

const getRemoveMenuItem = (item: { podcast: Podcast; episode: Episode }): DropdownMenuItem[] => [
  {
    label: 'Remove from Playlist',
    icon: 'i-mdi-playlist-minus',
    onSelect: () => {
      playlistsStore.removeFromPlaylist(playlistId.value, {
        feedUrl: item.podcast.feedUrl,
        guid: item.episode.guid
      })
    }
  }
]

const moveUp = (index: number) => {
  if (index <= 0) return
  playlistsStore.reorderPlaylist(playlistId.value, index, index - 1)
}

const moveDown = (index: number) => {
  if (!playlist.value || index >= playlist.value.items.length - 1) return
  playlistsStore.reorderPlaylist(playlistId.value, index, index + 1)
}

const playAll = () => {
  const items = playlist.value?.items
  if (!items?.length) return
  const first = items[0]!
  nowPlayingStore.loadPodcast({ episode: first.episode, podcast: first.podcast })
  items.slice(1).forEach((item) => queueStore.addToQueue({ episode: item.episode, podcast: item.podcast }))
}
</script>
