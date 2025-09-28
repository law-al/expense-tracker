<template>
  <app-layout>
    <loading-modal :is-submitting="isLoading">
      <template #statusText>
        <p class="text-white italic text-sm font-medium tracking-wide animate-pulse">
          Loading dashboard data...
        </p>
      </template>
    </loading-modal>

    <section>
      <!-- welcome name and notis bell -->
      <div class="w-full h-[10vh] flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <u-avatar src="https://github.com/benjamincanac.png" size="lg" />
          <div>
            <h2 class="text-xl font-bold text-white tracking-tight">
              Welcome back, {{ getAccountOverview.username || 'User!' }}
            </h2>
            <p class="text-gray-300 text-base font-medium">Here's a summary of your finances</p>
          </div>
        </div>

        <div class="">
          <u-chip
            :text="getNofisCount || 0"
            size="3xl"
            color="info"
            :ui="{
              base: 'bg-white text-gray-900 font-bold',
              root: '',
            }"
          >
            <u-button
              icon="i-mingcute-notification-line"
              @click="handleNotiClick"
              color="error"
              variant="outline"
              :ui="{
                base: 'text-white ring-white cursor-pointer',
              }"
            />
          </u-chip>

          <notification-panel
            :open-notifications="openNotiPanel"
            @close-notifications="openNotiPanel = false"
          />
        </div>
      </div>

      <div class="">
        <!-- Total Balance in the Account -->
        <div class="px-6 py-4 rounded-lg mb-4 premium-card shadow-2xl">
          <UAccordion :items="items" class="h-full">
            <template #default="{ item }">
              <span class="font-medium text-gray-300 text-sm uppercase tracking-wider">
                {{ item.label }}
              </span>
              <p class="text-3xl font-black text-white mt-2 tracking-tight">
                {{ formatCurrency(getAccountOverview.totalBalance, 'USD') }}
              </p>
            </template>

            <!-- Accounts -->
            <template #content>
              <!-- error state -->
              <div
                v-if="!!fetchAccountError && !isLoading"
                class="text-red-400 text-base font-medium bg-red-900/20 p-3 rounded-lg border border-red-500/30"
              >
                Error loading account data: {{ fetchAccountError }}
              </div>

              <!-- Break down details for account -->
              <div v-else class="flex flex-col gap-3 my-5">
                <div
                  v-for="account in getAccountOverview.accounts"
                  :key="account.name"
                  class="flex items-center gap-4 text-white p-3 rounded-lg bg-gray-800/30 border border-gray-700/50"
                >
                  <u-icon
                    :name="account.accountType.icon ?? 'i-ri-bank-line'"
                    class="size-7 text-blue-400"
                  />
                  <div class="">
                    <span class="text-sm font-medium text-gray-300 uppercase tracking-wide">{{
                      account.accountType.name
                    }}</span>
                    <p class="text-lg font-bold text-white mt-1">
                      {{ formatCurrency(account.currentBalance || 0, account.currency) }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </UAccordion>
        </div>
      </div>

      <!-- Transaction -->
      <div class="">
        <!-- Error Messages -->
        <div
          v-if="!!fetchTransactionError"
          class="mb-2 premium-card px-6 py-4 rounded-lg shadow-2xl flex items-center justify-center"
        >
          <p
            class="text-base font-medium text-center text-red-400 bg-red-900/20 p-3 rounded border border-red-500/30"
          >
            Budget Error: {{ fetchTransactionError }}
          </p>
        </div>

        <!-- Recent transaction for account-->
        <div v-else class="px-6 py-5 rounded-lg mb-4 premium-card shadow-2xl text-soft-white">
          <header class="mb-5">
            <p class="font-bold text-xl text-white tracking-tight">Recent Transactions</p>
            <p class="text-sm text-gray-300 font-medium mt-1">Your latest transactions</p>
          </header>

          <div class="flex flex-col gap-3">
            <!-- Transaction item -->
            <div v-if="recentTxns.length === 0" class="">
              <p class="text-gray-400 text-base font-medium text-center py-6">
                No recent transactions available.
              </p>
            </div>
            <div
              v-else
              v-for="(transaction, index) in recentTxns"
              :key="index"
              class="flex items-center justify-between px-5 py-4 rounded-lg odd:bg-gray-900/40 even:bg-gray-800/40 border border-gray-700/30"
            >
              <div class="flex items-center gap-4">
                <u-icon
                  :name="getTransactionLogo(transaction.transactionType.name)"
                  class="size-7"
                  :class="getTransactionAmountColor(transaction.transactionType.name)"
                />
                <div class="flex flex-col">
                  <p class="text-base font-bold text-white">
                    {{ transaction.description || 'Transfer' }}
                  </p>
                  <span class="text-sm text-gray-300 font-medium">{{
                    formatDate(transaction.date)
                  }}</span>
                </div>
              </div>
              <p
                class="text-base font-bold tracking-tight"
                :class="getTransactionAmountColor(transaction.transactionType.name)"
              >
                {{ formatCurrency(transaction.amount, transaction.account.currency) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget  -->
      <div class="">
        <!-- Error Messages -->
        <div
          v-if="fetchBudgetError"
          class="mb-2 premium-card px-6 py-4 rounded-lg shadow-2xl flex items-center justify-center"
        >
          <p
            class="text-base font-medium text-center text-red-400 bg-red-900/20 p-3 rounded border border-red-500/30"
          >
            Budget Error: {{ fetchBudgetError }}
          </p>
        </div>
        <!-- Budget  -->
        <div v-else class="px-6 py-5 rounded-lg mb-4 premium-card shadow-2xl">
          <header class="mb-5">
            <p class="font-bold text-xl text-white tracking-tight">Budgets</p>
            <p class="text-sm text-gray-300 font-medium mt-1">Your budget overview</p>
          </header>

          <div class="flex flex-col gap-4" style="color: #94a3b8">
            <div
              class="flex flex-col justify-between px-5 py-4 rounded-lg border border-gray-600/50"
              style="background-color: #1a1a2e"
            >
              <div class="flex flex-col mb-3">
                <p class="text-lg font-bold text-white">Monthly Budget</p>
                <span class="text-sm text-gray-300 font-medium mt-1"
                  >Spent:
                  <span class="font-bold text-red-400">{{
                    formatCurrency(budgets?.totalExpenses || 0)
                  }}</span>
                  of
                  <span class="font-bold text-green-400">{{
                    formatCurrency(budgets?.totalBudgets || 0)
                  }}</span>
                </span>
              </div>
              <percent-bar :percentage="budgets?.percentage || 0" />
            </div>

            <div class="w-full overflow-x-scroll scrollbar-hidden">
              <div class="flex flex-nowrap items-center gap-3 pb-2 cursor-pointer">
                <div
                  v-for="item in budgetsByCategory"
                  :key="item.categoryId"
                  class="min-w-[150px] px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 shadow-inner flex items-center gap-3"
                >
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white"
                    :style="{ backgroundColor: colorToHex(item.category.color || '#000000') }"
                  >
                    {{ item.percetage }}%
                  </div>
                  <span class="text-white text-base font-semibold">{{ item.category.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expense -->
      <div class="">
        <!-- Error Messages -->
        <div
          v-if="fetchExpenseError"
          class="mb-2 premium-card px-6 py-4 rounded-lg shadow-2xl flex items-center justify-center"
        >
          <p
            class="text-base font-medium text-center text-red-400 bg-red-900/20 p-3 rounded border border-red-500/30"
          >
            Expense Error: {{ fetchExpenseError }}
          </p>
        </div>
        <!-- Expense chart -->
        <div v-else class="px-6 py-5 rounded-lg mb-4 premium-card shadow-2xl">
          <header class="mb-5">
            <p class="font-bold text-xl text-white tracking-tight">Expense Chart</p>
            <p class="text-sm text-gray-300 font-medium mt-1">Your expense trends</p>
          </header>

          <ExpenseChart
            v-if="expenseSummary.length > 0"
            :data="expenseSummary"
            :loading="isLoading"
          />
        </div>
      </div>
    </section>
  </app-layout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/app/AppLayout.vue'
import ExpenseChart from '@/components/chart/ExpenseChart.vue'
import type { AccordionItem } from '@nuxt/ui'
import { onMounted, ref } from 'vue'
import { useDashboardDataV2 } from '@/composables/fetchDashBoardData'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { colorToHex } from '@/utils/colorUtils'
import { useAccountStore } from '@/stores/account.store'
import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/stores/transaction.store'
import { useBudgetStore } from '@/stores/budget.store'
import NotificationPanel from '@/components/common/NotificationPanel.vue'
import { nextTick } from 'vue'
import { useNotificationStore } from '@/stores/notification.store'

const accountStore = useAccountStore()
const notificationStore = useNotificationStore()
const { getAccountOverview } = storeToRefs(accountStore)
const { getNofisCount } = storeToRefs(notificationStore)
const transactionStore = useTransactionStore()
const { getRecentTransactions: recentTxns, getExpenseAggregrate: expenseSummary } =
  storeToRefs(transactionStore)
const budgetStore = useBudgetStore()
const { getBudgets: budgets, getBudgetsByCategory: budgetsByCategory } = storeToRefs(budgetStore)
const {
  isLoading,
  fetchAccountError,
  fetchBudgetError,
  fetchExpenseError,
  fetchTransactionError,
  refreshDashBoard,
} = useDashboardDataV2()

const items = ref<AccordionItem[]>([
  {
    label: 'Total Balance',
  },
])

const openNotiPanel = ref<boolean>(false)

const getTransactionLogo = (transactionType: string) => {
  switch (transactionType) {
    case 'expense':
      return 'i-solar-arrow-down-linear'
    case 'income':
      return 'i-solar-arrow-up-linear'
    case 'transfer-out':
      return 'i-solar-arrow-right-linear'
    case 'transfer-in':
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
    case 'transfer-out':
      return 'text-red-500'
    case 'transfer-in':
      return 'text-blue-500'
    default:
      return 'text-white'
  }
}

const handleNotiClick = async () => {
  openNotiPanel.value = true
  await nextTick()
}

onMounted(async () => {
  await refreshDashBoard()
})
</script>

<style scoped></style>
