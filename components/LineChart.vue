<template>
  <div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
  }>
  title?: string
}>()

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((dataset) => ({
    ...dataset,
    tension: 0.3,
    fill: true,
    borderWidth: 3,
    pointRadius: 5,
    pointHoverRadius: 7,
    pointBackgroundColor: isDark.value ? '#fff' : dataset.borderColor,
    pointBorderColor: dataset.borderColor,
    pointBorderWidth: 2,
  })),
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 15,
        font: {
          size: 13,
          weight: '600',
        },
        color: isDark.value ? '#e5e7eb' : '#374151',
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    tooltip: {
      backgroundColor: isDark.value ? '#1f2937' : '#ffffff',
      titleColor: isDark.value ? '#f3f4f6' : '#111827',
      bodyColor: isDark.value ? '#e5e7eb' : '#374151',
      borderColor: isDark.value ? '#374151' : '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        label: function (context: any) {
          const label = context.dataset.label || ''
          const value = context.parsed.y || 0
          return `${label}: $${value.toFixed(2)}`
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: true,
        color: isDark.value ? '#374151' : '#e5e7eb',
      },
      ticks: {
        color: isDark.value ? '#9ca3af' : '#6b7280',
        font: {
          size: 11,
          weight: '500',
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: isDark.value ? '#374151' : '#e5e7eb',
      },
      ticks: {
        color: isDark.value ? '#9ca3af' : '#6b7280',
        font: {
          size: 11,
          weight: '500',
        },
        callback: function (value: any) {
          return '$' + value.toFixed(0)
        },
      },
    },
  },
}))
</script>

