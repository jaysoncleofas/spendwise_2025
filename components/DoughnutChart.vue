<template>
  <div>
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  spent: number
  remaining: number
  label: string
  budgetLimit: number
}>()

const chartData = computed(() => {
  const remaining = Math.max(0, props.remaining)
  const spent = props.spent
  
  // Determine colors based on percentage
  const percentage = (spent / props.budgetLimit) * 100
  let spentColor = '#22c55e' // green
  
  if (percentage >= 100) {
    spentColor = '#ef4444' // red
  } else if (percentage >= 90) {
    spentColor = '#f97316' // orange
  } else if (percentage >= 80) {
    spentColor = '#eab308' // yellow
  }
  
  return {
    labels: ['Spent', 'Remaining'],
    datasets: [
      {
        data: [spent, remaining],
        backgroundColor: [spentColor, '#e5e7eb'],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.label || ''
          const value = context.parsed || 0
          const percentage = ((value / props.budgetLimit) * 100).toFixed(1)
          return `${label}: $${value.toFixed(2)} (${percentage}%)`
        },
      },
    },
  },
}
</script>

