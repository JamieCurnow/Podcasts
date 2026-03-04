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
    <NuxtLink :to="episodeRoute!" class="cursor-pointer no-underline!">
      <div class="font-medium">{{ title }}</div>
      <div class="text-sm line-clamp-2 leading-tight font-light" v-html="description"></div>
    </NuxtLink>
    <PodPlayRow :episode="episode" :podcast="podcast" :extra-menu-items="extraMenuItems" class="py-1" />
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '#ui/types'
import type { Episode, Podcast } from '~~/shared/types/index'
import type { PropType } from 'vue'

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
  noTitle: Boolean,
  extraMenuItems: {
    type: Array as PropType<DropdownMenuItem[]>,
    default: () => []
  }
})

const { title, description, episodeRoute } = useEpisode(
  () => props.episode,
  () => props.podcast
)
</script>
