<template>
  <div class="relative flex shrink w-min">
    <svg viewBox="0 0 36 36" class="h-full">
      <path
        class="fill-none"
        :class="[stroke, invert ? darkColor : lightColor]"
        :style="{ fill: 'none' }"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        class="fill-none"
        :class="[stroke, invert ? lightColor : darkColor]"
        :style="{ fill: 'none' }"
        :stroke-dasharray="`${props.percentage}, 100`"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
    </svg>
    <div class="absolute h-full w-full top-0 left-0 flex items-center justify-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  percentage: {
    type: Number,
    required: true
  },
  stroke: {
    type: String,
    default: 'stroke-[3]'
  },
  invert: Boolean
})

const lightColor = 'stroke-neutral-500 dark:stroke-neutral-400'
const darkColor = 'stroke-neutral-200 dark:stroke-neutral-700'
</script>
