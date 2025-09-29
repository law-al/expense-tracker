<template>
  <div class="w-full budget-card p-6 rounded-lg">
    <div class="flex items-center justify-between mb-6">
      <div
        class="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold tracking-wide backdrop-blur-sm border"
        :style="{
          backgroundColor: colorToHex(budget.category.color || 'white') + '15',
          color: colorToHex(budget.category.color || 'white'),
          borderColor: colorToHex(budget.category.color || 'white') + '25',
        }"
      >
        <u-icon
          :name="budget.category.icon || 'i-mdi-folder'"
          class="size-4"
          :style="{ color: colorToHex(budget.category.color || 'white') }"
        />
        <span>{{ budget.category.name }}</span>
      </div>

      <u-dropdown-menu
        :items="items"
        :content="{ side: 'bottom', sideOffset: 10, align: 'end' }"
        :ui="{
          content:
            'w-36 bg-gray-900/95 backdrop-blur-xl ring-0 text-white z-[9999] rounded-xl shadow-2xl border border-white/20',
          group: 'border border-white/10',
          label: 'bg-red-500',
          itemLeadingIcon: 'size-4 text-white',
          item: 'text-white hover:!bg-white/10 transition-all duration-200 rounded-lg mx-2 my-1',
          itemLabel: 'text-sm font-medium',
        }"
      >
        <div
          class="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
        >
          <u-icon
            name="i-codicon-kebab-vertical"
            class="size-4 text-gray-300 hover:text-white transition-colors"
          />
        </div>
        <template #delete>
          <u-icon name="i-ri-delete-bin-6-line" class="shrink-0 size-4 text-red-400" />
          <span class="text-red-400 font-medium">Delete Budget</span>
        </template>
      </u-dropdown-menu>
    </div>

    <div class="flex items-baseline justify-between mb-4">
      <div class="flex items-baseline gap-3">
        <p class="text-white text-2xl font-bold">
          {{ formatCurrency(budget.totalBudget) }}
        </p>
        <div
          class="px-2 py-1 rounded-lg text-xs font-bold"
          :class="
            overSpent
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'bg-green-500/10 text-green-400 border border-green-500/20'
          "
        >
          {{ overSpent ? 'OVER' : 'ON TRACK' }}
        </div>
      </div>
      <div class="text-right">
        <span class="text-2xl font-bold" :class="overSpent ? 'text-red-400' : 'text-gray-400'">
          {{ overSpent ? Math.abs(100 - budget.percetage) : budget.percetage }}%
        </span>
        <p class="text-xs text-gray-500 mt-1">
          {{ overSpent ? 'Over budget' : 'Used' }}
        </p>
      </div>
    </div>

    <div class="mb-4">
      <percent-bar :percentage="budget.percetage" />
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-red-400"></div>
        <p class="text-sm text-gray-400 font-medium">
          {{ formatCurrency(budget.totalExpense) }} spent
        </p>
      </div>

      <div class="flex items-center gap-2">
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center"
          :class="
            overSpent
              ? 'bg-red-500/15 border border-red-500/25'
              : 'bg-emerald-500/15 border border-emerald-500/25'
          "
        >
          <u-icon
            :name="overSpent ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
            class="size-4"
            :class="overSpent ? 'text-red-400' : 'text-emerald-400'"
          />
        </div>
        <div class="text-right">
          <p class="text-sm font-semibold" :class="overSpent ? 'text-red-400' : 'text-white'">
            {{ formatCurrency(Math.abs(budget.totalBudget - budget.totalExpense)) }}
          </p>
          <p class="text-xs text-gray-500">
            {{ overSpent ? 'over budget' : 'remaining' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BudgetByCategory } from '@/types'
import { colorToHex } from '@/utils/colorUtils'
import { formatCurrency } from '@/utils/formatters'
import type { DropdownMenuItem } from '@nuxt/ui'
import { computed } from 'vue'
import { toRef } from 'vue'

const props = defineProps<{
  budget: BudgetByCategory
}>()

const budget = toRef(props, 'budget')

const items: DropdownMenuItem[][] = [
  [
    {
      label: 'View',
      icon: 'i-lucide-eye',
    },
    {
      label: 'Edit',
      icon: 'i-lucide-pencil',
    },
  ],
  [
    {
      label: 'Delete',
      color: 'error',
      icon: 'i-lucide-trash',
      slot: 'delete' as const,
    },
  ],
]

const overSpent = computed(() => {
  return budget.value.totalExpense > budget.value.totalBudget
})
</script>

<style scoped>
.budget-card {
  background: rgba(15, 15, 26, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.budget-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 48px rgba(0, 0, 0, 0.4),
    0 6px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.budget-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, transparent 50%);
  border-radius: inherit;
}
</style>
