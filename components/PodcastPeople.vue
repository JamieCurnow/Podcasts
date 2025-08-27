<template>
  <div class="flex flex-wrap gap-6">
    <PodcastPerson v-for="(person, i) in people" :key="i" :person="person" />
  </div>
</template>

<script setup lang="ts">
import type { PodcastPerson } from '~/types/PodcastPerson'
defineProps({
  people: {
    type: Array as () => PodcastPerson[],
    required: true
  }
})
</script>
