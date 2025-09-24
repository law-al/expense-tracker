<template>
  <loading-modal :is-submitting="isLoading" />

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
          class="flex items-center text-sm gap-2 px-4 py-4 border border-gray-700 cursor-pointer"
        >
          <u-icon :name="type?.icon || ''" class="size-6" />
          <div class="flex items-center justify-between w-full">
            <p class="text-white">{{ type.name }}</p>
            <u-icon name="i-lsicon-right-filled" class="size-5" />
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
  console.log('Account created successfully')
  router.replace('/dashboard')
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
    console.log(axiosError.response?.data)
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
</style>
