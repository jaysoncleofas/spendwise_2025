<template>
    <div class="px-4 sm:px-0">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Wallets</h1>
        <button @click="showCreateModal = true" class="btn-primary">
          + Add Wallet
        </button>
      </div>

      <!-- Wallets Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="wallet in walletsStore.wallets" 
          :key="wallet.id"
          class="card hover:shadow-lg transition-shadow"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ wallet.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400" v-if="wallet.description">{{ wallet.description }}</p>
            </div>
            <div class="flex space-x-2">
              <button @click="editWallet(wallet)" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300" title="Edit">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button @click="deleteWalletConfirm(wallet.id)" class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300" title="Delete">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {{ formatCurrencyWithCommas(wallet.balance, wallet.currency) }} <span class="text-base text-gray-500 dark:text-gray-400">{{ wallet.currency }}</span>
          </div>

          <button @click="showAddMoneyModal(wallet)" class="btn-primary w-full">
            Add Money
          </button>
        </div>
      </div>

      <!-- Create/Edit Wallet Modal -->
      <div v-if="showCreateModal || editingWallet" class="modal-overlay">
        <div class="modal-content">
          <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {{ editingWallet ? 'Edit Wallet' : 'Create New Wallet' }}
          </h2>
          <form @submit.prevent="handleSaveWallet" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input v-model="walletForm.name" type="text" required class="input-field" placeholder="e.g., Cash on Hand, Bank of America" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea v-model="walletForm.description" class="input-field" rows="3" placeholder="Optional description"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
              <select v-model="walletForm.currency" required class="input-field">
                <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
                  {{ currency.symbol }} {{ currency.code }} - {{ currency.name }}
                </option>
              </select>
            </div>
            <div class="flex space-x-3">
              <button type="submit" class="btn-primary flex-1">
                {{ editingWallet ? 'Update' : 'Create' }}
              </button>
              <button type="button" @click="closeModal" class="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Add Money Modal -->
      <div v-if="addMoneyWallet" class="modal-overlay">
        <div class="modal-content">
          <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add Money to {{ addMoneyWallet.name }}</h2>
          <form @submit.prevent="handleAddMoney" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
              <input v-model.number="addMoneyAmount" type="number" step="0.01" min="0.01" required class="input-field" placeholder="0.00" />
            </div>
            <div class="flex space-x-3">
              <button type="submit" class="btn-primary flex-1">Add Money</button>
              <button type="button" @click="addMoneyWallet = null" class="btn-secondary flex-1">Cancel</button>
            </div>
          </form>
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
const { getCurrencySymbol, formatCurrencyWithCommas } = useCurrency()

const showCreateModal = ref(false)
const editingWallet = ref<any>(null)
const addMoneyWallet = ref<any>(null)
const addMoneyAmount = ref(0)
const currencies = ref<any[]>([])

// Fetch available currencies
const fetchCurrencies = async () => {
  try {
    const { $api } = useNuxtApp()
    const response = await $api.get('/currency/currencies')
    currencies.value = response.data
  } catch (error) {
    console.error('Failed to fetch currencies:', error)
    // Fallback to default currencies if API fails
    currencies.value = [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
      { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    ]
  }
}

const walletForm = ref({
  name: '',
  description: '',
  currency: 'USD',
})

const resetForm = () => {
  walletForm.value = {
    name: '',
    description: '',
    currency: 'USD',
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingWallet.value = null
  resetForm()
}

const editWallet = (wallet: any) => {
  editingWallet.value = wallet
  walletForm.value = {
    name: wallet.name,
    description: wallet.description || '',
    currency: wallet.currency,
  }
}

const handleSaveWallet = async () => {
  try {
    if (editingWallet.value) {
      await walletsStore.updateWallet(editingWallet.value.id, walletForm.value)
    } else {
      await walletsStore.createWallet(walletForm.value)
    }
    closeModal()
  } catch (error) {
    console.error('Failed to save wallet:', error)
    alert('Failed to save wallet. Please try again.')
  }
}

const showAddMoneyModal = (wallet: any) => {
  addMoneyWallet.value = wallet
  addMoneyAmount.value = 0
}

const handleAddMoney = async () => {
  if (addMoneyAmount.value <= 0) {
    alert('Please enter a valid amount')
    return
  }
  
  try {
    await walletsStore.addMoney(addMoneyWallet.value.id, addMoneyAmount.value)
    addMoneyWallet.value = null
    addMoneyAmount.value = 0
  } catch (error) {
    console.error('Failed to add money:', error)
    alert('Failed to add money. Please try again.')
  }
}

const deleteWalletConfirm = async (id: number) => {
  if (confirm('Are you sure you want to delete this wallet? This action cannot be undone.')) {
    try {
      await walletsStore.deleteWallet(id)
    } catch (error) {
      console.error('Failed to delete wallet:', error)
      alert('Failed to delete wallet. Please try again.')
    }
  }
}

onMounted(async () => {
  await Promise.all([
    walletsStore.fetchWallets(),
    fetchCurrencies()
  ])
})
</script>


