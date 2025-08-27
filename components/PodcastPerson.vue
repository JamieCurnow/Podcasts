<template>
  <a :href="person.href" target="_blank" class="flex items-center gap-2 no-underline">
    <img :src="person.img" alt="person image" v-if="person.img" class="size-12 rounded-full object-cover" />
    <div class="text-left">
      <div class="font-semibold text-sm">{{ person.name }}</div>
      <div class="text-xs font-normal text-neutral-500 dark:text-neutral-400 capitalize">
        {{ person.role }}
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { PodcastPerson } from '~/types/PodcastPerson'
defineProps({
  person: {
    type: Object as () => PodcastPerson,
    required: true
  }
})
</script>
