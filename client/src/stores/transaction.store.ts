import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTransactionStore = defineStore('transaction', () => {
  const selectedTransactionType = ref<string | null>(null)

  const getSeletedTransactionType = computed(() => selectedTransactionType.value)


  const setTransactionType = (type: string) => {
    selectedTransactionType.value = type
  }

  return { selectedTransactionType, getSeletedTransactionType, setTransactionType }
})
