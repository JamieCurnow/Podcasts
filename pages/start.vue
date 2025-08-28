<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh] text-center p-4 pb-40">
    <h1 class="text-4xl font-bold mb-2">Welcome to Podcasts</h1>
    <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
      The free, open-source podcast app.
      <br />
      No ads. No tracking. Just pure podcasting goodness.
    </p>
    <p class="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-6">"For the love of pods"</p>
    <div class="flex gap-4 justify-center mb-8">
      <UButton to="/add-podcast" icon="i-heroicons-plus-circle" size="lg" class="no-underline"
        >Add by RSS</UButton
      >
      <UButton @click="showImportDialog" icon="i-heroicons-arrow-up-tray" size="lg" color="gray">
        Import from OPML
      </UButton>
    </div>
    <a
      href="https://github.com/JamieCurnow/Podcasts"
      target="_blank"
      class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
    >
      ⭐ Star us on GitHub
    </a>
    <ImportOPMLDialog v-model="importDialogVisible" />
  </div>
</template>

<script setup lang="ts">
const importDialogVisible = ref(false)

const showImportDialog = () => {
  importDialogVisible.value = true
}
</script>
