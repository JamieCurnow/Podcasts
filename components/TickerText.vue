<template>
  <div ref="container" class="w-full overflow-hidden whitespace-nowrap">
    <span ref="textEl" :class="{ 'animate-ticker': isOverflowing }" class="inline-block pl-20">
      {{ text }}
    </span>
    <span
      v-if="isOverflowing"
      :class="{ 'animate-ticker': isOverflowing }"
      class="inline-block pl-20"
      aria-hidden="true"
    >
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string
}>()

const container = ref<HTMLElement | null>(null)
const textEl = ref<HTMLElement | null>(null)
const isOverflowing = ref(false)

const checkOverflow = () => {
  if (container.value && textEl.value) {
    isOverflowing.value = textEl.value.scrollWidth > container.value.clientWidth
  }
}

onMounted(() => {
  checkOverflow()
  window.addEventListener('resize', checkOverflow)
})

watch(
  () => props.text,
  () => {
    nextTick(() => {
      checkOverflow()
    })
  }
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
  90% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-ticker {
  animation: ticker-animation 20s linear infinite;
}
</style>
