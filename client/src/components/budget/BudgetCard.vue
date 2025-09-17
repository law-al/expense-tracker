<template>
  <div class="w-full glass-card p-4 rounded-lg">
    <div class="flex items-center justify-between mb-4">
      <p class="font-semibold" :style="{ color: colorToHex(budget.category.color || 'white') }">
        {{ budget.category.name }}
      </p>
      <u-dropdown-menu
        :items="items"
        :content="{ side: 'bottom', sideOffset: 10, align: 'end' }"
        :ui="{
          content: 'w-30 bg-gray-900 ring-0 text-white z-[9999]',
          item: 'text-white hover:!bg-gray-500/20',
          group: 'border border-gray-800',
          label: 'bg-red-500',
          itemLeadingIcon: 'size-4 text-white',
          itemLabel: 'text-sm',
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
      <p class="text-sm" :class="overSpent ? 'text-red-500' : 'text-soft-white'">
        {{ formatCurrency((budget.totalBudget - budget.totalExpense) * -1) }}
        {{ overSpent ? 'overspending' : 'left' }}
      </p>
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
