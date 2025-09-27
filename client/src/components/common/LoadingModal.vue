<template>
  <!-- Loading Overlay -->
  <div
    v-if="isSubmitting"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
  >
    <div class="flex flex-col items-center gap-3 rounded-2xl bg-white/10 px-6 py-5 shadow-2xl">
      <!-- Modern Loader -->
      <span class="loader"></span>
      <slot name="statusText">
        <!-- Status Text -->
        <p class="text-white italic text-sm font-medium tracking-wide animate-pulse">
          Submitting your data...
        </p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isSubmitting: boolean
}>()
</script>

<style scoped>
.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border-top: 4px solid #6366f1;
  border-right: 4px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

.loader::after {
  content: '';
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border-bottom: 4px solid #6366f1;
  border-left: 4px solid transparent;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
