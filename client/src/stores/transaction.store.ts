import api from '@/services/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CategoryExpenseSummary, TransactionHistory, TransactionWithDetails } from '@/types'

export const useTransactionStore = defineStore('transaction', () => {
  let controller: AbortController | null = null

  // State
  const selectedTransactionType = ref<string | null>(null)
  const recentTransactions = ref<Array<TransactionWithDetails>>([])
  const expenseAggregrate = ref<Array<CategoryExpenseSummary>>([])
  const transactionHistory = ref<Array<TransactionHistory>>([])

  // Getters
  const getSeletedTransactionType = computed(() => selectedTransactionType.value)
  const getTransactionHistory = computed(() => transactionHistory.value)
  const getRecentTransactions = computed(() => recentTransactions.value)
  const getExpenseAggregrate = computed(() => expenseAggregrate.value)

  // Methods
  const setTransactionType = (type: string) => {
    selectedTransactionType.value = type
  }

  const fetchRecentTransactions = async () => {
    try {
      const response = await api.get('/transactions/recent')
      if (response.status === 200) {
        console.log('Recent transactions fetched successfully:', response.data)
        recentTransactions.value = response.data.data
      }
    } catch (error) {
      throw error
    }
  }

  const fetchExpencesAggregrate = async () => {
    try {
      const response = await api.get('/transactions/expenses-aggregrate')
      if (response.status === 200) {
        expenseAggregrate.value = response.data.data
      }
    } catch (error) {
      throw error
    }
  }

  const fetchTransactionHistory = async (params: string = '2025') => {
    if (controller) {
      controller.abort()
    }

    controller = new AbortController()
    const signal = controller.signal
    try {
      const response = await api.get('/transactions/history', {
        params: { period: params },
        signal,
      })
      if (response.status === 200) {
        console.log('Transaction history fetched successfully:', response.data)
        transactionHistory.value = response.data.data
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request was aborted')
      }
      throw error
    }
  }

  return {
    selectedTransactionType,
    getSeletedTransactionType,
    getTransactionHistory,
    getRecentTransactions,
    getExpenseAggregrate,
    setTransactionType,
    fetchTransactionHistory,
    fetchRecentTransactions,
    fetchExpencesAggregrate,
  }
})
