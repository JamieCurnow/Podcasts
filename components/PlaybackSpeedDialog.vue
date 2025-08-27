<template>
  <SlideUpDialog v-model="dialog" height="668px">
    <div class="flex flex-col p-4">
      <div class="self-center">
        <UIcon name="i-ic-round-horizontal-rule" class="size-10 text-neutral-300 dark:text-neutral-600" />
      </div>
      <h3 class="mb-4 text-center text-lg font-semibold">Playback speed</h3>

      <div class="mb-4 text-center text-2xl font-bold">{{ userConfigStore.playbackSpeed.toFixed(1) }}x</div>

      <URange v-model="userConfigStore.playbackSpeed" :min="0.8" :max="2" :step="0.1" />

      <div class="mt-4 flex justify-around">
        <UButton
          v-for="speed in presetSpeeds"
          :key="speed"
          variant="outline"
          size="xl"
          class="rounded-full"
          @click="userConfigStore.playbackSpeed = speed"
        >
          {{ speed.toFixed(1) }}x
        </UButton>
      </div>

      <div class="mt-20 w-full flex justify-center">
        <UButton size="lg" variant="ghost" icon="i-ic-round-close" @click="dialog = false"> Close </UButton>
      </div>
    </div>
  </SlideUpDialog>
</template>

<script setup lang="ts">
import { useUserConfigStore } from '~/stores/userConfigStore'
import SlideUpDialog from '~/components/SlideUpDialog.vue'

const userConfigStore = useUserConfigStore()

const dialog = defineModel<boolean>()

const presetSpeeds = [0.8, 1.0, 1.2, 1.5, 2.0]
</script>
