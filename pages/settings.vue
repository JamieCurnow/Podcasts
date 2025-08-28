<template>
  <div class="flex flex-col gap-4 pt-4 pb-40 px-4">
    <div class="flex flex-col gap-2">
      <div class="text-lg font-semibold">General</div>
      <div class="flex flex-col gap-4">
        <div>
          <label
            for="initial-fetch-amount"
            class="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Initial Episodes to Fetch
          </label>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
            Controls how many episodes are fetched when you first view a podcast. A higher number means a
            longer initial load time.
          </p>
          <UInput
            id="initial-fetch-amount"
            v-model="amountOfPodsToInitiallyFetch"
            type="number"
            min="1"
            max="50"
          />
        </div>
        <div></div>
        <label
          for="pull-down-weight"
          class="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Pull Down Weight
        </label>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
          Controls how hard it "feels" in the UI to pull down to refresh. A lower number means it feels harder
          to pull down.
        </p>
        <UInput id="pull-down-weight" v-model="pullDownWeight" type="number" min="0.1" max="1" step="0.01" />
      </div>
    </div>

    <Divider />

    <div class="flex flex-col gap-2">
      <div class="text-lg font-semibold">Import/Export</div>
      <div class="flex flex-col gap-4">
        <div>
          <UButton color="primary" variant="solid" :icon="'mdi-import'" trailing @click="openImportDialog"
            >Import OPML</UButton
          >
          <ImportOPMLDialog v-model="isImportDialogOpen" />
        </div>
        <div>
          <UButton color="primary" variant="solid" :icon="'mdi-export'" trailing @click="openExportDialog"
            >Export OPML</UButton
          >
          <ExportOPMLDialog v-model="isExportDialogOpen" />
        </div>
      </div>
    </div>

    <Divider />

    <div class="p-4 pt-2 px-2 flex flex-col border-red-500 border rounded-md gap-2">
      <div class="text-red-500 text-lg">Danger Zone</div>
      <div class="flex flex-col gap-4">
        <div>
          <ClientOnly>
            <UButton
              :disabled="!history?.length"
              @click="clearAllHistory()"
              color="white"
              variant="solid"
              :icon="history?.length ? 'mdi-close' : 'mdi-check'"
              trailing
            >
              Clear all history
            </UButton>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const historyStore = useHistoryStore()
const { history } = storeToRefs(historyStore)
const { clearAllHistory } = historyStore

const userConfigStore = useUserConfigStore()
const { amountOfPodsToInitiallyFetch, pullDownWeight } = storeToRefs(userConfigStore)

const isImportDialogOpen = ref(false)
const isExportDialogOpen = ref(false)

const openImportDialog = () => {
  isImportDialogOpen.value = true
}

const openExportDialog = () => {
  isExportDialogOpen.value = true
}
</script>
