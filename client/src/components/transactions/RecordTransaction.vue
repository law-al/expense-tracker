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
        class="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30 animate-scale-in"
      >
        <svg class="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>

      <h3 class="text-xl font-semibold text-white mb-2">Success!</h3>
      <p class="text-gray-400 text-sm">
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
    class="!w-full !max-w-full !h-full bg-gradient-to-b from-[#0b0b10] to-[#13131f] text-white !border-0 !ring-0"
  >
    <template #body>
      <div class="relative h-screen flex flex-col">
        <!-- Header -->
        <div
          class="w-full h-[10vh] flex items-center justify-between px-5 border-b border-white/10 bg-black/20 backdrop-blur-md"
        >
          <h2 class="text-lg font-semibold">
            {{ transactionType === 'income' ? 'Income' : 'Expenses' }}
          </h2>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            class="hover:bg-white/10 rounded-full"
            @click="handleClose"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 flex flex-col justify-between overflow-y-auto">
          <div>
            <!-- Error -->
            <p v-show="displayError" class="text-red-500 text-xs italic text-center mt-2">
              {{ displayError }}
            </p>

            <!-- Amount Input -->
            <div class="w-full border-b border-white/10 p-6">
              <span
                class="text-xs block mb-2 tracking-wide uppercase"
                :class="transactionType === 'income' ? 'text-green-400' : 'text-red-400'"
              >
                {{ transactionType === 'income' ? 'Income' : 'Expenses' }}
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
                class="w-full text-5xl h-[100px] bg-transparent font-light text-center focus:outline-none placeholder:text-gray-600"
                :class="transactionType === 'income' ? 'text-green-400' : 'text-red-400'"
              />
            </div>

            <!-- Account -->
            <div class="flex items-center justify-between w-full p-5 border-b border-white/10">
              <div>
                <span class="text-xs text-gray-400">Account</span>
                <p class="font-medium">{{ selectedAccount?.accountType.name }}</p>
              </div>
              <div class="p-2 bg-white/10 border border-white/10 rounded-xl">
                <u-icon :name="selectedAccount?.accountType.icon || ''" class="size-6" />
              </div>
            </div>

            <!-- Category -->
            <div class="flex items-center justify-between w-full p-5 border-b border-white/10">
              <div>
                <span class="text-xs text-gray-400">Category</span>
                <p class="font-semibold">{{ selectedCategory?.name }}</p>
              </div>
              <div
                class="rounded-full p-2 border"
                :style="{
                  backgroundColor: `${colorToHex(selectedCategory?.color as string)}22`,
                  borderColor: `${colorToHex(selectedCategory?.color as string)}33`,
                }"
              >
                <u-icon
                  :name="selectedCategory?.icon || ''"
                  class="size-6"
                  :style="{ color: colorToHex(selectedCategory?.color as string) }"
                />
              </div>
            </div>

            <!-- Sub Categories -->
            <div
              v-if="categoryStore.subCategories.length > 0 && transactionType === 'expense'"
              class="flex items-center gap-3 overflow-x-auto p-5 border-b border-white/10"
            >
              <div v-for="subCategory in categoryStore.subCategories" :key="subCategory.id">
                <div
                  @click="handleSelectSubCategory(subCategory)"
                  class="px-3 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition"
                  :class="
                    selectedSubCategory?.id === subCategory.id
                      ? 'bg-white/10 border border-white/20 shadow-sm'
                      : 'border border-white/10 hover:bg-white/5'
                  "
                >
                  <u-icon
                    :name="subCategory.icon || ''"
                    class="size-5"
                    :style="{ color: colorToHex(subCategory?.color as string) }"
                  />
                  <span class="text-xs">{{ subCategory.name }}</span>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="w-full p-5">
              <label for="notes" class="text-xs text-gray-400">Notes</label>
              <textarea
                id="notes"
                rows="3"
                v-model="description"
                placeholder="Add a note (optional)"
                class="w-full mt-2 p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              ></textarea>
            </div>
          </div>

          <!-- Submit -->
          <div class="p-5">
            <u-button
              @click="handleAddExpense"
              :disabled="!amount || amount <= 0 || isSubmitting"
              :loading="isLoading || isSubmitting"
              size="xl"
              class="justify-center w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/40 font-medium text-white shadow-md shadow-indigo-500/30"
              :label="transactionType === 'income' ? 'Add Income' : 'Add Expense'"
            />
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

<style scoped></style>
