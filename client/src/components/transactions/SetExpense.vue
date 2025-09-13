<template>
  <UDrawer
    v-model:open="openExpenseView"
    direction="left"
    should-scale-background
    set-background-color-on-scale
    :dismissible="false"
    :handle="false"
    :overlay="false"
    title="Expenses"
    description="Enter the expense amount for this transaction."
    :ui="{
      body: 'bg-transparent !ring-0 !rounded-none !border-0 !p-0 !mt-0 w-[100%]',
      header: 'hidden',
      container: '!rounded-none !border-0 !p-0 w-full',
    }"
    class="!w-[100%] !max-w-[100%] !h-[100%] !max-h-[100%] bg-gray-950 !border-0 !ring-0 text-white !p-0 !mt-0"
  >
    <template #body>
      <!-- Full Screen Loader -->
      <div
        v-if="isSubmitting"
        class="fixed inset-0 z-[9999] bg-gray-950/95 backdrop-blur-sm flex items-center justify-center"
      >
        <div class="flex flex-col items-center gap-4">
          <div
            class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"
          ></div>
          <p class="text-white text-lg font-light">Processing your expense...</p>
        </div>
      </div>

      <!-- Success Modal -->
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 z-[9999] bg-gray-950/95 backdrop-blur-sm flex items-center justify-center"
      >
        <div class="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm mx-4 text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center"
          >
            <u-icon name="i-lucide-check" class="w-8 h-8 text-green-500" />
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">Success!</h3>
          <p class="text-gray-300 text-sm">Your expense has been added successfully.</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="relative" :class="{ 'pointer-events-none': isSubmitting }">
        <div
          class="w-full flex items-center justify-between px-4 pb-3 pt-3 border-b-2 border-gray-700"
        >
          <h2 class="text-white font-semibold text-lg">Expense</h2>

          <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="handleClose" />
        </div>

        <div class="">
          <p v-show="displayError" class="text-red-500 text-sm italic block w-full text-center">
            {{ displayError }}
          </p>
          <div class="w-full border-b border-gray-700 p-4 mt-3">
            <span class="text-xs text-center w-full block mb-1 text-red-500">Expenses</span>
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
              class="w-full text-5xl h-[100px] bg-transparent font-extralight text-red-500 text-center focus-within:outline-none placeholder:text-gray-600 active:outline-none active:border-none active:focus:outline-none focus:border-none focus:ring-0"
            />
          </div>

          <div class="w-full flex flex-col justify-between h-[70vh]">
            <div class="">
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
                    backgroundColor: `${categoryColorToHex(selectedCategory?.color as string)}33`,
                    borderColor: `${categoryColorToHex(selectedCategory?.color as string)}33`,
                  }"
                >
                  <u-icon
                    :name="selectedCategory?.icon || ''"
                    class="size-6"
                    :style="{ color: categoryColorToHex(selectedCategory?.color as string) }"
                  />
                </div>
              </div>

              <!-- Select Sub Category -->
              <div class="flex items-center gap-2 overflow-x-auto p-4 border-b border-gray-700">
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
                          ? `${categoryColorToHex(subCategory?.color as string)}33`
                          : 'transparent',
                      borderColor:
                        selectedSubCategory?.id === subCategory.id
                          ? `${categoryColorToHex(subCategory?.color as string)}33`
                          : '#88888833',
                    }"
                  >
                    <u-icon
                      :name="subCategory.icon || ''"
                      class="size-5"
                      :style="{
                        color: categoryColorToHex(subCategory?.color as string),
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

            <!-- Submit -->
            <div class="mt-auto">
              <u-button
                @click="handleAddExpense"
                :disabled="!amount || amount <= 0 || isSubmitting"
                :loading="isLoading || isSubmitting"
                size="lg"
                class="w-full rounded-none bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/60 cursor-pointer font-light text-white justify-center"
                label="Add Expense"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import type { Category } from '../../../../api/src/types'
import CurrencyInput from '../inputs/CurrencyInput.vue'
import Color from 'color'
import { useAccountStore } from '@/stores/account.store'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/stores/category.store'
import { ref, watch } from 'vue'
import { AxiosError } from 'axios'
import api from '@/services/api'
import { useRouter } from 'vue-router'

// props from parent component (SetCategory.vue)
const prop = defineProps<{
  openExpenseView: boolean
}>()
const openExpenseView = ref(prop.openExpenseView)
// emit from parent component (SetCategory.vue)
const emit = defineEmits<{
  (e: 'closeExpenseView'): void
}>()

const router = useRouter()

// const amount = ref<number | null>(0)
const amount = ref<number | null>(0)
const accountStore = useAccountStore()
const categoryStore = useCategoryStore()
const { selectedAccount } = storeToRefs(accountStore)
const { selectedCategory, selectedSubCategory } = storeToRefs(categoryStore)
const description = ref<string>('')
const displayError = ref<string | null>('')
const isLoading = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)
const showSuccessModal = ref<boolean>(false)

const categoryColorToHex = (setColor: string) => {
  if (!setColor) return '#000000'
  try {
    const color = Color(setColor || 'black')
    return color.hex().toString()
  } catch (error) {
    console.error('Invalid color format:', error)
    return '#000000'
  }
}

const handleSelectSubCategory = (subCategory: Category) => {
  if (!isSubmitting.value) {
    categoryStore.setSubCategory(subCategory)
  }
}

const handleClose = () => {
  if (isSubmitting.value) return

  amount.value = 0
  description.value = ''
  categoryStore.setSubCategory(null)
  emit('closeExpenseView')
}

const resetForm = () => {
  amount.value = 0
  description.value = ''
  categoryStore.setSubCategory(null)
}

const navigateToDashboard = () => {
  router.push('/dashboard')
  emit('closeExpenseView')
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
      transactionTypeId: 1,
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
      setTimeout(() => {
        showSuccessModal.value = false
        navigateToDashboard()
      }, 3000)
    } else {
      displayError.value = 'Failed to add expense. Please try again.'
      isSubmitting.value = false
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>
    displayError.value = axiosError.response?.data.message || 'An error occurred. Please try again.'
    isSubmitting.value = false
  } finally {
    isLoading.value = false
  }
}

// STEP: Watch for prop changes and update local state
watch(
  () => prop.openExpenseView,
  (newVal) => {
    openExpenseView.value = newVal
    console.log('Expense Drawer Open:', openExpenseView.value)
  },
)
</script>

<style scoped></style>
