<template>
  <loading-modal :is-submitting="isSubmitting" />

  <success-modal :success-modal="showSuccessModal" @close-success-modal="showSuccessModal = false">
    <template #main>
      <div
        class="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/25 animate-scale-in backdrop-blur-sm border border-indigo-500/20"
      >
        <svg class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>

      <h3 class="text-2xl font-bold text-white mb-3 tracking-tight">Account Created!</h3>
      <p class="text-gray-400 text-base leading-relaxed">
        Your new account is now active and ready to use.
      </p>
    </template>
  </success-modal>

  <u-slideover
    title="Add Account"
    :close="{ onClick: handleClose }"
    :overlay="false"
    :transition="false"
    v-model:open="openAccountForm"
    :ui="{
      content: 'bg-gradient-to-br from-[#0a0a12] via-[#0f0f1a] to-[#141427] backdrop-blur-xl',
      title: 'text-white font-bold text-xl tracking-tight',
      body: 'text-white !h-[90vh] overflow-hidden scrollbar-hide',
      close: 'bg-white text-gray-800 hover:!bg-white/80 cursor-pointer',
    }"
  >
    <template #body>
      <div class="h-[100%] flex flex-col">
        <!-- Header Section -->
        <div class="h-[11%]">
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-12 h-12 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl flex items-center justify-center"
            >
              <u-icon name="i-mdi-bank-plus" class="size-6 text-green-400" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">Create New Account</h2>
              <p class="text-gray-400 text-sm">Set up your financial account</p>
            </div>
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="fetchErrorMessage" class="mb-6">
          <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
            <p class="text-red-400 text-sm font-medium text-center">{{ fetchErrorMessage }}</p>
          </div>
        </div>

        <!-- Form -->
        <u-form :schema="schema" :state="state" @submit="onSubmit" class="flex flex-col h-[89%]">
          <div class="space-y-6 flex-1 overflow-auto scrollbar-hide">
            <!-- Account Name -->
            <div class="premium-form-field">
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center"
                >
                  <u-icon name="i-mdi-account" class="size-4 text-blue-400" />
                </div>
                <div>
                  <span class="text-white text-sm font-semibold">Account Name</span>
                  <p class="text-gray-500 text-xs">Give your account a memorable name</p>
                </div>
              </div>
              <u-form-field
                name="accountName"
                :ui="{
                  error: 'text-xs text-red-400 mt-2 font-medium',
                }"
              >
                <u-input
                  type="text"
                  size="lg"
                  @input="fetchErrorMessage = null"
                  v-model="state.accountName"
                  :highlight="false"
                  placeholder="e.g., Main Checking, Savings Account"
                  trailing-icon="i-mdi-pencil"
                  :ui="{
                    base: 'w-full bg-white/5 border border-white/20 text-white px-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm placeholder:text-gray-500',
                  }"
                  class="w-full"
                />
              </u-form-field>
            </div>

            <!-- Opening Balance -->
            <div class="premium-form-field">
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center"
                >
                  <u-icon name="i-mdi-cash" class="size-4 text-green-400" />
                </div>
                <div>
                  <span class="text-white text-sm font-semibold">Opening Balance</span>
                  <p class="text-gray-500 text-xs">Starting amount in this account</p>
                </div>
              </div>
              <u-form-field
                name="amount"
                :ui="{
                  error: 'text-xs text-red-400 mt-2 font-medium',
                }"
              >
                <div class="relative">
                  <u-input
                    type="number"
                    size="lg"
                    @input="fetchErrorMessage = null"
                    :highlight="false"
                    v-model="state.openingBalance"
                    trailing-icon="i-mdi-currency-usd"
                    placeholder="0.00"
                    :ui="{
                      base: 'w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder:text-gray-500 text-right [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] transition-all duration-200 backdrop-blur-sm text-lg font-semibold',
                    }"
                    class="w-full"
                  />
                </div>
              </u-form-field>
            </div>

            <!-- Currency Selection -->
            <div class="premium-form-field">
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center"
                >
                  <u-icon name="i-mdi-currency-usd" class="size-4 text-purple-400" />
                </div>
                <div>
                  <span class="text-white text-sm font-semibold">Currency</span>
                  <p class="text-gray-500 text-xs">Choose your account currency</p>
                </div>
              </div>
              <u-form-field
                name="currency"
                :ui="{
                  error: 'text-xs text-red-400 mt-2 font-medium',
                }"
              >
                <USelect
                  v-model="state.currency"
                  @input="fetchErrorMessage = null"
                  :items="currencyOptions"
                  :ui="{
                    base: 'w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white transition-all duration-200 backdrop-blur-sm',
                    viewport:
                      'bg-gray-900/95 backdrop-blur-xl text-white rounded-xl border border-white/20',
                    item: 'text-white hover:bg-white/10 px-4 py-3 transition-colors rounded-lg mx-2 my-1',
                    value: 'text-white font-medium',
                  }"
                />
              </u-form-field>
            </div>

            <!-- Account Type Display -->
            <div v-if="selectedAccountType" class="premium-form-field">
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center"
                >
                  <u-icon name="i-mdi-shape" class="size-4 text-orange-400" />
                </div>
                <div>
                  <span class="text-white text-sm font-semibold">Account Type</span>
                  <p class="text-gray-500 text-xs">Selected account category</p>
                </div>
              </div>
              <div class="p-4 bg-white/5 border border-white/20 rounded-2xl backdrop-blur-sm">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center"
                    >
                      <u-icon
                        :name="selectedAccountType.icon || 'i-mdi-bank'"
                        class="size-5 text-indigo-400"
                      />
                    </div>
                    <div>
                      <p class="text-white font-semibold">{{ selectedAccountType.name }}</p>
                      <p class="text-gray-400 text-xs">Account category</p>
                    </div>
                  </div>
                  <div class="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                    <span class="text-indigo-400 text-xs font-medium">Selected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="border-t border-white/10 mt-4">
            <u-button
              size="lg"
              type="submit"
              class="group w-full justify-center rounded-2xl py-5 text-white font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-indigo-500/50 shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-indigo-500/30 backdrop-blur-sm"
            >
              <div class="flex items-center gap-3">
                <u-icon
                  name="i-mdi-plus-circle"
                  class="size-5 group-hover:rotate-12 transition-transform"
                />
                <span class="text-base">Create Account</span>
              </div>
            </u-button>
          </div>
        </u-form>
      </div>
    </template>
  </u-slideover>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AxiosError } from 'axios'
