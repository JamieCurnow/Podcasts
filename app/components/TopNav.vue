<template>
  <div class="flex gap-2 h-20 items-center px-2">
    <div class="w-16 flex justify-start">
      <DarkModeToggle />
    </div>
    <div class="flex flex-col grow items-center justify-center">
      <ClientOnly>
        <NuxtLink to="/">
          <img :src="logo" alt="logo" class="h-20 -rotate-90" />
        </NuxtLink>
      </ClientOnly>
    </div>
    <div class="w-16 flex justify-end">
      <ClientOnly>
        <UButton
          square
          :ui="{ base: 'rounded-full!' }"
          icon="i-mdi-menu"
          :color="isDark ? 'primary' : 'neutral'"
          aria-label="menu"
          variant="ghost"
          @click="menuOpen = !menuOpen"
        />

        <template #fallback>
          <div class="w-8 h-8" />
        </template>
      </ClientOnly>
    </div>
    <NavMenu v-model="menuOpen" />
  </div>
</template>

<script setup lang="ts">
const isDark = computed(() => useColorMode().value === 'dark')
const logo = computed(() => {
  return useColorMode().value === 'dark' ? '/logo-light-no-bg.svg' : '/logo-dark-no-bg.svg'
})

const menuOpen = ref(false)
</script>
