<template>
  <app-layout>
    <section>
      <!-- Total Balance in the Account -->
      <div class="px-4 py-2 rounded-lg mb-4 glass-card shadow-2xl">
        <UAccordion :items="items" class="h-full">
          <template #default="{ item }">
            <span class="font-extralight text-cool-gray text-xs">
              {{ item.label }}
            </span>
            <p class="text-2xl font-semibold text-white mt-1">
              {{ formatCurrency(accountsOverview.totalBalance, 'USD') }}
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
                    {{ formatCurrency(account.currentBalance || 0, account.currency) }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </UAccordion>
      </div>

      <!-- Recent transaction -->
      <div class="px-4 py-4 rounded-lg mb-4 glass-card shadow-2xl text-soft-white">
        <header class="mb-4">
          <p class="font-semibold text-lg">Recent Transactions</p>
          <p class="text-xs text-cool-gray">Your latest transactions</p>
        </header>

        <div class="flex flex-col gap-4">
          <!-- Transaction item -->
          <div v-if="recentTxns.length === 0" class="">
            <p class="text-cool-gray text-sm">No recent transactions available.</p>
          </div>
          <div
            v-else
            v-for="(transaction, index) in recentTxns"
            :key="index"
            class="flex items-center justify-between px-4 py-3 rounded-lg"
            style="background-color: #1a1a2e"
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
                <span class="text-xs text-cool-gray">{{ formatDate(transaction.date) }}</span>
              </div>
            </div>
            <p
              class="text-sm font-semibold"
              :class="getTransactionAmountColor(transaction.transactionType.name)"
            >
              {{ formatCurrency(transaction.amount, transaction.account.currency) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Budget  -->
      <div class="px-4 py-4 rounded-lg mb-4 glass-card shadow-2xl">
        <header class="mb-4">
          <p class="font-semibold text-lg">Budgets</p>
          <p class="text-xs text-cool-gray">Your budget overview</p>
        </header>

        <div class="flex flex-col gap-4" style="color: #94a3b8">
          <div
            class="flex flex-col justify-between px-4 py-3 rounded-lg"
            style="background-color: #1a1a2e"
          >
            <div class="flex flex-col mb-2">
              <p class="text-sm font-semibold text-white">Monthly Budget</p>
              <span class="text-xs text-cool-gray"
                >Spent: <span>{{ formatCurrency(budgets?.totalExpenses || 0) }}</span> of
                <span>{{ formatCurrency(budgets?.totalBudgets || 0) }}</span>
              </span>
            </div>
            <percent-bar :percentage="budgets?.percentage || 0" />
          </div>

          <div class="w-full overflow-x-scroll scrollbar-hidden">
            <div class="flex flex-nowrap items-center gap-2 pb-2 cursor-pointer">
              <div
                v-for="item in budgetsByCategory"
                :key="item.categoryId"
                class="min-w-[120px] flex-shrink-0 rounded-4xl px-2 py-2 flex items-center gap-2"
                :style="{ background: `${colorToHex(item.category.color || '#000000')}20` }"
              >
                <div
                  class="w-[30px] h-[30px] rounded-full flex items-center justify-center"
                  :style="{
                    background: `conic-gradient(${colorToHex(item.category.color || '#000000')} 0% ${item.percetage}%, #1f2937 ${item.percetage}% 100%)`,
                  }"
                >
                  <span class="text-xs text-white font-medium">{{ item.percetage }}%</span>
                </div>
                <p class="text-white text-xs">{{ item.category.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expunse chart -->
      <div class="px-4 py-4 rounded-lg mb-4 glass-card shadow-2xl">
        <header class="mb-4">
          <p class="font-semibold text-lg">Expense Chart</p>
          <p class="text-xs text-cool-gray">Your expense trends</p>
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
import { formatCurrency, formatDate } from '@/utils/formatters'
import { colorToHex } from '@/utils/colorUtils'

const items = ref<AccordionItem[]>([
  {
    label: 'Total Balance',
  },
])

const categoryStore = useCategoryStore()
const {
  isDashboardLoading,
  dashBoardError,
  accountsOverview,
  recentTransactions: recentTxns,
  expenseByCategory: expenseSummary,
  budgets,
  budgetsByCategory,
  refreshDashboard,
} = useDashboardData()

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

<style scoped></style>
