import type { Transaction } from '../../../api/src/types'

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

export type { TransactionWithDetails, TransactionHistory }
