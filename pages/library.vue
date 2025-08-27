<template>
  <div class="pt-10 px-4 pb-40">
    <div v-if="podcasts">
      <SearchPods v-if="podcasts" hide-sub-indicator :podcasts="podcasts" />
    </div>
    <div v-else>
      <FullScreenLoading />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Podcast } from '~/types/index'
import SearchPods from '~/components/SearchPods.vue'

const { urls } = storeToRefs(useSubsStore())

const podcasts = ref<Podcast[] | null>(null)
const loading = ref(false)
const getSubs = async () => {
  try {
    loading.value = true
    const pods = await Promise.all(
      urls.value?.map((url) => {
        return $fetch('/api/podcast/feed', { method: 'GET', query: { url, limit: 0 } }).catch(() => null)
      }) || []
    )
    podcasts.value = pods.filter((p) => p?.podcast?.feedUrl).map((x) => x!.podcast)
    loading.value = false
  } catch (e) {
    loading.value = false
    console.error(e)
  }
}

onMounted(() => {
  getSubs()
})
</script>
