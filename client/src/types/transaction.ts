interface TransactionHistory {
  date: string
  transactions: (Pick<Transaction, 'date' | 'description' | 'amount'> & {
    transactionType: Pick<Transaction['transactionType'], 'id'>
    account: Pick<Transaction['account'], 'accountType'>
    category: Pick<Transaction['category'], 'name' | 'color' | 'icon'>
  })[]
}

type TransactionWithDetails = Pick<Transaction, 'date' | 'description' | 'amount'> & {
  account: Pick<Transaction['account'], 'name' | 'currency'>
  transactionType: Pick<Transaction['transactionType'], 'name'>
}

type Transaction = {
  id: string
  date: Date
  description: string
  amount: number
  accountId: string
  categoryId: string
  transactionTypeId: string
  userId: string
  createdAt: Date
  updatedAt: Date

  account: {
    id: string
    name: string
    currency: string
    currentBalance: number
    accountTypeId: string
    accountType: {
      name: string
    }
    userId: string
    createdAt: Date
    updatedAt: Date
  }

  category: {
    id: string
    name: string
    icon: string | null
    transactionTypeId: string
    color: string | null
    parentId: string | null
    userId: string
    createdAt: Date
    updatedAt: Date
  }

  transactionType: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    userId: string
  }
}

export type { TransactionWithDetails, TransactionHistory }
