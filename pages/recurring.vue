<template>
    <div class="px-4 sm:px-0">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Recurring Transactions</h1>
      <div class="flex gap-3">
        <button
          @click="processRecurring"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Process Due
        </button>
        <button
          @click="showCreateModal = true"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          + Add Recurring
        </button>
      </div>
    </div>

    <!-- Recurring Transactions List -->
    <div v-if="!loading && recurringTransactions.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Frequency</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Next Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="recurring in recurringTransactions" :key="recurring.id">
            <td class="px-6 py-4">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ recurring.description }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ recurring.wallet_name }} → {{ recurring.category_name }}</p>
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="[
                'px-2 py-1 text-xs rounded-full',
                recurring.transaction_type === 'income' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                recurring.transaction_type === 'expense' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
              ]">
                {{ recurring.transaction_type }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 dark:text-white font-semibold">
              {{ formatAmount(recurring.amount) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 capitalize">
              {{ recurring.frequency }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
              {{ formatDate(recurring.next_occurrence) }}
            </td>
            <td class="px-6 py-4">
              <span :class="[
                'px-2 py-1 text-xs rounded-full',
                recurring.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              ]">
                {{ recurring.is_active ? 'Active' : 'Paused' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm font-medium space-x-2">
              <button
                v-if="recurring.is_active"
                @click="pauseRecurring(recurring.id)"
                class="text-orange-600 hover:text-orange-900"
              >
                Pause
              </button>
              <button
                v-else
                @click="resumeRecurring(recurring.id)"
                class="text-green-600 hover:text-green-900"
              >
                Resume
              </button>
              <button
                @click="deleteRecurring(recurring.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Loading recurring transactions...</p>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && recurringTransactions.length === 0" class="text-center py-12 bg-white rounded-lg shadow-md">
      <p class="text-gray-500 mb-4">No recurring transactions set up yet.</p>
      <button
        @click="showCreateModal = true"
        class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Create Your First Recurring Transaction
      </button>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div class="p-6 overflow-y-auto flex-1">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Create Recurring Transaction</h2>
          <form @submit.prevent="createRecurring" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select v-model="newRecurring.transaction_type" required class="input-field mt-1">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Wallet</label>
              <select v-model="newRecurring.wallet_id" required class="input-field mt-1">
                <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
                  {{ wallet.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select v-model="newRecurring.category_id" class="input-field mt-1">
                <option :value="null">None</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
              <input v-model.number="newRecurring.amount" type="number" step="0.01" required class="input-field mt-1" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <input v-model="newRecurring.description" type="text" required class="input-field mt-1" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</label>
              <select v-model="newRecurring.frequency" required class="input-field mt-1">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
              <input v-model="newRecurring.start_date" type="datetime-local" required class="input-field mt-1" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date (Optional)</label>
              <input v-model="newRecurring.end_date" type="datetime-local" class="input-field mt-1" placeholder="Leave empty for indefinite" />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave empty for indefinite recurring</p>
            </div>
          </form>
        </div>
        
        <!-- Action Buttons Row -->
        <div class="flex gap-3 p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <button type="button" @click="showCreateModal = false" class="btn-secondary flex-1">
            Cancel
          </button>
          <button @click="createRecurring" class="btn-primary flex-1">
            Create
          </button>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const recurringStore = useRecurringStore()
const walletsStore = useWalletsStore()
const categoriesStore = useCategoriesStore()
const { formatCurrencyWithCommas, getDefaultCurrency } = useCurrency()

const displayCurrency = computed(() => getDefaultCurrency())
const formatAmount = (amount: number) => formatCurrencyWithCommas(amount, displayCurrency.value)

const recurringTransactions = computed(() => recurringStore.recurringTransactions)
const loading = computed(() => recurringStore.loading)
const wallets = computed(() => walletsStore.wallets)
const categories = computed(() => categoriesStore.categories)

const showCreateModal = ref(false)

// Initialize with current date
const now = new Date()
const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString().slice(0, 16)

const newRecurring = ref({
  transaction_type: 'expense',
  wallet_id: null,
  category_id: null,
  amount: 0,
  description: '',
  frequency: 'monthly',
  start_date: defaultStartDate,
  end_date: '',
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const createRecurring = async () => {
  try {
    // Clean up the data before sending
    const data = {
      ...newRecurring.value,
      end_date: newRecurring.value.end_date || null,
      category_id: newRecurring.value.category_id || null,
    }
    
    await recurringStore.createRecurringTransaction(data)
    showCreateModal.value = false
    
    // Reset form with default date
    const resetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString().slice(0, 16)
    newRecurring.value = {
      transaction_type: 'expense',
      wallet_id: null,
      category_id: null,
      amount: 0,
      description: '',
      frequency: 'monthly',
      start_date: resetDate,
      end_date: '',
    }
  } catch (error: any) {
    const errorMsg = error.response?.data?.detail || 'Failed to create recurring transaction'
    alert(errorMsg)
    console.error('Error details:', error.response?.data)
  }
}

const pauseRecurring = async (id: number) => {
  if (confirm('Are you sure you want to pause this recurring transaction?')) {
    await recurringStore.pauseRecurringTransaction(id)
  }
}

const resumeRecurring = async (id: number) => {
  await recurringStore.resumeRecurringTransaction(id)
}

const deleteRecurring = async (id: number) => {
  if (confirm('Are you sure you want to delete this recurring transaction?')) {
    await recurringStore.deleteRecurringTransaction(id)
  }
}

const processRecurring = async () => {
  try {
    const result = await recurringStore.processRecurringTransactions()
    alert(`Processed ${result.processed_count} recurring transactions`)
    await recurringStore.fetchRecurringTransactions()
  } catch (error) {
    alert('Failed to process recurring transactions')
  }
}

onMounted(async () => {
  await Promise.all([
    recurringStore.fetchRecurringTransactions(),
    walletsStore.fetchWallets(),
    categoriesStore.fetchCategories(),
  ])
})
</script>

