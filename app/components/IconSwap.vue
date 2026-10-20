<template>
  <!-- both icons share one grid cell so the old and new cross-fade in place -->
  <span class="inline-grid place-items-center">
    <Transition
      enter-active-class="transition-[opacity,scale,filter] duration-150 ease-out"
      leave-active-class="transition-[opacity,scale,filter] duration-150 ease-out"
      enter-from-class="opacity-0 scale-90 blur-[2px] motion-reduce:scale-100 motion-reduce:blur-none"
      leave-to-class="opacity-0 scale-90 blur-[2px] motion-reduce:scale-100 motion-reduce:blur-none"
    >
      <UIcon :key="name" :name="name" class="[grid-area:1/1]" v-bind="$attrs" />
    </Transition>
  </span>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  name: string
}>()
</script>
