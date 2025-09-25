import api from '@/services/api'
import type { Budget, BudgetByCategory } from '@/types'
import axios from 'axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useBudgetStore = defineStore('budget', () => {
  let controller: AbortController | null = null
  const endpoints = ['/budget/total-budget', 'budget/total-budget-by-category']

  // State
  const budgets = ref<Budget | null>(null)
  const budgetByCategory = ref<BudgetByCategory[]>([])

  // Getters
  const getBudgets = computed(() => budgets.value)
  const getBudgetsByCategory = computed(() => budgetByCategory.value)

  // Methods
  const setBudgets = (data: Budget | null) => {
    budgets.value = data
  }

  const setBudgetsByCategory = (data: BudgetByCategory[]) => {
    budgetByCategory.value = data
  }

  const fetchBudgets = async (params: string = 'monthly') => {
    if (controller) {
      controller.abort()
    }

    controller = new AbortController()
    const signal = controller.signal
    axios
      .all(endpoints.map((endpoint) => api.get(endpoint, { params: { period: params }, signal })))
      .then(
        axios.spread((budgetResponse, budgetByCategoryResponse) => {
          budgets.value = budgetResponse.data.data
          budgetByCategory.value = budgetByCategoryResponse.data.data
        }),
      )
      .catch((error) => {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request was aborted')
        }
        throw error
      })
  }

  const fetchBudgetsByCategory = async (params: string = 'monthly') => {
    try {
      const response = await api.get('budget/total-budget-by-category', {
        params: { period: params },
      })
      if (response.status === 200) {
        budgetByCategory.value = response.data.data
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    budgets.value = null
    budgetByCategory.value = []
  }

  return {
    budgets,
    budgetByCategory,
    getBudgets,
    getBudgetsByCategory,
    setBudgets,
    setBudgetsByCategory,
    fetchBudgets,
    fetchBudgetsByCategory,
    logout,
  }
})
