<template>
  <!-- Create Budget Modal -->
  <base-modal
    :open-modal="openModal"
    direction="bottom"
    @close-modal="handleCloseModal"
    class="!w-full !max-w-full !h-full bg-gradient-to-br from-[#0a0a12] via-[#0f0f1a] to-[#141427] text-white !border-0 !ring-0 backdrop-blur-xl"
  >
    <template #title>
      <div class="flex items-center gap-4 pb-2">
        <div
          class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <u-icon name="i-mdi-wallet-plus" class="size-5 text-white" />
        </div>
        <div>
          <p class="text-xl font-bold text-white tracking-tight">Create Budget</p>
          <p class="text-xs text-gray-400">Set spending limits for better control</p>
        </div>
      </div>
    </template>

    <template #main>
      <div class="h-[90vh] py-2">
        <span
          v-if="fetchErrorMessage"
          class="text-center text-red-400 italic text-sm block w-full py-3 px-4 mx-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm"
        >
          {{ fetchErrorMessage }}
        </span>

        <div class="flex flex-col h-full">
          <div class="overflow-y-scroll scrollbar-hidden space-y-1">
            <!-- Budget Amount Input -->
            <div
              class="mx-4 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl"
            >
              <div class="text-center">
                <span
                  class="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20 mb-6"
                >
                  <u-icon name="i-mdi-target" class="size-3" />
                  {{ selectedPeriod }} Budget
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
                  class="w-full text-6xl font-extralight text-center focus:outline-none placeholder:text-gray-700 text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text h-[120px] tracking-tight"
                />
                <div
                  class="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mt-4"
                ></div>
              </div>
            </div>

            <!-- Budget Period -->
            <div
              class="mx-4 bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center"
                >
                  <u-icon name="i-mdi-calendar" class="size-4 text-blue-400" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-white">Budget Period</p>
                  <p class="text-xs text-gray-500">How often to reset your budget</p>
                </div>
              </div>
              <u-select
                v-model="selectedPeriod"
                :items="items"
                size="lg"
                :ui="{
                  base: 'w-full bg-white/5 border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all duration-200',
                  item: 'text-white cursor-pointer hover:bg-indigo-600/20 hover:text-white px-4 py-3 transition-colors',
                  content:
                    'bg-gray-900/95 backdrop-blur-xl text-white rounded-xl border border-white/20 shadow-2xl z-[9999]',
                }"
                class="!w-full"
              />
            </div>

            <!-- Budget Name -->
            <div
              class="mx-4 bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center"
                >
                  <u-icon name="i-mdi-tag" class="size-4 text-green-400" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-white">Budget Name</p>
                  <p class="text-xs text-gray-500">Give your budget a memorable name</p>
                </div>
              </div>
              <input
                type="text"
                v-model="budgetName"
                placeholder="e.g., Monthly Groceries, Entertainment Fund"
                class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            <!-- Category Selection -->
            <div
              class="mx-4 bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center"
                >
                  <u-icon name="i-mdi-shape" class="size-4 text-purple-400" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-white">Category</p>
                  <p class="text-xs text-gray-500">Choose what this budget covers</p>
                </div>
              </div>

              <div
                @click="openCategoryModal = true"
                class="group flex items-center justify-between cursor-pointer p-4 rounded-xl border border-white/20 hover:border-purple-500/30 bg-white/5 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              >
                <p class="text-sm font-medium">
                  {{ selectedCategory ? selectedCategory.name : 'Select Category' }}
                </p>
                <u-icon
                  name="i-mdi-chevron-right"
                  class="size-5 text-gray-500 group-hover:text-purple-400 transition-colors"
                />
              </div>

              <!-- Selected Category Display -->
              <div
                v-if="selectedCategory"
                class="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="p-3 rounded-xl border border-white/20 backdrop-blur-sm"
                    :style="{
                      backgroundColor: `${colorToHex(selectedCategory?.color || 'white')}15`,
                    }"
                  >
                    <u-icon
                      :name="selectedCategory.icon || ''"
                      class="size-6"
                      :style="{ color: colorToHex(selectedCategory?.color || 'white') }"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-white">{{ selectedCategory.name }}</p>
                    <p class="text-xs text-gray-500">Selected category</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Note Section -->
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
                  <p class="text-sm font-semibold text-white">Notes</p>
                  <p class="text-xs text-gray-500">Add any additional details</p>
                </div>
              </div>
              <textarea
                rows="3"
                placeholder="Add a note about this budget..."
                class="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none transition-all duration-200 backdrop-blur-sm"
              ></textarea>
            </div>
          </div>

          <!-- Create Budget Button -->
          <div class="p-6 pt-8">
            <u-button
              :disabled="!budgetAmount || !selectedCategory || isSubmitting || !budgetName"
              :loading="isSubmitting"
              @click="handleCreateBudget"
              size="xl"
              class="group justify-center w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-600 font-semibold text-white shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-indigo-500/30 backdrop-blur-sm"
            >
              <div class="flex items-center gap-3">
                <u-icon
                  name="i-mdi-check-circle"
                  class="size-5 group-hover:rotate-12 transition-transform"
                />
                <span class="text-base">Create Budget</span>
              </div>
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
      emit('closeBudgetModal')
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

<style scoped>
.scrollbar-hidden {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
</style>
