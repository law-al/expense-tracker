export interface Budget {
  totalBudgets: number
  totalExpenses: number
  percentage: number
}

export interface BudgetByCategory {
  categoryId: number
  category: {
    name: string | undefined
    color: string | undefined | null
    icon: string | undefined | null
  }
  totalBudget: number
  totalExpense: number
  percetage: number
}
