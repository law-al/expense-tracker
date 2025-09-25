<template>
  <!-- Full Screen Loader -->
  <LoadingModal :is-submitting="isSubmitting">
    <template #statusText>
      <p class="text-white text-sm font-medium tracking-wide">
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
        class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>

      <h3 class="text-lg font-semibold text-indigo-200 mb-2">Success!</h3>
      <p class="text-gray-300 text-sm">
        {{
          transactionType === 'income'
            ? 'Your income has been added successfully.'
            : 'Your expense has been added successfully.'
        }}
      </p>
    </template>
  </SuccessModal>

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
    class="!w-[100%] !max-w-[100%] !h-[100%] !max-h-[100%] bg-gray-950 !border-0 !ring-0 text-white !p-0 !mt-0"
  >
    <template #body>
      <!-- Main Content -->
      <div class="relative h-[100vh]">
        <div
          class="w-full h-[10vh] flex items-center justify-between px-4 pb-3 pt-3 border-b-2 border-gray-700"
        >
          <h2 class="text-white font-semibold text-lg">
            {{ transactionType === 'income' ? 'Income' : 'Expenses' }}
          </h2>

          <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="handleClose" />
        </div>

        <div class="h-[90vh] flex flex-col justify-around">
          <div class="">
            <!-- Error Message -->
            <p
              v-show="displayError"
              class="text-red-500 text-xs italic block w-full text-center mt-2"
            >
              {{ displayError }}
            </p>
            <!-- Amount Input -->
            <div class="w-full border-b border-gray-700 p-4 mt-3">
              <span
                class="text-xs text-center w-full block mb-1"
                :class="transactionType === 'income' ? 'text-green-500' : 'text-red-500'"
              >
                {{ transactionType === 'income' ? 'Income' : 'Expenses' }}</span
              >
              <currency-input
                v-model="amount"
                :options="{
                  locale: 'en-US',
                  currency: 'USD',
                  valueRange: {},
                  hideCurrencySymbolOnFocus: true,
                  hideGroupingSeparatorOnFocus: true,
                  hideNegligibleDecimalDigitsOnFocus: true,
                  autoDecimalDigits: true,
                  useGrouping: false,
                  accountingSign: false,
                }"
                placeholder="$0.00"
                :required="true"
                class="w-full text-5xl h-[100px] bg-transparent font-extralight text-center focus-within:outline-none placeholder:text-gray-600 active:outline-none active:border-none active:focus:outline-none focus:border-none focus:ring-0"
                :class="transactionType === 'income' ? 'text-green-500' : 'text-red-500'"
              />
            </div>

            <div class="w-full flex flex-col justify-between">
              <!-- Selected Account -->
              <div class="flex items-center justify-between w-full p-4 border-b border-gray-700">
                <div class="">
                  <span class="font-extralight text-xs">Account</span>
                  <p class="font-semibold text-sm">{{ selectedAccount?.accountType.name }}</p>
                </div>
                <div class="border border-gray-700 rounded-lg p-1 bg-white/10">
                  <u-icon :name="selectedAccount?.accountType.icon || ''" class="size-6" />
                </div>
              </div>

              <!-- Selected Category -->
              <div class="flex items-center justify-between w-full p-4 border-b border-gray-700">
                <div class="">
                  <span class="font-extralight text-xs">Category</span>
                  <p class="font-bold text-sm">{{ selectedCategory?.name }}</p>
                </div>
                <div
                  class="rounded-full border p-1"
                  :style="{
                    backgroundColor: `${colorToHex(selectedCategory?.color as string)}33`,
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

              <!-- Select Sub Category -->
              <div
                v-if="categoryStore.subCategories.length > 0 && transactionType === 'expense'"
                class="flex items-center gap-2 overflow-x-auto p-4 border-b border-gray-700"
              >
                <div
                  v-for="subCategory in categoryStore.subCategories"
                  :key="subCategory.id"
                  class="text-white"
                >
                  <div
                    @click="handleSelectSubCategory(subCategory)"
                    class="border border-gray-700 rounded-2xl p-2 flex items-center gap-2 cursor-pointer w-fit"
                    :style="{
                      backgroundColor:
                        selectedSubCategory?.id === subCategory.id
                          ? `${colorToHex(subCategory?.color as string)}33`
                          : 'transparent',
                      borderColor:
                        selectedSubCategory?.id === subCategory.id
                          ? `${colorToHex(subCategory?.color as string)}33`
                          : '#88888833',
                    }"
                  >
                    <u-icon
                      :name="subCategory.icon || ''"
                      class="size-5"
                      :style="{
                        color: colorToHex(subCategory?.color as string),
                      }"
                    />
                    <span class="text-xs">{{ subCategory.name }}</span>
                  </div>
                </div>
              </div>

              <!-- Note section -->
              <div class="w-full p-4">
                <label for="notes" class="font-extralight text-xs text-gray-400">Notes</label>
                <textarea
                  name="notes"
                  id="notes"
                  rows="3"
                  :disabled="isLoading || isSubmitting"
                  v-model="description"
                  placeholder="Add a note (optional)"
                  class="w-full mt-1 p-2 bg-transparent border border-gray-700 rounded-none text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <div class="mt-auto px-2 py-2">
            <u-button
              @click="handleAddExpense"
              :disabled="!amount || amount <= 0 || isSubmitting"
              :loading="isLoading || isSubmitting"
              size="xl"
              class="w-full rounded-none bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/60 cursor-pointer font-light text-white justify-center"
              label="Add Expense"
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
