import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '@/types'

import api from '@/services/api'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const selectedCategory = ref<Category | null>(null)
  const subCategories = ref<Category[]>([])
  const selectedSubCategory = ref<Category | null>(null)

  const expenseCategories = ref<Category[]>([])
  const incomeCategories = ref<Category[]>([])

  // const setCategories = (newCategories: Category[]) => {
  //   categories.value = newCategories
  // }

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

  const getSubCategoriesById = async (id: number) => {
    try {
      const response = await api.get(`/category/sub-category/${id}`)
      if (response.status === 200) {
        subCategories.value = response.data.data
      }
    } catch (error) {
      throw error
    }
  }

  return {
    selectedCategory,
    subCategories,
    setCategories,
    expenseCategories,
    incomeCategories,
    setSubCategory,
    selectedSubCategory,
    categories,
    setCategory,

    getSubCategoriesById,
  }
})
