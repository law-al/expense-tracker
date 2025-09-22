import api from '@/services/api'
import type { Budget, BudgetByCategory } from '@/types'
import axios from 'axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useBudgetStore = defineStore('budget', () => {
  let controller: AbortController | null = null
  const endpoints = ['/budget/total_budget', 'budget/total_budget_by_category']

  const budgets = ref<Budget | null>(null)
  const budgetByCategory = ref<BudgetByCategory[]>([])

  const getBudgets = computed(() => budgets.value)
  const getBudgetsByCategory = computed(() => budgetByCategory.value)

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

  return {
    budgets,
    budgetByCategory,
    getBudgets,
    getBudgetsByCategory,
    setBudgets,
    setBudgetsByCategory,
    fetchBudgets,
  }
})
