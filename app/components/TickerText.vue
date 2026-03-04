<template>
  <div ref="container" class="w-full overflow-hidden whitespace-nowrap">
    <div ref="track" :class="{ 'animate-ticker': isOverflowing }" class="inline-block">
      <span class="inline-block" :class="{ 'pr-16': isOverflowing }">{{ text }}</span>
      <span v-if="isOverflowing" class="inline-block pr-16" aria-hidden="true">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string
}>()

const container = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const isOverflowing = ref(false)

const checkOverflow = () => {
  if (!container.value || !track.value) return
  // temporarily disable animation to measure natural width
  isOverflowing.value = false
  nextTick(() => {
    if (container.value && track.value) {
      isOverflowing.value = track.value.scrollWidth > container.value.clientWidth
    }
  })
}

onMounted(() => {
  checkOverflow()
  window.addEventListener('resize', checkOverflow)
})

watch(
  () => props.text,
  () => nextTick(checkOverflow)
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkOverflow)
})
</script>

<style>
@keyframes ticker-animation {
  0% {
    transform: translateX(0);
  }
  80% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-ticker {
  animation: ticker-animation 15s linear infinite;
}
</style>
