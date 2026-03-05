<template>
  <SlideUpDialog v-model="dialog" height="420px">
    <div class="flex flex-col p-4">
      <div class="self-center">
        <UIcon name="i-ic-round-horizontal-rule" class="size-10 text-neutral-300 dark:text-neutral-600" />
      </div>
      <h3 class="mb-4 text-center text-lg font-semibold">Sleep timer</h3>

      <!-- Active state: countdown -->
      <template v-if="sleepTimerStore.isActive">
        <div class="flex flex-1 flex-col items-center justify-center gap-4 pt-8">
          <div class="text-5xl font-bold tabular-nums">
            {{ sleepTimerStore.mode === 'endOfEpisode' ? '∞' : sleepTimerStore.remainingFormatted }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">
            {{
              sleepTimerStore.mode === 'endOfEpisode'
                ? 'Until end of episode'
                : `${sleepTimerStore.selectedMinutes} min timer`
            }}
          </div>
        </div>
        <div class="mt-12 flex w-full justify-center">
          <UButton size="lg" variant="ghost" color="error" @click="sleepTimerStore.cancel()"> Cancel timer </UButton>
        </div>
      </template>

      <!-- Inactive state: wheel picker -->
      <template v-else>
        <div class="relative mx-auto w-full max-w-[200px]">
          <!-- Center selection indicator -->
          <div
            class="pointer-events-none absolute left-0 right-0 top-1/2 z-10 -translate-y-1/2 h-[40px] border-y border-neutral-300 dark:border-neutral-600"
          />
          <!-- Scroll container -->
          <div
            ref="scrollContainer"
            class="scrollbar-hide h-[200px] overflow-y-auto overflow-x-hidden snap-y snap-mandatory"
            @scroll="onScroll"
            @touchstart.stop
            @touchmove.stop
          >
            <!-- Top spacer -->
            <div class="h-[80px]" />
            <!-- Options -->
            <div
              v-for="(option, index) in options"
              :key="option.value"
              class="flex h-[40px] snap-center items-center justify-center will-change-transform"
              :style="getOptionStyle(index)"
            >
              <span class="text-lg font-medium">{{ option.label }}</span>
            </div>
            <!-- Bottom spacer -->
            <div class="h-[80px]" />
          </div>
        </div>

        <div class="mt-6 flex w-full justify-between px-4">
          <UButton size="lg" variant="ghost" icon="i-ic-round-close" @click="dialog = false"> Close </UButton>
          <UButton size="lg" @click="startTimer"> Start </UButton>
        </div>
      </template>
    </div>
  </SlideUpDialog>
</template>

<script setup lang="ts">
import SlideUpDialog from '~/components/SlideUpDialog.vue'

const dialog = defineModel<boolean>()

const sleepTimerStore = useSleepTimerStore()

const options = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '20 min', value: 20 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
  { label: 'End of episode', value: -1 }
]

const scrollContainer = ref<HTMLDivElement | null>(null)
const selectedIndex = ref(0)
const scrollCenter = ref(0)

const onScroll = () => {
  if (!scrollContainer.value) return
  scrollCenter.value = scrollContainer.value.scrollTop / 40
  selectedIndex.value = Math.max(0, Math.min(Math.round(scrollCenter.value), options.length - 1))
}

const getOptionStyle = (index: number) => {
  const distance = Math.min(Math.abs(index - scrollCenter.value), 3)
  const scale = 1.15 - distance * 0.12
  const opacity = Math.max(0.25, 1 - distance * 0.35)
  return {
    transform: `scale(${scale})`,
    opacity
  }
}

const startTimer = () => {
  const option = options[selectedIndex.value]!
  if (option.value === -1) {
    sleepTimerStore.start({ endOfEpisode: true })
  } else {
    sleepTimerStore.start({ minutes: option.value })
  }
}

// Scroll to default position (15 min = index 2) when opening
watch(dialog, (val) => {
  if (val && !sleepTimerStore.isActive) {
    selectedIndex.value = 2
    nextTick(() => {
      scrollContainer.value?.scrollTo({ top: 2 * 40, behavior: 'instant' })
    })
  }
})
</script>
