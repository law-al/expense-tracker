import { defineStore } from 'pinia'
import type { Account } from '../../../api/src/types'
import { ref } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

export const useAccountStore = defineStore('accounts', () => {
  const router = useRouter()
  const accounts = ref<Array<Account>>([])

  const setAccounts = (newAccounts: Array<Account>) => {
    accounts.value = newAccounts
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

  return { accounts, setAccounts, getUsersAccount }
})
