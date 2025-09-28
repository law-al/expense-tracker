<template>
  <div style="height: 200px" class="relative">
    <Doughnut :data="chartData" :options="chartOptions" />
    <div class="absolute inset-0 flex flex-col justify-center items-center z-100">
      <p class="text-center text-sm font-light">Expenses</p>
      <p class="text-center text-lg font-bold">
        {{
          isLoading
            ? 'Loading...'
            : totalExpense.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CategoryExpenseSummary } from '@/types'
import { ref, toRef, computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartData,
  type ChartOptions,
} from 'chart.js'

const props = defineProps<{
  data: CategoryExpenseSummary[]
  loading: boolean
}>()

const isLoading = toRef(props, 'loading')
const data = computed(() => props.data.map((item) => item.totalAmount || 0))
const labels = computed(() => props.data.map((item) => item.categoryName || 'Uncategorized'))
const totalExpense = computed(() => data.value.reduce((sum, val) => sum + val, 0))

const chartData = computed<ChartData<'doughnut'>>(() => {
  if (isLoading.value) {
    return {
      labels: ['Loading'],
      datasets: [
        {
          data: [1],
          backgroundColor: ['#e0e0e0'],
        },
      ],
    }
  }

  return {
    labels: labels.value,
    datasets: [
      {
        label: 'Expenses',
        data: data.value,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
          'rgb(46, 204, 113)',
          'rgb(231, 76, 60)',
          'rgb(52, 152, 219)',
          'rgb(155, 89, 182)',
          'rgb(241, 196, 15)',
          'rgb(26, 188, 156)',
          'rgb(230, 126, 34)',
          'rgb(142, 68, 173)',
          'rgb(41, 128, 185)',
          'rgb(39, 174, 96)',
          'rgb(192, 57, 43)',
          'rgb(243, 156, 18)',
          'rgb(22, 160, 133)',
          'rgb(211, 84, 0)',
        ],
        offset: 4,
        borderColor: '#1F2937',
        borderWidth: 4,
        hoverOffset: 5,
        borderRadius: 25,
      },
    ],
  }
})

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const chartOptions = ref<ChartOptions<'doughnut'>>({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '80%',
  plugins: {
    legend: {
      display: false,
    },
  },
})
</script>

<style scoped></style>
