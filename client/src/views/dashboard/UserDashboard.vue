<template>
  <app-layout>
    <loading-modal :is-submitting="isLoading">
      <template #statusText>
        <p class="text-white text-sm font-medium tracking-wide">Loading dashboard data...</p>
      </template>
    </loading-modal>

    <section>
      <!-- welcome name and notis bell -->
      <div class="w-full h-[10vh] flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <u-avatar src="https://github.com/benjamincanac.png" size="lg" />
          <div>
            <h2 class="text-lg font-semibold text-white">
              Welcome back, {{ getAccountOverview.username || 'User!' }}
            </h2>
            <p class="text-gray-400 text-sm">Here’s a summary of your finances</p>
          </div>
        </div>

        <div class="">
          <u-chip
            :text="getNofisCount || 0"
            size="3xl"
            color="info"
            :ui="{
              base: 'bg-white text-gray-900',
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
        <div class="px-4 py-2 rounded-lg mb-4 glass-card shadow-2xl">
          <UAccordion :items="items" class="h-full">
            <template #default="{ item }">
              <span class="font-extralight text-cool-gray text-xs">
                {{ item.label }}
              </span>
              <p class="text-2xl font-semibold text-white mt-1">
                {{ formatCurrency(getAccountOverview.totalBalance, 'USD') }}
              </p>
            </template>

            <!-- Accounts -->
            <template #content>
              <!-- error state -->
              <div v-if="!!fetchAccountError && !isLoading" class="text-red-500 text-sm">
                Error loading account data: {{ fetchAccountError }}
              </div>

              <!-- Break down details for account -->
              <div v-else class="flex flex-col gap-2 my-4">
                <div
                  v-for="account in getAccountOverview.accounts"
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
      </div>

      <!-- Transaction -->
      <div class="">
        <!-- Error Messages -->
        <div
          v-if="!!fetchTransactionError"
          class="mb-2 glass-card px-4 py-4 rounded-lg shadow-2xl flex items-center justify-center"
        >
          <p class="text-sm italic text-center text-red-500">
            Budget Error: {{ fetchTransactionError }}
          </p>
        </div>

        <!-- Recent transaction for account-->
        <div v-else class="px-4 py-4 rounded-lg mb-4 glass-card shadow-2xl text-soft-white">
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
              class="flex items-center justify-between px-4 py-3 rounded-lg odd:bg-gray-900/40 even:bg-gray-800/40"
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
      </div>

      <!-- Budget  -->
      <div class="">
        <!-- Error Messages -->
        <div
          v-if="fetchBudgetError"
          class="mb-2 glass-card px-4 py-4 rounded-lg shadow-2xl flex items-center justify-center"
        >
          <p class="text-sm italic text-center text-red-500">
            Budget Error: {{ fetchBudgetError }}
          </p>
        </div>
        <!-- Budget  -->
        <div v-else class="px-4 py-4 rounded-lg mb-4 glass-card shadow-2xl">
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
                  class="min-w-[140px] px-3 py-2 rounded-xl bg-gray-800/50 border border-gray-700 shadow-inner flex items-center gap-3"
                >
                  <div
                    class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    :style="{ backgroundColor: colorToHex(item.category.color || '#000000') }"
                  >
                    {{ item.percetage }}%
                  </div>
                  <span class="text-white text-sm font-medium">{{ item.category.name }}</span>
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
          class="mb-2 glass-card px-4 py-4 rounded-lg shadow-2xl flex items-center justify-center"
        >
          <p class="text-sm italic text-center text-red-500">
            Expense Error: {{ fetchExpenseError }}
          </p>
        </div>
        <!-- Expunse chart -->
        <div v-else class="px-4 py-4 rounded-lg mb-4 glass-card shadow-2xl">
          <header class="mb-4">
            <p class="font-semibold text-lg">Expense Chart</p>
            <p class="text-xs text-cool-gray">Your expense trends</p>
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
