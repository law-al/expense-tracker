<template>
  <base-modal :open-modal="openModal" direction="right" @close-modal="handleCloseCategoryModal">
    <template #title>
      <p>Select a budget category</p>
    </template>

    <template #main>
      <div class="flex flex-col gap-5 mt-3">
        <div
          v-for="category in expenseCategories"
          :key="category.id"
          @click="handleOpenAndSet(category)"
          class="h-[50px] w-full flex items-center gap-4 px-4 py-4 cursor-pointer text-gray-400 hover:text-gray-200"
        >
          <div class="border border-gray-700 rounded-lg p-1 bg-white/10">
            <u-icon :name="category.icon || ''" class="size-6" />
          </div>
          <div class="flex items-center justify-between w-full">
            <span class="font-light text-sm">{{ category.name }}</span>
            <u-icon name="i-lsicon-right-filled" class="size-5" />
          </div>
        </div>
      </div>
    </template>
  </base-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Category } from '@/types'
import BaseModal from '../common/BaseModal.vue'
import { useCategoryStore } from '@/stores/category.store'

const props = defineProps<{
  openModal: boolean
}>()
const openModal = ref(props.openModal)
const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const handleCloseCategoryModal = () => {
  emit('closeModal')
}

const categoryStore = useCategoryStore()
const { expenseCategories, setCategory } = categoryStore

const handleOpenAndSet = (category: Category) => {
  setCategory(category)
  emit('closeModal')
}

watch(
  () => props.openModal,
  (newVal) => {
    openModal.value = newVal
  },
)
</script>

<style scoped></style>
