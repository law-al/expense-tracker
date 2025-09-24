<template>
  <UDrawer
    v-model:open="openCategoryView"
    direction="right"
    should-scale-background
    set-background-color-on-scale
    :dismissible="false"
    :handle="false"
    :overlay="false"
    title="Select a Category"
    description="Choose a category to associate with this transaction."
    :ui="{
      content: 'z-100',
      body: 'bg-transparent !ring-0 !rounded-none !border-0 !p-0 !mt-0 w-[100%]',
      header: 'hidden',
      container: '!rounded-none !border-0 !p-0 w-full',
    }"
    class="!w-[100%] !max-w-[100%] !h-[100%] !max-h-[100%] bg-gray-950 !border-0 !ring-0 text-white !p-0 !mt-0"
  >
    <template #body>
      <div
        class="w-full flex items-center justify-between px-4 pb-3 pt-3 border-b-2 border-gray-700"
      >
        <h2 class="text-white font-semibold text-lg">Select a Category</h2>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          @click="emit('closeCategoryView')"
        />
      </div>

      <!-- Select Category -->
      <div class="flex flex-col gap-5 mt-3">
        <div
          v-for="category in categories"
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
  </UDrawer>

  <set-expense
    :open-expense-view="openRecordTransactionModal"
    @close-expense-view="openRecordTransactionModal = false"
    @finish-transaction-and-dismiss="finishTransactionAndDismiss"
  />
</template>

<script setup lang="ts">
import type { Category } from '@/types'
import { useCategoryStore } from '@/stores/category.store'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import SetExpense from './RecordTransaction.vue'
import { useTransactionStore } from '@/stores/transaction.store'
import { useGlobalStore } from '@/stores/global.store'

// props from parent component (SetAccount.vue)
const props = defineProps<{
  openCategoryView: boolean
}>()

const emit = defineEmits<{
  (e: 'closeCategoryView'): void
  (e: 'finishTransactionAndDismiss'): void
}>()

const globalStore = useGlobalStore()
// Use global store state for category modal visibility
const { openRecordTransactionModal } = storeToRefs(globalStore)
const categoryStore = useCategoryStore()
const { expenseCategories, incomeCategories } = storeToRefs(categoryStore)
// To open the expense session
const transactionStore = useTransactionStore()

const openCategoryView = ref(props.openCategoryView) // this is set once when the component load to the initial value of the prop. When the props change, this value will not change. Hence we need to watch for changes in the prop and update this value accordingly.
// emit to parent component (SetAccount.vue)

const categories = computed(() =>
  transactionStore.selectedTransactionType === 'income'
    ? incomeCategories.value
    : expenseCategories.value,
)

const handleOpenAndSet = async (category: Category) => {
  categoryStore.setCategory(category)
  openRecordTransactionModal.value = true
  try {
    await categoryStore.fetchSubCategoriesById(category.id)
  } catch (error) {
    console.error('Error fetching sub-categories:', error)
  }
}

const finishTransactionAndDismiss = () => {
  openRecordTransactionModal.value = false
  emit('finishTransactionAndDismiss')
}

// Watch for changes in the prop and update the local ref accordingly
watch(
  () => props.openCategoryView,
  (newVal) => {
    openCategoryView.value = newVal
    console.log('Category Drawer Open:', openCategoryView.value)
  },
)
</script>

<style scoped>
.bg-image {
  background: linear-gradient(180deg, #0b0e1a, #1a1446) !important;
}
</style>
