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
        <div class="flex items-center gap-4 pb-4 border-b border-white/10 w-full">
          <div
            class="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <u-icon name="i-mdi-history" class="size-6 text-white" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white tracking-tight">Transaction History</h2>
            <p class="text-sm text-gray-400">Your complete financial record</p>
          </div>
        </div>
      </div>

      <!-- User Record Content -->
      <div class="h-[75vh] overflow-y-auto custom-scrollbar pr-1 mt-6">
        <!-- Empty state -->
        <div
          v-if="getTransactionHistory.length === 0"
          class="h-full flex flex-col items-center justify-center gap-6"
        >
          <div
            class="w-24 h-24 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-3xl flex items-center justify-center"
          >
            <u-icon name="i-mdi-receipt-text-outline" class="size-12 text-gray-500" />
          </div>
          <div class="text-center">
            <p class="text-gray-400 text-lg font-medium mb-2">No transactions yet</p>
            <p class="text-gray-600 text-sm">Your transaction history will appear here</p>
          </div>
        </div>

        <!-- Transaction groups -->
        <div v-else class="flex flex-col gap-4 pb-6">
          <div
            v-for="transaction in getTransactionHistory"
            :key="transaction.date"
            class="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl overflow-hidden"
          >
            <!-- Date header -->
            <div
              class="px-6 py-4 bg-gradient-to-r from-black/30 via-black/20 to-black/30 border-b border-white/10 sticky top-0 z-10 backdrop-blur-xl"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center"
                >
                  <u-icon name="i-mdi-calendar" class="size-4 text-blue-400" />
                </div>
                <div>
                  <p class="text-white text-sm font-semibold">
                    {{ transaction.date }}
                  </p>
                  <p class="text-gray-500 text-xs">
                    {{ transaction.transactions.length }} transaction{{
                      transaction.transactions.length > 1 ? 's' : ''
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Transactions for that date -->
            <div class="flex flex-col">
              <div
                v-for="(tx, n) in transaction.transactions"
                :key="n"
                class="group w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all duration-200 border-b border-white/5 last:border-b-0"
              >
                <!-- Category Icon -->
                <div
                  class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm border transition-all duration-200 group-hover:scale-105"
                  :style="{
                    backgroundColor: `${colorToHex(tx.category.color as string)}15`,
                    borderColor: `${colorToHex(tx.category.color as string)}25`,
                  }"
                >
                  <u-icon
                    :name="tx.category.icon || ''"
                    class="size-6"
                    :style="{ color: colorToHex(tx.category.color as string) }"
                  />
                </div>

                <!-- Transaction Details -->
                <div class="flex flex-col flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <p class="text-white text-base font-semibold truncate">
                      {{ tx.category.name }}
                    </p>
                    <div
                      class="px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm"
                      :class="
                        tx.transactionType.id === 1 || tx.transactionType.id === 3
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      "
                    >
                      {{
                        tx.transactionType.id === 1 || tx.transactionType.id === 3
                          ? 'Expense'
                          : 'Income'
                      }}
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex items-center gap-2">
                      <u-icon
                        :name="tx.account.accountType.icon || ''"
                        class="size-4 text-gray-500"
                      />
                      <p class="text-gray-400 text-sm font-medium">
                        {{ tx.account.accountType.name }}
                      </p>
                    </div>
                    <span class="text-gray-600">•</span>
                    <p class="text-gray-500 text-xs">
                      {{
                        new Date().toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      }}
                    </p>
                  </div>
                </div>

                <!-- Amount -->
                <div class="text-right">
                  <p
                    class="text-lg font-bold tracking-tight"
                    :class="setAmountColor(tx.transactionType.id)"
                  >
                    {{ tx.transactionType.id === 1 || tx.transactionType.id === 3 ? '-' : '+'
                    }}{{ formatCurrency(tx.amount) }}
                  </p>
                  <div class="flex items-center justify-end gap-1 mt-1">
                    <div
                      class="w-2 h-2 rounded-full"
                      :class="
                        tx.transactionType.id === 1 || tx.transactionType.id === 3
                          ? 'bg-red-400'
                          : 'bg-green-400'
                      "
                    ></div>
                    <p class="text-xs text-gray-500">
                      {{
                        tx.transactionType.id === 1 || tx.transactionType.id === 3 ? 'Out' : 'In'
                      }}
                    </p>
                  </div>
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
      return 'text-red-400'
    case 2:
      return 'text-green-400'
    case 3:
      return 'text-red-400'
    case 4:
      return 'text-green-400'
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
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #4f46e5, #7c3aed);
  border-radius: 12px;
  border: 2px solid transparent;
  background-clip: content-box;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #6366f1, #8b5cf6);
  background-clip: content-box;
}
</style>
