<template>
  <div class="flex flex-col gap-2">
    <PodcastFundingCard v-for="(fund, i) in podcast.funding" :key="i" :funding="fund" />
  </div>
</template>

<script setup lang="ts">
import type { Podcast } from '~/types/index'
defineProps({
  podcast: {
    type: Object as PropType<Podcast>,
    required: true
  }
})
</script>
