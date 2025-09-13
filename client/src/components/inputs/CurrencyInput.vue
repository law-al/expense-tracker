<template>
  <input ref="inputRef" type="text" />
</template>

<script setup lang="ts">
import { useCurrencyInput, type CurrencyInputOptions } from 'vue-currency-input'

const props = defineProps<{
  modelValue: number | null
  options?: CurrencyInputOptions
}>()

const { inputRef } = useCurrencyInput(props?.options as CurrencyInputOptions)
</script>

<style scoped></style>
