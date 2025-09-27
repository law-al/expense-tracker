export type CategoryExpenseSummary = {
  categoryId: number | null
  categoryName?: string | null
  categoryColor?: string | null
  totalAmount: number | null
}

export type Category = {
  id: number
  name: string
  icon: string | null
  transactionTypeId: number
  color: string | null
  parentId: number | null
  userId: number | null
}
