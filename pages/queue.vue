<template>
  <div v-if="queue?.length" class="flex flex-col gap-2 pt-4 pb-40">
    <template v-for="({ podcast, episode }, i) in queue" :key="`${podcast.feedUrl}/${episode.guid}`">
      <PodListItem :episode="episode" :podcast="podcast" class="px-4" sub-header="date" />
      <Divider v-if="i + 1 !== queue.length" />
    </template>
  </div>
  <div v-else class="text-2xl text-center pt-20 text-neutral-300 dark:text-neutral-600">
    No episodes in the queue
  </div>
</template>

<script setup lang="ts">
const queueStore = useQueueStore()
const { queue } = storeToRefs(queueStore)
</script>
