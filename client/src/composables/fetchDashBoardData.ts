import { toRef } from 'vue'
import { AxiosError } from 'axios'
import { useAccountStore } from '@/stores/account.store'
import { reactive } from 'vue'
import { useBudgetStore } from '@/stores/budget.store'
import { useTransactionStore } from '@/stores/transaction.store'
import { useCategoryStore } from '@/stores/category.store'

const dashboardState = reactive({
  isLoading: false as boolean,
  fetchErrorMessage: null as string | null,
})

const dashboardError = {
  fetchAccountError: null as string | null,
  fetchTransactionError: null as string | null,
  fetchExpenseError: null as string | null,
  fetchBudgetError: null as string | null,
  fetchCategoryError: null as string | null,
}

const dashboardErrorKeys = Object.keys(dashboardError) as Array<keyof typeof dashboardError>

export const useDashboardDataV2 = () => {
  const accountStore = useAccountStore()
  const transactionStore = useTransactionStore()
  const budgetStore = useBudgetStore()
  const categoryStore = useCategoryStore()

  const refreshDashBoard = async () => {
    const allFetches = [
      accountStore.fetchUsersAccount(),
      transactionStore.fetchRecentTransactions(),
      transactionStore.fetchExpencesAggregrate(),
      budgetStore.fetchBudgets(),
      categoryStore.fetchExpenseCategories(),
      categoryStore.fetchIncomeCategories(),
    ]

    dashboardState.isLoading = true

    const results = await Promise.allSettled(allFetches)
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const errorKey =
          index === 5 || index === 6 ? dashboardErrorKeys[5] : dashboardErrorKeys[index]
        const error = result.reason
        if (error instanceof Error) {
          dashboardError[errorKey] = error.message
        } else {
          const axiosError = error as AxiosError<{ message: string }>
          dashboardError[errorKey] = axiosError.response?.data.message || 'An error occurred'
        }
      }
    })

    dashboardState.isLoading = false
  }

  return {
    isLoading: toRef(dashboardState, 'isLoading'),
    fetchAccountError: toRef(dashboardError, 'fetchAccountError'),
    fetchTransactionError: toRef(dashboardError, 'fetchTransactionError'),
    fetchExpenseError: toRef(dashboardError, 'fetchExpenseError'),
    fetchBudgetError: toRef(dashboardError, 'fetchBudgetError'),
    fetchCategoryError: toRef(dashboardError, 'fetchCategoryError'),
    refreshDashBoard,
  }
}
