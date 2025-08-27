<template>
  <USlideover v-model="isOpen">
    <div class="flex flex-col gap-4">
      <!-- top bar -->
      <div class="px-6 pt-4">
        <!-- back -->
        <div>
          <button @click="isOpen = false">
            <UIcon name="i-ic-close" class="size-7" />
          </button>
        </div>
      </div>

      <!-- menu items -->
      <div class="flex flex-col">
        <NuxtLink
          v-for="(item, i) in menuItems"
          :key="i"
          class="cursor-pointer no-underline"
          :to="item.to"
          @click="isOpen = false"
        >
          <Divider />
          <div class="py-6 flex items-center px-6 gap-6">
            <div class="shrink">
              <UIcon :name="item.icon" class="size-8"></UIcon>
            </div>
            <div class="grow text-xl font-light">
              {{ item.title }}
            </div>
            <div class="shrink">
              <UIcon name="i-ic-baseline-keyboard-arrow-right" class="size-8"></UIcon>
            </div>
          </div>
          <Divider v-if="i === menuItems.length - 1" />
        </NuxtLink>
      </div>
    </div>
  </USlideover>
</template>

<script setup lang="ts">
const isOpen = defineModel({ type: Boolean, default: false })
const menuItems = [
  { icon: 'i-ic-baseline-subscriptions', title: 'Subscriptions', to: '/library' },
  { icon: 'i-ic-baseline-playlist-add', title: 'Queue', to: '/queue' },
  { icon: 'i-mdi-bookmark-multiple-outline', title: 'Bookmarks', to: '/bookmarks' },
  { icon: 'i-ic-baseline-arrow-circle-down', title: 'Downloads', to: '/downloads' },
  { icon: 'i-ic-baseline-history', title: 'History', to: '/history' },
  { icon: 'i-ic-baseline-settings', title: 'Settings', to: '/settings' }
]
</script>
