<template>
  <!-- waits 200ms before showing, so cached loads never flash a spinner -->
  <div class="h-[50svh] flex items-center justify-center animate-fade-in-delayed">
    <Loading class="size-16" />
  </div>
</template>

<script setup lang="ts"></script>
