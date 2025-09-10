<template>
  <div class="h-[100vh] max-w-[639px] p-4 bg-image flex items-center justify-center">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.bg-image {
  background-image:
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.5) 10%,
      rgba(0, 0, 0, 9) 50%,
      rgba(0, 0, 0, 1) 100%
    ),
    url('@/assets/images/onboard-img.png');
  background-size: contain;
  background-position: top;
  background-repeat: no-repeat;
}
</style>
<!-- This will only apply to screens smaller than sm breakpoint -->
<!-- This will work for mobile without prefixes -->
