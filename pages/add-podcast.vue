<template>
  <div class="p-4 pt-10">
    <h1 class="text-2xl font-semibold mb-4">Add {{ urls?.length ? 'a new' : 'your first' }} Podcast</h1>
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <UInput
          v-model="rssUrl"
          placeholder="Enter podcast RSS feed URL"
          size="xl"
          class="w-full"
          :disabled="loading"
          autofocus
          icon="i-mdi-rss-box"
          @keyup.enter="addPodcast"
        />
        <UButton
          variant="solid"
          icon="i-ic-baseline-add"
          square
          size="xl"
          :loading="loading"
          @click="addPodcast"
        />
      </div>
      <div v-if="error" class="text-red-500 mt-2">
        {{ error }}
      </div>
      <div class="text-neutral-500 dark:text-neutral-400 mt-4 space-y-2">
        <p>
          You can usually find the RSS feed URL on the podcast's website. Look for a link that says "RSS",
          "Subscribe", or has the RSS icon <UIcon name="i-mdi-rss-box" class="size-4" />.
        </p>
        <p>
          You can also use <a href="https://podcastindex.org/" target="_blank">Podcast Index</a> to find
          podcast RSS feeds. Look out for the "Copy RSS" button on podcast pages.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSubsStore } from '~/stores/subsStore'

const rssUrl = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const subsStore = useSubsStore()
const { urls } = storeToRefs(subsStore)
const router = useRouter()

const addPodcast = async () => {
  if (!rssUrl.value) {
    error.value = 'Please enter a URL.'
    return
  }

  loading.value = true
  error.value = null

  try {
    const { amountOfPodsToInitiallyFetch } = storeToRefs(useUserConfigStore())

    // we don't need the response, just to check if it's a valid feed
    await $fetch('/api/podcast/feed', {
      query: { url: rssUrl.value, limit: amountOfPodsToInitiallyFetch.value }
    })

    subsStore.addSubscription(rssUrl.value)
    router.push(`/podcast?url=${encodeURIComponent(rssUrl.value)}`)
  } catch (e: any) {
    error.value = 'Failed to add podcast. Please check the RSS feed URL.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const encodedFeedUrl = useRoute().query.url
  if (encodedFeedUrl && typeof encodedFeedUrl === 'string') {
    rssUrl.value = decodeURIComponent(encodedFeedUrl)
    addPodcast()
  }
})
</script>
