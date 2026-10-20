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
      <!-- TransitionGroup slides rows into their new place on reorder and fades out unsubscribes -->
      <TransitionGroup
        v-if="editing"
        tag="div"
        class="relative flex flex-col gap-2 animate-enter"
        move-class="transition-transform duration-200 ease-out"
        leave-active-class="absolute inset-x-0 transition-[opacity,scale] duration-150 ease-out"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-for="(pod, index) in podcasts"
          :key="pod.feedUrl"
          data-row
          draggable="true"
          class="flex items-center gap-3 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border-t-2 transition-[opacity,scale,border-color,box-shadow] duration-150 ease-out"
          :class="{
            'opacity-50 scale-95': dragIndex === index && touchDelta === null,
            'relative z-10 scale-[1.02] shadow-lg': dragIndex === index && touchDelta !== null,
            'border-primary': dropIndex === index && dropIndex !== dragIndex,
            'border-transparent': dropIndex !== index || dropIndex === dragIndex
          }"
          :style="
            dragIndex === index && touchDelta !== null
              ? { transform: `translateY(${touchDelta}px)` }
              : undefined
          "
          @dragstart="onDragStart($event, index)"
          @dragover.prevent="onDragOver(index)"
          @dragend="onDragEnd"
        >
          <!-- Drag handle: touch drags start here only, so the rest of the row still scrolls the page -->
          <div
            class="cursor-grab active:cursor-grabbing text-neutral-400 touch-none p-2 -m-2"
            @touchstart="onTouchStart($event, index)"
            @touchmove.prevent="onTouchMove"
            @touchend="onTouchEnd"
            @touchcancel="onTouchEnd"
          >
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
            :aria-label="`Unsubscribe from ${pod.title}`"
            @click="unsubscribe(pod.feedUrl, index)"
          />
        </div>
        <!-- Drop indicator for last position -->
        <div
          v-if="dragIndex !== null"
          key="drop-end"
          class="h-1 rounded transition-colors duration-150"
          :class="{
            'bg-primary': dropIndex === podcasts.length,
            'bg-transparent': dropIndex !== podcasts.length
          }"
          @dragover.prevent="onDragOver(podcasts.length)"
        />
      </TransitionGroup>

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

// Touch-based drag for mobile. The row follows the finger (touchDelta) while dragging
const touchStartY = ref(0)
const touchItemHeight = ref(0)
const touchDelta = ref<number | null>(null)

const onTouchStart = (e: TouchEvent, index: number) => {
  if (dragIndex.value !== null) return // ignore a second finger mid-drag
  dragIndex.value = index
  touchDelta.value = 0
  touchStartY.value = e.touches[0]!.clientY
  const row = (e.currentTarget as HTMLElement).closest('[data-row]') as HTMLElement | null
  touchItemHeight.value = (row?.offsetHeight || 0) + 8 // include gap
}

const onTouchMove = (e: TouchEvent) => {
  if (dragIndex.value === null || !podcasts.value || !touchItemHeight.value) return
  const delta = e.touches[0]!.clientY - touchStartY.value
  touchDelta.value = delta
  const indexOffset = Math.round(delta / touchItemHeight.value)
  // dropIndex means "insert before", so moving down k rows targets the row after the k-th
  const target = indexOffset > 0 ? dragIndex.value + indexOffset + 1 : dragIndex.value + indexOffset
  dropIndex.value = Math.max(0, Math.min(podcasts.value.length, target))
}

const onTouchEnd = () => {
  if (dragIndex.value !== null && dropIndex.value !== null && dragIndex.value !== dropIndex.value) {
    applyReorder(dragIndex.value, dropIndex.value)
  }
  dragIndex.value = null
  dropIndex.value = null
  touchDelta.value = null
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
