<template>
  <PullToRefesh
    :disable="currentPodcastDialogOpen || bodyScrollLock"
    :min-close-height="pullToRefreshMinClose"
    @refresh="refresh()"
  >
    <template #pull-content>
      <div
        v-if="status !== 'loading'"
        class="h-32 flex justify-center pt-4 w-full bg-neutral-50 dark:bg-neutral-900"
      >
        <div class="font-semibold text-lg">
          {{ status === 'refreshing' ? 'Loading...' : 'Pull to refresh' }}
        </div>
      </div>
    </template>

    <div
      v-if="(status === 'success' || status === 'refreshing') && podcast"
      class="flex flex-col gap-2 pt-4 bg-neutral-50 dark:bg-neutral-900"
    >
      <!-- top bar -->
      <div class="px-4">
        <!-- back -->
        <div>
          <button @click="$router.back()">
            <UIcon name="i-ic-outline-arrow-back" class="size-7" />
          </button>
        </div>
        <!-- options -->
        <div></div>
      </div>
      <!-- pod info -->
      <div v-if="podcast" class="flex flex-col gap-6 px-4 pt-5">
        <!-- img and title -->
        <div class="flex gap-3">
          <!-- img -->
          <div>
            <PodCover :img="podcast.image?.url || podcast.itunesImage" class="w-24 h-24" />
          </div>
          <!-- title -->
          <div class="flex flex-col gap-2">
            <!-- title -->
            <div class="text-xl font-semibold">{{ podcast.title || podcast.itunesSubtitle }}</div>
            <!-- author -->
            <div class="text-xs font-light">{{ podcast.itunesAuthor || '' }}</div>
          </div>
        </div>
        <!-- Sub and other buttons -->
        <div class="flex gap-4 items-center">
          <!-- sub -->
          <div>
            <button
              class="flex gap-2 pl-1 h-8 rounded-lg w-32"
              :class="
                thisPodIsSubbed
                  ? 'text-neutral-900 dark:text-neutral-100 bg-neutral-300 dark:bg-neutral-600'
                  : 'text-neutral-500 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-700'
              "
              @click="toggleSub()"
            >
              <div>
                <UIcon
                  :name="thisPodIsSubbed ? 'i-ic-sharp-check-circle' : 'i-ic-baseline-add-circle'"
                  class="size-8"
                  :class="
                    thisPodIsSubbed
                      ? 'text-neutral-500 dark:text-neutral-100'
                      : 'text-neutral-400 dark:text-neutral-400'
                  "
                />
              </div>
              <div class="text-sm mt-[6px]">{{ thisPodIsSubbed ? 'Subscribed' : 'Subscribe' }}</div>
            </button>
          </div>
          <!-- net -->
          <div class="mt-1">
            <a v-if="podcast.link" :href="podcast.link" target="_blank">
              <UIcon name="i-mdi-earth" class="size-6" :class="iconColors" />
            </a>
          </div>
          <!-- share -->
          <div v-if="canShare" class="ml-2 mt-1">
            <button @click="share()">
              <UIcon name="i-ic-outline-share" class="size-6" :class="iconColors" />
            </button>
          </div>
        </div>
        <!-- People -->
        <PodcastPeople v-if="podcast.persons?.length" :people="podcast.persons" />
        <!-- discription -->
        <div class="text-sm leading-6" v-html="podcast.contentEncoded || podcast.description"></div>
        <!-- funding -->
        <div v-if="podcast.funding?.length" class="">
          <PodcastFunding :podcast="podcast" />
        </div>
      </div>
      <!-- episode count -->
      <div>
        <!-- count -->
        <div></div>
        <!-- sort opts -->
        <div></div>
      </div>
      <Divider />
      <!-- episodes -->
      <template v-for="(episode, i) in episodes" :key="`${podcast.feedUrl}/${episode.guid}`">
        <div
          v-if="i === episodes.length - fromBottomAmountToAutoLoadMore"
          ref="lastInList"
          class="-mt-[8px]"
        ></div>
        <PodListItem :episode="episode" :podcast="podcast" class="px-4" no-cover no-title sub-header="date" />
        <Divider />
      </template>

      <!-- more -->
      <div v-if="episodes.length" class="w-full p-4 pb-40 justify-center flex">
        <div>
          <Loading class="size-16" />
        </div>
      </div>
    </div>
  </PullToRefesh>

  <div v-if="status === 'error'">{{ error }}</div>
  <FullScreenLoading v-if="status === 'loading'" />
