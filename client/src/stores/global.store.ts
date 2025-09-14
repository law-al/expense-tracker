import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  const openTransactionModal = ref<boolean>(false)
  const openSetAccountModal = ref<boolean>(false)
  const openSetCategoryModal = ref<boolean>(false)
  const openRecordTransactionModal = ref<boolean>(false)

  const closeAllModals = () => {
    setTimeout(() => {
      openTransactionModal.value = false
    }, 50) // Delay to allow any closing animations to complete
    openRecordTransactionModal.value = false
    openSetCategoryModal.value = false
    openSetAccountModal.value = false
  }

  return {
    openTransactionModal,
    openSetAccountModal,
    openSetCategoryModal,
    openRecordTransactionModal,
    closeAllModals,
  }
})
