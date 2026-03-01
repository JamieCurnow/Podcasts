<template>
  <div>
    <img
      :src="img"
      alt="podcast cover"
      :class="{ 'rounded-md': lessRounded, 'rounded-lg': !lessRounded }"
      class="cursor-pointer"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  img: {
    type: String,
    default: ''
  },
  width: {
    type: Number,
    default: 100
  },
  height: {
    type: Number,
    default: 100
  },
  lessRounded: Boolean
})

// const cacheForImages = 60 * 60 * 24 * 7 * 4 // 4 weeks
// const proxyImg = computed(() => getProxyUrl({ url: props.img, cacheMaxAgeSeconds: cacheForImages }))
</script>
