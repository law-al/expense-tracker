import api from '@/services/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { TransactionHistory } from '@/types'

export const useTransactionStore = defineStore('transaction', () => {
  let controller: AbortController | null = null

  const selectedTransactionType = ref<string | null>(null)
  const transactionHistory = ref<Array<TransactionHistory>>([])

  const getSeletedTransactionType = computed(() => selectedTransactionType.value)
  const getTransactionHistory = computed(() => transactionHistory.value)

  const setTransactionType = (type: string) => {
    selectedTransactionType.value = type
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
    setTransactionType,
    fetchTransactionHistory,
  }
})
