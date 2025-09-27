type AccountWithDetails = {
  id: number
  name: string
  currency: 'USD' | 'NGN'
  currentBalance: number | null

  accountType: {
    name: string
    icon: string | null
    color: string | null
  }

  transactions: {
    id: number
    amount: number
    date: Date
    transactionType: {
      name: string
    }
  }[]
}

type AccountType = {
  id: number
  name: string
  color: string | null
  icon: string | null
}

export type { AccountWithDetails, AccountType }
