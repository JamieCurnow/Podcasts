<template>
  <div class="pt-10 px-4 pb-40">
    <div v-if="podcasts">
      <div class="flex justify-end mb-4">
        <UButton
          :icon="editing ? 'i-heroicons-check' : 'i-heroicons-pencil-square'"
          :variant="editing ? 'solid' : 'ghost'"
          size="sm"
          :color="editing ? 'success' : 'neutral'"
          @click="editing = !editing"
        >
          {{ editing ? 'Done' : 'Edit' }}
        </UButton>
      </div>

      <!-- Edit mode: list view with drag-to-reorder + unsubscribe -->
      <div v-if="editing" class="flex flex-col gap-2">
        <div
          v-for="(pod, index) in podcasts"
          :key="pod.feedUrl"
          draggable="true"
          class="flex items-center gap-3 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 transition-all duration-150"
          :class="{
            'opacity-50 scale-95': dragIndex === index,
            'border-t-2 border-primary': dropIndex === index && dropIndex !== dragIndex,
            'border-t-2 border-transparent': dropIndex !== index || dropIndex === dragIndex
          }"
          @dragstart="onDragStart($event, index)"
          @dragover.prevent="onDragOver(index)"
          @dragend="onDragEnd"
          @touchstart="onTouchStart($event, index)"
          @touchmove.prevent="onTouchMove"
          @touchend="onTouchEnd"
        >
          <!-- Drag handle -->
          <div class="cursor-grab active:cursor-grabbing text-neutral-400 touch-none">
            <UIcon name="i-heroicons-bars-3" class="size-5" />
          </div>

          <!-- Podcast info -->
          <PodCover :img="pod.image?.url || pod.itunesImage" :width="56" :height="56" />
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium line-clamp-2">{{ pod.title }}</div>
            <div class="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">{{ pod.link }}</div>
          </div>

          <!-- Unsubscribe button -->
          <UButton
            icon="i-heroicons-x-mark"
            color="error"
            variant="ghost"
            size="sm"
            @click="unsubscribe(pod.feedUrl, index)"
          />
        </div>
        <!-- Drop indicator for last position -->
        <div
          v-if="dragIndex !== null"
          class="h-1 rounded transition-all duration-150"
          :class="{
            'bg-primary': dropIndex === podcasts.length,
            'bg-transparent': dropIndex !== podcasts.length
          }"
          @dragover.prevent="onDragOver(podcasts.length)"
        />
      </div>

      <!-- Normal mode: grid view -->
      <SearchPods v-else hide-sub-indicator :podcasts="podcasts" />
    </div>
    <div v-else>
      <FullScreenLoading />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Podcast } from '~~/shared/types/index'
import SearchPods from '~/components/SearchPods.vue'

const subsStore = useSubsStore()
const { urls } = storeToRefs(subsStore)

const { amountOfPodsToInitiallyFetch } = storeToRefs(useUserConfigStore())

const podcasts = ref<Podcast[] | null>(null)
const loading = ref(false)
const editing = ref(false)

// Drag and drop state
const dragIndex = ref<number | null>(null)
const dropIndex = ref<number | null>(null)

const onDragStart = (_e: DragEvent, index: number) => {
  dragIndex.value = index
}

const onDragOver = (index: number) => {
  dropIndex.value = index
}

const onDragEnd = () => {
  if (dragIndex.value !== null && dropIndex.value !== null && dragIndex.value !== dropIndex.value) {
    applyReorder(dragIndex.value, dropIndex.value)
  }
  dragIndex.value = null
  dropIndex.value = null
}

// Touch-based drag for mobile
const touchStartY = ref(0)
const touchItemHeight = ref(0)

const onTouchStart = (e: TouchEvent, index: number) => {
  dragIndex.value = index
  touchStartY.value = e.touches[0]!.clientY
  const target = e.currentTarget as HTMLElement
  touchItemHeight.value = target.offsetHeight + 8 // include gap
}

const onTouchMove = (e: TouchEvent) => {
  if (dragIndex.value === null || !podcasts.value) return
  const currentY = e.touches[0]!.clientY
  const delta = currentY - touchStartY.value
  const indexOffset = Math.round(delta / touchItemHeight.value)
  const newIndex = Math.max(0, Math.min(podcasts.value.length, dragIndex.value + indexOffset))
  dropIndex.value = newIndex
}

const onTouchEnd = () => {
  if (dragIndex.value !== null && dropIndex.value !== null && dragIndex.value !== dropIndex.value) {
    applyReorder(dragIndex.value, dropIndex.value)
  }
  dragIndex.value = null
  dropIndex.value = null
}

const applyReorder = (from: number, to: number) => {
  if (!podcasts.value) return
  // Adjust target index when moving downward since splice shifts items
  const adjustedTo = to > from ? to - 1 : to
  if (from === adjustedTo) return
  subsStore.reorderSubscriptions(from, adjustedTo)
  const item = podcasts.value.splice(from, 1)[0]!
  podcasts.value.splice(adjustedTo, 0, item)
}

const getSubs = async () => {
  try {
    loading.value = true
    const pods = await Promise.all(
      urls.value?.map((url) => {
        return $fetch('/api/podcast/feed', {
          method: 'GET',
          query: { url, start: 0, limit: amountOfPodsToInitiallyFetch.value }
        }).catch(() => null)
      }) || []
    )
    podcasts.value = pods.filter((p) => p?.podcast?.feedUrl).map((x) => x!.podcast)
    loading.value = false
  } catch (e) {
    loading.value = false
    console.error(e)
  }
}

const unsubscribe = (feedUrl: string, index: number) => {
  subsStore.removeSubscription(feedUrl)
  podcasts.value?.splice(index, 1)
}

onMounted(() => {
  getSubs()
})
</script>
