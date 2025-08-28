<template>
  <div class="flex flex-col gap-4 p-4 mt-10">
    <div class="text-center">
      <h1 class="text-2xl font-bold">Welcome to the Podcast App</h1>
      <p>The free, open-source podcast app.</p>
      <p>No ads. No tracking. Powered by RSS. Pure.</p>
      <p>For the love of pods.</p>
    </div>
    <div class="flex flex-col">
      <div class="text-center">
        <h2 class="text-xl font-semibold mb-2">Getting Started</h2>
      </div>
      <div class="flex gap-2 justify-center">
        <UButton @click="$router.push('/add')" color="green" size="lg">Add your favorite Podcasts</UButton>
        <UButton @click="showImportDialog" color="green" size="lg">Import Podcasts</UButton>

        <ImportOPMLDialog v-model="importDialogVisible" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const importDialogVisible = ref(false)

const showImportDialog = () => {
  importDialogVisible.value = true
}
</script>
