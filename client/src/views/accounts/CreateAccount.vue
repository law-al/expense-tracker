<template>
  <loading-modal :is-submitting="isLoading" />

  <div
    class="h-screen max-w-[639px] bg-gradient-to-br from-[#0a0a12] via-[#0f0f1a] to-[#141427] backdrop-blur-xl"
  >
    <!-- Header -->
    <header class="w-full py-8 px-6">
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 bg-gradient-to-br from-indigo-600/20 to-purple-700/20 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <u-icon name="i-mdi-bank-plus" class="size-6 text-indigo-400" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Create Account</h1>
          <p class="text-gray-400 text-sm">Choose your account type</p>
        </div>
      </div>
    </header>

    <!-- Account Types List -->
    <div class="px-4 space-y-3">
      <div
        v-for="type in accountTypes"
        :key="type.name"
        @click="setOpen(type)"
        class="premium-account-type group flex items-center gap-4 p-5 cursor-pointer rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        <!-- Account Type Icon -->
        <div
          class="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:border-white/30 transition-all duration-200 shadow-lg"
        >
          <u-icon
            :name="type?.icon || 'i-mdi-bank'"
            class="size-7 text-indigo-400 group-hover:text-indigo-300 transition-colors"
          />
        </div>

        <!-- Account Type Details -->
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <p
              class="text-white text-base font-semibold group-hover:text-gray-100 transition-colors"
            >
              {{ type.name }}
            </p>
            <div class="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <span class="text-indigo-400 text-xs font-medium">{{
                getAccountTypeCategory(type.name)
              }}</span>
            </div>
          </div>
          <p class="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
            {{ getAccountTypeDescription(type.name) }}
          </p>
        </div>

        <!-- Selection Arrow -->
        <div
          class="w-8 h-8 bg-white/5 border border-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
        >
          <u-icon
            name="i-lsicon-right-filled"
            class="size-4 text-gray-500 group-hover:text-white transition-colors"
          />
        </div>
      </div>
    </div>

    <!-- Footer Info -->
    <div class="px-6 pt-8">
      <div
        class="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <u-icon name="i-mdi-lightbulb" class="size-4 text-blue-400" />
          </div>
          <div>
            <p class="text-blue-300 text-sm font-medium">Choose wisely</p>
            <p class="text-blue-400/80 text-xs">
              Select the account type that best fits your needs
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Account form -->
  <create-account-form
    :open-account-form="isOpen"
    :selected-account-type="selectedAccountType || null"
    @close-account-form="isOpen = false"
    @account-created="handleAccountCreated"
  />
</template>

<script setup lang="ts">
import api from '@/services/api'
import { AxiosError } from 'axios'
import { nextTick, onMounted, ref } from 'vue'
import type { AccountType } from '@/types'
import CreateAccountForm from '@/components/account/CreateAccountForm.vue'
import router from '@/router'

type AccountTypes = Omit<AccountType, 'createdBy'>

const accountTypes = ref<AccountTypes[]>([])
const selectedAccountType = ref<AccountTypes>()
const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const setOpen = (type: AccountTypes): void => {
  isOpen.value = true
  selectedAccountType.value = type
}

const handleAccountCreated = () => {
  router.replace('/dashboard')
}

const getAccountTypeCategory = (typeName: string): string => {
  const categories: Record<string, string> = {
    'Checking Account': 'Banking',
    'Savings Account': 'Banking',
    'Credit Card': 'Credit',
    Investment: 'Investment',
    Cash: 'Physical',
    Loan: 'Debt',
  }
  return categories[typeName] || 'General'
}

const getAccountTypeDescription = (typeName: string): string => {
  const descriptions: Record<string, string> = {
    'Checking Account': 'For everyday spending and transactions',
    'Savings Account': 'For building your emergency fund',
    'Credit Card': 'Track credit card expenses and payments',
    Investment: 'Monitor your investment portfolio',
    Cash: 'Physical cash on hand',
    Loan: 'Track loan balances and payments',
  }
  return descriptions[typeName] || 'Manage your finances effectively'
}

onMounted(async () => {
  try {
    isLoading.value = true
    await nextTick()
    const response = await api.get('/accounts/types')
    if (response.status === 200) {
      accountTypes.value = response.data.data
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>
    if (axiosError.response) {
      console.error('Error fetching account types:', axiosError.response.data.message)
    } else {
      console.error('Error fetching account types:', axiosError.message)
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.bg-image {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 1)), #6c63ff;
}

.bg-slide {
  background: #6b63ff;
  background: linear-gradient(
    180deg,
    rgba(107, 99, 255, 1) 0%,
    rgba(98, 91, 227, 1) 10%,
    rgba(0, 0, 0, 1) 100%
  );
}

.premium-account-type {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.premium-account-type:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.bg-image {
  background: linear-gradient(180deg, #0b0e1a, #1a1446);
}
</style>