</template>

<script setup lang="ts">
import type { Episode, Podcast } from '~/types/index'
import type { PodcastResponse } from '~/types/PodcastResponse'

definePageMeta({ layout: 'default', keepalive: true })

const iconColors = 'text-neutral-500 dark:text-neutral-400'

const url = computed(() => useRoute().query.url as string)
const { urls } = storeToRefs(useSubsStore())
const { amountOfPodsToInitiallyFetch } = storeToRefs(useUserConfigStore())
const { currentPodcastDialogOpen } = storeToRefs(useNowPlayingStore())
const { bodyScrollLock } = storeToRefs(useGlobalStateStore())

const thisPodIsSubbed = computed(() => urls.value?.includes(url.value))
const toggleSub = () => {
  if (thisPodIsSubbed.value) {
    if (!urls.value) return
    urls.value = urls.value.filter((u) => u !== url.value)
  } else {
    if (!urls.value) urls.value = []
    urls.value?.push(url.value)
  }
}

const lastInList = ref<HTMLElement | undefined>(undefined)
const targetIsVisible = useElementVisibility(lastInList)
const fromBottomAmountToAutoLoadMore = 2
watch(targetIsVisible, (v, old) => {
  if (v && !old) fetchMore()
})

const data = ref<PodcastResponse | undefined>(undefined)
const podcast = ref<Podcast | undefined>(undefined)
const episodes = ref<Episode[]>([])
const error = ref<string | undefined>(undefined)

const canShare = computed(() => 'share' in navigator)
const share = () => {
  if (!navigator.share) return
  const title = podcast.value?.title || podcast.value?.itunesSubtitle
  const text = 'Listen on your favorite podcast app'
  const url = window.location.href
  try {
    navigator.share({ title, text, url })
  } catch (e) {
    console.error(e)
  }
}

const status = ref<'success' | 'error' | 'loading' | 'refreshing'>('loading')
const getData = async (opts?: { isRefresh?: boolean }) => {
  try {
    status.value = opts?.isRefresh ? 'refreshing' : 'loading'
    const res = await $fetch(`/api/podcast/feed`, {
      method: 'GET',
      query: { url: url.value, start: 0, limit: amountOfPodsToInitiallyFetch.value },
      cache: opts?.isRefresh ? 'no-cache' : 'default'
    })
    data.value = res
    podcast.value = res.podcast
    episodes.value = res.episodes
    status.value = 'success'
  } catch (e) {
    status.value = 'error'
    console.error(`Failed to fetch ${url.value}`)
    error.value = `Failed to fetch ${url.value}`
    console.error(e)
  }
}

const pullToRefreshMinClose = computed(() => (status.value === 'refreshing' ? 80 : 0))
const lastRefresh = ref(0)
const refreshInterval = 1000 * 60 * 5
const refresh = async () => {
  if (Date.now() - lastRefresh.value < refreshInterval) {
    // simulate a refresh
    status.value = 'refreshing'
    await new Promise((resolve) => setTimeout(resolve, 1000))
    status.value = 'success'
  } else {
    await getData({ isRefresh: true })
    lastRefresh.value = Date.now()
  }
}

watch(
  url,
  (v, old) => {
    if (!v) return
    if (v === old) return
    getData()
  },
  { immediate: true }
)

const fetchMore = async () => {
  const start = episodes.value.length
  const limit = 5
  const res = await $fetch(`/api/podcast/feed`, { method: 'GET', query: { url: url.value, start, limit } })
  episodes.value.push(...res.episodes)
}
</script>
