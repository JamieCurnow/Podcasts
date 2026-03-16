<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <div class="p-6 flex flex-col gap-4">
        <div class="text-lg font-semibold">New Playlist</div>
        <UInput v-model="name" placeholder="Playlist name" autofocus @keydown.enter="create" />
        <UTextarea v-model="description" placeholder="Description (optional)" :rows="2" />
        <div class="flex gap-2 justify-end">
          <UButton variant="ghost" @click="isOpen = false">Cancel</UButton>
          <UButton :disabled="!name.trim()" @click="create">Create</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = defineModel({ type: Boolean, default: false })
const emit = defineEmits<{ created: [id: string] }>()

const name = ref('')
const description = ref('')

const playlistsStore = usePlaylistsStore()

const create = () => {
  if (!name.value.trim()) return
  const playlist = playlistsStore.createPlaylist({
    name: name.value.trim(),
    description: description.value.trim() || undefined
  })
  name.value = ''
  description.value = ''
  isOpen.value = false
  emit('created', playlist.id)
}
</script>
