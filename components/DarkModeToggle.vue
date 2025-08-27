<template>
  <ClientOnly>
    <UButton
      square
      :ui="{ rounded: 'rounded-full' }"
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      :color="isDark ? 'primary' : 'gray'"
      aria-label="Theme"
      :variant="isDark ? 'ghost' : 'soft'"
      @click="isDark = !isDark"
    />

    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(v: boolean) {
    colorMode.preference = v ? 'dark' : 'light'
  }
})
</script>
