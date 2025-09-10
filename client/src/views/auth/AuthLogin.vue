<template>
  <auth-layout>
    <div class="w-[400px]">
      <!-- Error from form submission -->
      <p v-if="errorFlag" class="text-red-500 text-sm italic mb-4 text-center w-full">
        {{ errorFlag }}
      </p>
      <div class="mb-10">
        <h1 class="text-2xl font-bold text-center mb-2">Login to continue</h1>
        <p class="text-center">Enter your credentials to access your account</p>
      </div>

      <div class="">
        <u-form :schema="schema" :state="state" @submit="onSubmit" class="mt-4">
          <div class="flex flex-col gap-3">
            <u-form-field
              label="Username"
              name="username"
              :ui="{
                error: 'text-xs text-red-500 mt-1',
              }"
            >
              <u-input
                size="lg"
                type="text"
                v-model="state.username"
                placeholder="Enter your username"
                :highlight="false"
                :ui="{
                  base: 'w-full px-4 py-4 ring-1 ring-gray-300 !rounded-sm focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-gray-500',
                }"
                class="w-full bg-amber-200"
              />
            </u-form-field>

            <!-- Password -->
            <u-form-field
              label="Password"
              name="password"
              :ui="{
                error: 'text-xs text-red-500 mt-1',
              }"
            >
              <u-input
                type="password"
                size="lg"
                v-model="state.password"
                placeholder="Enter your password"
                :highlight="false"
                :ui="{
                  base: 'w-full px-4 py-4 ring-1 ring-gray-300 !rounded-sm focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-gray-500',
                }"
                class="w-full"
              />
            </u-form-field>
          </div>

          <div class="mt-8">
            <u-button
              type="submit"
              size="lg"
              :loading="isLoading"
              :disabled="isLoading"
              class="w-full rounded-sm py-3 text-white justify-center cursor-pointer !bg-indigo-700 hover:bg-indigo-800"
              >Login</u-button
            >
          </div>
        </u-form>
      </div>
    </div>
  </auth-layout>
</template>

<script setup lang="ts">
import AuthLayout from '@/layouts/auth/AuthLayout.vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { reactive, ref } from 'vue'
import api from '@/services/api'
import type { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import { useAccountStore } from '@/stores/account.store'

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: undefined,
  password: undefined,
})

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()
const accountStore = useAccountStore()
const isLoading = ref<boolean>(false)
const errorFlag = ref<string | null>(null)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    errorFlag.value = null
    isLoading.value = true
    const response = await api.post('/auth/login', event.data)

    if (response.status === 200) {
      localStorage.setItem('token', response.data?.data?.accessToken)
      userStore.isAuthenticated = true

      // STEP: Get user account
      accountStore.getUsersAccount()
    }
    toast.add({ title: 'Success', description: 'Logged in successfully.', color: 'success' })

    router.push('/login')
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>

    errorFlag.value =
      axiosError.response?.data?.message || 'There was an error submitting the form.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
