import { toRef } from 'vue'
import type {
  TransactionWithDetails,
  AccountWithDetails,
  CategoryExpenseSummary,
} from '../../../api/src/types'
import axios from 'axios'
import api from '@/services/api'
import { useAccountStore } from '@/stores/account.store'
import { reactive } from 'vue'

const sharedState = reactive({
  createdAt: new Date(),
  isDashboardLoading: false as boolean,
  dashBoardError: null as string | null,
  accountsOverview: { accounts: [] as AccountWithDetails[], totalBalance: 0 },
  recentTransactions: [] as TransactionWithDetails[],
  expenseByCategory: [] as CategoryExpenseSummary[],
})

export const useDashboardData = () => {
  const accountStore = useAccountStore()

  const refreshDashboard = async () => {
    sharedState.createdAt = new Date()

    console.log('Refreshing dashboard data...')
    const endPoints = [
      '/accounts/fetch',
      '/transactions/recent',
      'transactions/expenses_aggregrate',
    ]

    sharedState.isDashboardLoading = true
    sharedState.dashBoardError = null
    axios
      .all(endPoints.map((endpoint) => api.get(endpoint)))
      .then(
        axios.spread((accountsResponse, transactionsResponse, expenseSummaryResponse) => {
          sharedState.accountsOverview = accountsResponse.data.data
          sharedState.recentTransactions = transactionsResponse.data.data
          sharedState.expenseByCategory = expenseSummaryResponse.data.data

          accountStore.setAccounts(accountsResponse.data.data.accounts)
        }),
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
    refreshDashboard,
  }
}
