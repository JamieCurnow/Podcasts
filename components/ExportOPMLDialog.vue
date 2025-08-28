<template>
  <UModal v-model="open" :overlay="true">
    <UCard>
      <div>
        <div class="mb-4">
          <div class="text-lg font-semibold">Export Pods</div>
          <div><p>Export your podcast subscriptions as OPML</p></div>
        </div>
        <div v-if="loading">
          <Loading class="size-16" />
        </div>
        <div v-else class="flex flex-col gap-4">
          <div>Pods to export:</div>
          <div v-if="!podcasts.length">No podcasts found</div>
          <div v-else>
            <div class="mb-4">
              <UButton v-if="noSelected" variant="outline" @click="selectAll">Select all</UButton>
              <UButton v-else variant="outline" @click="deselectAll">Deselect all</UButton>
            </div>
            <PodcastListItem
              v-for="podcast in podcasts"
              :key="podcast.feedUrl"
              v-model="podcast.selected"
              :podcast="podcast"
            />
          </div>
          <div class="flex justify-end gap-4">
            <UButton size="lg" @click="open = false" color="gray">Cancel</UButton>
            <UButton
              :loading="exporting"
              size="lg"
              :disabled="noSelected"
              @click="exportSelected"
              color="primary"
              icon="i-heroicons-arrow-down-tray"
            >
              Export
            </UButton>
          </div>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const open = defineModel({ type: Boolean, required: true })

const { urls } = storeToRefs(useSubsStore())
const podcasts = ref<(Podcast & { selected: boolean })[]>([])

const noSelected = computed(() => !podcasts.value.some((pod) => pod.selected))

const deselectAll = () => {
  podcasts.value.forEach((pod) => (pod.selected = false))
}

const selectAll = () => {
  podcasts.value.forEach((pod) => (pod.selected = true))
}

const exporting = ref(false)
const exportSelected = async () => {
  try {
    exporting.value = true
    const selectedUrls = podcasts.value.filter((pod) => pod.selected).map((pod) => pod.feedUrl)
    if (!selectedUrls.length) return
    const opml = await createOpml(selectedUrls)
    const blob = new Blob([opml], { type: 'text/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'podcasts.opml.xml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    open.value = false
  } catch (error) {
    console.error('Error exporting OPML:', error)
  } finally {
    exporting.value = false
  }
}

const loading = ref(false)

const { amountOfPodsToInitiallyFetch } = storeToRefs(useUserConfigStore())

watch([open, urls], async ([val, actualUrls]) => {
  console.log('watch', val, actualUrls)
  if (val && actualUrls) {
    loading.value = true
    const maybePods = await Promise.all(
      actualUrls.map((url) =>
        $fetch('/api/podcast/feed', {
          query: { url, start: 0, limit: amountOfPodsToInitiallyFetch.value }
        }).catch(() => null)
      )
    )
    const pods = maybePods.map((res) => res?.podcast).filter((pod): pod is Podcast => !!pod)
    podcasts.value = pods.map((pod) => ({ ...pod, selected: true }))
    loading.value = false
  }
})
</script>
