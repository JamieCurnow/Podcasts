<template>
  <div ref="container" class="relative w-full">
    <div ref="pullContent" class="absolute top-0 left-0 w-full">
      <slot name="pull-content"> </slot>
    </div>

    <div
      class="will-change-transform"
      :class="{ 'transition-transform transform-gpu duration-300 ease-in-out': !shouldPullDown }"
      :style="{ transform: `translateY(${amountToPullDown}px)` }"
    >
      <!-- <div class="absolute top-0 left-0 bg-black/50">
        <p>maxPullAmount: {{ maxPullAmount }}</p>
        <p>amountToPullDown: {{ amountToPullDown }}</p>
        <p>refreshThresholdAmount: {{ refreshThresholdAmount }}</p>
        <p>pullContentHeight: {{ pullContentHeight }}</p>
        <p>hasTriggered: {{ hasTriggered }}</p>
      </div> -->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  disable: {
    type: Boolean,
    default: false
  },
  // controls how hard it "feels" in the ui to pull down a percentage number - 50 = 50%
  pullDownWeight: {
    type: Number,
    default: 0.85
  },
  // px amount to be max pulled down
  // defaults to height of the pull down slot
  maxPull: {
    type: Number,
    default: 0
  },
  // the threshold to trigger the refresh
  // defaults to 80% of the maxPull
  refreshThreshold: {
    type: Number,
    default: 0
  },
  // min close height is the height that the pull down should
  // stop at once released. Useful for keeping it open a bit
  // while refreshing
  minCloseHeight: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits<{
  (key: 'pull', amount: number): void
  (key: 'refresh'): void
  (key: 'releaseAfterRefresh'): void
  (key: 'release'): void
}>()

const container = ref<HTMLElement | null>(null)
const { arrivedState } = useScroll(window)
const hasScrolledToTop = computed(() => arrivedState.top)
const scrollLock = useScrollLock(window)

const { isSwiping, lengthY, direction } = useSwipe(container, { threshold: 1 })

const shouldPullDown = computed(() => {
  return !props.disable && hasScrolledToTop.value && isSwiping.value && direction.value === 'down'
})

const pullContent = ref<HTMLElement | null>(null)
const { height: pullContentHeight } = useElementSize(pullContent)

const maxPullAmount = computed(() => {
  if (props.maxPull) return props.maxPull

  return pullContentHeight.value || 1000
})

const lengthYAtTop = ref(0)
watch(shouldPullDown, (v) => {
  if (v) lengthYAtTop.value = lengthY.value
})

const hasTriggered = ref(false)

const amountToPullDown = computed(() => {
  if (!shouldPullDown.value) return props.minCloseHeight || 0
  const amount = Math.abs(lengthY.value) - Math.abs(lengthYAtTop.value)

  // Use an exponential function for a more natural feel.
  // The resistance increases the further you pull down.
  const dampenedAmount = amount ** props.pullDownWeight
  return Math.min(dampenedAmount, maxPullAmount.value)
})

watch(amountToPullDown, (v) => {
  scrollLock.value = v > 0
  emit('pull', v)
})

const refreshThresholdAmount = computed(() => {
  if (props.refreshThreshold) return props.refreshThreshold
  return maxPullAmount.value * 0.8
})

watchEffect(() => {
  // if we pull down enough, trigger the refresh
  if (amountToPullDown.value >= refreshThresholdAmount.value && !hasTriggered.value) {
    hasTriggered.value = true
    emit('refresh')
  }
})

// if we've triggered the refresh and let go, amount to pull down
// should revert to 0 and we should reset hasTriggered
watchEffect(() => {
  if (!shouldPullDown.value && hasTriggered.value) {
    hasTriggered.value = false
    emit('releaseAfterRefresh')
  }
})

watch(shouldPullDown, (v) => {
  if (!v) emit('release')
})
</script>
