<template>
  <div class="playing">
    <span class="playing__bar playing__bar1"></span>
    <span class="playing__bar playing__bar2"></span>
    <span class="playing__bar playing__bar3"></span>
  </div>
</template>

<script setup lang="ts">
// Thanks https://codepen.io/MoritzGiessmann/pen/XWWovQP
</script>
<style scoped>
@reference "~/assets/css/main.css";

.playing {
  @apply size-5;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 4px;
  box-sizing: border-box;
}

/* full-height bars scaled from the bottom: scaleY stays on the compositor where height would re-layout every frame */
.playing__bar {
  @apply bg-gray-400 dark:bg-neutral-400;
  display: inline-block;
  width: 27%;
  height: 100%;
  transform-origin: bottom;
  animation: up-and-down 1.3s ease infinite alternate;
}

.playing__bar1 {
  transform: scaleY(0.6);
}

.playing__bar2 {
  transform: scaleY(0.3);
  animation-delay: -2.2s;
}

.playing__bar3 {
  transform: scaleY(0.75);
  animation-delay: -3.7s;
}

@keyframes up-and-down {
  10% {
    transform: scaleY(0.3);
  }

  30% {
    transform: scaleY(1);
  }

  60% {
    transform: scaleY(0.5);
  }

  80% {
    transform: scaleY(0.75);
  }

  100% {
    transform: scaleY(0.6);
  }
}

@media (prefers-reduced-motion: reduce) {
  .playing__bar {
    animation: none;
  }
}
</style>
