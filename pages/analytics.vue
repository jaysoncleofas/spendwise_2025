<template>
    <div class="px-4 sm:px-0">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Analytics</h1>

      <!-- Period Selector -->
      <div class="card mb-6">
        <div class="flex space-x-4">
          <button 
            @click="selectPeriod('today')" 
            class="px-4 py-2 rounded-lg font-medium"
            :class="selectedPeriod === 'today' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            Today
          </button>
          <button 
            @click="selectPeriod('week')" 
            class="px-4 py-2 rounded-lg font-medium"
            :class="selectedPeriod === 'week' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            This Week
          </button>
          <button 
            @click="selectPeriod('month')" 
            class="px-4 py-2 rounded-lg font-medium"
            :class="selectedPeriod === 'month' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            This Month
          </button>
        </div>
      </div>

      <div v-if="currentSummary">
        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="stat-card border-green-500">
            <div class="text-sm font-medium text-gray-500">Total Income</div>
            <div class="mt-1 text-3xl font-semibold text-green-600">
              {{ formatAmount(currentSummary.total_income) }}
            </div>
            <div class="mt-2 text-sm text-gray-600">
              {{ currentSummary.transaction_count }} transactions
            </div>
          </div>
          <div class="stat-card border-red-500">
            <div class="text-sm font-medium text-gray-500">Total Expenses</div>
            <div class="mt-1 text-3xl font-semibold text-red-600">
              {{ formatAmount(currentSummary.total_expense) }}
            </div>
          </div>
          <div class="stat-card border-blue-500">
            <div class="text-sm font-medium text-gray-500">Net Amount</div>
            <div class="mt-1 text-3xl font-semibold" :class="currentSummary.net_amount >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ formatAmount(currentSummary.net_amount) }}
            </div>
          </div>
        </div>

        <!-- Interactive Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Expense Distribution Pie Chart -->
          <div class="card">
            <h2 class="text-xl font-bold mb-6">Expense Distribution</h2>
            <div v-if="currentSummary.top_categories.length > 0" class="h-80 flex items-center justify-center">
              <PieChart 
                :labels="currentSummary.top_categories.map((c: any) => c.category_name)"
                :data="currentSummary.top_categories.map((c: any) => c.total_amount)"
              />
            </div>
            <div v-else class="h-80 flex items-center justify-center text-gray-500">
              No expense data available
            </div>
          </div>

          <!-- Income vs Expense Trend -->
          <div class="card">
            <h2 class="text-xl font-bold mb-6">Income vs Expense Trends</h2>
            <div v-if="currentSummary.daily_breakdown.length > 0" class="h-80 flex items-center justify-center">
              <LineChart 
                :labels="currentSummary.daily_breakdown.map((d: any) => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))"
                :datasets="[
                  {
                    label: 'Income',
                    data: currentSummary.daily_breakdown.map((d: any) => d.total_income),
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  },
                  {
                    label: 'Expenses',
                    data: currentSummary.daily_breakdown.map((d: any) => d.total_expense),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  },
                ]"
              />
            </div>
            <div v-else class="h-80 flex items-center justify-center text-gray-500">
              No data available
            </div>
          </div>
        </div>

        <!-- Top Expense Categories (Detailed View) -->
        <div class="card mb-8">
          <h2 class="text-xl font-bold mb-6">Top Expense Categories</h2>
          <div class="space-y-4">
            <div 
              v-for="category in currentSummary.top_categories" 
              :key="category.category_id"
              class="flex items-center justify-between"
            >
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-medium">{{ category.category_name }}</span>
                  <span class="text-sm text-gray-600">
                    {{ formatAmount(category.total_amount) }} ({{ category.percentage.toFixed(1) }}%)
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    class="bg-primary-600 h-2.5 rounded-full"
                    :style="{ width: category.percentage + '%' }"
                  ></div>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ category.transaction_count }} transactions
                </div>
              </div>
            </div>
            <div v-if="currentSummary.top_categories.length === 0" class="text-center py-4 text-gray-500">
              No expense data available for this period
            </div>
          </div>
        </div>

        <!-- Daily Breakdown Chart -->
        <div class="card mb-8">
          <h2 class="text-xl font-bold mb-6">Daily Net Amount</h2>
          <div v-if="currentSummary.daily_breakdown.length > 0" class="h-80 flex items-center justify-center">
            <BarChart 
              :labels="currentSummary.daily_breakdown.map((d: any) => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))"
              :datasets="[
                {
                  label: 'Net Amount',
                  data: currentSummary.daily_breakdown.map((d: any) => d.net_amount),
                  backgroundColor: currentSummary.daily_breakdown.map((d: any) => d.net_amount >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'),
                },
              ]"
            />
          </div>
          <div v-else class="h-80 flex items-center justify-center text-gray-500">
            No data available
          </div>
        </div>

        <!-- Daily Breakdown Table -->
        <div class="card mb-8">
          <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">Daily Breakdown Details</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Income</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expenses</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transactions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="day in currentSummary.daily_breakdown" :key="day.date">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ new Date(day.date).toLocaleDateString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                    +{{ formatAmount(day.total_income) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                    -{{ formatAmount(day.total_expense) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="day.net_amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                    {{ formatAmount(day.net_amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ day.transaction_count }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Comparison Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Month-over-Month Comparison -->
          <div class="card">
            <h2 class="text-xl font-bold mb-6">Month-over-Month Comparison</h2>
            <div v-if="analyticsStore.monthOverMonth && analyticsStore.monthOverMonth.data.length > 0" class="h-80 flex items-center justify-center">
              <LineChart 
                :labels="analyticsStore.monthOverMonth.data.map((d: any) => d.month_short)"
                :datasets="[
                  {
                    label: 'Income',
                    data: analyticsStore.monthOverMonth.data.map((d: any) => d.income),
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  },
                  {
                    label: 'Expenses',
                    data: analyticsStore.monthOverMonth.data.map((d: any) => d.expense),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  },
                  {
                    label: 'Net',
                    data: analyticsStore.monthOverMonth.data.map((d: any) => d.net),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  },
                ]"
              />
            </div>
            <div v-else class="h-80 flex items-center justify-center text-gray-500">
              Loading comparison data...
            </div>
          </div>

          <!-- Year-over-Year Comparison -->
          <div class="card">
            <h2 class="text-xl font-bold mb-6">Year-over-Year Comparison</h2>
            <div v-if="analyticsStore.yearOverYear && analyticsStore.yearOverYear.data.length > 0" class="h-80 flex items-center justify-center">
              <BarChart 
                :labels="analyticsStore.yearOverYear.data.map((d: any) => d.year.toString())"
                :datasets="[
                  {
                    label: 'Income',
                    data: analyticsStore.yearOverYear.data.map((d: any) => d.income),
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                  },
                  {
                    label: 'Expenses',
                    data: analyticsStore.yearOverYear.data.map((d: any) => d.expense),
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                  },
                  {
                    label: 'Net',
                    data: analyticsStore.yearOverYear.data.map((d: any) => d.net),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  },
                ]"
              />
            </div>
            <div v-else class="h-80 flex items-center justify-center text-gray-500">
              Loading comparison data...
            </div>
          </div>
        </div>

        <!-- Spending Patterns Heatmap -->
        <div class="card mb-8">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Spending Patterns Heatmap</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">When do you spend the most? (Last 30 days)</p>
            </div>
          </div>
          
          <div v-if="analyticsStore.spendingHeatmap && analyticsStore.spendingHeatmap.data">
            <SpendingHeatmap 
              :data="analyticsStore.spendingHeatmap.data"
              :days="analyticsStore.spendingHeatmap.days"
            />
            
            <!-- Check if heatmap is empty (all zeros) -->
            <div v-if="isHeatmapEmpty" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p class="font-semibold text-blue-900">No spending data yet</p>
                  <p class="text-sm text-blue-700 mt-1">
                    Create some <strong>expense</strong> transactions to see your spending patterns. The heatmap shows when you spend the most by day of week and hour.
                  </p>
                  <NuxtLink to="/transactions" class="inline-block mt-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                    Add transactions →
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="heatmapError" class="text-center py-8 text-red-500">
            {{ heatmapError }}
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
            <p>Loading spending patterns...</p>
          </div>
        </div>

        <!-- Budget Utilization with Donut Charts -->
        <div class="card mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Budget Utilization</h2>
            <NuxtLink 
              to="/budgets"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View Details →
            </NuxtLink>
          </div>
          
          <div v-if="budgetStatuses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="budget in budgetStatuses"
              :key="budget.category_id"
              class="text-center"
            >
              <div class="relative w-32 h-32 mx-auto mb-3">
                <DoughnutChart
                  :spent="budget.spent"
                  :remaining="budget.remaining"
                  :label="budget.category_name"
                  :budgetLimit="budget.budget_limit"
                />
                <!-- Center Text -->
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <div :class="[
                    'text-2xl font-bold',
                    budget.percentage >= 100 ? 'text-red-600' :
                    budget.percentage >= 90 ? 'text-orange-600' :
                    budget.percentage >= 80 ? 'text-yellow-600' :
                    'text-green-600'
                  ]">
                    {{ budget.percentage.toFixed(0) }}%
                  </div>
                </div>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ budget.category_name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatAmount(budget.spent) }} / {{ formatAmount(budget.budget_limit) }}</p>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No budgets set yet.</p>
            <NuxtLink
              to="/categories"
              class="inline-block mt-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              Set up budgets in Categories →
            </NuxtLink>
          </div>
        </div>

        <!-- Wallets Summary -->
        <div class="card">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Wallets Overview</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="wallet in analyticsStore.walletsSummary" 
              :key="wallet.wallet_id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ wallet.wallet_name }}</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {{ formatAmount(wallet.balance) }}
              </div>
              <div class="mt-3 space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Income:</span>
                  <span class="text-green-600">+{{ formatAmount(wallet.total_income) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Expenses:</span>
                  <span class="text-red-600">-{{ formatAmount(wallet.total_expense) }}</span>
                </div>
                <div class="flex justify-between border-t pt-1">
                  <span class="text-gray-600 dark:text-gray-400">Transactions:</span>
                  <span class="text-gray-900 dark:text-gray-100">{{ wallet.transaction_count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'default'
})

const analyticsStore = useAnalyticsStore()
const budgetsStore = useBudgetsStore()
const { formatCurrencyWithCommas, getDefaultCurrency } = useCurrency()

const displayCurrency = computed(() => getDefaultCurrency())
const formatAmount = (amount: number) => formatCurrencyWithCommas(amount, displayCurrency.value)

const budgetStatuses = computed(() => budgetsStore.budgetStatuses)
const heatmapError = ref('')

const isHeatmapEmpty = computed(() => {
  if (!analyticsStore.spendingHeatmap?.data) return true
  
  // Check if all values are 0
  return analyticsStore.spendingHeatmap.data.every((day: number[]) => 
    day.every((value: number) => value === 0)
  )
})

const selectedPeriod = ref('month')

const currentSummary = computed(() => {
  switch (selectedPeriod.value) {
    case 'today':
      return analyticsStore.todaySummary
    case 'week':
      return analyticsStore.weekSummary
    case 'month':
      return analyticsStore.monthSummary
    default:
      return null
  }
})

const selectPeriod = (period: string) => {
  selectedPeriod.value = period
}

onMounted(async () => {
  try {
    await Promise.all([
      analyticsStore.fetchTodaySummary(),
      analyticsStore.fetchWeekSummary(),
      analyticsStore.fetchMonthSummary(),
      analyticsStore.fetchWalletsSummary(),
      analyticsStore.fetchMonthOverMonth(6),
      analyticsStore.fetchYearOverYear(3),
      budgetsStore.fetchBudgetStatus(),
    ])
    
    // Fetch heatmap separately to catch errors
    try {
      await analyticsStore.fetchSpendingHeatmap(30)
    } catch (error: any) {
      console.error('Heatmap error:', error)
      heatmapError.value = error.response?.data?.detail || 'Failed to load spending patterns. You may need more transaction data.'
    }
  } catch (error) {
    console.error('Error loading analytics:', error)
  }
})
</script>


