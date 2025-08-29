<template>
  <div class="max-w-4xl mx-auto">
    <TopNav v-if="topNavPaths.includes(currentPath)" />
    <ClientOnly>
      <CurrentPodcastDialog />
    </ClientOnly>
    <slot />
    <ClientOnly>
      <NowPlayingBar />
    </ClientOnly>
    <BottomNav />

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const currentPath = computed(() => useRoute().path)
const topNavPaths = [
  '/',
  '/start',
  '/add-podcast',
  '/library',
  '/bookmarks',
  '/queue',
  '/downloads',
  '/history',
  '/settings',
  '/import'
]
</script>
