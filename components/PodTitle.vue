<template>
  <NuxtLink :to="`/podcast?url=${encodeURIComponent(podcast.feedUrl)}`" class="cursor-pointer no-underline">
    <div class="flex gap-2 justify-center">
      <div v-if="!noCover">
        <PodCover less-rounded class="w-10 mt-1" :img="img" />
      </div>
      <div class="flex flex-col grow" :class="{ 'flex-col-reverse': subHeaderAbove }">
        <div v-if="!noTitle" class="text-base dark:font-light">{{ title }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">{{ subText }}</div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Episode, Podcast } from '~/types/index'
import type { PropType } from 'vue'
import PodCover from './PodCover.vue'
import { decode } from 'html-entities'

const props = defineProps({
  episode: { type: Object as PropType<Episode>, required: true },
  podcast: { type: Object as PropType<Podcast>, required: true },
  subHeader: { type: String as PropType<'timeAgo' | 'date' | 'podcastTitle'>, default: '' },
  subHeaderAbove: Boolean,
  noTitle: Boolean,
  noCover: Boolean
})

const dayjs = useDayjs()

const title = computed(() => decode(props.podcast.title) || 'No Title')
const img = computed(() => props.episode.itunesImage || props.podcast.image?.url || props.podcast.itunesImage)
const publishedDate = computed(() => props.episode.pubDate)
const localPublishedDate = computed(() => {
  const date = new Date(publishedDate.value)
  // date in DD MMM YY format
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
})
const podcastTitle = computed(() => decode(props.podcast.title))

const getPlural = (value: number, text: string) => {
  return `${value} ${text}${value > 1 ? 's' : ''} ago`
}

const timeAgo = computed(() => {
  const now = dayjs().startOf('day')
  const pastDate = dayjs(publishedDate.value).startOf('day')

  let text = ''

  const days = now.diff(pastDate, 'day')
  const weeks = now.diff(pastDate, 'week')
  const months = now.diff(pastDate, 'month')
  const years = now.diff(pastDate, 'year')

  // check if the future date is today or has already passed
  if (days <= 0) {
    text = 'Today'
  } else if (years > 0) {
    text = getPlural(years, 'year')
  } else if (months > 0) {
    text = getPlural(months, 'month')
  } else if (weeks > 0) {
    text = getPlural(weeks, 'week')
  } else {
    text = getPlural(days, 'day')
  }

  return { text, days, weeks, months, years }
})

const subText = computed(() => {
  if (props.subHeader === 'timeAgo') {
    return timeAgo.value.text
  } else if (props.subHeader === 'date') {
    return localPublishedDate.value
  } else if (props.subHeader === 'podcastTitle') {
    return podcastTitle.value
  }
})
</script>
