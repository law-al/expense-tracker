<template>
  <div
    v-if="successModal"
    class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999]"
  >
    <div
      class="glass-card text-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl text-center max-w-sm w-[90%]"
    >
      <slot name="main">
        <div
          class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-6 h-6 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h3 class="text-lg font-semibold text-indigo-200 mb-2">Budget Created</h3>
        <p class="text-gray-300 text-sm mb-6">Your budget is now active and ready to use.</p>
      </slot>

      <button
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors cursor-pointer"
        @click="emit('closeSuccessModal')"
      >
        Done
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  successModal: boolean
}>()

const emit = defineEmits<{
  (e: 'closeSuccessModal'): void
}>()
</script>

<style scoped></style>
