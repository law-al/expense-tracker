<template>
  <!-- Menu modal -->
  <base-modal :open-modal="openMenuModal" direction="right" @close-modal="handleCloseMenuModal">
    <template #title>Menu</template>

    <template #main>
      <div class="flex flex-col justify-between gap-4 h-[90vh] p-4">
        <div class="h-full flex flex-col justify-start">
          <router-link
            to="/settings"
            class="w-full flex items-center gap-2 px-4 py-4 border-b border-gray-700 cursor-pointer text-gray-400 hover:text-gray-200"
          >
            <u-icon name="i-mdi-cog-outline" class="size-6" />
            <p class="text-sm">Settings</p>
          </router-link>

          <router-link
            to="/user-record"
            class="w-full flex items-center gap-2 px-4 py-4 border-b border-gray-700 cursor-pointer text-gray-400 hover:text-gray-200"
          >
            <u-icon name="i-mdi-account-outline" class="size-6" />
            <p class="text-sm">User Record</p>
          </router-link>
          <router-link
            to="/create-account"
            class="w-full flex items-center gap-2 px-4 py-4 border-b border-gray-700 cursor-pointer text-gray-400 hover:text-gray-200"
          >
            <u-icon name="i-mdi-bank-outline" class="size-6" />
            <p class="text-sm">Accounts</p>
          </router-link>
        </div>
        <div class="">
          <u-button
            variant="solid"
            size="xl"
            color="warning"
            class="w-full justify-center !rounded-xs text-white !bg-red-500 hover:bg-red-600 cursor-pointer"
            >Logout</u-button
          >
        </div>
      </div>
    </template>
  </base-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  openMenuModal: boolean
}>()
const openMenuModal = ref(props.openMenuModal)

const emit = defineEmits<{
  (e: 'closeMenuModal'): void
}>()

const handleCloseMenuModal = () => {
  emit('closeMenuModal')
}

watch(
  () => props.openMenuModal,
  (newVal) => {
    console.log('Menu modal visibility changed:', newVal)
    openMenuModal.value = newVal
  },
)
</script>

<style scoped></style>
