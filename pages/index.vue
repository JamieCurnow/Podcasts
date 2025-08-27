<template>
  <PullToRefesh
    :disable="currentPodcastDialogOpen || bodyScrollLock"
    :min-close-height="pullToRefreshMinClose"
    :pull-down-weight="pullDownWeight"
    @refresh="refresh()"
  >
    <template #pull-content>
      <div v-if="!loading" class="h-32 flex justify-center pt-4 w-full bg-neutral-50 dark:bg-neutral-900">
        <div class="font-semibold text-lg">{{ refreshing ? 'Loading...' : 'Pull to refresh' }}</div>
      </div>
    </template>

    <div v-if="!loading && urls?.length" class="flex flex-col gap-2 bg-neutral-50 dark:bg-neutral-900">
      <!-- <Divider /> -->
      <div>
        <SubsHorizontalScroll :podcasts="pods" />
      </div>
      <div class="mx-1">
        <Divider v-if="podcasts.length" />
      </div>
      <template
        v-for="({ episode, podcast }, i) in episodesSortedByDate"
        :key="`${podcast.feedUrl}/${episode.guid}`"
      >
        <div
          v-if="i === episodesSortedByDate.length - fromBottomAmountToAutoLoadMore"
          ref="lastInList"
          class="-mt-[8px]"
        ></div>
        <PodListItem :episode="episode" :podcast="podcast" class="px-4" />
        <Divider />
      </template>

      <!-- more -->
      <div v-if="podcasts.length" class="w-full p-4 pb-40 justify-center flex">
        <div>
          <Loading class="size-16" />
        </div>
      </div>
    </div>
    <div
      v-if="!loading && !urls?.length"
      class="text-2xl text-center pt-20 text-neutral-300 dark:text-neutral-600 bg-neutral-50 dark:bg-neutral-900"
    >
      No podcast subs!
      <p class="text-xl md:text-2xl">Click explore below to find your favorite pod</p>
    </div>
  </PullToRefesh>
  <FullScreenLoading v-if="loading" />
</template>

<script setup lang="ts">
import type { Episode, Podcast } from '~/types/index'
import PullToRefesh from '~/components/PullToRefesh.vue'
import type { PodcastResponse } from '~/types/PodcastResponse'

definePageMeta({ layout: 'default', keepalive: true })
const { currentPodcastDialogOpen } = storeToRefs(useNowPlayingStore())
const { bodyScrollLock } = storeToRefs(useGlobalStateStore())
const { urls } = storeToRefs(useSubsStore())
const { pullDownWeight } = storeToRefs(useUserConfigStore())

const lastInList = ref<HTMLElement | undefined>(undefined)
const targetIsVisible = useElementVisibility(lastInList)
const fromBottomAmountToAutoLoadMore = 2

watch(targetIsVisible, (v, old) => {
  if (v && !old) loadMore()
})

const { amountOfPodsToInitiallyFetch } = storeToRefs(useUserConfigStore())

// main loading
const loading = ref(true)
const { isLoading } = storeToRefs(useLoadingStore())
watch(
  loading,
  (val) => {
    isLoading.value = val
  },
  { immediate: true }
)

const podcasts = ref<(PodcastResponse & { url: string })[]>([])

const amountFetched = ref(0)

const pods = computed(() => podcasts.value?.map((pod) => pod.podcast) || [])
const episodeBatches = ref<{ episode: Episode; podcast: Podcast }[][]>([])
const currentEpisodeBatch = ref(0)

const fetchPod = async (opts: { url: string; start: number; limit: number; noCache?: boolean }) => {
  const { limit, start, url } = opts

  const pod = await $fetch(`/api/podcast/feed`, {
    method: 'GET',
    query: { url, start, limit },
    cache: opts.noCache ? 'no-cache' : 'default'
  }).catch((e) => {
    console.error(`Failed to fetch ${url}`)
    console.error(e)
    return undefined
  })

  if (!pod) return undefined

  const podAndUrls = { ...pod, url }
  return podAndUrls
}

const isNotUndefined = <T,>(value: T | undefined): value is T => {
  return value !== undefined
}

const fetchBatch = async (opts?: { replaceAfterFetch?: boolean; noCache?: boolean }) => {
  const batch = currentEpisodeBatch.value
  const start = batch * amountOfPodsToInitiallyFetch.value
  if (!urls.value) return
  const maybePods = await Promise.all(
    urls.value.map((url) =>
      fetchPod({ url, start, limit: amountOfPodsToInitiallyFetch.value, noCache: opts?.noCache })
    )
  )
  const pods = maybePods.filter(isNotUndefined)

  if (opts?.replaceAfterFetch) {
    podcasts.value = []
    episodeBatches.value = []
  }

  // process the fetched podcast
  pods.forEach((pod) => {
    const i = podcasts.value.findIndex((x) => x.url === pod.url)
    if (i === -1) {
      podcasts.value.push(pod)
    } else {
      podcasts.value[i].podcast = pod.podcast
      podcasts.value[i].episodes.push(...pod.episodes)
    }

    const epBatch = episodeBatches.value[batch]
    if (!epBatch) episodeBatches.value[batch] = []
    episodeBatches.value[batch].push(...pod.episodes.map((episode) => ({ episode, podcast: pod.podcast })))
  })

  amountFetched.value += amountOfPodsToInitiallyFetch.value
  currentEpisodeBatch.value++
}

const refreshing = ref(false)
const lastRefresh = ref(0)
const refreshFrequency = 1000 * 60 * 5
const pullToRefreshMinClose = computed(() => (refreshing.value ? 80 : 0))
const refresh = async () => {
  try {
    refreshing.value = true
    currentEpisodeBatch.value = 0
    amountFetched.value = 0
    if (Date.now() - lastRefresh.value < refreshFrequency) {
      // simulate a pause
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } else {
      // actually fetch
      await fetchBatch({ replaceAfterFetch: true, noCache: true })
      lastRefresh.value = Date.now()
    }
    refreshing.value = false
  } catch (e) {
    console.error(e)
    refreshing.value = false
  }
}

watch(
  () => urls.value?.length,
  async (v) => {
    if (v === 0) {
      loading.value = false
      return useRouter().push('/search')
    }
    try {
      loading.value = true
      currentEpisodeBatch.value = 0
      amountFetched.value = 0
      podcasts.value = []
      episodeBatches.value = []
      await fetchBatch()

      loading.value = false
    } catch (e) {
      loading.value = false
      console.error(e)
    }
  },
  { immediate: true }
)

const episodesSortedByDate = computed(() => {
  return episodeBatches.value.reduce(
    (acc, batch) => {
      const sorted = batch.sort((a, b) => {
        return new Date(b.episode.pubDate).getTime() - new Date(a.episode.pubDate).getTime()
      })
      acc.push(...sorted)
      return acc
    },
    [] as { episode: Episode; podcast: Podcast }[]
  )
})

const loadingMore = ref(false)
const loadMore = async () => {
  try {
    loadingMore.value = true
    await fetchBatch()
    loadingMore.value = false
  } catch (e) {
    console.error(e)
  }
}
</script>
