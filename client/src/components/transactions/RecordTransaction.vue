<template>
  <!-- Full Screen Loader -->
  <LoadingModal :is-submitting="isSubmitting">
    <template #statusText>
      <p class="text-white italic text-sm font-medium tracking-wide animate-pulse">
        {{ transactionType === 'income' ? 'Adding your income...' : 'Adding your expense...' }}
      </p>
    </template>
  </LoadingModal>

  <!-- Success Modal -->
  <SuccessModal
    :success-modal="showSuccessModal"
    :show-button="false"
    @close-success-modal="showSuccessModal = false"
  >
    <template #main>
      <div
        class="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/25 animate-scale-in backdrop-blur-sm border border-green-500/20"
      >
        <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>

      <h3 class="text-2xl font-bold text-white mb-3 tracking-tight">Success!</h3>
      <p class="text-gray-400 text-base leading-relaxed">
        {{
          transactionType === 'income'
            ? 'Your income has been added successfully.'
            : 'Your expense has been added successfully.'
        }}
      </p>
    </template>
  </SuccessModal>

  <!-- Drawer -->
  <UDrawer
    v-model:open="openExpenseView"
    direction="left"
    should-scale-background
    set-background-color-on-scale
    :dismissible="false"
    :handle="false"
    :overlay="false"
    :title="transactionType === 'income' ? 'Add Income' : 'Add Expense'"
    :description="
      transactionType === 'income'
        ? 'Add details for your income transaction.'
        : 'Add details for your expense transaction.'
    "
    :ui="{
      content: 'z-100',
      body: 'bg-transparent !ring-0 !rounded-none !border-0 !p-0 !mt-0 w-[100%]',
      header: 'hidden',
      container: '!rounded-none !border-0 !p-0 w-full',
    }"
    class="!w-full !max-w-full !h-full bg-gradient-to-br from-[#0a0a12] via-[#0f0f1a] to-[#141427] text-white !border-0 !ring-0 backdrop-blur-xl"
  >
    <template #body>
      <div class="relative h-screen flex flex-col">
        <!-- Header -->
        <div
          class="w-full h-[10vh] flex items-center justify-between px-6 border-b border-white/10 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-xl"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm border"
              :class="
                transactionType === 'income'
                  ? 'bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30'
                  : 'bg-gradient-to-br from-red-600/20 to-red-500/20 border-red-500/30'
              "
            >
              <u-icon
                :name="transactionType === 'income' ? 'i-mdi-trending-up' : 'i-mdi-trending-down'"
                class="size-5"
                :class="transactionType === 'income' ? 'text-green-400' : 'text-red-400'"
              />
            </div>
            <div>
              <h2 class="text-xl font-bold tracking-tight">
                {{ transactionType === 'income' ? 'Add Income' : 'Add Expense' }}
              </h2>
              <p class="text-xs text-gray-500">
                {{ transactionType === 'income' ? 'Record your earnings' : 'Track your spending' }}
              </p>
            </div>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            size="xl"
            @click="handleClose"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 flex flex-col overflow-y-auto mt-2">
          <div class="space-y-3 h-[80%] overflow-auto scrollbar-hide">
            <!-- Error -->
            <div v-show="displayError" class="mx-4 mt-4">
              <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
                <p class="text-red-400 text-sm font-medium text-center">{{ displayError }}</p>
              </div>
            </div>

            <!-- Amount Input -->
            <div
              class="mx-4 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl"
            >
              <div class="text-center">
                <span
                  class="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full border backdrop-blur-sm mb-6"
                  :class="
                    transactionType === 'income'
                      ? 'text-green-400 bg-green-500/10 border-green-500/20'
                      : 'text-red-400 bg-red-500/10 border-red-500/20'
                  "
                >
                  <u-icon
                    :name="
                      transactionType === 'income' ? 'i-mdi-plus-circle' : 'i-mdi-minus-circle'
                    "
                    class="size-3"
                  />
                  {{ transactionType === 'income' ? 'Income Amount' : 'Expense Amount' }}
                </span>
                <currency-input
                  v-model="amount"
                  :options="{
                    locale: 'en-US',
                    currency: 'USD',
                    autoDecimalDigits: true,
                    useGrouping: true,
                  }"
                  placeholder="$0.00"
                  class="w-full text-6xl font-extralight text-center focus:outline-none placeholder:text-gray-700 text-transparent bg-clip-text h-[120px] tracking-tight"
                  :class="
                    transactionType === 'income'
                      ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-green-500'
                      : 'bg-gradient-to-r from-red-400 via-red-400 to-red-500'
                  "
                />
                <div
                  class="w-20 h-1 rounded-full mx-auto mt-4"
                  :class="
                    transactionType === 'income'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-red-500 to-red-400'
                  "
                ></div>
              </div>
            </div>

            <!-- Account -->
            <div
              class="mx-4 bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center"
                  >
                    <u-icon name="i-mdi-bank" class="size-4 text-blue-400" />
                  </div>
                  <div>
                    <span class="text-xs text-gray-500 font-medium">Account</span>
                    <p class="text-sm font-semibold text-white">
                      {{ selectedAccount?.accountType.name }}
                    </p>
                  </div>
                </div>
                <div class="p-3 bg-white/5 border border-white/20 rounded-2xl backdrop-blur-sm">
                  <u-icon
                    :name="selectedAccount?.accountType.icon || ''"
                    class="size-6 text-blue-400"
                  />
                </div>
              </div>
            </div>

            <!-- Category -->
            <div
              class="mx-4 bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center"
                  >
                    <u-icon name="i-mdi-shape" class="size-4 text-purple-400" />
                  </div>
                  <div>
                    <span class="text-xs text-gray-500 font-medium">Category</span>
                    <p class="text-sm font-semibold text-white">{{ selectedCategory?.name }}</p>
                  </div>
                </div>
                <div
                  class="rounded-2xl p-3 border backdrop-blur-sm"
                  :style="{
                    backgroundColor: `${colorToHex(selectedCategory?.color as string)}15`,
                    borderColor: `${colorToHex(selectedCategory?.color as string)}25`,
                  }"
                >
                  <u-icon
                    :name="selectedCategory?.icon || ''"
                    class="size-6"
                    :style="{ color: colorToHex(selectedCategory?.color as string) }"
                  />
                </div>
              </div>
            </div>

            <!-- Sub Categories -->
            <div
              v-if="categoryStore.subCategories.length > 0 && transactionType === 'expense'"
              class="mx-4 bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center"
                >
                  <u-icon name="i-mdi-format-list-bulleted" class="size-4 text-indigo-400" />
                </div>
                <div>
                  <span class="text-xs text-gray-500 font-medium">Sub Categories</span>
                  <p class="text-xs text-gray-400">Choose a specific type</p>
                </div>
              </div>
              <div class="flex items-center gap-3 overflow-x-auto pb-2">
                <div v-for="subCategory in categoryStore.subCategories" :key="subCategory.id">
                  <div
                    @click="handleSelectSubCategory(subCategory)"
                    class="px-4 py-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-200 whitespace-nowrap backdrop-blur-sm"
                    :class="
                      selectedSubCategory?.id === subCategory.id
                        ? 'bg-white/15 border border-white/30 shadow-lg scale-105'
                        : 'border border-white/20 hover:bg-white/10 hover:border-white/30'
                    "
                  >
                    <u-icon
                      :name="subCategory.icon || ''"
                      class="size-5"
                      :style="{ color: colorToHex(subCategory?.color as string) }"
                    />
                    <span class="text-sm font-medium">{{ subCategory.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div
              class="mx-4 bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center"
                >
                  <u-icon name="i-mdi-note-text" class="size-4 text-orange-400" />
                </div>
                <div>
                  <span class="text-xs text-gray-500 font-medium">Notes (required)</span>
                  <p class="text-xs text-gray-400">Add additional details</p>
                </div>
              </div>
              <textarea
                id="notes"
                rows="3"
                v-model="description"
                placeholder="Add a note about this transaction..."
                class="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none transition-all duration-200 backdrop-blur-sm"
              ></textarea>
            </div>
          </div>

          <!-- Submit -->
          <div class="p-6 mt-auto">
            <u-button
              @click="handleAddExpense"
              :disabled="!amount || amount <= 0 || isSubmitting"
              :loading="isLoading || isSubmitting"
              size="xl"
              class="group justify-center w-full py-5 rounded-2xl font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border backdrop-blur-sm"
              :class="
                transactionType === 'income'
                  ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-600 shadow-green-500/25 hover:shadow-green-500/40 border-green-500/30'
                  : 'bg-gradient-to-r from-red-600 via-red-600 to-red-500 hover:from-red-700 hover:via-red-700 hover:to-red-600 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-600 shadow-red-500/25 hover:shadow-red-500/40 border-red-500/30'
              "
            >
              <div class="flex items-center gap-3">
                <u-icon
                  :name="transactionType === 'income' ? 'i-mdi-plus-circle' : 'i-mdi-minus-circle'"
                  class="size-5 group-hover:rotate-12 transition-transform"
                />
                <span class="text-base">{{
                  transactionType === 'income' ? 'Add Income' : 'Add Expense'
                }}</span>
              </div>
            </u-button>
          </div>
        </div>
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import type { Category } from '@/types'
import CurrencyInput from '../inputs/CurrencyInput.vue'
import { useAccountStore } from '@/stores/account.store'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/stores/category.store'
import { computed, ref, watch } from 'vue'
import { AxiosError } from 'axios'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { useDashboardDataV2 } from '@/composables/fetchDashBoardData'
import { useTransactionStore } from '@/stores/transaction.store'
import { colorToHex } from '@/utils/colorUtils'
import SuccessModal from '../common/SuccessModal.vue'

// props from parent component (SetCategory.vue)
const prop = defineProps<{
  openExpenseView: boolean
}>()

// emit from parent component (SetCategory.vue)
const emit = defineEmits<{
  (e: 'closeExpenseView'): void
  (e: 'finishTransactionAndDismiss'): void
}>()

const accountStore = useAccountStore()
const { selectedAccount } = storeToRefs(accountStore)
const categoryStore = useCategoryStore()
const { selectedCategory, selectedSubCategory } = storeToRefs(categoryStore)
const transactionStore = useTransactionStore()
const router = useRouter()
const { refreshDashBoard } = useDashboardDataV2()

const amount = ref<number | null>(0)
const description = ref<string>('')
const displayError = ref<string | null>('')
const isLoading = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)
const showSuccessModal = ref<boolean>(false)
const openExpenseView = ref(prop.openExpenseView)

const transactionType = computed(() => transactionStore.getSeletedTransactionType)

const handleSelectSubCategory = (subCategory: Category) => {
  if (!isSubmitting.value) {
    categoryStore.setSubCategory(subCategory)
  }
}

const handleClose = () => {
  if (isSubmitting.value) return

  amount.value = 0
  description.value = ''
  categoryStore.setCategory(null)
  categoryStore.setSubCategory(null)
  emit('closeExpenseView')
}

const resetForm = () => {
  amount.value = 0
  description.value = ''
  categoryStore.setSubCategory(null)
}

const handleAddExpense = async () => {
  if (!amount.value || amount.value <= 0) {
    displayError.value = 'Please enter a valid amount greater than zero.'
    return
  }

  try {
    isSubmitting.value = true
    isLoading.value = true
    displayError.value = null

    const response = await api.post('/transactions/create', {
      amount: amount.value,
      transactionTypeId: transactionType.value === 'income' ? 2 : 1,
      accountId: selectedAccount.value?.id,
      categoryId: selectedCategory.value?.id,
      subCategoryId: selectedSubCategory.value?.id,
      description: description.value,
    })

    if (response.status === 201) {
      displayError.value = null

      // Show success modal
      showSuccessModal.value = true

      // Reset form fields
      resetForm()

      // Auto-close success modal and navigate after 3 seconds
      setTimeout(async () => {
        showSuccessModal.value = false
        emit('finishTransactionAndDismiss')
        await refreshDashBoard()

        router.push('/dashboard')
      }, 3000)
    } else {
      displayError.value = 'Failed to add expense. Please try again.'
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>
    displayError.value = axiosError.response?.data.message || 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
    isSubmitting.value = false
  }
}

// STEP: Watch for prop changes and update local state
watch(
  () => prop.openExpenseView,
  (newVal) => {
    openExpenseView.value = newVal
  },
)
</script>

<style scoped>
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
