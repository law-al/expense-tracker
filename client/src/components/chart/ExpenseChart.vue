<template>
  <div style="height: 200px">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import type { CategoryExpenseSummary } from '../../../../api/src/types'
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
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
        ],
        hoverOffset: 5,
        borderColor: 'transparent',
        borderRadius: 15,
        data: data.value,
        weight: 10,
      },
    ],
  }
})

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const chartOptions = ref<ChartOptions<'doughnut'>>({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      display: false,
    },
  },
})
</script>

<style scoped></style>
