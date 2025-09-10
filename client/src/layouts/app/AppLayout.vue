<template>
  <div class="h-[100vh] max-w-[639px] p-4 overflow-scroll bg-image">
    <p>This is the app layout</p>
    <slot></slot>

  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.bg-image {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 1)), #6c63ff;
}
</style>
