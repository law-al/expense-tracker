<template>
  <auth-layout>
    <loading-modal :is-submitting="isLoading" />

    <div v-if="!isLoading" class="w-[400px]">
      <!-- Error from form submission -->
      <p v-if="errorFlag" class="text-red-500 text-sm italic mb-4 text-center w-full">
        {{ errorFlag }}
      </p>
      <div class="mb-10">
        <h1 class="text-2xl font-bold text-center mb-2">Verify Your Account</h1>
        <p class="text-center">
          Enter the OTP code sent to your email to complete the verification process
        </p>
      </div>

      <div class="">
        <u-form :schema="schema" :state="state" @submit="onSubmit" class="mt-4">
          <div class="flex flex-col gap-3">
            <u-form-field
              label="OTP Code"
              name="otp"
              :ui="{
                error: 'text-xs text-red-500 mt-2',
                label: 'mb-1 text-white',
              }"
            >
              <u-pin-input
                otp
                placeholder="○"
                :length="6"
                type="number"
                v-model="formattedOTP"
                mask
                :ui="{
                  base: 'w-[50px] h-[50px] !bg-gray-950 text-white px-4 py-4 ring-1 ring-indigo-500 !rounded-sm focus:outline-none focus-visible:outline-none focus:ring-1 focus-visible:ring-1 focus-visible:ring-indigo-600',
                  root: 'flex items-center justify-between',
                }"
              />
            </u-form-field>

            <!-- Resend OTP with timer-->
            <div class="text-sm text-center mt-2">
              <p>
                Didn't receive the code?
                <button
                  @click="handleResendOTPCountdown"
                  class="text-indigo-600 cursor-pointer hover:underline disabled:cursor-not-allowed disabled:text-gray-500"
                  :disabled="countdown > 0"
                  type="button"
                >
                  Resend OTP
                </button>
              </p>
              <p v-if="countdown > 0" class="text-cool-gray text-xs mt-1">
                You can resend the OTP in {{ countdown }} seconds
              </p>
            </div>
          </div>

          <div class="mt-8">
            <u-button
              type="submit"
              size="lg"
              :loading="isLoading"
              :disabled="isLoading"
              class="w-full rounded-sm py-3 text-white justify-center cursor-pointer !bg-indigo-700 hover:bg-indigo-800"
              >Verify</u-button
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
import { nextTick, reactive, ref } from 'vue'
import api from '@/services/api'
import type { AxiosError } from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import { computed } from 'vue'
import { useCountdown } from '@vueuse/core'
import { onUnmounted } from 'vue'
import { useDashboardDataV2 } from '@/composables/fetchDashBoardData'
import { useAccountStore } from '@/stores/account.store'

const schema = z.object({
  otp: z.string({ error: 'OTP code is required' }).min(6, 'OTP code must be 6 digits long'),
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  otp: '',
})

const formattedOTP = computed({
  get(): number[] {
    return state.otp ? Array.from(state.otp, Number) : []
  },
  set(value: number[]): void {
    state.otp = value.join('')
  },
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const accountStore = useAccountStore()
const { refreshDashBoard } = useDashboardDataV2()

const { token } = route.query
const isLoading = ref<boolean>(false)
const isSendingOTP = ref<boolean>(false)
const errorFlag = ref<string | null>(null)
const countdown = ref(0)
const { start, stop, reset } = useCountdown(countdown, {
  onTick() {
    if (countdown.value === 0) {
      return
    } else {
      countdown.value -= 1
    }
  },
  interval: 1000,
})

const handleResendOTPCountdown = async () => {
  if (countdown.value === 0) {
    try {
      isSendingOTP.value = true
      errorFlag.value = null
      await api.get(`/auth/resend-otp?token=${token}`)

      // Start 30 seconds countdown
      countdown.value = 30
      start()
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>

      errorFlag.value =
        axiosError.response?.data?.message || 'There was an error resending the OTP.'
    } finally {
      isSendingOTP.value = false
    }
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    errorFlag.value = null
    isLoading.value = true
    const response = await api.post(`/auth/verify?token=${token}`, {
      otp: event.data.otp,
    })

    if (response.status === 200) {
      localStorage.setItem('token', response.data?.data?.accessToken)
      userStore.isAuthenticated = true

      await refreshDashBoard()
      if (accountStore.accounts.length === 0) {
        router.push('/create-account')
      } else {
        router.push('/dashboard')
      }
    }
    await nextTick()
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>

    errorFlag.value =
      axiosError.response?.data?.message || 'There was an error submitting the form.'
  } finally {
    isLoading.value = false
  }
}

onUnmounted(() => {
  stop()
  reset()
})
</script>

<style scoped></style>
