<template>
  <div>
    <!-- loading in a tailwind-native way -->
    <div class="flex justify-center items-center w-full h-full">
      <!-- <div
        class="animate-spin rounded-full w-full h-full border-t-2 border-b-2 border-gray-400 dark:border-s-neutral-300"
      ></div> -->
      <UIcon
        name="i-mdi-loading"
        class="text-gray-400 dark:text-neutral-300 animate-spin w-full h-full"
        size="2rem"
      />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
