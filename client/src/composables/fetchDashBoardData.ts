import { ref } from 'vue'
import type {
  TransactionWithDetails,
  AccountWithDetails,
  CategoryExpenseSummary,
} from '../../../api/src/types'
import axios from 'axios'
import api from '@/services/api'
import { useAccountStore } from '@/stores/account.store'
import { useCategoryStore } from '@/stores/category.store'

interface AccountsOverviewData {
  accounts: AccountWithDetails[]
  totalBalance: number
}

export const useDashboardData = () => {
  const isDashboardLoading = ref<boolean>(false)
  const dashBoardError = ref<string | null>(null)
  const accountsOverview = ref<AccountsOverviewData>({
    accounts: [],
    totalBalance: 0,
  })
  const recentTransactions = ref<TransactionWithDetails[]>([])
  const expenseByCategory = ref<CategoryExpenseSummary[]>([])
  const accountStore = useAccountStore()
  const categoryStore = useCategoryStore()

  const refreshDashboard = async () => {
    const endPoints = [
      '/accounts/fetch',
      '/transactions/recent',
      'transactions/expenses_aggregrate',
      'category/fetch',
    ]

    isDashboardLoading.value = true
    dashBoardError.value = null
    axios
      .all(endPoints.map((endpoint) => api.get(endpoint)))
      .then(
        axios.spread(
          (accountsResponse, transactionsResponse, expenseSummaryResponse, categoryResponse) => {
            accountsOverview.value = accountsResponse.data.data
            recentTransactions.value = transactionsResponse.data.data
            expenseByCategory.value = expenseSummaryResponse.data.data

            accountStore.setAccounts(accountsResponse.data.data.accounts)
            categoryStore.setCategories(categoryResponse.data.data)
          },
        ),
      )
      .catch((errors) => {
        console.error('Error fetching data:', errors)
        dashBoardError.value = 'There was an error fetching account data.'
      })
      .finally(() => {
        isDashboardLoading.value = false
      })
  }

  return {
    isDashboardLoading,
    dashBoardError,
    accountsOverview,
    recentTransactions,
    expenseByCategory,
    refreshDashboard,
  }
}
