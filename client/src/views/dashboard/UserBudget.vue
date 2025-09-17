<template>
  <app-layout>
    <!-- Loading Overlay -->
    <loading-modal :is-submitting="isSubmitting" />

    <!-- Success Modal -->
    <SuccessModal
      :success-modal="showSuccessModal"
      @close-success-modal="handleCloseSuccessModal"
    ></SuccessModal>

    <!-- Main Content -->
    <div class="min-h-[85vh]">
      <!-- Header -->
      <header class="flex items-center justify-between px-2 py-2 pb-4 border-b border-gray-700">
        <p class="text-xl font-light">Budgets</p>

        <!-- Add Budget Button -->
        <div
          @click="openModal = true"
          class="w-[30px] h-[30px] rounded-full bg-indigo-700 flex items-center justify-center cursor-pointer shadow-lg hover:bg-indigo-800"
        >
          <u-icon name="i-mdi-plus" class="size-6 text-soft-white" />
        </div>

        <!-- Create Budget Modal -->
        <base-modal :open-modal="openModal" direction="bottom" @close-modal="handleCloseModal">
          <template #title>
            <p>Create a Budget</p>
          </template>

          <template #main>
            <div class="">
              <!-- Error Message -->
              <span
                v-if="fetchError"
                class="text-center text-red-500 italic text-xs block w-full py-2"
              >
                {{ fetchError }}
              </span>

              <!-- Budget Amount Input -->
              <div class="w-full border-b border-gray-700 p-4 mt-3">
                <span class="text-xs text-center w-full block mb-1 text-soft-white">
                  Monthly Budget
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

              <!-- Add name input -->
              <div class="mt-4 px-4">
                <p class="text-sm text-cool-gray mb-1">Name (optional)</p>
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
                <div class="mt-3">
                  <p class="text-sm text-cool-gray px-4 mt-2 mb-1">Selected Category</p>
                  <div
                    v-if="selectedCategory"
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

            <!-- Budget Category Modal -->
            <div class="">
              <budget-category
                :open-modal="openCategoryModal"
                @close-modal="openCategoryModal = false"
              />
            </div>
          </template>
        </base-modal>
      </header>

      <!-- Main Content Area -->
      <main class="h-full mt-3 px-2">
        <!-- No Budgets State -->
        <div
          v-if="getBudgets?.totalBudgets === 0"
          class="h-[70vh] flex flex-col justify-center items-center gap-2"
        >
          <p class="text-center text-cool-gray">No budgets set yet.</p>
          <p class="text-center text-cool-gray">Click the + button to add a budget.</p>
        </div>

        <!-- Budgets Exist -->
        <div v-else class="">
          <!-- Total Budget Summary -->
          <div class="">
            <h2 class="text-soft-white text-center mb-2">Total Budget</h2>
          </div>
          <div class="w-full mb-8">
            <div class="flex items-baseline justify-between mb-2">
              <p class="text-soft-white text-lg font-light">
                {{ formatCurrency(getBudgets?.totalBudgets as number) }}
              </p>
              <span class="text-xs text-cool-gray">%{{ getBudgets?.percentage }}</span>
            </div>

            <percent-bar :percentage="getBudgets?.percentage || 0" />

            <div class="flex items-center justify-between mt-2">
              <p class="text-sm text-cool-gray">
                -{{ formatCurrency(getBudgets?.totalExpenses as number) }} spent
              </p>
              <p class="text-sm text-soft-white">
                {{
                  formatCurrency(
                    ((getBudgets?.totalExpenses || 0) - (getBudgets?.totalBudgets || 0)) * -1,
                  )
                }}
                left
              </p>
            </div>
          </div>

          <!-- Budget Cards -->
          <div class="">
            <div class="flex flex-col gap-4 z-[9999]">
              <budget-card
                v-for="budget in getBudgetsByCategory"
                :key="budget.categoryId"
                :budget="budget"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  </app-layout>
</template>

<script setup lang="ts">
import BudgetCard from '@/components/budget/BudgetCard.vue'
import BudgetCategory from '@/components/budget/BudgetCategory.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import SuccessModal from '@/components/common/SuccessModal.vue'
import { useDashboardData } from '@/composables/fetchDashBoardData'
import api from '@/services/api'
import { useBudgetStore } from '@/stores/budget.store'
import { useCategoryStore } from '@/stores/category.store'
import { formatCurrency } from '@/utils/formatters'
import type { AxiosError } from 'axios'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const categoryStore = useCategoryStore()
const { selectedCategory } = storeToRefs(categoryStore)
const budgetStore = useBudgetStore()
const { getBudgets, getBudgetsByCategory } = storeToRefs(budgetStore)
const { refreshDashboard } = useDashboardData()

const openModal = ref<boolean>(false)
const openCategoryModal = ref<boolean>(false)
const budgetAmount = ref<number | null>(null)
const isSubmitting = ref<boolean>(false)
const showSuccessModal = ref<boolean>(false)
const fetchError = ref<string | null>(null)
const budgetName = ref<string>()

const handleCloseModal = () => {
  openModal.value = false
  categoryStore.setCategory(null)
  budgetAmount.value = null
}

const handleCloseSuccessModal = () => {
  showSuccessModal.value = false
  refreshDashboard()
}

const handleCreateBudget = async () => {
  const value = {
    amount: budgetAmount.value as number,
    categoryId: selectedCategory.value?.id as number,
    period: 'monthly',
    name: budgetName.value,
  }
  try {
    isSubmitting.value = true
    fetchError.value = null
    const response = await api.post('/budget/create', value)

    if (response.status === 201) {
      isSubmitting.value = false
      openModal.value = false
      budgetAmount.value = null
      categoryStore.setCategory(null)
      showSuccessModal.value = true
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>
    fetchError.value =
      axiosError.response?.data?.message || 'There was an error submitting the form.'
  } finally {
    isSubmitting.value = false
  }
}

watch([isSubmitting, showSuccessModal], ([newValForSubmit, newValForSuccess]) => {
  if (newValForSubmit || newValForSuccess) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})
</script>

<style scoped>
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-scale-in {
  animation: scale-in 0.2s ease-out forwards;
}
</style>
