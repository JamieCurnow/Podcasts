<template>
  <div
    class="grid grid-cols-2 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800"
    :class="sizeClass"
  >
    <template v-if="images.length">
      <img
        v-for="(img, i) in images"
        :key="i"
        :src="getProxyUrl({ url: img })"
        class="w-full h-full object-cover"
      />
      <div
        v-for="i in Math.max(0, 4 - images.length)"
        :key="`empty-${i}`"
        class="bg-neutral-300 dark:bg-neutral-700"
      />
    </template>
    <div v-else class="col-span-2 row-span-2 flex items-center justify-center">
      <UIcon name="i-mdi-playlist-music" class="size-8 text-neutral-400 dark:text-neutral-500" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Playlist } from '~~/shared/types/index'

const props = defineProps({
  playlist: {
    type: Object as PropType<Playlist>,
    required: true
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md'
  }
})

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'size-12'
  if (props.size === 'lg') return 'size-32'
  return 'size-20'
})

const images = computed(() => {
  const seen = new Set<string>()
  const imgs: string[] = []
  for (const item of props.playlist.items) {
    const img = item.podcast.itunesImage || item.podcast.image?.url
    if (img && !seen.has(img)) {
      seen.add(img)
      imgs.push(img)
      if (imgs.length === 4) break
    }
  }
  return imgs
})
</script>
