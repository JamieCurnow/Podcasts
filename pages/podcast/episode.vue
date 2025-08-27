<template>
  <div
    v-if="(status === 'success' || status === 'refreshing') && podcast && episode"
    class="flex flex-col gap-2 pt-4 bg-neutral-50 dark:bg-neutral-900 pb-40"
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
    <div v-if="podcast" class="flex flex-col gap-6 px-4 pt-3">
      <!-- img and title -->
      <NuxtLink :to="`/podcast?url=${encodeURIComponent(podcast.feedUrl)}`" class="flex gap-3 no-underline">
        <!-- img -->
        <div>
          <PodCover :img="podcast.image?.url || podcast.itunesImage" class="size-16" />
        </div>
        <!-- title -->
        <div class="flex flex-col gap-1">
          <!-- title -->
          <div class="text-md font-semibold">{{ podcast.title || podcast.itunesSubtitle }}</div>
          <!-- author -->
          <div class="text-xs font-light">{{ podcast.itunesAuthor || '' }}</div>
        </div>
      </NuxtLink>
    </div>
    <!-- date and title -->
    <div class="flex flex-col px-4 pt-2 gap-2">
      <!-- date -->
      <div class="text-xs font-light">{{ episodeDateNormal }}</div>
      <!-- title -->
      <div class="text-xl font-semibold">{{ episode.title }}</div>
    </div>
    <!-- playing -->
    <div class="pt-2 px-4">
      <PodPlayRow :episode="episode" :podcast="podcast" />
    </div>
    <!-- chapters -->
    <div class="pt-4 px-4">
      <PodcastChapters :episode="episode" :podcast="podcast" />
    </div>
    <!-- people -->
    <div v-if="episode.persons?.length" class="pt-4 px-4">
      <PodcastPeople :people="episode.persons" />
    </div>
    <!-- description -->
    <div
      class="pt-2 px-4 text-sm whitespace-pre-wrap"
      v-html="episode.contentEncoded || episode.description"
    />
    <!-- funding -->
    <div v-if="podcast.funding?.length" class="pt-4 px-4">
      <PodcastFunding :podcast="podcast" />
    </div>
  </div>
  <div v-if="status === 'error'">{{ error }}</div>
  <FullScreenLoading v-if="status === 'loading'" />
</template>

<script setup lang="ts">
import type { Episode, Podcast } from '~/types/index'
import PodPlayRow from '~/components/PodPlayRow.vue'
import { useUserConfigStore } from '~/stores/userConfigStore'
import { storeToRefs } from 'pinia'

definePageMeta({ layout: 'default', keepalive: true })

// const iconColors = 'text-neutral-500 dark:text-neutral-400'

const url = computed(() => useRoute().query.url as string)
const episodeGuid = computed(() => useRoute().query.episodeGuid as string)

const podcast = ref<Podcast | undefined>(undefined)
const episode = ref<Episode | undefined>(undefined)
const error = ref<string | undefined>(undefined)

const userConfigStore = useUserConfigStore()
const { amountOfPodsToInitiallyFetch } = storeToRefs(userConfigStore)

const episodeDateNormal = computed(() => {
  if (!episode.value) return ''
  const date = new Date(episode.value.pubDate)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
})

const status = ref<'success' | 'error' | 'loading' | 'refreshing'>('loading')
const getData = async () => {
  try {
    status.value = 'loading'
    podcast.value = undefined
    episode.value = undefined
    let start = 0
    let foundEpisode: Episode | undefined
    let fetchedPodcast: Podcast | undefined

    while (!foundEpisode) {
      const res = await $fetch(`/api/podcast/feed`, {
        method: 'GET',
        query: { url: url.value, start, limit: amountOfPodsToInitiallyFetch.value }
      })

      if (!fetchedPodcast) {
        fetchedPodcast = res.podcast
      }

      if (res.episodes && res.episodes.length > 0) {
        foundEpisode = res.episodes.find((e) => e.guid === episodeGuid.value)
        if (foundEpisode) {
          break
        }
        start += amountOfPodsToInitiallyFetch.value
      } else {
        // No more episodes
        break
      }
    }

    if (fetchedPodcast && foundEpisode) {
      podcast.value = fetchedPodcast
      episode.value = foundEpisode
      status.value = 'success'
    } else if (fetchedPodcast) {
      // podcast loaded but not episode
      podcast.value = fetchedPodcast
      status.value = 'error'
      error.value = 'Episode not found.'
    } else {
      status.value = 'error'
      error.value = `Failed to fetch podcast for ${url.value}`
    }
  } catch (e) {
    status.value = 'error'
    console.error(`Failed to fetch ${url.value}`)
    error.value = `Failed to fetch ${url.value}`
    console.error(e)
  }
}

watch(
  [url, episodeGuid],
  () => {
    getData()
  },
  { immediate: true }
)
</script>
