<template>
  <div>
    <button
      class="text-left h-10 w-full flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 hover:opacity-80 px-3 py-1"
      :class="{ 'rounded-md': !chaptersOpen, 'rounded-t-md': chaptersOpen }"
      @click="toggleChapters()"
      v-if="chaptersAvailable"
    >
      <div>Chapters</div>
      <div v-if="!gettingChapters">
        <UIcon
          name="i-ic-outline-arrow-drop-down"
          class="size-5 mt-1"
          :class="{ 'rotate-180': chaptersOpen }"
        />
      </div>
      <div v-else>
        <Loading class="size-5" />
      </div>
    </button>
    <div v-if="chaptersOpen" class="flex flex-col gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-b-md">
      <PodcastChapter
        v-for="(chapter, i) in chapters"
        :key="i"
        :chapter="chapter"
        :index="i"
        :episode="episode"
        :podcast="podcast"
        class="border-b border-neutral-50 dark:border-neutral-900 last:border-0 first:pt-3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Episode } from '~/types/index'
import type { PodcastChapterJson, PodcastChapterJsonChapter } from '~/types/PodcastChapterJson'

// cache chapters for long - they are not likely to change. 1 week?
const CHAPTERS_CACHE_MAX_AGE_SECONDS = 604800 // 1 week

const props = defineProps({
  episode: {
    type: Object as PropType<Episode>,
    required: true
  },
  podcast: {
    type: Object as PropType<Podcast>,
    required: true
  }
})

const chapters = ref<PodcastChapterJsonChapter[]>([])

// if the chapters are a URL to a JSON file, return that URL
// we'll use it to fetch the chapters later. This is podcast:chapters spec
const chaptersUrl = computed(() => {
  const url = props.episode.chapters?.podcastChapter?.url || ''
  const type = props.episode.chapters?.podcastChapter?.type
  if (type?.includes('json')) {
    return url
  } else {
    return ''
  }
})

const pscChapterToPodcastJsonChapter = (pscChapter: { start: string; title?: string; href?: string }) => {
  return {
    startTime: parseInt(pscChapter.start, 10),
    title: pscChapter.title,
    url: pscChapter.href
  }
}

const pscChapters = computed(() => {
  return props.episode.chapters?.pscChapters || []
})

const chaptersAvailable = computed(() => {
  return chaptersUrl.value || pscChapters.value.length > 0
})

const chaptersOpen = ref(false)

const gettingChapters = ref(false)
const getChapters = async () => {
  try {
    // if there's no remote chapters URL, use the pscChapters from the feed
    if (!chaptersUrl.value) {
      chapters.value = pscChapters.value.map(pscChapterToPodcastJsonChapter)
      return
    }

    // otherwise, fetch the chapters from the remote URL
    gettingChapters.value = true
    const proxyUrl = getProxyUrl({
      url: chaptersUrl.value,
      cacheMaxAgeSeconds: CHAPTERS_CACHE_MAX_AGE_SECONDS
    })
    const res = await $fetch<PodcastChapterJson>(proxyUrl)
    if (res?.chapters && Array.isArray(res.chapters)) {
      chapters.value = res.chapters
    } else {
      throw new Error('Invalid chapters format')
    }
  } catch (e) {
    console.error('Error fetching chapters:', e)
    useToast().add({
      color: 'red',
      title: 'Error',
      description: 'There was an error fetching the chapters.'
    })

    // try to fall back to pscChapters if available
    if (pscChapters.value.length > 0) {
      chapters.value = pscChapters.value.map(pscChapterToPodcastJsonChapter)
    }
  } finally {
    gettingChapters.value = false
  }
}

const toggleChapters = async () => {
  if (!chaptersOpen.value) {
    await getChapters()
  }
  chaptersOpen.value = !chaptersOpen.value
}
</script>
