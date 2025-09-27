<template>
  <!-- Submiting Budget Overlay -->
  <loading-modal :is-submitting="isSubmitting">
    <template #statusText>
      <p>Adding Budget...</p>
    </template>
  </loading-modal>

  <!-- Loading Overlay -->
  <loading-modal :is-submitting="isLoading">
    <template #statusText>
      <p>Fetching Budget...</p>
    </template>
  </loading-modal>

  <app-layout>
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
      </header>

      <!-- Main Content Area -->
      <main class="h-[75vh] my-2 px-2">
        <!-- Error Message -->
        <span
          v-if="fetchErrorMessage"
          class="text-center text-red-500 italic text-xs block w-full py-2"
        >
          {{ fetchErrorMessage }}</span
        >

        <!-- Total Budget Summary -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-soft-white text-center mb-2">Total Budget</h2>
          <u-select
            v-model="period"
            :items="items"
            size="lg"
            :ui="{
              base: 'w-full bg-gray-800 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600 ring-indigo-600 bg-gray-950 z-[100]',
              item: 'text-white cursor-pointer hover:bg-gray-200 hover:!text-gray-600 px-4 py-2 ',
              content: 'bg-gray-950 text-white rounded-md z-[100]',
            }"
            class="!w-[150px] mb-4"
          />
        </div>

        <div class="h-[60vh]">
          <!-- No Budgets State -->
          <div
            v-if="getBudgets?.totalBudgets === 0"
            class="h-full flex flex-col justify-center items-center gap-2 text-sm"
          >
            <p class="text-center text-cool-gray">No budgets set yet.</p>
            <p class="text-center text-cool-gray">Click the + button to add a budget.</p>
          </div>

          <!-- Budget Summary -->
          <div v-else class="w-full mb-8">
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
            <div class="flex flex-col gap-4">
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

  <!-- Create Budget Modal -->
  <create-budget
    :open-modal="openModal"
    :is-submitting="isSubmitting"
    @close-budget-modal="handleCloseModal"
    @submitting-status="(status: boolean) => (isSubmitting = status)"
    @success-status="(status: boolean) => (showSuccessModal = status)"
  />
</template>

<script setup lang="ts">
import BudgetCard from '@/components/budget/BudgetCard.vue'
import CreateBudget from '@/components/budget/CreateBudget.vue'
import SuccessModal from '@/components/common/SuccessModal.vue'
import { useBudgetStore } from '@/stores/budget.store'
import { useCategoryStore } from '@/stores/category.store'
import { formatCurrency } from '@/utils/formatters'
import type { AxiosError } from 'axios'
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, ref, watch } from 'vue'

const categoryStore = useCategoryStore()
const budgetStore = useBudgetStore()
const { getBudgets, getBudgetsByCategory } = storeToRefs(budgetStore)

const openModal = ref<boolean>(false)
const budgetAmount = ref<number | null>(null)
const isSubmitting = ref<boolean>(false)
const isLoading = ref<boolean>(true)
const showSuccessModal = ref<boolean>(false)
const fetchErrorMessage = ref<string | null>(null)

const items = ref([
  {
    label: 'Daily',
    value: 'daily',
  },
  {
    label: 'Weekly',
    value: 'weekly',
  },
  {
    label: 'Monthly',
    value: 'monthly',
  },
  {
    label: 'Yearly',
    value: 'yearly',
  },
])
const period = ref('monthly')

const handleCloseModal = () => {
  openModal.value = false
  categoryStore.setCategory(null)
  budgetAmount.value = null
}

const handleCloseSuccessModal = async () => {
  showSuccessModal.value = false
  budgetAmount.value = null
  budgetStore.fetchBudgetsByCategory(period.value)
}

watch(period, async (newValue) => {
  try {
    fetchErrorMessage.value = null
    isSubmitting.value = true
    await nextTick()
    await budgetStore.fetchBudgets(newValue)
  } catch (error: unknown) {
    if (error instanceof Error) {
      fetchErrorMessage.value = error.message
    } else {
      const axiosError = error as AxiosError<{ message: string }>
      fetchErrorMessage.value =
        axiosError.response?.data?.message || 'There was an error fetching budget data.'
    }
  } finally {
    isSubmitting.value = false
  }
})

watch([isSubmitting, showSuccessModal], ([newValForSubmit, newValForSuccess]) => {
  if (newValForSubmit || newValForSuccess) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})

onMounted(async () => {
  try {
    isLoading.value = true
    await nextTick()
    await budgetStore.fetchBudgets(period.value)
  } catch (error) {
    if (error instanceof Error) {
      fetchErrorMessage.value = error.message
    } else {
      const axiosError = error as AxiosError<{ message: string }>
      fetchErrorMessage.value =
        axiosError.response?.data?.message || 'There was an error fetching budget data.'
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.bg {
  background: linear-gradient(180deg, #0b0e1a, #1a1446);
}

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
