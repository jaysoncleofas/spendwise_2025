<template>
    <div class="px-4 sm:px-0">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Budget Management</h1>
      <button
        @click="refreshData"
        class="btn-primary"
      >
        Refresh
      </button>
    </div>

    <!-- Budget Alerts -->
    <div v-if="budgetAlerts.length > 0" class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Alerts</h2>
      <div class="space-y-3">
        <div
          v-for="alert in budgetAlerts"
          :key="alert.category_id"
          :class="[
            'p-4 rounded-lg border-l-4',
            alert.severity === 'danger' ? 'bg-red-50 dark:bg-red-900 border-red-500' :
            alert.severity === 'critical' ? 'bg-orange-50 dark:bg-orange-900 border-orange-500' :
            'bg-yellow-50 dark:bg-yellow-900 border-yellow-500'
          ]"
        >
          <div class="flex items-center justify-between">
            <div>
              <p :class="[
                'font-semibold',
                alert.severity === 'danger' ? 'text-red-800 dark:text-red-200' :
                alert.severity === 'critical' ? 'text-orange-800 dark:text-orange-200' :
                'text-yellow-800 dark:text-yellow-200'
              ]">
                {{ alert.message }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {{ formatAmount(alert.spent) }} / {{ formatAmount(alert.budget_limit) }}
              </p>
            </div>
            <div :class="[
              'text-2xl font-bold',
              alert.severity === 'danger' ? 'text-red-600 dark:text-red-400' :
              alert.severity === 'critical' ? 'text-orange-600 dark:text-orange-400' :
              'text-yellow-600 dark:text-yellow-400'
            ]">
              {{ alert.percentage.toFixed(1) }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Status Cards -->
    <div v-if="!loading && budgetStatuses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="budget in budgetStatuses"
        :key="budget.category_id"
        class="card"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ budget.category_name }}</h3>
              <span v-if="budget.budget_type === 'fixed'" class="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                Fixed
              </span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-300">
              {{ budget.budget_type === 'fixed' ? formatFixedPeriod(budget.period_start) : formatPeriod(budget.period_start, budget.period_end) }}
            </p>
          </div>
          <span :class="[
            'px-3 py-1 rounded-full text-xs font-semibold',
            budget.alert_level === 'safe' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
            budget.alert_level === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
            budget.alert_level === 'critical' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
            'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          ]">
            {{ budget.alert_level.toUpperCase() }}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="mb-4">
          <div class="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
            <span>{{ formatAmount(budget.spent) }} spent</span>
            <span>{{ formatAmount(budget.remaining) }} remaining</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              :class="[
                'h-full transition-all duration-300',
                budget.percentage >= 100 ? 'bg-red-500' :
                budget.percentage >= 90 ? 'bg-orange-500' :
                budget.percentage >= 80 ? 'bg-yellow-500' :
                'bg-green-500'
              ]"
              :style="{ width: Math.min(budget.percentage, 100) + '%' }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-300 mt-1">
            <span>0%</span>
            <span class="font-semibold">{{ budget.percentage.toFixed(1) }}%</span>
            <span>100%</span>
          </div>
        </div>

        <!-- Budget Details -->
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-300">Budget Limit:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ formatAmount(budget.budget_limit) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-300">Total Spent:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ formatAmount(budget.spent) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-300">Remaining:</span>
            <span :class="budget.remaining >= 0 ? 'text-green-500 dark:text-green-400 font-semibold' : 'text-red-500 dark:text-red-400 font-semibold'">
              {{ formatAmount(budget.remaining) }}
            </span>
          </div>
        </div>

        <!-- View History Button -->
        <button
          @click="showHistory(budget.category_id, budget.category_name)"
          class="mt-4 w-full px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900 rounded-md hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
        >
          View History
        </button>
      </div>
    </div>

    <!-- Budget History Modal -->
    <div v-if="historyModal.show" class="modal-overlay p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ historyModal.categoryName }} - Budget History</h2>
            <button @click="historyModal.show = false" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div v-if="historyModal.loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p class="mt-2 text-gray-500 dark:text-gray-400">Loading history...</p>
          </div>
          
          <div v-else-if="historyModal.data">
            <!-- History Chart would go here - for now showing table -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="table-header">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Month</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Budget</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Spent</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Remaining</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usage %</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="(item, index) in historyModal.data.history" :key="index" class="table-row">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ item.month }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ formatAmount(item.budget_limit) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {{ formatAmount(item.spent) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm" :class="item.remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                      {{ formatAmount(item.remaining) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-2">
                        <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                          <div
                            :class="[
                              'h-2 rounded-full',
                              item.percentage >= 100 ? 'bg-red-500' :
                              item.percentage >= 90 ? 'bg-orange-500' :
                              item.percentage >= 80 ? 'bg-yellow-500' :
                              'bg-green-500'
                            ]"
                            :style="{ width: Math.min(item.percentage, 100) + '%' }"
                          ></div>
                        </div>
                        <span class="text-sm font-medium">{{ item.percentage.toFixed(1) }}%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Loading budgets...</p>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && budgetStatuses.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">No budgets set. Go to Categories to set budget limits.</p>
      <NuxtLink
        to="/categories"
        class="inline-block mt-4 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Manage Categories
      </NuxtLink>
    </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const budgetsStore = useBudgetsStore()
const { formatCurrencyWithCommas, getDefaultCurrency } = useCurrency()

const displayCurrency = computed(() => getDefaultCurrency())
const formatAmount = (amount: number) => formatCurrencyWithCommas(amount, displayCurrency.value)

const budgetStatuses = computed(() => budgetsStore.budgetStatuses)
const budgetAlerts = computed(() => budgetsStore.budgetAlerts)
const loading = computed(() => budgetsStore.loading)

const historyModal = ref({
  show: false,
  loading: false,
  categoryId: null as number | null,
  categoryName: '',
  data: null as any
})

const formatPeriod = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

const formatFixedPeriod = (start: string) => {
  const startDate = new Date(start)
  const today = new Date()
  const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  return `Since ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (${daysPassed} days)`
}

const showHistory = async (categoryId: number, categoryName: string) => {
  historyModal.value.show = true
  historyModal.value.loading = true
  historyModal.value.categoryId = categoryId
  historyModal.value.categoryName = categoryName
  historyModal.value.data = null
  
  try {
    const data = await budgetsStore.fetchBudgetHistory(categoryId, 6)
    historyModal.value.data = data
  } catch (error) {
    console.error('Failed to load budget history:', error)
  } finally {
    historyModal.value.loading = false
  }
}

const refreshData = async () => {
  await Promise.all([
    budgetsStore.fetchBudgetStatus(),
    budgetsStore.fetchBudgetAlerts(),
  ])
}

onMounted(() => {
  refreshData()
})
</script>

