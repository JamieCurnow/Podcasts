<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between px-4">
      <div class="font-bold text-lg">Subscriptions</div>
      <!-- <div>
        <NuxtLink to="/library" class="no-underline">More</NuxtLink>
      </div> -->
    </div>
    <div class="w-full max-w-full overflow-x-scroll pb-3">
      <div class="flex gap-3 min-w-max first:pl-4 last:pr-4">
        <div v-for="(pod, i) in podsWithImages" :key="i">
          <NuxtLink
            :to="`/podcast?url=${encodeURIComponent(pod.podcast.feedUrl)}`"
            class="cursor-pointer no-underline"
          >
            <PodCover :img="pod.img" class="w-24" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Podcast } from '~/types/Podcast'

const props = defineProps({
  podcasts: {
    type: Array as PropType<Podcast[]>,
    required: true
  }
})

const getImg = (pod: Podcast) => pod.image?.url || pod.itunesImage
const podsWithImages = computed(() =>
  props.podcasts.map((podcast) => ({ podcast, img: getImg(podcast) })).filter((x) => x.img)
)
</script>
