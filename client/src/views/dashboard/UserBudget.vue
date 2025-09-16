<template>
  <app-layout>
    <div class="h-screen">
      <header class="flex items-center justify-between px-2 py-2 pb-4 border-b border-gray-700">
        <p class="text-xl font-light">Budgets</p>
        <div
          class="w-[30px] h-[30px] rounded-full bg-indigo-700 flex items-center justify-center cursor-pointer shadow-lg hover:bg-indigo-800"
        >
          <u-icon name="i-mdi-plus" class="size-6 text-soft-white" />
        </div>
      </header>

      <main class="h-full mt-3 px-2">
        <div v-if="!getBudgets" class="h-full flex flex-col justify-center items-center gap-2">
          <p class="text-center text-cool-gray">No budgets set yet.</p>
          <p class="text-center text-cool-gray">Click the + button to add a budget.</p>
        </div>
        <div v-else class="">
          <h2 class="text-soft-white text-center mb-2">Total Budget</h2>
          <div class="w-full mb-8">
            <div class="flex items-baseline justify-between mb-2">
              <p class="text-soft-white text-lg font-light">
                {{ formatCurrency(getBudgets?.totalBudgets as number) }}
              </p>
              <span class="text-xs text-cool-gray">%{{ getBudgets?.percentage }}</span>
            </div>

            <percent-bar :percentage="getBudgets?.percentage || 0" />

            <div class="flex items-center justify-between mt-2">
              <p class="text-sm text-cool-gray">
                -{{ formatCurrency(getBudgets?.totalExpenses as number) }} spent
              </p>
              <p class="text-sm text-soft-white">
                {{
                  formatCurrency(
                    ((getBudgets?.totalExpenses || 0) - (getBudgets?.totalBudgets || 0)) * -1,
                  )
                }}
                left
              </p>
            </div>
          </div>

          <div class="">
            <div class="flex flex-col gap-4">
              <budget-card
                v-for="budget in getBudgetsByCategory"
                :key="budget.categoryId"
                :budget="budget"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  </app-layout>
</template>

<script setup lang="ts">
import BudgetCard from '@/components/budget/BudgetCard.vue'
import { useBudgetStore } from '@/stores/budget.store'
import { formatCurrency } from '@/utils/formatters'
import { storeToRefs } from 'pinia'

const budgetStore = useBudgetStore()
const { getBudgets, getBudgetsByCategory } = storeToRefs(budgetStore)
</script>

<style scoped></style>
