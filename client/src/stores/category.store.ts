import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Category } from '@/types'

import api from '@/services/api'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const selectedCategory = ref<Category | null>(null)
  const subCategories = ref<Category[]>([])
  const selectedSubCategory = ref<Category | null>(null)

  const expenseCategories = ref<Category[]>([])
  const incomeCategories = ref<Category[]>([])

  // Getters
  const getCategories = computed(() => categories.value)
  const getSubCategories = computed(() => subCategories.value)
  const getExpenseCategories = computed(() => expenseCategories.value)
  const getIncomeCategories = computed(() => incomeCategories.value)
  const getSelectedCategory = computed(() => selectedCategory.value)
  const getSelectedSubCategory = computed(() => selectedSubCategory.value)

  // Methods
  const setCategory = (newCategories: Category | null) => {
    selectedCategory.value = newCategories
  }

  const setCategories = (newCategories: Category[], type: 'expense' | 'income') => {
    if (type === 'expense') {
      expenseCategories.value = newCategories
    } else if (type === 'income') {
      incomeCategories.value = newCategories
    }
  }

  const setSubCategory = (newSubCategories: Category | null) => {
    selectedSubCategory.value = newSubCategories
  }

  const fetchExpenseCategories = async () => {
    try {
      const response = await api.get('/category/fetch-expense')
      if (response.status === 200) {
        expenseCategories.value = response.data.data
      }
    } catch (error) {
      throw error
    }
  }

  const fetchIncomeCategories = async () => {
    try {
      const response = await api.get('/category/fetch-income')
      if (response.status === 200) {
        incomeCategories.value = response.data.data
      }
    } catch (error) {
      throw error
    }
  }

  const fetchSubCategoriesById = async (id: number) => {
    try {
      const response = await api.get(`/category/sub-category/${id}`)
      if (response.status === 200) {
        subCategories.value = response.data.data
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    categories.value = []
    subCategories.value = []
    expenseCategories.value = []
    incomeCategories.value = []
    selectedCategory.value = null
    selectedSubCategory.value = null
  }

  return {
    categories,
    subCategories,
    expenseCategories,
    incomeCategories,
    selectedCategory,
    selectedSubCategory,

    getCategories,
    getSubCategories,
    getExpenseCategories,
    getIncomeCategories,
    getSelectedCategory,
    getSelectedSubCategory,

    setSubCategory,
    setCategories,
    setCategory,

    fetchExpenseCategories,
    fetchIncomeCategories,
    fetchSubCategoriesById,

    logout,
  }
})
