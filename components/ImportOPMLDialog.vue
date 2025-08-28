<template>
  <UModal v-model="open" :overlay="true">
    <UCard>
      <div>
        <div class="mb-4">
          <div class="text-lg font-semibold">Import Pods</div>
          <div><p>Import your podcast subscriptions from an OPML file</p></div>
        </div>
        <div v-if="!file">
          <input type="file" accept=".opml,.xml" ref="fileInput" @change="onFileChange" class="hidden" />
          <UButton
            v-if="fileInput"
            size="lg"
            color="primary"
            @click="fileInput.click()"
            icon="i-heroicons-document-plus"
          >
            Select OPML File
          </UButton>
        </div>
        <div v-if="file">
          <div v-if="loading">
            <Loading class="size-16" />
          </div>
          <div v-else class="flex flex-col gap-4">
            <div>Pods to import:</div>
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
                :loading="importing"
                size="lg"
                :disabled="noSelected"
                @click="importSelected"
                color="green"
              >
                Import
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const open = defineModel({ type: Boolean, required: true })
const subStore = useSubsStore()

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
  }
}

watch(open, (val) => {
  if (!val) {
    file.value = null
    podcasts.value = []
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
})

const podcasts = ref<(Podcast & { selected: boolean })[]>([])

const noSelected = computed(() => !podcasts.value.some((pod) => pod.selected))

const deselectAll = () => {
  podcasts.value.forEach((pod) => (pod.selected = false))
}

const selectAll = () => {
  podcasts.value.forEach((pod) => (pod.selected = true))
}

const importing = ref(false)
const importSelected = () => {
  const selected = podcasts.value.filter((pod) => pod.selected)
  const selectedUrls = selected.map((pod) => pod.feedUrl)

  selectedUrls.forEach((url) => subStore.addSubscription(url))
  open.value = false
  useRouter().push('/library')
}

const loading = ref(false)

watch(file, async (val) => {
  if (val) {
    loading.value = true
    const fileContent = await val.text()
    const newUrls = parseOpml(fileContent)
    const maybePods = await Promise.all(
      newUrls.map((url) => $fetch('/api/podcast/feed', { query: { url, limit: 1 } }).catch(() => null))
    )
    const pods = maybePods.map((res) => res?.podcast).filter((pod): pod is Podcast => !!pod)
    const uniquePods = pods.reduce((acc, pod) => {
      if (!acc.find((p) => p.feedUrl === pod.feedUrl)) {
        acc.push(pod)
      }
      return acc
    }, [] as Podcast[])
    podcasts.value = uniquePods.map((pod) => ({ ...pod, selected: true }))
    loading.value = false
  }
})
</script>
