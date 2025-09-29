<template>
  <UDrawer
    v-model:open="openAccountView"
    should-scale-background
    set-background-color-on-scale
    :dismissible="false"
    :handle="false"
    :overlay="false"
    title="Select an Account"
    description="Choose an account to associate with this transaction."
    :ui="{
      content: 'z-100',
      body: 'bg-transparent !ring-0 !rounded-none !border-0 !p-0 !mt-0',
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
            class="w-10 h-10 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-2xl flex items-center justify-center border border-blue-500/30"
          >
            <u-icon name="i-mdi-bank" class="size-5 text-blue-400" />
          </div>
          <div>
            <h2 class="text-white font-bold text-xl tracking-tight">Select Account</h2>
            <p class="text-gray-400 text-sm">Choose your payment source</p>
          </div>
        </div>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
           size="xl"
          @click="emit('closeAccountView')"
        />
      </div>

      <!-- Account List -->
      <div class="flex flex-col gap-3 p-6">
        <div
          v-for="account in accounts"
          :key="account.id"
          @click="handleOpenAndSet(account)"
          class="group premium-account-item w-full flex items-center gap-4 p-5 cursor-pointer rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <!-- Account Icon -->
          <div
            class="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:border-white/30 transition-all duration-200 shadow-lg"
          >
            <u-icon
              :name="account.accountType.icon || 'i-mdi-bank'"
              class="size-7 text-blue-400 group-hover:text-blue-300 transition-colors"
            />
          </div>

          <!-- Account Details -->
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <p
                class="text-white text-base font-semibold group-hover:text-gray-100 transition-colors"
              >
                {{ account.accountType.name }}
              </p>
              <div class="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                <span class="text-green-400 text-xs font-medium">Active</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors"
              >
                {{ formatCurrency(account?.currentBalance || 0, account.currency) }}
              </span>
              <span class="text-gray-600">•</span>
              <span class="text-gray-500 text-xs">Available balance</span>
            </div>
          </div>

          <!-- Selection Arrow -->
          <div
            class="w-8 h-8 bg-white/5 border border-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
          >
            <u-icon
              name="i-lucide-chevron-right"
              class="size-4 text-gray-500 group-hover:text-white transition-colors"
            />
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="px-6 pb-6">
        <div
          class="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl backdrop-blur-sm"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <u-icon name="i-mdi-information" class="size-4 text-indigo-400" />
            </div>
            <div>
              <p class="text-indigo-300 text-sm font-medium">Quick tip</p>
              <p class="text-indigo-400/80 text-xs">
                Select the account you want to use for this transaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDrawer>
  <set-category
    :open-category-view="openSetCategoryModal"
    @close-category-view="openSetCategoryModal = false"
    @finish-transaction-and-dismiss="finishTransactionAndDismiss"
  />
</template>

<script setup lang="ts">
import type { AccountWithDetails } from '@/types'
import { ref, watch } from 'vue'
import SetCategory from './SetCategory.vue'
import { useAccountStore } from '@/stores/account.store'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.store'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps<{
  openAccountView: boolean
}>()
const emit = defineEmits<{
  (e: 'closeAccountView'): void
  (e: 'finishTransactionAndDismiss'): void
}>()

const globalStore = useGlobalStore()
// Use global store state for category modal visibility
const { openSetCategoryModal } = storeToRefs(globalStore)
const accountsStore = useAccountStore()
const { accounts } = storeToRefs(accountsStore)

const openAccountView = ref(props.openAccountView)

const handleOpenAndSet = (account: AccountWithDetails) => {
  openSetCategoryModal.value = true
  accountsStore.setAccount(account)
}

const finishTransactionAndDismiss = () => {
  openSetCategoryModal.value = false
  emit('finishTransactionAndDismiss')
}

// Watch for changes in the prop and update the local ref accordingly
watch(
  () => props.openAccountView,
  (newVal) => {
    openAccountView.value = newVal
  },
)
</script>

<style scoped>
.bg-image {
  background: linear-gradient(180deg, #0b0e1a, #1a1446) !important;
}

.premium-account-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.premium-account-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
</style>
