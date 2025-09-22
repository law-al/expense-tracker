<template>
  <!-- Create Budget Modal -->
  <base-modal :open-modal="openModal" direction="bottom" @close-modal="handleCloseModal">
    <template #title>
      <p>Create a Budget</p>
    </template>

    <template #main>
      <div class="h-[90vh] py-2">
        <span
          v-if="fetchErrorMessage"
          class="text-center text-red-500 italic text-xs block w-full py-2"
        >
          {{ fetchErrorMessage }}</span
        >

        <div class="flex flex-col h-full">
          <div class="overflow-y-scroll scrollbar-hidden">
            <!-- Budget Amount Input -->
            <div class="w-full border-b border-gray-700 p-4 mt-3">
              <span class="text-xs text-center w-full block mb-1 text-soft-white">
                {{ selectedPeriod }} Budget (required)
              </span>
              <currency-input
                v-model="budgetAmount"
                :options="{
                  locale: 'en-US',
                  currency: 'USD',
                  valueRange: {},
                  hideCurrencySymbolOnFocus: true,
                  hideGroupingSeparatorOnFocus: true,
                  hideNegligibleDecimalDigitsOnFocus: true,
                  autoDecimalDigits: true,
                  useGrouping: false,
                  accountingSign: false,
                }"
                placeholder="$0.00"
                :required="true"
                class="w-full text-5xl h-[100px] bg-transparent font-extralight text-center focus-within:outline-none active:outline-none active:border-none active:focus:outline-none focus:border-none focus:ring-0 text-white placeholder:text-cool-gray"
              />
            </div>

            <!-- Budget Period -->
            <div class="px-4 mt-4 border-b border-gray-700 pb-4">
              <p class="text-sm text-cool-gray mb-1">Budget Period (required)</p>
              <u-select
                v-model="selectedPeriod"
                :items="items"
                size="lg"
                :ui="{
                  base: 'w-full bg-gray-800 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600 ring-transparent bg-gray-950 z-[100]',
                  item: 'text-white cursor-pointer hover:bg-gray-200 hover:!text-gray-600 px-4 py-2 ',
                  content: 'bg-gray-950 text-white rounded-md z-[100]',
                }"
                class="!w-full"
              />
            </div>

            <!-- Add name input -->
            <div class="my-2 px-4 border-b border-gray-700 pb-4">
              <p class="text-sm text-cool-gray mb-1">Name (required)</p>
              <input
                type="text"
                v-model="budgetName"
                placeholder="e.g., Groceries, Entertainment"
                class="w-full bg-gray-900 text-white placeholder:text-cool-gray rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <!-- Category Selection -->
            <div class="">
              <!-- Select Category Button -->
              <div
                @click="openCategoryModal = true"
                class="flex items-center justify-between p-4 border-b border-gray-700 cursor-pointer text-gray-500 hover:text-soft-white"
              >
                <p class="text-sm mb-2">Select Category</p>
                <u-icon name="i-lsicon-right-filled" class="size-5" />
              </div>

              <!-- Selected Category Display -->
              <div v-if="selectedCategory" class="mt-3 border-b border-gray-700 pb-4">
                <p class="text-sm text-cool-gray px-4 mt-2 mb-1">Selected Category</p>
                <div
                  class="flex items-center gap-4 px-4 py-4 cursor-pointer text-gray-400 hover:text-gray-200"
                >
                  <div class="border border-gray-700 rounded-lg p-1 bg-white/10">
                    <u-icon :name="selectedCategory.icon || ''" class="size-6" />
                  </div>
                  <div class="">
                    <p class="text-sm">{{ selectedCategory.name }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Note Section -->
            <div class="mt-4 px-4">
              <p class="text-sm text-cool-gray mb-1">Note (optional)</p>
              <textarea
                rows="3"
                placeholder="Add a note..."
                class="w-full bg-gray-900 text-white placeholder:text-cool-gray rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-indigo-600 resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Create Budget Button -->
          <div class="mt-10 px-4">
            <u-button
              :disabled="!budgetAmount || !selectedCategory || isSubmitting || !budgetName"
              :loading="isSubmitting"
              @click="handleCreateBudget"
              class="w-full rounded-sm py-3 text-white justify-center cursor-pointer !bg-indigo-700 hover:bg-indigo-800 disabled:!bg-indigo-400"
            >
              Create Budget
            </u-button>
          </div>
        </div>
      </div>
    </template>
  </base-modal>

  <!-- Budget Category Modal -->
  <div class="">
    <budget-category :open-modal="openCategoryModal" @close-modal="openCategoryModal = false" />
  </div>
</template>

<script setup lang="ts">
import api from '@/services/api'
import { useCategoryStore } from '@/stores/category.store'
import type { AxiosError } from 'axios'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { ref, watch } from 'vue'

const props = defineProps<{
  openModal: boolean
  isSubmitting: boolean
}>()
const openModal = ref(props.openModal)
const isSubmitting = computed(() => props.isSubmitting)

const emit = defineEmits<{
  (e: 'closeBudgetModal'): void
  (e: 'submittingStatus', status: boolean): void
  (e: 'successStatus', status: boolean): void
}>()

const handleCloseModal = () => {
  emit('closeBudgetModal')
}

const categoryStore = useCategoryStore()
const { selectedCategory } = storeToRefs(categoryStore)

const fetchErrorMessage = ref<string | null>(null)
const budgetAmount = ref<number | null>(null)
const items = ref([
  {
    label: 'Daily',
    value: 'Daily',
  },
  {
    label: 'Weekly',
    value: 'Weekly',
  },
  {
    label: 'Monthly',
    value: 'Monthly',
  },
  {
    label: 'Yearly',
    value: 'Yearly',
  },
])
const selectedPeriod = ref('Monthly')
const budgetName = ref<string>()
const openCategoryModal = ref<boolean>(false)

const handleCreateBudget = async () => {
  const value = {
    amount: budgetAmount.value as number,
    categoryId: selectedCategory.value?.id as number,
    period: selectedPeriod.value.toUpperCase(),
    name: budgetName.value,
  }
  try {
    emit('submittingStatus', true)
    fetchErrorMessage.value = null
    const response = await api.post('/budget/create', value)

    if (response.status === 201) {
      emit('submittingStatus', false)
      openModal.value = false
      budgetAmount.value = null
      categoryStore.setCategory(null)
      emit('successStatus', true)
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>
    fetchErrorMessage.value =
      axiosError.response?.data?.message || 'There was an error submitting the form.'
  } finally {
    emit('submittingStatus', false)
  }
}

watch(
  () => props.openModal,
  (newVal) => {
    openModal.value = newVal
  },
)
</script>

<style scoped></style>
