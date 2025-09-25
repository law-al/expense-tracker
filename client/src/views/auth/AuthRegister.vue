<template>
  <auth-layout>
    <loading-modal :is-submitting="isLoading" />

    <div v-if="!isLoading" class="w-[400px]">
      <!-- Error from form submission -->
      <p v-if="errorFlag" class="text-red-500 text-sm italic mb-4 text-center w-full">
        {{ errorFlag }}
      </p>
      <div class="mb-10">
        <h1 class="text-2xl font-bold text-center mb-2">Register to get started</h1>
        <p class="text-center">Register now to access all features</p>
      </div>

      <div class="">
        <u-form :schema="schema" :state="state" @submit="onSubmit" class="mt-4">
          <div class="flex flex-col gap-3">
            <!-- Username -->
            <u-form-field
              label="Username"
              name="username"
              :ui="{
                error: 'text-xs text-red-500 mt-1',
                label: 'mb-1 text-white',
              }"
            >
              <u-input
                size="lg"
                type="text"
                v-model="state.username"
                placeholder="Enter your username"
                :highlight="false"
                :ui="{
                  base: 'w-full !bg-gray-950 text-white px-4 py-4 ring-1 ring-indigo-500 !rounded-sm focus:outline-none focus-visible:outline-none focus:ring-1 focus-visible:ring-1 focus-visible:ring-indigo-600',
                }"
                class="w-full bg-amber-200"
              />
            </u-form-field>

            <!-- Email -->
            <u-form-field
              label="Email"
              name="email"
              :ui="{
                error: 'text-xs text-red-500 mt-1',
                label: 'mb-1 text-white',
              }"
            >
              <u-input
                type="email"
                size="lg"
                :highlight="false"
                placeholder="Enter your email"
                v-model="state.email"
                :ui="{
                  base: 'w-full !bg-gray-950 text-white px-4 py-4 ring-1 ring-indigo-500 !rounded-sm focus:outline-none focus-visible:outline-none focus:ring-1 focus-visible:ring-1 focus-visible:ring-indigo-600',
                }"
                class="w-full"
              />
            </u-form-field>

            <!-- Password -->
            <u-form-field
              label="Password"
              name="password"
              :ui="{
                error: 'text-xs text-red-500 mt-1',
                label: 'mb-1 text-white',
              }"
            >
              <u-input
                type="password"
                size="lg"
                v-model="state.password"
                placeholder="Enter your password"
                :highlight="false"
                :ui="{
                  base: 'w-full !bg-gray-950 text-white px-4 py-4 ring-1 ring-indigo-500 !rounded-sm focus:outline-none focus-visible:outline-none focus:ring-1 focus-visible:ring-1 focus-visible:ring-indigo-600',
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
              >Register</u-button
            >
          </div>
        </u-form>

        <div class="text-sm text-center mt-4">
          <p>
            Already have an account?
            <router-link to="/login" class="text-indigo-600 hover:underline"
              >Login here</router-link
            >
          </p>
        </div>
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

const schema = z.object({
  username: z
    .string({ error: 'Username is required' })
    .min(3, 'Username must be at least 3 characters long'),
  email: z.email('Invalid email address'),
  password: z
    .string({ error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: undefined,
  email: undefined,
  password: undefined,
})

const router = useRouter()
const isLoading = ref<boolean>(false)
const errorFlag = ref<string | null>(null)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    errorFlag.value = null
    isLoading.value = true
    const response = await api.post('/auth/register', event.data)

    if (response.status === 201) {
      router.push({
        path: '/verify',
        query: { token: response.data.data.accessToken },
      })
    }
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
