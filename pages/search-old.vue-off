<template>
  <div class="flex flex-col gap-4 pt-10 px-4 pb-40">
    <UInput
      v-model="query"
      :loading="searching"
      placeholder="Search"
      auto-focus
      icon="i-mdi-search"
      @keyup.enter="search()"
    />
    <div v-if="searching" class="flex items-center justify-center pt-10">
      <Loading class="size-16" />
    </div>
    <div v-if="searchResultPods">
      <SearchPods :podcasts="searchResultPods" />
    </div>
    <!-- <Divider v-if="searchResultPods" /> -->
    <!-- trending -->
    <div v-if="!searching && !searchResultPods" class="flex flex-col gap-4">
      <div class="text-lg font-bold">Trending</div>
      <SearchPods v-if="trendingPods" :podcasts="trendingPods" />
      <div v-else>
        <FullScreenLoading />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * This page is deprecated and will be removed in the future.
 * I'm removing reliance on the PodIdx API which this page used. The endpoints are removed.
 * But this page looks nice so we may use it in the future to search the user's own podcasts.
 */
import type { Podcast } from '~/types/index'
import FullScreenLoading from '~/components/FullScreenLoading.vue'
import type { PodIdxTrendingResult } from '~/types/PodIdxTrendingResult'

const query = ref('')
const searching = ref(false)
const searchResultPods = ref<Podcast[] | null>(null)
const search = async () => {
  try {
    searching.value = true
    const res = await $fetch('/api/search', {
      method: 'GET',
      query: { query: query.value, max: 10 }
    })
    /** @ts-expect-error - there is no search endpoint so TS doesn't know what the type is */
    searchResultPods.value = await feedsToPods(res.feeds)
    searching.value = false
  } catch (e) {
    searching.value = false
    console.error(e)
  }
}

const gettingTrending = ref(false)
const trendingPods = ref<Podcast[] | null>(null)
const getTrending = async () => {
  try {
    gettingTrending.value = true
    const res = await $fetch('/api/trending', { method: 'GET' })
    /** @ts-expect-error - there is no search endpoint so TS doesn't know what the type is */
    trendingPods.value = await feedsToPods(res.trending.feeds)
    gettingTrending.value = false
  } catch (e) {
    console.error(e)
  }
}

const feedsToPods = async (feeds: PodIdxTrendingResult['feeds']) => {
  const urls = feeds.map((x) => x.url)
  const podcasts = await Promise.all(
    urls.map((url) => {
      return $fetch('/api/podcast/feed', { method: 'get', query: { url, limit: 0 } }).catch(() => null)
    })
  )
  return podcasts.filter((p) => p?.podcast?.feedUrl).map((x) => x!.podcast)
}

onMounted(() => {
  getTrending()
})
</script>
