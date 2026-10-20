<template>
  <div v-if="queue?.length" class="flex flex-col gap-2 pt-4 pb-40">
    <template v-for="({ podcast, episode }, i) in queue" :key="`${podcast.feedUrl}/${episode.guid}`">
      <PodListItem :episode="episode" :podcast="podcast" class="px-4" sub-header="date" />
      <Divider v-if="i + 1 !== queue.length" />
    </template>
  </div>
  <EmptyState
    v-else
    icon="i-ic-baseline-playlist-add"
    title="Your queue's empty"
    body="Tap the queue icon on any episode and it'll play next in line."
  />
</template>

<script setup lang="ts">
const queueStore = useQueueStore()
const { queue } = storeToRefs(queueStore)
</script>
