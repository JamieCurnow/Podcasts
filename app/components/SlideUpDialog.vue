<template>
  <div :class="{ invisible: !isVisible }">
    <!-- backdrop -->
    <div
      :class="isPoppedUp ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      class="fixed inset-0 z-50 touch-none bg-neutral-900/50 backdrop-blur-md transition-opacity duration-300 ease-out"
      @click="model = false"
    />
    <!-- sheet -->
    <div
      role="dialog"
      aria-modal="true"
      :class="{ 'transition-transform duration-500 ease-drawer': !isDragging }"
      :style="{ transform: sheetTransform, height: sheetHeight }"
      class="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[calc(100dvh-env(safe-area-inset-top)-0.5rem)] w-full max-w-4xl touch-none flex-col justify-center overflow-hidden rounded-t-3xl bg-neutral-50 pb-[env(safe-area-inset-bottom)] shadow-lg will-change-transform dark:bg-neutral-800"
      @touchstart.stop
    >
      <div ref="dialogEl" class="flex flex-1 flex-col">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  preventSwipe?: boolean
  height?: string
}>()

const model = defineModel<boolean>()

const { swipeDownBeforeCloseAmount } = storeToRefs(useUserConfigStore())
const { bodyScrollLock } = storeToRefs(useGlobalStateStore())

// the sheet transition length, in ms. Matches duration-500 above
const transitionMs = 500
// px per ms. A quick flick closes the sheet even if it hasn't travelled far
const flickVelocity = 0.11

const sheetHeight = computed(() =>
  props.height ? `calc(${props.height} + env(safe-area-inset-bottom, 0px))` : undefined
)

// isVisible keeps the sheet rendered for its exit, isPoppedUp is the open/closed position
const isVisible = ref(false)
const isPoppedUp = ref(false)

// drag to dismiss
const dialogEl = ref<HTMLDivElement | null>(null)
const dragStartedAt = ref(0)
// read at touchstart: preventSwipe is released on pointerup, which fires before touchend
const dragBlocked = ref(false)
const { isSwiping, direction, lengthY } = useSwipe(dialogEl, {
  threshold: 0,
  onSwipeStart: () => {
    dragStartedAt.value = Date.now()
    dragBlocked.value = !!props.preventSwipe
  },
  onSwipeEnd: () => {
    if (dragBlocked.value || props.preventSwipe) return
    const offset = dragOffset.value
    const velocity = offset / Math.max(1, Date.now() - dragStartedAt.value)
    if (offset > swipeDownBeforeCloseAmount.value || (offset > 10 && velocity > flickVelocity))
      model.value = false
  }
})

const isDragging = computed(() => {
  if (dragBlocked.value || props.preventSwipe || !isSwiping.value) return false
  return direction.value === 'down' || direction.value === 'up'
})

// lengthY is positive when swiping up. Down follows the finger, up gets heavier the further you pull
const dragOffset = computed(() => {
  const offset = -lengthY.value
  if (offset >= 0) return offset
  return -(Math.abs(offset) ** 0.5) * 2
})

const sheetTransform = computed(() => {
  if (isDragging.value) return `translateY(${dragOffset.value}px)`
  return isPoppedUp.value ? 'translateY(0)' : 'translateY(100%)'
})

let closeTimer: ReturnType<typeof setTimeout> | undefined
watch(model, (val) => {
  clearTimeout(closeTimer)
  if (val) {
    disableScroll()
    isVisible.value = true
    // flush styles with the sheet still offscreen so the slide up actually transitions
    nextTick(() => {
      dialogEl.value?.getBoundingClientRect()
      isPoppedUp.value = true
    })
  } else {
    isPoppedUp.value = false
    closeTimer = setTimeout(() => {
      isVisible.value = false
      enableScroll()
    }, transitionMs)
  }
})

const disableScroll = () => {
  document.body.classList.add('disable-scroll')
  bodyScrollLock.value = true
}

const enableScroll = () => {
  document.body.classList.remove('disable-scroll')
  bodyScrollLock.value = false
}
</script>