import { ref } from 'vue'
import { toRef } from 'vue'
import z from 'zod'
import type { AccountType } from '@/types'
import api from '@/services/api'
import { useRouter } from 'vue-router'

type AccountTypes = Omit<AccountType, 'createdBy'>

const props = defineProps<{
  openAccountForm: boolean
  selectedAccountType: AccountTypes | null
}>()
const openAccountForm = toRef(props, 'openAccountForm')
const selectedAccountType = toRef(props, 'selectedAccountType')

const emit = defineEmits<{
  (e: 'closeAccountForm'): void
  (e: 'accountCreated'): void
}>()

const schema = z.object({
  accountName: z.string().min(2, { message: 'Required' }),
  openingBalance: z.number({ error: 'Required' }).min(0, { message: 'Required' }),
  currency: z.string().min(1, { message: 'Required' }),
})

type Schema = z.output<typeof schema>

const state = ref<Partial<Schema>>({
  accountName: '',
  openingBalance: 10,
  currency: 'USD',
})

const currencyOptions = [
  {
    label: 'USD - US Dollar',
    value: 'USD',
  },
]
const router = useRouter()

const isSubmitting = ref<boolean>(false)
const showSuccessModal = ref<boolean>(false)
const fetchErrorMessage = ref<string | null>('')

const previousRoute = router.options.history.state.back

const handleClose = () => {
  emit('closeAccountForm')
  // Reset form state and errors when closing the form
  state.value = {
    accountName: '',
    openingBalance: 10,
    currency: 'USD',
  }
  fetchErrorMessage.value = null
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const value = event.data

  try {
    isSubmitting.value = true
    if (!selectedAccountType.value) {
      throw new Error('Please select an account type')
    }
    const response = await api.post('/accounts/create', {
      ...value,
      accountTypeId: selectedAccountType.value.id,
    })

    if (response.status === 201) {
      showSuccessModal.value = true
      setTimeout(() => {
        showSuccessModal.value = false
        if (previousRoute === '/login' || previousRoute === '/verify') {
          window.location.href = '/dashboard'
        } else {
          emit('accountCreated')
        }
      }, 2000)
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>
    fetchErrorMessage.value =
      axiosError.response?.data?.message || 'There was an error submitting the form.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.premium-form-field {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 24px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.premium-form-field:hover {
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow:
    0 6px 24px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-scale-in {
  animation: scale-in 0.3s ease-out forwards;
}
</style>
