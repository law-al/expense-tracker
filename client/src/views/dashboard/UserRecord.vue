<template>
  <app-layout>
    <!-- Loading -->
    <loading-modal :is-submitting="isLoading">
      <template #statusText>
        <p class="text-white italic text-sm font-medium tracking-wide animate-pulse">
          Loading transaction history...
        </p>
      </template>
    </loading-modal>

    <div class="min-h-[85vh]">
      <!-- Header -->
      <div class="w-full h-[10vh] flex items-center">
        <h2 class="text-xl font-light pb-4 border-b border-gray-800 w-full text-white">
          User Record
        </h2>
      </div>

      <!-- User Record Content -->
      <div class="h-[75vh] overflow-y-auto custom-scrollbar pr-1">
        <!-- Empty state -->
        <div
          v-if="getTransactionHistory.length === 0"
          class="h-full flex items-center justify-center"
        >
          <p class="text-gray-500 text-sm italic">No transactions available.</p>
        </div>

        <!-- Transaction groups -->
        <div v-else class="flex flex-col gap-6">
          <div
            v-for="transaction in getTransactionHistory"
            :key="transaction.date"
            class="bg-gray-900/50 backdrop-blur-xl rounded-sm border border-gray-800 shadow-sm overflow-hidden"
          >
            <!-- Date header -->
            <div class="px-4 py-2 bg-gray-950/70 border-b border-gray-800 sticky top-0 z-10">
              <p class="text-gray-300 text-xs font-medium tracking-wide">
                {{ transaction.date }}
              </p>
            </div>

            <!-- Transactions for that date -->
            <div class="flex flex-col divide-y divide-gray-800">
              <div
                v-for="(tx, n) in transaction.transactions"
                :key="n"
                class="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-800/50 transition"
              >
                <!-- Category Icon -->
                <div
                  class="w-[44px] h-[44px] rounded-full flex items-center justify-center shadow-inner"
                  :style="{ backgroundColor: `${colorToHex(tx.category.color as string)}22` }"
                >
                  <u-icon
                    :name="tx.category.icon || ''"
                    class="size-5"
                    :style="{ color: colorToHex(tx.category.color as string) }"
                  />
                </div>

                <!-- Category + Account -->
                <div class="flex flex-col flex-1">
                  <p class="text-white text-sm font-medium">
                    {{ tx.category.name }}
                  </p>
                  <p class="text-gray-500 text-xs font-light">
                    {{ tx.account.accountType.name }}
                  </p>
                </div>

                <!-- Amount -->
                <div class="text-right">
                  <p
                    class="text-sm font-semibold tracking-wide"
                    :class="setAmountColor(tx.transactionType.id)"
                  >
                    {{ formatCurrency(tx.amount) }}
                  </p>
                </div>
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
import { nextTick, onMounted, ref } from 'vue'

const transactionStore = useTransactionStore()
const { getTransactionHistory } = storeToRefs(transactionStore)

const isLoading = ref<boolean>(false)
const fetchErrorMessage = ref<string | null>('')

const setAmountColor = (transactionTypeId: number | string) => {
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

onMounted(async () => {
  try {
    isLoading.value = true
    fetchErrorMessage.value = ''

    await nextTick()

    await transactionStore.fetchTransactionHistory()
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 4px;
}
</style>
