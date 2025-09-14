<template>
  <app-layout>
    <section>
      <!-- Total Balance in the Account -->
      <div class="px-4 py-2 rounded-lg mb-4 glass-card shadow-2xl">
        <UAccordion :items="items" class="h-full">
          <template #default="{ item }">
            <span class="font-extralight text-gray-400 text-xs">
              {{ item.label }}
            </span>
            <p class="text-2xl font-semibold text-white mt-1">
              {{ formattedCurrency(accountsOverview.totalBalance, 'USD') }}
            </p>
          </template>

          <template #content>
            <!-- loading -->
            <div v-if="isDashboardLoading" class="text-white">Loading account data...</div>
            <!-- error -->
            <div v-if="dashBoardError" class="text-red-500">{{ dashBoardError }}</div>

            <!-- Break down details -->
            <div v-if="!isDashboardLoading && !dashBoardError" class="flex flex-col gap-2 my-4">
              <div
                v-for="account in accountsOverview.accounts"
                :key="account.name"
                class="flex items-center gap-4 text-white"
              >
                <u-icon
                  :name="account.accountType.icon ?? 'i-ri-bank-line'"
                  class="size-6 text-white"
                />
                <div class="">
                  <span class="text-xs font-extralight">{{ account.accountType.name }}</span>
                  <p class="text-sm font-semibold text-white">
                    {{ formattedCurrency(account.currentBalance || 0, account.currency) }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </UAccordion>
      </div>

      <!-- Recent transaction -->
      <div class="px-4 py-4 rounded-lg mb-4 glass-card shadow-2xl">
        <header class="mb-4">
          <p class="font-semibold text-lg">Recent Transactions</p>
          <p class="text-xs text-gray-400">Your latest transactions</p>
        </header>

        <div class="flex flex-col gap-4">
          <!-- Transaction item -->
          <div v-if="recentTxns.length === 0" class="">
            <p class="text-gray-400 text-sm">No recent transactions available.</p>
          </div>
          <div
            v-else
            v-for="(transaction, index) in recentTxns"
            :key="index"
            class="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg"
          >
            <div class="flex items-center gap-4">
              <u-icon
                :name="getTransactionLogo(transaction.transactionType.name)"
                class="size-6"
                :class="getTransactionAmountColor(transaction.transactionType.name)"
              />
              <div class="flex flex-col">
                <p class="text-sm font-semibold text-white">
                  {{ transaction.description || 'Transfer' }}
                </p>
                <span class="text-xs text-gray-400">{{ formattedDate(transaction.date) }}</span>
              </div>
            </div>
            <p
              class="text-sm font-semibold"
              :class="getTransactionAmountColor(transaction.transactionType.name)"
            >
              {{ formattedCurrency(transaction.amount, transaction.account.currency) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Budget  -->
      <div class="px-4 py-4 rounded-lg mb-4 glass-card shadow-2xl">
        <header class="mb-4">
          <p class="font-semibold text-lg">Budgets</p>
          <p class="text-xs text-gray-400">Your budget overview</p>
        </header>

        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg">
            <div class="flex flex-col">
              <p class="text-sm font-semibold text-white">Monthly Groceries</p>
              <span class="text-xs text-gray-400">Spent: $150 of $300</span>
            </div>
            <div class="w-24 h-4 bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-green-500" style="width: 50%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expunse chart -->
      <div class="px-4 py-4 rounded-lg mb-4 glass-card shadow-2xl">
        <header class="mb-4">
          <p class="font-semibold text-lg">Expense Chart</p>
          <p class="text-xs text-gray-400">Your expense trends</p>
        </header>

        <ExpenseChart :data="expenseSummary" :loading="isDashboardLoading" />
      </div>
    </section>
  </app-layout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/app/AppLayout.vue'
import ExpenseChart from '@/components/chart/ExpenseChart.vue'
import type { AccordionItem } from '@nuxt/ui'
import { onMounted, ref } from 'vue'
import { useDashboardData } from '@/composables/fetchDashBoardData'
import { useCategoryStore } from '@/stores/category.store'
import api from '@/services/api'
import axios from 'axios'

const categoryStore = useCategoryStore()

const items = ref<AccordionItem[]>([
  {
    label: 'Total Balance',
  },
])

const {
  isDashboardLoading,
  dashBoardError,
  accountsOverview,
  recentTransactions: recentTxns,
  expenseByCategory: expenseSummary,
  refreshDashboard,
} = useDashboardData()

// Helper functions
const formattedCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount)
}

const formattedDate = (dateString: Date) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

const getTransactionLogo = (transactionType: string) => {
  switch (transactionType) {
    case 'expense':
      return 'i-solar-arrow-down-linear'
    case 'income':
      return 'i-solar-arrow-up-linear'
    case 'transfer_from':
      return 'i-solar-arrow-right-linear'
    case 'transfer_to':
      return 'i-solar-arrow-left-linear'
    default:
      return 'i-solar-coin-dollar-bold'
  }
}

const getTransactionAmountColor = (transactionType: string) => {
  switch (transactionType) {
    case 'expense':
      return 'text-red-500'
    case 'income':
      return 'text-green-500'
    case 'transfer_from':
      return 'text-red-500'
    case 'transfer_to':
      return 'text-blue-500'
    default:
      return 'text-white'
  }
}

onMounted(async () => {
  await refreshDashboard()
  const endPoints = ['category/fetch_expense', 'category/fetch_income']

  isDashboardLoading.value = true
  dashBoardError.value = null
  axios
    .all(endPoints.map((endpoint) => api.get(endpoint)))
    .then(
      axios.spread((expenseCategoryResponse, incomeCategoryResponse) => {
        categoryStore.setCategories(expenseCategoryResponse.data.data, 'expense')
        categoryStore.setCategories(incomeCategoryResponse.data.data, 'income')
      }),
    )
    .catch((errors) => {
      console.error('Error fetching data:', errors)
      dashBoardError.value = 'There was an error fetching account data.'
    })
    .finally(() => {
      isDashboardLoading.value = false
    })
})
</script>

<style scoped>
.glass-card {
  background: rgba(26, 20, 70, 0.35); /* dark indigo tint */
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0));
  pointer-events: none;
}
</style>
