<template>
  <div class="flex flex-col py-2 gap-4">
    <div>
      <PodTitle
        :episode="episode"
        :podcast="podcast"
        :sub-header="subHeader || 'timeAgo'"
        :no-cover="noCover"
        :no-title="noTitle"
      />
    </div>
    <NuxtLink
      :to="`/podcast/episode?url=${encodeURIComponent(podcast.feedUrl)}&episodeGuid=${encodeURIComponent(episode.guid) || ''}`"
      class="cursor-pointer no-underline"
    >
      <div class="font-medium">{{ title }}</div>
      <div class="text-sm line-clamp-2 leading-tight font-light" v-html="description"></div>
    </NuxtLink>
    <PodPlayRow :episode="episode" :podcast="podcast" class="py-1" />
  </div>
</template>

<script setup lang="ts">
import type { Episode, Podcast } from '~/types/index'
import type { PropType } from 'vue'
import { decode } from 'html-entities'

const props = defineProps({
  episode: {
    type: Object as PropType<Episode>,
    required: true
  },
  podcast: {
    type: Object as PropType<Podcast>,
    required: true
  },
  subHeader: {
    type: String as PropType<'timeAgo' | 'date' | 'podcastTitle'>,
    default: ''
  },
  noCover: Boolean,
  noTitle: Boolean
})

const description = computed(() => props.episode.description || props.episode.itunesSummary)
const title = computed(
  () =>
    decode(props.episode.title) ||
    decode(props.episode.itunesTitle) ||
    decode(props.episode.itunesSubtitle) ||
    'No Title'
)
</script>
