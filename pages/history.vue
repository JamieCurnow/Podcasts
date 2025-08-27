<template>
  <div v-if="staticHistory?.length" class="flex flex-col gap-2 pt-4 pb-40">
    <template v-for="({ podcast, episode }, i) in staticHistory" :key="`${podcast.feedUrl}/${episode.guid}`">
      <PodListItem :episode="episode" :podcast="podcast" class="px-4" sub-header="date" />
      <Divider v-if="i + 1 !== staticHistory.length" />
    </template>
  </div>
  <div v-else class="text-2xl text-center pt-20 text-neutral-300 dark:text-neutral-600">
    No historic episodes
  </div>
</template>

<script setup lang="ts">
import type { Episode, Podcast } from '~/types/index'
const store = useHistoryStore()
const { history } = storeToRefs(store)
// we dupe it to static on mount so it doesn't change when the store changes
// if you play an episode from the history, it will be moved to the top
// we need to remember to clear this if we delete a history item tho
const staticHistory = ref<{ podcast: Podcast; episode: Episode }[]>([])

onMounted(() => {
  if (history.value) staticHistory.value = JSON.parse(JSON.stringify(history.value))
})
</script>
