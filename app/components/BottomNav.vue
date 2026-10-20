<template>
  <nav
    class="mx-auto fixed flex justify-center bottom-0 left-0 h-[calc(5rem+env(safe-area-inset-bottom))] w-full text-neutral-500 dark:text-neutral-400"
  >
    <div
      class="max-w-4xl w-full flex justify-between bg-neutral-100 dark:bg-neutral-800 px-9 lg:px-20 pt-3 pb-[env(safe-area-inset-bottom)]"
      :class="{ 'lg:rounded-t-lg': audioState === 'idle' }"
    >
      <!-- the whole column is the tap target, not just the icon pill -->
      <button
        v-for="(item, i) in menu"
        :key="i"
        class="group flex flex-col items-center"
        :aria-current="routePath === item.link ? 'page' : undefined"
        @click="$router.push(item.link)"
      >
        <div
          class="flex justify-center items-center w-16 h-8 rounded-full transition-[scale,background-color] duration-150 ease-out group-active:scale-95"
          :class="{ [buttonBg]: routePath === item.link }"
        >
          <UIcon :name="item.icon" class="size-6" />
        </div>
        <div class="text-xs pt-1" :class="{ [textActive]: routePath === item.link }">{{ item.text }}</div>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const routePath = computed(() => useRoute().path)
const { audioState } = storeToRefs(useNowPlayingStore())
const buttonBg = 'dark:bg-neutral-700 bg-neutral-50 text-neutral-600 dark:text-neutral-300'
const textActive = 'font-semibold  text-neutral-600 dark:text-neutral-300'
const menu = [
  { icon: 'i-mdi-home-variant', text: 'Home', link: '/' },
  { icon: 'i-ic-baseline-add', text: 'Add', link: '/add-podcast' },
  // { icon: 'i-mdi-bookmark-multiple-outline', text: 'Bookmarks', link: '/bookmarks' },
  { icon: 'i-mdi-play-box-multiple-outline', text: 'Library', link: '/library' }
]
</script>
