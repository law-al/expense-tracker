<template>
  <success-modal
    :success-modal="showConfirmLogoutModal"
    :show-button="false"
    @close-success-modal="showConfirmLogoutModal = false"
  >
    <template #main>
      <div
        class="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
      >
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          ></path>
        </svg>
      </div>

      <h3 class="text-xl font-bold text-white mb-3 tracking-tight">Sign Out</h3>
      <p class="text-gray-400 text-base mb-8 leading-relaxed">
        Are you sure you want to sign out of your account?
      </p>

      <div class="flex justify-center gap-3">
        <button
          class="px-6 py-3 bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 hover:text-white rounded-xl transition-all duration-200 cursor-pointer font-medium backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50"
          @click="showConfirmLogoutModal = false"
        >
          Cancel
        </button>
        <button
          @click="handleLogout"
          class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl transition-all duration-200 cursor-pointer font-medium shadow-lg hover:shadow-red-500/25"
        >
          Sign Out
        </button>
      </div>
    </template>
  </success-modal>
  <!-- Menu modal -->
  <base-modal
    v-if="!showConfirmLogoutModal"
    :open-modal="openMenuModal"
    direction="right"
    @close-modal="handleCloseMenuModal"
  >
    <template #title>
      <div class="flex items-center gap-3">
        <span class="text-xl font-bold text-white tracking-tight">Menu</span>
      </div>
    </template>

    <template #main>
      <div class="flex flex-col justify-between gap-6 h-[90vh]">
        <div class="h-full flex flex-col justify-start space-y-2">
          <!-- Settings -->
          <router-link
            to="/settings"
            class="group w-full flex items-center gap-4 px-6 py-5 rounded-2xl cursor-pointer text-gray-400 hover:text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/30 border border-transparent hover:border-gray-700/30"
          >
            <div
              class="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300"
            >
              <u-icon name="i-mdi-cog-outline" class="size-6 text-blue-400" />
            </div>
            <div class="flex-1">
              <p class="font-semibold text-base">Settings</p>
              <p class="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                Manage your preferences
              </p>
            </div>
            <u-icon
              name="i-mdi-chevron-right"
              class="size-5 text-gray-600 group-hover:text-gray-400 transition-colors"
            />
          </router-link>

          <!-- User Record -->
          <router-link
            to="/user-record"
            class="group w-full flex items-center gap-4 px-6 py-5 rounded-2xl cursor-pointer text-gray-400 hover:text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/30 border border-transparent hover:border-gray-700/30"
          >
            <div
              class="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center group-hover:from-green-500/30 group-hover:to-emerald-600/30 transition-all duration-300"
            >
              <u-icon name="i-mdi-account-outline" class="size-6 text-green-400" />
            </div>
            <div class="flex-1">
              <p class="font-semibold text-base">User Record</p>
              <p class="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                View your profile
              </p>
            </div>
            <u-icon
              name="i-mdi-chevron-right"
              class="size-5 text-gray-600 group-hover:text-gray-400 transition-colors"
            />
          </router-link>

          <!-- Accounts -->
          <router-link
            to="/create-account"
            class="group w-full flex items-center gap-4 px-6 py-5 rounded-2xl cursor-pointer text-gray-400 hover:text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/30 border border-transparent hover:border-gray-700/30"
          >
            <div
              class="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all duration-300"
            >
              <u-icon name="i-mdi-bank-outline" class="size-6 text-purple-400" />
            </div>
            <div class="flex-1">
              <p class="font-semibold text-base">Accounts</p>
              <p class="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                Manage your accounts
              </p>
            </div>
            <u-icon
              name="i-mdi-chevron-right"
              class="size-5 text-gray-600 group-hover:text-gray-400 transition-colors"
            />
          </router-link>
        </div>

        <!-- Logout Button -->
        <div class="p-4">
          <u-button
            variant="solid"
            size="xl"
            @click="handleConfirmLogout"
            color="warning"
            class="group justify-center w-full py-4 rounded-2xl text-white bg-gradient-to-r from-red-600 via-red-600 to-red-500 hover:from-red-700 hover:via-red-700 hover:to-red-600 shadow-xl hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 font-semibold text-base border border-red-500/20 hover:border-red-400/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div class="flex items-center gap-3">
              <u-icon name="i-mdi-logout" class="size-5" />
              <span>Sign Out</span>
            </div>
          </u-button>
        </div>
      </div>
    </template>
  </base-modal>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import SuccessModal from '../common/SuccessModal.vue'
import { useAccountStore } from '@/stores/account.store'
import { useTransactionStore } from '@/stores/transaction.store'
import { useCategoryStore } from '@/stores/category.store'
import { useBudgetStore } from '@/stores/budget.store'
import { useUserStore } from '@/stores/user.store'

const props = defineProps<{
  openMenuModal: boolean
}>()
const openMenuModal = ref(props.openMenuModal)

const emit = defineEmits<{
  (e: 'closeMenuModal'): void
}>()

const handleCloseMenuModal = () => {
  emit('closeMenuModal')
}

const accountStore = useAccountStore()
const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const budgetStore = useBudgetStore()
const userStore = useUserStore()

const showConfirmLogoutModal = ref<boolean>(false)

const handleConfirmLogout = () => {
  showConfirmLogoutModal.value = true
}

const handleLogout = () => {
  localStorage.removeItem('token')
  emit('closeMenuModal')
  accountStore.logout()
  transactionStore.logout()
  categoryStore.logout()
  budgetStore.logout()
  userStore.logout()
  window.location.href = '/login'
}

watch(
  () => props.openMenuModal,
  (newVal) => {
    openMenuModal.value = newVal
  },
)

onUnmounted(() => {
  showConfirmLogoutModal.value = false
})
</script>

<style scoped></style>
