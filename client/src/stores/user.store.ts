import { ref } from 'vue'

import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isAuthenticated = ref<boolean>(false)

  // STEP: Get user from localStorage if available
  const initializeUser = () => {
    const token = localStorage.getItem('token')
    if (token !== 'undefined' && token !== null) {
      isAuthenticated.value = true
    } else {
      isAuthenticated.value = false
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return { isAuthenticated, initializeUser, logout }
})
