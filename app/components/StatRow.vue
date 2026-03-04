<template>
  <div class="flex items-center justify-between py-2">
    <div class="text-sm text-neutral-600 dark:text-neutral-400">{{ label }}</div>
    <div class="text-sm font-medium">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>
