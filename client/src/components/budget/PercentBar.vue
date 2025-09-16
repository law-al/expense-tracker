<template>
  <div class="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
    <div
      class="h-full"
      :style="{
        width: `${percentage || 0}%`,
        backgroundColor: getBudgetColor(percentage || 0),
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  percentage: number
}>()

const getBudgetColor = (percentage: number) => {
  if (percentage <= 20) return '#3B82F6'
  if (percentage > 20 && percentage <= 40) return '#06B6D4'
  if (percentage > 41 && percentage <= 60) return '#F59E0B'
  if (percentage > 61 && percentage <= 80) return '#F97316'
  if (percentage > 81 && percentage <= 99) return '#EF4444'
  return 'DC2626'
}
</script>

<style scoped></style>
