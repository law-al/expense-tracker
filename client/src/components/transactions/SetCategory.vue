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
    class="!w-[100%] !max-w-[100%] !h-[100%] !max-h-[100%] bg-gradient-to-br from-[#0a0a12] via-[#0f0f1a] to-[#141427] !border-0 !ring-0 text-white !p-0 !mt-0"
  >
    <template #body>
      <!-- Header -->
      <div
        class="w-full flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-2xl flex items-center justify-center border border-purple-500/30"
          >
            <u-icon name="i-mdi-shape" class="size-5 text-purple-400" />
          </div>
          <div>
            <h2 class="text-white font-bold text-xl">Select Category</h2>
            <p class="text-gray-400 text-sm">Choose transaction category</p>
          </div>
        </div>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          size="xl"
          @click="emit('closeCategoryView')"
        />
      </div>

      <!-- Categories List -->
      <div class="flex flex-col gap-2 p-6">
        <div
          v-for="category in categories"
          :key="category.id"
          @click="handleOpenAndSet(category)"
          class="category-item flex items-center gap-4 p-4 cursor-pointer rounded-xl"
        >
          <!-- Category Icon -->
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center border border-white/20 bg-white/5"
          >
            <u-icon :name="category.icon || 'i-mdi-folder'" class="size-6 text-gray-300" />
          </div>

          <!-- Category Details -->
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <p class="text-white text-base font-semibold">
                {{ category.name }}
              </p>
              <div
                class="px-2 py-1 rounded-lg border border-white/20 text-xs font-medium bg-white/5 text-gray-400"
              >
                {{ 'General' }}
              </div>
            </div>
            <p class="text-gray-400 text-sm">
              {{ getCategoryDescription(category.name) }}
            </p>
          </div>

          <!-- Selection Arrow -->
          <div
            class="w-8 h-8 bg-white/5 border border-white/20 rounded-xl flex items-center justify-center"
          >
            <u-icon name="i-lsicon-right-filled" class="size-4 text-gray-500" />
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

const getCategoryDescription = (categoryName: string) => {
  const descriptions: Record<string, string> = {
    'Food & Dining': 'Restaurants, groceries, delivery',
    Transportation: 'Gas, public transit, rideshare',
    Shopping: 'Retail purchases, online orders',
    Entertainment: 'Movies, games, subscriptions',
    'Bills & Utilities': 'Rent, electricity, internet',
    Healthcare: 'Medical, dental, pharmacy',
    Education: 'Tuition, books, courses',
    Travel: 'Flights, hotels, vacation',
    Income: 'Salary, freelance, investments',
    // Add more based on your categories
  }
  return descriptions[categoryName] || 'Transaction category'
}

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
  },
)
</script>

<style scoped>
.bg-image {
  background: linear-gradient(180deg, #0b0e1a, #1a1446) !important;
}

.category-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.category-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%);
  border-color: rgba(255, 255, 255, 0.2);
}

.category-item:hover .size-6 {
  color: #ffffff;
}

.category-item:hover .size-4 {
  color: #ffffff;
}

.category-item:hover .w-8 {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}
</style>
