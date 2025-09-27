<template>
  <div class="w-full glass-card p-4 rounded-lg">
    <div class="flex items-center justify-between mb-4">
      <p
        class="px-2 py-1 rounded-md text-sm font-semibold tracking-wide"
        :style="{
          backgroundColor: colorToHex(budget.category.color || 'white') + '22',
          color: colorToHex(budget.category.color || 'white'),
        }"
      >
        {{ budget.category.name }}
      </p>
      <u-dropdown-menu
        :items="items"
        :content="{ side: 'bottom', sideOffset: 10, align: 'end' }"
        :ui="{
          content:
            'w-30 bg-gray-900 ring-0 text-white z-[9999] rounded-lg shadow-lg border border-gray-800',
          group: 'border border-gray-800',
          label: 'bg-red-500',
          itemLeadingIcon: 'size-4 text-white',

          item: 'text-white hover:!bg-indigo-500/10 transition-colors',
          itemLabel: 'text-sm tracking-wide',
        }"
      >
        <u-icon
          name="i-codicon-kebab-vertical"
          class="size-4 text-soft-white cursor-pointer hover:text-gray-400 transition-colors"
        />
        <template #delete>
          <u-icon name="i-ri-delete-bin-6-line" class="shrink-0 size-5 text-red-500" />
          <p class="text-red-500">Delete</p>
        </template>
      </u-dropdown-menu>
    </div>
    <div class="flex items-baseline justify-between mb-2">
      <p class="text-soft-white text-lg font-light">
        {{ formatCurrency(budget.totalBudget) }}
      </p>
      <span class="text-xs" :class="overSpent ? 'text-red-500' : 'text-cool-gray'"
        >%{{ overSpent ? 100 - budget.percetage : budget.percetage }}</span
      >
    </div>
    <percent-bar :percentage="budget.percetage" />
    <div class="flex items-center justify-between mt-2">
      <p class="text-sm text-cool-gray">-{{ formatCurrency(budget.totalExpense) }} spent</p>
      <div class="flex items-center gap-1">
        <u-icon
          :name="overSpent ? 'i-lucide-arrow-up-right' : 'i-lucide-arrow-down-right'"
          class="size-4"
          :class="overSpent ? 'text-red-500' : 'text-emerald-400'"
        />
        <p class="text-sm" :class="overSpent ? 'text-red-500' : 'text-soft-white'">
          {{ formatCurrency(budget.totalBudget - budget.totalExpense) }}
          {{ overSpent ? 'overspending' : 'left' }}
        </p>
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

<style scoped></style>
