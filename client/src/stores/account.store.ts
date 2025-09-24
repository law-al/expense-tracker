import { defineStore } from 'pinia'
import type { AccountWithDetails } from '@/types'
import { computed, ref } from 'vue'
import api from '@/services/api'

interface AccountsOverview {
  accounts: AccountWithDetails[]
  totalBalance: number
}

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref<Array<AccountWithDetails>>([])
  const accountOverview = ref<AccountsOverview>({ accounts: [], totalBalance: 0 })
  const selectedAccount = ref<AccountWithDetails | null>(null)

  // Computed
  const getAccounts = computed(() => accounts.value)
  const getAccountOverview = computed(() => accountOverview.value)

  // Methods
  const setAccounts = (newAccounts: Array<AccountWithDetails>) => {
    accounts.value = newAccounts
  }

  const setAccount = (account: AccountWithDetails) => {
    selectedAccount.value = account
  }

  const fetchUsersAccount = async () => {
    try {
      const response = await api.get('/accounts/fetch')
      if (response.status === 200) {
        accounts.value = response.data.data.accounts
        accountOverview.value = response.data.data
      }
    } catch (error) {
      console.log('Error fetching account:', error)
    }
  }

  return {
    accounts,
    selectedAccount,
    getAccounts,
    getAccountOverview,
    setAccount,
    setAccounts,
    fetchUsersAccount,
  }
})
