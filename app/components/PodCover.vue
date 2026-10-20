<template>
  <div>
    <!-- fades in once loaded rather than popping in a line at a time -->
    <img
      ref="imgEl"
      :src="proxyImg"
      alt="podcast cover"
      :class="[lessRounded ? 'rounded-md' : 'rounded-lg', loaded ? 'opacity-100' : 'opacity-0']"
      class="cursor-pointer select-none transition-opacity duration-200 ease-out [-webkit-touch-callout:none]"
      draggable="false"
      :width="width"
      :height="height"
      @load="loaded = true"
      @error="loaded = true"
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

const cacheForImages = 60 * 60 * 24 * 7 * 4 // 4 weeks
const proxyImg = computed(() =>
  props.img ? getProxyUrl({ url: props.img, cacheMaxAgeSeconds: cacheForImages }) : ''
)

const imgEl = ref<HTMLImageElement | null>(null)
const loaded = ref(false)
// cached (or prerendered) images can finish before hydration, so their load event is never seen
onMounted(() => {
  if (imgEl.value?.complete) loaded.value = true
})
watch(proxyImg, () => {
  loaded.value = false
  nextTick(() => {
    if (imgEl.value?.complete) loaded.value = true
  })
})
</script>
