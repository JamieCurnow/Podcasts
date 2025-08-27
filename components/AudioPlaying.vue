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
.playing {
  @apply size-5;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 4px;
  box-sizing: border-box;
}

.playing__bar {
  @apply bg-gray-400 dark:bg-neutral-400;
  display: inline-block;
  width: 27%;
  height: 100%;
  animation: up-and-down 1.3s ease infinite alternate;
}

.playing__bar1 {
  height: 60%;
}

.playing__bar2 {
  height: 30%;
  animation-delay: -2.2s;
}

.playing__bar3 {
  height: 75%;
  animation-delay: -3.7s;
}

@keyframes up-and-down {
  10% {
    height: 30%;
  }

  30% {
    height: 100%;
  }

  60% {
    height: 50%;
  }

  80% {
    height: 75%;
  }

  100% {
    height: 60%;
  }
}
</style>
