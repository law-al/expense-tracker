<template>
  <UDrawer
    v-model:open="openAddTransactionView"
    should-scale-background
    set-background-color-on-scale
    :dismissible="false"
    :handle="false"
    :overlay="false"
    title="Select an Account"
    description="Choose an account to associate with this transaction."
    :ui="{
      content: 'z-100',
      body: 'bg-transparent !ring-0 !rounded-none !border-0 !p-0 !mt-0 ',
      header: 'hidden',
      container: '!rounded-none !border-0 !p-0',
    }"
    class="max-w-md !h-[100%] !max-h-[100%] bg-gradient-to-br from-[#0a0a12] via-[#0f0f1a] to-[#141427] !border-0 !ring-0 text-white !p-0 !mt-0 backdrop-blur-xl"
  >
    <template #body>
      <!-- Header -->
      <div
        class="w-full flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-xl"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 bg-gradient-to-br from-indigo-600/20 to-purple-700/20 rounded-2xl flex items-center justify-center border border-indigo-500/30"
          >
            <u-icon name="i-mdi-plus-circle" class="size-5 text-indigo-400" />
          </div>
          <div>
            <h2 class="text-white font-bold text-xl tracking-tight">Add Transaction</h2>
            <p class="text-gray-400 text-sm">Choose transaction type</p>
          </div>
        </div>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          size="xl"
          @click="emit('closeAddTransactionView')"
        />
      </div>

      <!-- Transaction Options -->
      <div class="flex flex-col gap-3 p-6">
        <div
          v-for="item in transactionItems"
          :key="item.name"
          @click="handleOpenAndSet(item.title)"
          class="premium-transaction-item group flex items-center gap-4 p-5 cursor-pointer rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <!-- Icon -->
          <div
            class="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:border-white/30 transition-all duration-200 shadow-lg"
          >
            <u-icon
              :name="item.icon"
              class="size-7 text-indigo-400 group-hover:text-indigo-300 transition-colors"
            />
          </div>

          <!-- Content -->
          <div class="flex-1">
            <p
              class="text-white text-base font-semibold group-hover:text-gray-100 transition-colors"
            >
              {{ item.name }}
            </p>
            <p class="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
              {{ getTransactionDescription(item.name) }}
            </p>
          </div>

          <!-- Arrow -->
          <div
            class="w-8 h-8 bg-white/5 border border-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
          >
            <u-icon
              name="i-mingcute-right-line"
              class="size-4 text-gray-500 group-hover:text-white transition-colors"
            />
          </div>
        </div>
      </div>
    </template>
  </UDrawer>

  <set-account
    :open-account-view="openSetAccountModal"
    @close-account-view="openSetAccountModal = false"
    @finish-transaction-and-dismiss="finishTransactionAndDismiss"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SetAccount from './SetAccount.vue'
import { useTransactionStore } from '@/stores/transaction.store'
import { useGlobalStore } from '@/stores/global.store'
import { storeToRefs } from 'pinia'

interface TransactionItem {
  name: string
  title: string
  icon: string
}

const transactionItems: TransactionItem[] = [
  {
    name: 'Income',
    title: 'income',
    icon: 'i-ph-trend-up-duotone',
  },
  {
    name: 'Expense',
    title: 'expense',
    icon: 'i-ph-trend-down-duotone',
  },
]

const props = defineProps<{
  openAddTransactionView: boolean
}>()
const openAddTransactionView = ref(props.openAddTransactionView)
const emit = defineEmits<{
  (e: 'closeAddTransactionView'): void
  (e: 'finishTransactionAndDismiss'): void
}>()

const globalStore = useGlobalStore()
const { openSetAccountModal } = storeToRefs(globalStore)
const transactionStore = useTransactionStore()

const getTransactionDescription = (transactionName: string) => {
  const descriptions: Record<string, string> = {
    Income: 'Record money coming in',
    Expense: 'Track money going out',
    Transfer: 'Move between accounts',
  }
  return descriptions[transactionName] || 'Add this transaction type'
}

const handleOpenAndSet = (transactionType: string) => {
  openSetAccountModal.value = true
  transactionStore.setTransactionType(transactionType)
}

const finishTransactionAndDismiss = () => {
  openSetAccountModal.value = false
  emit('finishTransactionAndDismiss')
}

// Watch for changes in the prop and update the local ref accordingly
watch(
  () => props.openAddTransactionView,
  (newVal) => {
    openAddTransactionView.value = newVal
  },
)
</script>

<style scoped>
.premium-transaction-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.premium-transaction-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
</style>
