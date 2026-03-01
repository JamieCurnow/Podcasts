<template>
  <div
    :class="{ 'opacity-0 pointer-events-none': !isOpen }"
    class="fixed justify-center items-center flex h-screen transition-opacity duration-300 ease-out w-screen top-0 left-0 backdrop-blur-md z-50 bg-neutral-900/50"
    @click.self="model = false"
  >
    <div
      :class="{
        'translate-y-full': !isPoppedUp,
        'duration-300 ease-in-out transition-transform': addAnimation
      }"
      :style="{
        transform:
          !preventSwipe && isSwiping && direction === 'down' && lengthY < 0
            ? `translateY(${Math.abs(lengthY)}px)`
            : undefined,
        height
      }"
      class="flex max-w-4xl justify-center transform-gpu flex-col fixed bottom-0 z-50 rounded-t-3xl w-full bg-neutral-50 dark:bg-neutral-800 shadow-lg"
      @touchstart.stop
    >
      <div ref="dialogEl" class="flex-1 flex flex-col">
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

const dialogEl = ref<HTMLDivElement | null>(null)
const { isSwiping, direction, lengthY } = useSwipe(dialogEl, { threshold: 1 })
watch([isSwiping, direction, lengthY], ([isSwiping, direction, lengthY]) => {
  if (props.preventSwipe) return
  if (isSwiping && direction === 'down' && Math.abs(lengthY) > swipeDownBeforeCloseAmount.value) {
    model.value = false
  }
})

const addAnimation = ref(true)
watch(
  model,
  (val) => {
    setTimeout(() => {
      addAnimation.value = !val
    }, 500)
  },
  { immediate: true }
)

const isOpen = ref(false)
const isPoppedUp = ref(false)
watch(model, (val) => {
  if (val) {
    disableScroll()
    isOpen.value = true
    setTimeout(() => {
      isPoppedUp.value = true
    }, 100)
  } else {
    isPoppedUp.value = false
    setTimeout(() => {
      isOpen.value = false
    }, 200)
    setTimeout(() => {
      enableScroll()
    }, 600)
  }
})

const { bodyScrollLock } = storeToRefs(useGlobalStateStore())

const disableScroll = () => {
  document.body.classList.add('disable-scroll')
  bodyScrollLock.value = true
}

const enableScroll = () => {
  document.body.classList.remove('disable-scroll')
  bodyScrollLock.value = false
}
</script>
