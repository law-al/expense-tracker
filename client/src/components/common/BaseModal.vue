<template>
  <UDrawer
    v-model:open="openModal"
    :direction="direction"
    should-scale-background
    set-background-color-on-scale
    :dismissible="false"
    :handle="false"
    :overlay="false"
    title="Select an Account"
    description="Choose an account to associate with this transaction."
    :ui="{
      content: 'z-100 h-screen bg-gray-950',
      body: 'h-screen',
      header: 'hidden',
      container: `p-0 ${direction === 'right' || direction === 'left' ? 'w-[100%]' : ''}`,
    }"
    class="!w-[100%] !max-w-[100%] !h-screen !max-h-screen !ring-0 text-white !p-0 !mt-0"
  >
    <template #body>
      <div
        class="w-full h-[10vh] flex items-center justify-between px-4 pb-3 pt-3 border-b-2 border-gray-700"
      >
        <h2 class="text-white font-semibold text-lg">
          <slot name="title"></slot>
        </h2>

        <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="emit('closeModal')" />
      </div>

      <slot name="main"></slot>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { ref, toRef, watch } from 'vue'

const props = defineProps<{
  openModal: boolean
  direction: 'right' | 'left' | 'top' | 'bottom'
}>()
const openModal = ref(props.openModal)
const direction = toRef(props, 'direction')
const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

// Watch for changes in the prop and update the local ref accordingly
watch(
  () => props.openModal,
  (newVal) => {
    openModal.value = newVal
  },
)
</script>

<style scoped>
.bg-image {
  background: linear-gradient(180deg, #0b0e1a, #1a1446) !important;
}
</style>
