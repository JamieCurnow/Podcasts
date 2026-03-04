<template>
  <div class="mb-4 flex gap-2 items-center">
    <UCheckbox v-model="selected" color="primary" />
    <div
      class="flex gap-2 items-center cursor-pointer hover:opacity-80"
      @click="selected = !selected"
      :class="{ 'opacity-50': !selected }"
    >
      <PodCover :img="image" class="size-10" />
      <div class="text-lg font-semibold line-clamp-1">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selected = defineModel({ type: Boolean, required: true })
const props = defineProps({
  podcast: { type: Object as () => Podcast, required: true }
})

const { title, image } = usePodcast(() => props.podcast)
</script>
