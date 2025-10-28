<template>
    <div class="px-4 sm:px-0">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

      <!-- Multi-Currency Summary (if wallets have different currencies) -->
      <div v-if="currencySummary && hasMultipleCurrencies" class="card mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
        <div class="flex justify-between items-center">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Total in Home Currency</h3>
            </div>
            <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {{ formatCurrencyWithCommas(currencySummary.total_balance, currencySummary.home_currency) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Converted from {{ currencySummary.wallets?.length || 0 }} wallet(s)
            </p>
          </div>
          <svg class="w-16 h-16 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div class="stat-card border-primary-500">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</div>
          <div class="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-100">
            {{ formatAmount(walletsStore.totalBalance) }}
          </div>
          <div v-if="hasMultipleCurrencies" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Mixed currencies
          </div>
        </div>
        <div class="stat-card border-green-500">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Today Income</div>
          <div class="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">
            {{ formatAmount(todayIncome) }}
          </div>
        </div>
        <div class="stat-card border-red-500">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Today Expenses</div>
          <div class="mt-1 text-3xl font-semibold text-red-600 dark:text-red-400">
            {{ formatAmount(todayExpense) }}
          </div>
        </div>
        <div class="stat-card border-blue-500">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Net Today</div>
          <div class="mt-1 text-3xl font-semibold" :class="netToday >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ formatAmount(netToday) }}
          </div>
        </div>
      </div>

      <!-- Period Summaries -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Today -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300">Income:</span>
              <span class="font-semibold text-green-600 dark:text-green-400">+{{ formatAmount(todayIncome) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300">Expenses:</span>
              <span class="font-semibold text-red-600 dark:text-red-400">-{{ formatAmount(todayExpense) }}</span>
            </div>
            <div class="flex justify-between border-t dark:border-gray-700 pt-2">
              <span class="text-gray-600 dark:text-gray-300 font-semibold">Net:</span>
              <span class="font-bold" :class="netToday >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ formatAmount(netToday) }}
              </span>
            </div>
          </div>
        </div>

        <!-- This Week -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Week</h3>
          <div class="space-y-2" v-if="analyticsStore.weekSummary">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300">Income:</span>
              <span class="font-semibold text-green-600 dark:text-green-400">+{{ formatAmount(analyticsStore.weekSummary.total_income) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300">Expenses:</span>
              <span class="font-semibold text-red-600 dark:text-red-400">-{{ formatAmount(analyticsStore.weekSummary.total_expense) }}</span>
            </div>
            <div class="flex justify-between border-t dark:border-gray-700 pt-2">
              <span class="text-gray-600 dark:text-gray-300 font-semibold">Net:</span>
              <span class="font-bold" :class="analyticsStore.weekSummary.net_amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ formatAmount(analyticsStore.weekSummary.net_amount) }}
              </span>
            </div>
          </div>
        </div>

        <!-- This Month -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Month</h3>
          <div class="space-y-2" v-if="analyticsStore.monthSummary">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300">Income:</span>
              <span class="font-semibold text-green-600 dark:text-green-400">+{{ formatAmount(analyticsStore.monthSummary.total_income) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300">Expenses:</span>
              <span class="font-semibold text-red-600 dark:text-red-400">-{{ formatAmount(analyticsStore.monthSummary.total_expense) }}</span>
            </div>
            <div class="flex justify-between border-t dark:border-gray-700 pt-2">
              <span class="text-gray-600 dark:text-gray-300 font-semibold">Net:</span>
              <span class="font-bold" :class="analyticsStore.monthSummary.net_amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ formatAmount(analyticsStore.monthSummary.net_amount) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Wallets Overview -->
      <div class="card mb-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Your Wallets</h3>
          <NuxtLink to="/wallets" class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium">
            View All →
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            v-for="wallet in walletsStore.wallets.slice(0, 4)" 
            :key="wallet.id"
            class="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="text-sm text-gray-600 dark:text-gray-300 font-medium">{{ wallet.name }}</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ formatAmount(wallet.balance) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
          <NuxtLink to="/transactions" class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium">
            View All →
          </NuxtLink>
        </div>
        <div class="space-y-3">
          <div 
            v-for="transaction in transactionsStore.transactions.slice(0, 5)" 
            :key="transaction.id"
            class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0"
          >
            <div>
              <div class="font-medium text-gray-900 dark:text-white">{{ transaction.description || 'Transaction' }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ transaction.wallet_name }} 
                <span v-if="transaction.category_name">• {{ transaction.category_name }}</span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ new Date(transaction.transaction_date).toLocaleDateString() }}
              </div>
            </div>
            <div class="text-right">
              <div 
                class="font-semibold"
                :class="{
                  'text-green-600 dark:text-green-400': transaction.transaction_type === 'income',
                  'text-red-600 dark:text-red-400': transaction.transaction_type === 'expense',
                  'text-blue-600 dark:text-blue-400': transaction.transaction_type === 'transfer'
                }"
              >
                {{ transaction.transaction_type === 'income' ? '+' : '-' }}{{ formatCurrencyWithCommas(transaction.amount, getTransactionCurrency(transaction)) }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {{ transaction.transaction_type }}
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

const walletsStore = useWalletsStore()
const transactionsStore = useTransactionsStore()
const analyticsStore = useAnalyticsStore()
const { getCurrencySymbol, formatCurrencyWithCommas, getDefaultCurrency } = useCurrency()

const currencySummary = ref<any>(null)

const todayIncome = computed(() => analyticsStore.todaySummary?.total_income || 0)
const todayExpense = computed(() => analyticsStore.todaySummary?.total_expense || 0)
const netToday = computed(() => todayIncome.value - todayExpense.value)

const hasMultipleCurrencies = computed(() => {
  if (!walletsStore.wallets || walletsStore.wallets.length === 0) return false
  const currencies = [...new Set(walletsStore.wallets.map((w: any) => w.currency))]
  return currencies.length > 1
})

const displayCurrency = computed(() => {
  return getDefaultCurrency()
})

const formatAmount = (amount: number) => {
  return formatCurrencyWithCommas(amount, displayCurrency.value)
}

// Get wallet currency for a transaction
const getTransactionCurrency = (transaction: any) => {
  const wallet = walletsStore.wallets.find((w: any) => w.id === transaction.wallet_id)
  return wallet?.currency || displayCurrency.value
}

const fetchCurrencySummary = async () => {
  try {
    const { $api } = useNuxtApp()
    const response = await $api.get('/currency/summary')
    currencySummary.value = response.data
  } catch (error) {
    console.error('Failed to fetch currency summary:', error)
  }
}

onMounted(async () => {
  await Promise.all([
    walletsStore.fetchWallets(),
    transactionsStore.fetchTransactions({ limit: 10 }),
    analyticsStore.fetchTodaySummary(),
    analyticsStore.fetchWeekSummary(),
    analyticsStore.fetchMonthSummary(),
    fetchCurrencySummary()
  ])
})
</script>


