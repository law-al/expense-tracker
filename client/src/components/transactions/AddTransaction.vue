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
    class="max-w-md !h-[100%] !max-h-[100%] bg-gray-950 !border-0 !ring-0 text-white !p-0 !mt-0"
  >
    <template #body>
      <div
        class="w-full flex items-center justify-between px-4 pb-3 pt-3 border-b-2 border-gray-700"
      >
        <h2 class="text-white font-semibold text-lg">Add a Transaction</h2>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          @click="emit('closeAddTransactionView')"
        />
      </div>

      <div class="flex flex-col mt-2">
        <div
          v-for="item in transactionItems"
          :key="item.name"
          @click="handleOpenAndSet(item.title)"
          class="flex items-center gap-1 border-b border-gray-700 text-gray-400 hover:text-gray-200 transition-all duration-150 ease-in-out cursor-pointer p-4"
        >
          <div class="border border-gray-700 rounded-lg p-1 bg-white/10">
            <u-icon :name="item.icon" class="size-6" />
          </div>
          <div class="flex items-center justify-between w-full px-2">
            <p class="">{{ item.name }}</p>
            <u-icon name="i-mingcute-right-line" class="size-5" />
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
.bg-image {
  background: linear-gradient(180deg, #0b0e1a, #1a1446) !important;
}
</style>
