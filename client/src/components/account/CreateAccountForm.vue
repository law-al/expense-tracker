<template>
  <u-slideover
    title="Add Account"
    :close="{ onClick: () => emit('closeAccountForm') }"
    :overlay="false"
    :transition="false"
    v-model:open="openAccountForm"
    :ui="{
      content: 'bg-gray-950',
      title: 'text-white',
      body: 'text-white',
      close: 'bg-white text-gray-800 hover:!bg-white/80 cursor-pointer',
    }"
  >
    <template #body>
      <loading-modal :is-submitting="isSubmitting" />

      <success-modal
        :success-modal="showSuccessModal"
        @close-success-modal="showSuccessModal = false"
      >
        <template #main>
          <div
            class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <h3 class="text-lg font-semibold text-indigo-200 mb-2">Account Created</h3>
          <p class="text-gray-300 text-sm mb-6">Your account is now active and ready to use.</p>
        </template>
      </success-modal>

      <div class="h-full">
        <!-- Fetch Error -->
        <div v-if="fetchErrorMessage" class="mb-4">
          <p class="text-sm italic text-center text-red-500">{{ fetchErrorMessage }}</p>
        </div>
        <!-- Form -->
        <u-form :schema="schema" :state="state" @submit="onSubmit" class="flex flex-col h-full">
          <div class="space-y-6 flex-1">
            <!-- Account name -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-white">Account Name</label>
              <u-form-field
                name="accountName"
                :ui="{
                  error: 'text-xs text-red-500 mt-1',
                }"
              >
                <u-input
                  type="text"
                  size="lg"
                  @input="fetchErrorMessage = null"
                  v-model="state.accountName"
                  :highlight="false"
                  placeholder="Enter account name"
                  trailing-icon="i-solar-pen-2-linear"
                  :ui="{
                    base: 'w-full px-3 py-3 ring-1 ring-gray-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800 text-white placeholder:text-gray-400 transition-all duration-200',
                  }"
                  class="w-full"
                />
              </u-form-field>
            </div>

            <!-- Account Starting Amount -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-white">Current Amount</label>
              <u-form-field
                name="amount"
                :ui="{
                  error: 'text-xs text-red-500 mt-1',
                }"
              >
                <div class="relative">
                  <u-input
                    type="number"
                    size="lg"
                    @input="fetchErrorMessage = null"
                    :highlight="false"
                    v-model="state.openingBalance"
                    trailing-icon="i-solar-pen-2-linear"
                    placeholder="0.00"
                    :ui="{
                      base: 'w-full px-3 py-3 pr-12 ring-1 ring-gray-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800 text-white placeholder:text-gray-400 text-right [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] transition-all duration-200',
                    }"
                    class="w-full"
                  />
                </div>
              </u-form-field>
            </div>

            <!-- Account Currency -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-white">Currency</label>
              <u-form-field
                name="currency"
                :ui="{
                  error: 'text-xs text-red-500 mt-1',
                }"
              >
                <USelect
                  v-model="state.currency"
                  @input="fetchErrorMessage = null"
                  :items="currencyOptions"
                  :ui="{
                    base: 'w-full px-3 py-3 ring-1 ring-gray-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800 text-white transition-all duration-200',
                  }"
                />
              </u-form-field>
            </div>

            <!-- Account Type -->
            <div v-if="selectedAccountType" class="space-y-2">
              <label class="text-sm font-medium text-white">Account Type</label>
              <div
                class="flex items-center justify-between px-3 py-3 ring-1 ring-gray-700 rounded-sm bg-gray-800"
              >
                <span class="text-white">{{ selectedAccountType.name }}</span>
                <u-icon :name="selectedAccountType.icon || ''" class="size-6 text-indigo-400" />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-6 mt-6 border-t border-gray-700">
            <u-button
              size="lg"
              type="submit"
              class="w-full justify-center rounded-sm py-3 text-white font-medium bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
            >
              Create Account
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
  {
    label: 'NGN - Nigerian Naira',
    value: 'NGN',
  },
]

const isSubmitting = ref<boolean>(false)
const showSuccessModal = ref<boolean>(false)
const fetchErrorMessage = ref<string | null>('')

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
        emit('accountCreated')
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

<style scoped></style>
