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
      body: 'bg-transparent !ring-0 !rounded-none !border-0 !p-0 !mt-0',
      header: 'hidden',
      container: '!rounded-none !border-0 !p-0',
    }"
    class="max-w-md !h-[100%] !max-h-[100%] bg-gray-950 !border-0 !ring-0 text-white !p-0 !mt-0"
  >
    <template #body>
      <div
        class="w-full flex items-center justify-between px-4 pb-3 pt-3 border-b-2 border-gray-700"
      >
        <h2 class="text-white font-semibold text-lg">Select an Account</h2>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          @click="emit('closeAccountView')"
        />
      </div>

      <div class="flex flex-col gap-5 mt-2">
        <div
          v-for="account in accounts"
          :key="account.id"
          @click="handleOpenAndSet(account)"
          class="h-[50px] w-full flex items-center gap-4 px-4 py-4 cursor-pointer text-gray-400 hover:text-gray-200"
        >
          <div class="border border-gray-700 rounded-lg p-1 bg-white/10">
            <u-icon :name="account.accountType.icon || 'i-mdi-bank'" class="size-6" />
          </div>
          <div class="">
            <p class="text-sm">{{ account.accountType.name }}</p>
            <span class="text-xs font-extralight">{{
              formatCurrency(account?.currentBalance || 0, account.currency)
            }}</span>
          </div>
        </div>
      </div>
    </template>
  </UDrawer>
  <set-category
    :open-category-view="openSetCategoryModal"
    @close-category-view="openSetCategoryModal = false"
  />
</template>

<script setup lang="ts">
import type { AccountWithDetails } from '@/types'
import { ref, watch } from 'vue'
import SetCategory from './SetCategory.vue'
import { useAccountStore } from '@/stores/account.store'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.store'

const props = defineProps<{
  openAccountView: boolean
}>()
const openAccountView = ref(props.openAccountView)
const emit = defineEmits<{
  (e: 'closeAccountView'): void
}>()

const accountsStore = useAccountStore()
const { accounts } = storeToRefs(accountsStore)
const globalStore = useGlobalStore()
// Use global store state for category modal visibility
const { openSetCategoryModal } = storeToRefs(globalStore)

const formatCurrency = (value: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value)
}

const handleOpenAndSet = (account: AccountWithDetails) => {
  openSetCategoryModal.value = true
  accountsStore.setAccount(account)
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
</style>
