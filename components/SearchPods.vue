<template>
  <div class="flex flex-wrap justify-start gap-x-5 gap-y-8">
    <div v-for="pod in podcasts" :key="pod.feedUrl" class="relative">
      <NuxtLink
        :to="`/podcast?url=${encodeURIComponent(pod.feedUrl)}`"
        class="flex flex-col gap-1 max-w-[100px] no-underline"
      >
        <PodCover :img="pod.image?.url || pod.itunesImage" />
        <div class="text-sm line-clamp-2">{{ pod.title }}</div>
      </NuxtLink>
      <!-- subscribe btn -->
      <button
        v-if="!hideSubIndicator"
        class="absolute rounded-full size-7 top-[66px] right-2 flex items-center justify-center"
        :class="{
          'bg-green-500 dark:bg-green-700': isSubbed(pod.feedUrl),
          'bg-neutral-50 dark:bg-neutral-300': !isSubbed(pod.feedUrl)
        }"
        @click.stop="toggleSub(pod.feedUrl)"
      >
        <UIcon class="text-neutral-900 size-6" :name="isSubbed(pod.feedUrl) ? 'i-mdi-check' : 'i-mdi-plus'" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Podcast } from '~/types/index'

defineProps({
  podcasts: {
    type: Object as PropType<Podcast[]>,
    required: true
  },
  hideSubIndicator: Boolean
})

const { urls } = storeToRefs(useSubsStore())
const isSubbed = (url: string) => urls.value?.includes(url)

const toggleSub = (url: string) => {
  if (isSubbed(url)) {
    if (!urls.value) return
    urls.value = urls.value.filter((x) => x !== url)
  } else {
    if (!urls.value) urls.value = []
    urls.value = [...urls.value, url]
  }
}
</script>
