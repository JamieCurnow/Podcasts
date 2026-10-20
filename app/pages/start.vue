<template>
  <!-- first run only, so the entrance gets a longer, staggered beat than normal UI -->
  <div class="flex flex-col items-center justify-center min-h-[80svh] text-center p-4 pb-40">
    <h1 class="text-4xl font-bold mb-2 animate-enter [animation-duration:500ms]">Welcome to Podcasts</h1>
    <p
      class="text-lg text-gray-600 dark:text-gray-400 mb-6 animate-enter [animation-duration:500ms] [animation-delay:80ms]"
    >
      The free, open-source podcast app.
      <br />
      No ads. No tracking. Just pure podcasting goodness.
    </p>
    <p
      class="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-6 animate-enter [animation-duration:500ms] [animation-delay:160ms]"
    >
      "For the love of pods"
    </p>
    <div
      class="flex flex-wrap gap-4 justify-center mb-8 animate-enter [animation-duration:500ms] [animation-delay:240ms]"
    >
      <UButton
        to="/add-podcast"
        icon="i-heroicons-plus-circle"
        size="lg"
        color="neutral"
        class="no-underline!"
        >Add by RSS</UButton
      >
      <UButton icon="i-heroicons-arrow-up-tray" size="lg" color="neutral" @click="showImportDialog">
        Import from OPML
      </UButton>
    </div>
    <div
      class="flex flex-wrap gap-2 justify-center mb-8 animate-enter [animation-duration:500ms] [animation-delay:320ms]"
    >
      <UButton
        icon="i-mdi-github"
        to="https://github.com/JamieCurnow/Podcasts"
        target="_blank"
        color="neutral"
        variant="subtle"
        class="no-underline!"
      >
        Star this app on GitHub
      </UButton>
      <UButton
        to="https://www.buymeacoffee.com/jamiecurnow"
        target="_blank"
        color="neutral"
        variant="subtle"
        class="no-underline!"
      >
        ☕ Buy me a coffee
      </UButton>
      <UButton
        to="https://github.com/sponsors/JamieCurnow"
        target="_blank"
        color="neutral"
        variant="subtle"
        class="no-underline!"
      >
        ❤️ Sponsor me on GitHub
      </UButton>
    </div>
    <ImportOPMLDialog v-model="importDialogVisible" />
  </div>
</template>

<script setup lang="ts">
const importDialogVisible = ref(false)

const showImportDialog = () => {
  importDialogVisible.value = true
}
</script>
