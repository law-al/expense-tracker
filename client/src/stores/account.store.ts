import { defineStore } from 'pinia'
import type { AccountWithDetails } from '../../../api/src/types'
import { ref } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

export const useAccountStore = defineStore('accounts', () => {
  const router = useRouter()
  const accounts = ref<Array<AccountWithDetails>>([])
  const selectedAccount = ref<AccountWithDetails | null>(null)

  const setAccounts = (newAccounts: Array<AccountWithDetails>) => {
    accounts.value = newAccounts
  }

  const setAccount = (account: AccountWithDetails) => {
    selectedAccount.value = account
  }

  const getUsersAccount = async () => {
    try {
      const response = await api.get('/accounts/fetch')
      if (response.status === 200) {
        accounts.value = response.data.data
        if (response.data?.data.accounts.length > 0) {
          router.replace('/dashboard')
          console.log('Account exist for user')
        } else {
          router.replace('/create-account')
          console.log('Account does not exist, proceed to create account')
        }
      }
    } catch (error) {
      console.log('Error fetching account:', error)
    }
  }

  return { accounts, selectedAccount, setAccount, setAccounts, getUsersAccount }
})
