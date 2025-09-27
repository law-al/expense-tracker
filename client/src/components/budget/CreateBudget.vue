<template>
  <!-- Create Budget Modal -->
  <base-modal
    :open-modal="openModal"
    direction="bottom"
    @close-modal="handleCloseModal"
    class="!w-full !max-w-full !h-full bg-gradient-to-b from-[#0b0b10] to-[#13131f] text-white !border-0 !ring-0"
  >
    <template #title>
      <p>Create a Budget</p>
    </template>

    <template #main>
      <div class="h-[90vh] py-2">
        <span
          v-if="fetchErrorMessage"
          class="text-center text-red-500 italic text-xs block w-full py-2"
        >
          {{ fetchErrorMessage }}
        </span>

        <div class="flex flex-col h-full">
          <div class="overflow-y-scroll scrollbar-hidden">
            <!-- Budget Amount Input -->
            <div class="w-full border-b border-white/10 p-6 mt-3">
              <span class="text-xs block mb-2 tracking-wide uppercase text-indigo-400">
                {{ selectedPeriod }} Budget (required)
              </span>
              <currency-input
                v-model="budgetAmount"
                :options="{
                  locale: 'en-US',
                  currency: 'USD',
                  autoDecimalDigits: true,
                  useGrouping: true,
                }"
                placeholder="$0.00"
                :required="true"
                class="w-full text-5xl h-[100px] bg-transparent font-light text-center focus:outline-none placeholder:text-gray-600 text-indigo-400"
              />
            </div>

            <!-- Budget Period -->
            <div class="px-6 py-5 border-b border-white/10">
              <p class="text-xs text-gray-400 mb-2">Budget Period (required)</p>
              <u-select
                v-model="selectedPeriod"
                :items="items"
                size="lg"
                :ui="{
                  base: 'w-full bg-gray-800 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500',
                  item: 'text-white cursor-pointer hover:bg-gray-600 hover:text-white px-4 py-2',
                  content: 'bg-gray-800 text-white rounded-lg border border-white/10 z-[9999]',
                }"
                class="!w-full"
              />
            </div>

            <!-- Add name input -->
            <div class="px-6 py-5 border-b border-white/10">
              <p class="text-xs text-gray-400 mb-2">Name (required)</p>
              <input
                type="text"
                v-model="budgetName"
                placeholder="e.g., Groceries, Entertainment"
                class="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <!-- Category Selection -->
            <div class="px-6 py-5 border-b border-white/10">
              <p class="text-xs text-gray-400 mb-2">Category</p>
              <div
                @click="openCategoryModal = true"
                class="flex items-center justify-between cursor-pointer p-3 rounded-lg border border-white/10 hover:bg-white/5"
              >
                <p class="text-sm">
                  {{ selectedCategory ? selectedCategory.name : 'Select Category' }}
                </p>
                <u-icon name="i-lsicon-right-filled" class="size-5" />
              </div>

              <!-- Selected Category Display -->
              <div v-if="selectedCategory" class="mt-3 flex items-center gap-3">
                <div
                  class="p-2 rounded-lg border border-white/20"
                  :style="{
                    backgroundColor: `${colorToHex(selectedCategory?.color || 'white')}22`,
                  }"
                >
                  <u-icon
                    :name="selectedCategory.icon || ''"
                    class="size-6"
                    :style="{ color: colorToHex(selectedCategory?.color || 'white') }"
                  />
                </div>
                <p class="text-sm font-medium">{{ selectedCategory.name }}</p>
              </div>
            </div>

            <!-- Note Section -->
            <div class="px-6 py-5">
              <p class="text-xs text-gray-400 mb-2">Note (optional)</p>
              <textarea
                rows="3"
                placeholder="Add a note..."
                class="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Create Budget Button -->
          <div class="p-6">
            <u-button
              :disabled="!budgetAmount || !selectedCategory || isSubmitting || !budgetName"
              :loading="isSubmitting"
              @click="handleCreateBudget"
              size="xl"
              class="justify-center w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/40 font-medium text-white shadow-md shadow-indigo-500/30"
            >
              Create Budget
            </u-button>
          </div>
        </div>
      </div>
    </template>
  </base-modal>

  <!-- Budget Category Modal -->
  <budget-category :open-modal="openCategoryModal" @close-modal="openCategoryModal = false" />
</template>

<script setup lang="ts">
import api from '@/services/api'
import { useBudgetStore } from '@/stores/budget.store'
import { useCategoryStore } from '@/stores/category.store'
import { colorToHex } from '@/utils/colorUtils'
import type { AxiosError } from 'axios'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { ref, watch } from 'vue'

const props = defineProps<{
  openModal: boolean
  isSubmitting: boolean
}>()
const openModal = ref(props.openModal)
const isSubmitting = computed(() => props.isSubmitting)

const emit = defineEmits<{
  (e: 'closeBudgetModal'): void
  (e: 'submittingStatus', status: boolean): void
  (e: 'successStatus', status: boolean): void
}>()

const handleCloseModal = () => {
  emit('closeBudgetModal')
}

const categoryStore = useCategoryStore()
const { selectedCategory } = storeToRefs(categoryStore)
const budgetStore = useBudgetStore()

const fetchErrorMessage = ref<string | null>(null)
const budgetAmount = ref<number | null>(null)
const items = ref([
  {
    label: 'Daily',
    value: 'Daily',
  },
  {
    label: 'Weekly',
    value: 'Weekly',
  },
  {
    label: 'Monthly',
    value: 'Monthly',
  },
  {
    label: 'Yearly',
    value: 'Yearly',
  },
])
const selectedPeriod = ref('Monthly')
const budgetName = ref<string>()
const openCategoryModal = ref<boolean>(false)

const handleCreateBudget = async () => {
  const value = {
    amount: budgetAmount.value as number,
    categoryId: selectedCategory.value?.id as number,
    period: selectedPeriod.value.toUpperCase(),
    name: budgetName.value,
  }
  try {
    emit('submittingStatus', true)
    fetchErrorMessage.value = null
    const response = await api.post('/budget/create', value)

    if (response.status === 201) {
      emit('submittingStatus', false)
      openModal.value = false
      budgetAmount.value = null
      categoryStore.setCategory(null)
      emit('successStatus', true)

      await budgetStore.fetchBudgets(selectedPeriod.value.toLowerCase())
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>
    fetchErrorMessage.value =
      axiosError.response?.data?.message || 'There was an error submitting the form.'
  } finally {
    emit('submittingStatus', false)
  }
}

watch(
  () => props.openModal,
  (newVal) => {
    openModal.value = newVal
  },
)
</script>

<style scoped></style>
