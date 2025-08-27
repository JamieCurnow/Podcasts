<template>
  <button class="border border-gray-400 dark:border-neutral-400 rounded-lg px-2 py-1 items-center flex">
    {{ funding.text }}
  </button>
</template>

<script setup lang="ts">
import type { PodcastFunding } from '~/types/PodcastFunding'
defineProps({
  funding: {
    type: Object as PropType<PodcastFunding>,
    required: true
  }
})
</script>
