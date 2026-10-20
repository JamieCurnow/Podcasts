<template>
  <div class="flex flex-col items-center px-8 pt-20 text-center animate-enter">
    <UIcon :name="icon" class="mb-4 size-14 text-neutral-300 dark:text-neutral-600" />
    <div class="text-xl font-medium text-neutral-500 dark:text-neutral-400">{{ title }}</div>
    <div v-if="body" class="mt-2 max-w-xs text-sm text-neutral-400 dark:text-neutral-500">{{ body }}</div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  body?: string
}>()
</script>
