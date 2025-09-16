import type { Budget, BudgetByCategory } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useBudgetStore = defineStore('budget', () => {
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

  return {
    budgets,
    budgetByCategory,
    getBudgets,
    getBudgetsByCategory,
    setBudgets,
    setBudgetsByCategory,
  }
})
