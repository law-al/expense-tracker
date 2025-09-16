import { ref } from 'vue'

import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isAuthenticated = ref<boolean>(false)

  // STEP: Get user from localStorage if available
  const initializeUser = () => {
    const token = localStorage.getItem('token')
    if (token !== 'undefined') {
      isAuthenticated.value = true
    } else {
      isAuthenticated.value = false
    }
  }

  return { isAuthenticated, initializeUser }
})
