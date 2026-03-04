<template>
  <NuxtLink :to="podcastRoute" class="cursor-pointer no-underline!">
    <div class="flex gap-2 justify-center">
      <div v-if="!noCover">
        <PodCover less-rounded class="w-10 mt-1" :img="episodeImage" />
      </div>
      <div class="flex flex-col grow" :class="{ 'flex-col-reverse': subHeaderAbove }">
        <div v-if="!noTitle" class="text-base dark:font-light">{{ podTitle }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">{{ subText }}</div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Episode, Podcast } from '~~/shared/types/index'
import type { PropType } from 'vue'
import PodCover from './PodCover.vue'

const props = defineProps({
  episode: { type: Object as PropType<Episode>, required: true },
  podcast: { type: Object as PropType<Podcast>, required: true },
  subHeader: { type: String as PropType<'timeAgo' | 'date' | 'podcastTitle'>, default: '' },
  subHeaderAbove: Boolean,
  noTitle: Boolean,
  noCover: Boolean
})

const { title: podTitle, podcastRoute } = usePodcast(() => props.podcast)
const { image: episodeImage, relativeDate, formattedDate } = useEpisode(() => props.episode, () => props.podcast)

const localPublishedDate = computed(() => {
  if (!props.episode.pubDate) return ''
  const date = new Date(props.episode.pubDate)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
})

const subText = computed(() => {
  if (props.subHeader === 'timeAgo') return relativeDate.value
  if (props.subHeader === 'date') return localPublishedDate.value
  if (props.subHeader === 'podcastTitle') return podTitle.value
})
</script>
