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

export const useDashboardDataV2 = () => {
  const accountStore = useAccountStore()
  const transactionStore = useTransactionStore()
  const budgetStore = useBudgetStore()
  const categoryStore = useCategoryStore()

  const refreshDashBoard = async () => {
    try {
      dashboardState.isLoading = true
      dashboardState.fetchErrorMessage = ''
      await accountStore.fetchUsersAccount()
      await transactionStore.fetchRecentTransactions()
      await transactionStore.fetchExpencesAggregrate()
      await budgetStore.fetchBudgets()
      await categoryStore.fetchExpenseCategories()
      await categoryStore.fetchIncomeCategories()
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        dashboardState.fetchErrorMessage = error.message
      } else {
        const axiosError = error as AxiosError<{ message: string }>
        dashboardState.fetchErrorMessage = axiosError.response?.data.message || 'An error occurred'
      }
    } finally {
      dashboardState.isLoading = false
    }
  }

  return {
    isLoading: toRef(dashboardState, 'isLoading'),
    fetchErrorMessage: toRef(dashboardState, 'fetchErrorMessage'),
    refreshDashBoard,
  }
}
