<template>
  <div class="h-32 flex justify-center pt-6 w-full bg-neutral-50 dark:bg-neutral-900">
    <!-- fades and turns with the finger, so it reads as connected to the pull -->
    <div
      class="flex flex-col items-center gap-1 text-neutral-500 dark:text-neutral-400"
      :style="{ opacity: refreshing ? 1 : progress }"
    >
      <Loading v-if="refreshing" class="size-6" />
      <UIcon
        v-else
        name="i-mdi-arrow-down"
        class="size-6"
        :style="{ transform: `rotate(${progress * 180}deg)` }"
      />
      <div class="text-sm font-medium">{{ refreshing ? 'Refreshing…' : 'Pull to refresh' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  progress: number
  refreshing: boolean
}>()
</script>
