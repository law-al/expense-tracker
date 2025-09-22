<template>
  <app-layout>
    <div class="min-h-[85vh]">
      <h1 class="text-2xl font-bold pb-4 border-b border-gray-700">User Record</h1>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center items-center h-96">
        <div class="">
          <p>Loading</p>
        </div>
      </div>

      <!-- User record content goes here -->

      <div class="flex flex-col gap-2">
        <div
          v-for="transaction in getTransactionHistory"
          :key="transaction.date"
          class="border-b border-gray-700 py-4"
        >
          <p class="text-soft-white text-sm mb-3">{{ transaction.date }}</p>
          <div
            v-for="(tx, n) in transaction.transactions"
            :key="n"
            class="w-full p-2 flex items-center gap-4 mb-2"
          >
            <div
              class="w-[40px] h-[40px] rounded-full flex items-center justify-center"
              :style="{ backgroundColor: `${colorToHex(tx.category.color as string)}33` }"
            >
              <u-icon
                :name="tx.category.icon || ''"
                class="size-4"
                :style="{ color: colorToHex(tx.category.color as string) }"
              />
            </div>

            <div class="flex justify-between items-center flex-1">
              <div class="">
                <p class="text-white font-light text-sm">{{ tx.category.name }}</p>
                <p class="text-cool-gray text-xs font-extralight">
                  {{ tx.account.accountType.name }}
                </p>
              </div>

              <div class="mt-2">
                <p class="text-sm font-semibold" :class="setAmountColor(tx.transactionType.id)">
                  {{ formatCurrency(tx.amount) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script setup lang="ts">
import { useTransactionStore } from '@/stores/transaction.store'
import { colorToHex } from '@/utils/colorUtils'
import { formatCurrency } from '@/utils/formatters'
import type { AxiosError } from 'axios'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const transactionStore = useTransactionStore()
const { getTransactionHistory } = storeToRefs(transactionStore)

const isLoading = ref<boolean>(false)
const fetchErrorMessage = ref<string | null>('')

const setAmountColor = (transactionTypeId: number) => {
  switch (transactionTypeId) {
    case 1:
      return 'text-red-500'
    case 2:
      return 'text-green-500'
    case 3:
      return 'text-red-500'
    case 4:
      return 'text-green-500'
    default:
      return 'text-white'
  }
}

onMounted(() => {
  try {
    isLoading.value = true
    fetchErrorMessage.value = ''
    transactionStore.fetchTransactionHistory()
  } catch (error) {
    if (error instanceof Error) {
      fetchErrorMessage.value = error.message
    } else {
      const axiosError = error as AxiosError<{ message: string }>
      fetchErrorMessage.value = axiosError.response?.data.message || 'An unexpected error occurred'
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped></style>
