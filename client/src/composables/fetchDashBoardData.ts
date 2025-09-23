import { toRef } from 'vue'
import type {
  AccountWithDetails,
  CategoryExpenseSummary,
  Budget,
  BudgetByCategory,
  TransactionWithDetails,
} from '@/types'
import axios from 'axios'
import api from '@/services/api'
import { useAccountStore } from '@/stores/account.store'
import { reactive } from 'vue'
import { useBudgetStore } from '@/stores/budget.store'

const sharedState = reactive({
  createdAt: new Date(),
  isDashboardLoading: false as boolean,
  dashBoardError: null as string | null,
  accountsOverview: { accounts: [] as AccountWithDetails[], totalBalance: 0 },
  recentTransactions: [] as TransactionWithDetails[],
  expenseByCategory: [] as CategoryExpenseSummary[],
  budgets: null as Budget | null,
  budgetByCategory: [] as BudgetByCategory[],
})

export const useDashboardData = () => {
  const accountStore = useAccountStore()
  const budgetStore = useBudgetStore()

  const refreshDashboard = async () => {
    sharedState.createdAt = new Date()

    console.log('Refreshing dashboard data...')
    const endPoints = [
      '/accounts/fetch',
      '/transactions/recent',
      '/transactions/expenses-aggregrate',
      '/budget/total-budget',
      'budget/total-budget-by-category',
    ]

    sharedState.isDashboardLoading = true
    sharedState.dashBoardError = null
    axios
      .all(endPoints.map((endpoint) => api.get(endpoint)))
      .then(
        axios.spread(
          (
            accountsResponse,
            transactionsResponse,
            expenseSummaryResponse,
            budgetResponse,
            budgetByCategoryResponse,
          ) => {
            sharedState.accountsOverview = accountsResponse.data.data
            sharedState.recentTransactions = transactionsResponse.data.data
            sharedState.expenseByCategory = expenseSummaryResponse.data.data
            sharedState.budgets = budgetResponse.data.data
            sharedState.budgetByCategory = budgetByCategoryResponse.data.data

            accountStore.setAccounts(accountsResponse.data.data.accounts)
            budgetStore.setBudgets(budgetResponse.data.data)
            budgetStore.setBudgetsByCategory(budgetByCategoryResponse.data.data)
          },
        ),
      )
      .catch((errors) => {
        console.error('Error fetching data:', errors)
        sharedState.dashBoardError = 'There was an error fetching account data.'
      })
      .finally(() => {
        sharedState.isDashboardLoading = false
      })

    console.log('Dashboard data refreshed.')
    console.log('Shared State:', sharedState)
  }

  return {
    isDashboardLoading: toRef(sharedState, 'isDashboardLoading'),
    dashBoardError: toRef(sharedState, 'dashBoardError'),
    accountsOverview: toRef(sharedState, 'accountsOverview'),
    recentTransactions: toRef(sharedState, 'recentTransactions'),
    expenseByCategory: toRef(sharedState, 'expenseByCategory'),
    budgets: toRef(sharedState, 'budgets'),
    budgetsByCategory: toRef(sharedState, 'budgetByCategory'),
    refreshDashboard,
  }
}
