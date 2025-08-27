<template>
  <UModal v-model="open">
    <UCard>
      <div class="flex flex-col gap-4">
        <div class="text-xl font-semibold">Subscriptions</div>
        <div v-if="loading">
          <Loading class="size-16" />
        </div>
        <div v-else class="flex flex-col gap-4">
          <div class="flex flex-wrap gap-4 justify-center">
            <div v-for="pod in podcasts" :key="pod.url" class="relative">
              <button
                class="absolute -top-2 -right-2 rounded-full bg-red-500 size-6 flex justify-center items-center"
                @click="removePod(pod.url)"
              >
                <UIcon name="i-mdi-close"></UIcon>
              </button>
              <PodCover :img="pod.podcast.image?.url || pod.podcast.itunesImage" class="w-24" />
            </div>
          </div>
          <Divider />
          <div class="flex flex-col gap-2">
            <UInput v-model="urlToAdd" size="xl" placeholder="Add a new RSS feel url here"></UInput>
            <UButton :loading="addingFeed" block size="xl" color="primary" @click="addFeed()">
              Add Subscription
            </UButton>
          </div>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { PodcastResponse } from '~/types/PodcastResponse'

defineProps({
  modelValue: Boolean
})

const open = defineModel('modelValue', { type: Boolean })

const { urls } = storeToRefs(useSubsStore())

const podcasts = ref<(PodcastResponse & { url: string })[]>([])

const removePod = (url: string) => {
  if (!urls.value) return
  const urlI = urls.value.indexOf(url)
  const podcastI = podcasts.value.findIndex((pod) => pod.url === url)
  if (urlI !== -1) urls.value.splice(urlI, 1)
  if (podcastI !== -1) podcasts.value.splice(podcastI, 1)
}

const loading = ref(false)
const getPods = async (opts?: { dontSetLoading?: boolean }) => {
  if (!urls.value) return
  const dontSetLoading = opts?.dontSetLoading
  try {
    if (!dontSetLoading) loading.value = true
    const maybePods = await Promise.all(
      urls.value.map((url) =>
        $fetch(`/api/podcast/feed`, {
          method: 'GET',
          params: { url, start: 0, limit: 0 }
        })
          .then((pod) => ({ url, ...pod }))
          .catch(() => undefined)
      )
    )
    const pods = maybePods.filter(
      (pod) => pod !== undefined && pod.podcast !== undefined
    ) as (PodcastResponse & { url: string })[]

    podcasts.value = pods
    loading.value = false
  } catch (e) {
    console.error(e)
    loading.value = false
  }
}

watch(open, (val) => {
  if (val) {
    getPods()
  }
})

const addingFeed = ref(false)
const urlToAdd = ref('')
const addFeed = async () => {
  try {
    addingFeed.value = true
    const url = urlToAdd.value
    if (!url) return
    if (urls.value?.includes(url)) return
    if (!urls.value) urls.value = []
    urls.value.push(url)
    await getPods({ dontSetLoading: true })
    addingFeed.value = false
    urlToAdd.value = ''
  } catch (e) {
    console.error(e)
    addingFeed.value = false
  }
}
</script>
