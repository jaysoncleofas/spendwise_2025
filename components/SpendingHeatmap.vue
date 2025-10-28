<template>
  <div class="spending-heatmap">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full">
        <!-- Hours header -->
        <div class="flex mb-2">
          <div class="w-24"></div>
          <div class="flex-1 flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300 px-1">
            <span v-for="hour in [0, 6, 12, 18, 23]" :key="hour">{{ hour }}:00</span>
          </div>
        </div>
        
        <!-- Heatmap grid -->
        <div v-for="(dayData, dayIndex) in data" :key="dayIndex" class="flex items-center mb-1.5">
          <!-- Day label -->
          <div class="w-24 text-sm font-semibold text-gray-800 dark:text-gray-200">
            {{ days[dayIndex] }}
          </div>
          
          <!-- Hour cells -->
          <div class="flex-1 flex gap-1">
            <div
              v-for="(value, hourIndex) in dayData"
              :key="hourIndex"
              :style="{ backgroundColor: getColor(value) }"
              :title="`${days[dayIndex]} ${hourIndex}:00 - $${value.toFixed(2)}`"
              class="flex-1 h-9 rounded transition-all hover:scale-110 hover:shadow-lg cursor-pointer border border-gray-200 dark:border-gray-700"
            >
            </div>
          </div>
        </div>
        
        <!-- Legend -->
        <div class="mt-6 flex items-center justify-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          <span>Less spending</span>
          <div class="flex gap-1.5">
            <div 
              v-for="i in 5" 
              :key="i"
              :style="{ backgroundColor: getLegendColor(i) }"
              class="w-8 h-5 rounded border border-gray-300 dark:border-gray-600"
            ></div>
          </div>
          <span>More spending</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: number[][]
  days: string[]
}>()

// Find max value for scaling
const maxValue = computed(() => {
  let max = 0
  props.data.forEach(dayData => {
    dayData.forEach(value => {
      if (value > max) max = value
    })
  })
  return max
})

const getColor = (value: number) => {
  if (value === 0) return '#e5e7eb' // gray-200 - more visible than gray-100
  
  const intensity = maxValue.value > 0 ? value / maxValue.value : 0
  
  // Use a gradient from light green to dark red for better visibility
  if (intensity < 0.2) return '#86efac' // green-300 - light spending
  if (intensity < 0.4) return '#fde047' // yellow-300 - moderate spending
  if (intensity < 0.6) return '#fb923c' // orange-400 - high spending
  if (intensity < 0.8) return '#f87171' // red-400 - higher spending
  return '#dc2626' // red-600 - highest spending
}

const getLegendColor = (level: number) => {
  const colors = ['#e5e7eb', '#86efac', '#fde047', '#fb923c', '#dc2626']
  return colors[level - 1]
}
</script>

<style scoped>
.spending-heatmap {
  @apply w-full;
}
</style>

