<template>
  <div class="mb-4 flex gap-2 items-center">
    <UCheckbox v-model="selected" color="primary" />
    <div
      class="flex gap-2 items-center cursor-pointer hover:opacity-80"
      @click="selected = !selected"
      :class="{ 'opacity-50': !selected }"
    >
      <PodCover :img="podcast.image?.url || podcast.itunesImage" class="size-10" />
      <div class="text-lg font-semibold line-clamp-1">
        {{ podcast.title || podcast.itunesSubtitle }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selected = defineModel({ type: Boolean, required: true })
defineProps({
  podcast: { type: Object as () => Podcast, required: true }
})
</script>
