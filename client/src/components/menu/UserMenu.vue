<template>
  <success-modal
    :success-modal="showConfirmLogoutModal"
    :show-button="false"
    @close-success-modal="showConfirmLogoutModal = false"
  >
    <template #main>
      <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          ></path>
        </svg>
      </div>

      <h3 class="text-lg font-semibold text-red-200 mb-2">Confirm Logout</h3>
      <p class="text-gray-300 text-sm mb-6">Are you sure you want to logout?</p>

      <div class="flex justify-center gap-4">
        <button
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors cursor-pointer"
          @click="showConfirmLogoutModal = false"
        >
          Cancel
        </button>
        <button
          @click="handleLogout"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors cursor-pointer"
        >
          Logout
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
    <template #title>Menu</template>

    <template #main>
      <div class="flex flex-col justify-between gap-4 h-[90vh]">
        <div class="h-full flex flex-col justify-start">
          <router-link
            to="/settings"
            class="w-full flex items-center gap-2 px-4 py-4 border-b border-gray-700 cursor-pointer text-gray-400 hover:text-gray-200"
          >
            <u-icon name="i-mdi-cog-outline" class="size-6" />
            <p class="text-sm">Settings</p>
          </router-link>

          <router-link
            to="/user-record"
            class="w-full flex items-center gap-2 px-4 py-4 border-b border-gray-700 cursor-pointer text-gray-400 hover:text-gray-200"
          >
            <u-icon name="i-mdi-account-outline" class="size-6" />
            <p class="text-sm">User Record</p>
          </router-link>
          <router-link
            to="/create-account"
            class="w-full flex items-center gap-2 px-4 py-4 border-b border-gray-700 cursor-pointer text-gray-400 hover:text-gray-200"
          >
            <u-icon name="i-mdi-bank-outline" class="size-6" />
            <p class="text-sm">Accounts</p>
          </router-link>
        </div>
        <div class="p-2">
          <u-button
            variant="solid"
            size="xl"
            @click="handleConfirmLogout"
            color="warning"
            class="w-full justify-center !rounded-xs text-white !bg-red-700 hover:bg-red-600 cursor-pointer"
            >Logout</u-button
          >
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
