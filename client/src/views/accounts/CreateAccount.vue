<template>
  <div class="h-[100vh] max-w-[639px] overflow-scroll bg-image">
    <header class="w-full py-8">
      <p class="text-center font-semibold text-xl">Create Account</p>
    </header>

    <!-- Account section -->

    <div class="">
      <div class="flex flex-col">
        <div
          v-for="type in accountTypes"
          :key="type.name"
          @click="setOpen(type)"
          class="flex items-center gap-2 px-4 py-4 border border-gray-700 cursor-pointer"
        >
          <u-icon :name="type?.icon || ''" class="size-10" />
          <div class="flex items-center justify-between w-full">
            <p class="text-white">{{ type.name }}</p>
            <u-icon name="i-lsicon-right-filled" class="size-5" />
          </div>
        </div>
      </div>

      <u-slideover
        title="Add Account"
        :overlay="false"
        :transition="false"
        v-model:open="isOpen"
        :ui="{
          content: 'bg-gray-900',
          title: 'text-white',
          body: 'text-white',
          close: 'text-white hover:!bg-gray-900',
        }"
      >
        <template #body>
          <u-form :schema="schema" :state="state" @submit="onSubmit" class="flex flex-col h-full">
            <div class="text-gray-500 pl-2 space-y-4">
              <!-- Account name -->
              <div class="flex items-start justify-between gap-4 min-h-[60px]">
                <p class="text-sm text-white min-w-fit pt-2">Account Name</p>
                <div class="max-w-[145px] flex flex-col">
                  <u-form-field
                    name="accountName"
                    :ui="{
                      error: 'text-xs text-red-500 mt-1 min-h-[16px]',
                    }"
                  >
                    <u-input
                      type="text"
                      size="lg"
                      v-model="state.accountName"
                      :highlight="false"
                      placeholder="Account name"
                      trailing-icon="i-solar-pen-2-linear"
                      :ui="{
                        base: 'w-full !px-0 py-2 ring-0 rounded-sm focus:outline-none focus-visible:outline-none focus:!ring-0 focus-visible:!ring-0 bg-gray-900 !text-gray-500 placeholder:text-sm placeholder:text-gray-500',
                      }"
                    />
                  </u-form-field>
                </div>
              </div>

              <!-- Account Starting Amount -->
              <div class="flex items-start justify-between gap-4 min-h-[60px]">
                <p class="text-sm text-white min-w-fit pt-2">Current Amount</p>
                <div class="max-w-[70px] flex flex-col">
                  <u-form-field
                    name="amount"
                    :ui="{
                      error: 'text-xs text-red-500 mt-1 min-h-[16px]',
                    }"
                  >
                    <u-input
                      type="number"
                      size="lg"
                      :highlight="false"
                      v-model="state.openingBalance"
                      placeholder="0.00"
                      trailing-icon="i-solar-pen-2-linear"
                      :ui="{
                        base: 'w-full !px-0 py-2 ring-0 rounded-sm focus:outline-none focus-visible:outline-none focus:!ring-0 focus-visible:!ring-0 bg-gray-900 !text-gray-500 placeholder:text-sm placeholder:text-gray-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]',
                      }"
                      class="text-right"
                    />
                  </u-form-field>
                </div>
              </div>

              <!-- Account Currency -->
              <div class="flex items-start justify-between gap-4 min-h-[60px]">
                <p class="text-sm text-white min-w-fit pt-2">Currency</p>
                <div class="max-w-[200px] flex flex-col">
                  <u-form-field
                    name="currency"
                    :ui="{
                      error: 'text-xs text-red-500 mt-1 min-h-[16px]',
                    }"
                  >
                    <USelect
                      v-model="state.currency"
                      :items="currencyOptions"
                      :ui="{
                        base: 'w-full !px-0 py-2 ring-0 rounded-sm focus:outline-none focus-visible:outline-none focus:!ring-0 focus-visible:!ring-0 bg-gray-900 text-white justify-end !text-sm !text-gray-500',
                      }"
                      class="w-48"
                    />
                  </u-form-field>
                </div>
              </div>

              <!-- Account Type -->
              <div class="flex items-center justify-between gap-4 min-h-[40px]">
                <p class="text-sm text-white min-w-fit">Account Type</p>
                <div class="flex items-center gap-3 px-2">
                  <p class="text-gray-500 text-sm">Credit Card</p>
                  <u-icon name="i-f7-creditcard" class="size-6 text-gray-500" />
                </div>
              </div>
            </div>

            <u-button
              size="lg"
              type="submit"
              class="mt-auto w-full rounded-sm py-3 text-white justify-center cursor-pointer !bg-indigo-700 hover:bg-indigo-800"
              >Create Account</u-button
            >
          </u-form>
        </template>
      </u-slideover>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/services/api'
import { AxiosError } from 'axios'
import { onMounted, ref } from 'vue'
import type { AccountType } from '../../../../api/src/types'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

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

type AccountTypes = Omit<AccountType, 'createdBy'>
const accountTypes = ref<AccountTypes[]>([])
const selectedAccountType = ref<AccountTypes>()
const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const value = event.data

  try {
    isLoading.value = true
    if (!selectedAccountType.value) {
      throw new Error('Please select an account type')
    }
    const response = await api.post('/accounts/create', {
      ...value,
      accountTypeId: selectedAccountType.value.id,
    })
    console.log(response.data)
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>
    console.log(axiosError.response?.data.message)
  } finally {
    isLoading.value = false
  }
}

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

const setOpen = (type: AccountTypes): void => {
  isOpen.value = true
  selectedAccountType.value = type
}

onMounted(async () => {
  try {
    const response = await api.get('/accounts/types')
    if (response.status === 200) {
      accountTypes.value = response.data.data
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>
    console.log(axiosError.response?.data)
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
</style>
