<template>
  <div class="flex gap-4 items-center">
    <div>
      <PodPlayChip :episode="episode" :podcast="podcast" />
    </div>
    <div>
      <PodAddToQueue :episode="episode" :podcast="podcast" />
    </div>
    <div>
      <PodDownload :episode="episode" :podcast="podcast" />
    </div>
    <div class="grow" />
    <div class="pr-2">
      <PodMenu :episode="episode" :podcast="podcast" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Episode, Podcast } from '~/types/index'

defineProps({
  episode: {
    type: Object as PropType<Episode>,
    required: true
  },
  podcast: {
    type: Object as PropType<Podcast>,
    required: true
  }
})
</script>
