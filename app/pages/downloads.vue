<template>
  <div v-if="cleanDownloads.length" class="flex flex-col gap-2 pt-4 pb-40">
    <template v-for="({ podcast, episode }, i) in cleanDownloads" :key="`${podcast.feedUrl}/${episode.guid}`">
      <PodListItem :episode="episode" :podcast="podcast" class="px-4" sub-header="date" />
      <Divider v-if="i + 1 !== cleanDownloads.length" />
    </template>
  </div>
  <EmptyState
    v-else
    icon="i-ic-baseline-arrow-circle-down"
    title="Nothing downloaded yet"
    body="Download an episode to listen offline, wherever you are."
  />
</template>

<script setup lang="ts">
const store = useDownloadsStore()
const { downloads } = storeToRefs(store)

const cleanDownloads = computed(() => {
  const d = downloads.value?.filter((download) => download.podcast && download.episode)
  return d || []
})

onMounted(() => {
  // remove downloads that don't have a podcast or episode
  const downloadsToRemove = downloads.value?.filter((download) => !download.podcast || !download.episode)
  downloadsToRemove?.forEach((download) => {
    store.deleteDownload({ episodeGuid: download.episodeGuid, feedUrl: download.feedUrl })
  })
})
</script>
