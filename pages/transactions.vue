<template>
    <div class="px-4 sm:px-0">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <div class="flex gap-3">
          <button @click="exportTransactions" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            📥 Export CSV
          </button>
          <button @click="showCreateModal = true" class="btn-primary">
            + Add Transaction
          </button>
        </div>
      </div>

      <!-- Advanced Filters -->
      <div class="card mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search & Filters</h3>
        
        <!-- Search Box -->
        <div class="mb-4">
          <input 
            v-model="filters.search" 
            type="text" 
            placeholder="Search descriptions and notes..." 
            class="input-field"
            @input="applyFilters"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wallet</label>
            <select v-model="filters.wallet_id" class="input-field" @change="applyFilters">
              <option :value="null">All Wallets</option>
              <option v-for="wallet in walletsStore.wallets" :key="wallet.id" :value="wallet.id">
                {{ wallet.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select v-model="filters.category_id" class="input-field" @change="applyFilters">
              <option :value="null">All Categories</option>
              <option v-for="category in categoriesStore.categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tag</label>
            <select v-model="filters.tag_id" class="input-field" @change="applyFilters">
              <option :value="null">All Tags</option>
              <option v-for="tag in tagsStore.tags" :key="tag.id" :value="tag.id">
                {{ tag.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select v-model="filters.transaction_type" class="input-field" @change="applyFilters">
              <option :value="null">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
            <select v-model="filters.sort_by" class="input-field" @change="applyFilters">
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Amount</label>
            <input 
              v-model.number="filters.min_amount" 
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              class="input-field"
              @input="applyFilters"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Amount</label>
            <input 
              v-model.number="filters.max_amount" 
              type="number" 
              step="0.01" 
              placeholder="1000.00" 
              class="input-field"
              @input="applyFilters"
            />
          </div>
          <div class="flex items-end">
            <button @click="resetFilters" class="btn-secondary w-full">
              Reset All Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Transactions List -->
      <div class="card">
        <div class="space-y-3">
          <div 
            v-for="transaction in transactionsStore.transactions" 
            :key="transaction.id"
            class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded transition-colors"
          >
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <span 
                    class="inline-flex items-center justify-center h-10 w-10 rounded-full"
                    :class="{
                      'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300': transaction.transaction_type === 'income',
                      'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300': transaction.transaction_type === 'expense',
                      'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300': transaction.transaction_type === 'transfer'
                    }"
                  >
                    {{ transaction.transaction_type === 'income' ? '↓' : transaction.transaction_type === 'expense' ? '↑' : '↔' }}
                  </span>
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ transaction.description || 'Transaction' }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ transaction.wallet_name }}
                    <span v-if="transaction.category_name">• {{ transaction.category_name }}</span>
                    <span v-if="transaction.transfer_wallet_name">→ {{ transaction.transfer_wallet_name }}</span>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ new Date(transaction.transaction_date).toLocaleString() }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div 
                  class="font-semibold text-lg"
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
              <div class="flex space-x-2">
                <button @click="openReceiptsModal(transaction)" class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300" title="Receipts">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                  </svg>
                </button>
                <button @click="editTransaction(transaction)" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300" title="Edit">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button @click="deleteTransactionConfirm(transaction.id)" class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300" title="Delete">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="transactionsStore.transactions.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No transactions found. Start by adding a new transaction!
          </div>
        </div>
      </div>

      <!-- Create/Edit Transaction Modal -->
      <div v-if="showCreateModal || editingTransaction" class="modal-overlay">
        <div class="modal-content max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {{ editingTransaction ? 'Edit Transaction' : 'New Transaction' }}
          </h2>
          <form @submit.prevent="handleSaveTransaction" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select v-model="transactionForm.transaction_type" required class="input-field">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wallet</label>
              <select v-model="transactionForm.wallet_id" required class="input-field">
                <option :value="null">Select wallet</option>
                <option v-for="wallet in walletsStore.wallets" :key="wallet.id" :value="wallet.id">
                  {{ wallet.name }}
                </option>
              </select>
            </div>
            <div v-if="transactionForm.transaction_type === 'transfer'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Wallet</label>
              <select v-model="transactionForm.transfer_wallet_id" required class="input-field">
                <option :value="null">Select destination wallet</option>
                <option 
                  v-for="wallet in walletsStore.wallets" 
                  :key="wallet.id" 
                  :value="wallet.id"
                  :disabled="wallet.id === transactionForm.wallet_id"
                >
                  {{ wallet.name }}
                </option>
              </select>
            </div>
            <div v-if="transactionForm.transaction_type !== 'transfer'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select v-model="transactionForm.category_id" class="input-field">
                <option :value="null">Select category (optional)</option>
                <option v-for="category in categoriesStore.categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
              <input v-model.number="transactionForm.amount" type="number" step="0.01" min="0.01" required class="input-field" placeholder="0.00" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <input v-model="transactionForm.description" type="text" class="input-field" placeholder="What was this for?" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <textarea v-model="transactionForm.notes" class="input-field" rows="2" placeholder="Additional notes (optional)"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input v-model="transactionForm.transaction_date" type="datetime-local" class="input-field" />
            </div>
            <div>
              <TagInput v-model="selectedTransactionTags" />
            </div>
            
            <!-- Receipt Attachment Section -->
            <div class="border-t pt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                </svg>
                Attach Receipt (Optional)
              </label>
              <div v-if="attachedReceipt" class="mb-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-green-800 dark:text-green-300 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Receipt Attached
                    </p>
                    <p class="text-xs text-green-600 dark:text-green-400">{{ attachedReceipt.original_filename }}</p>
                    <div v-if="attachedReceipt.parsed_data && (attachedReceipt.parsed_data.amount || attachedReceipt.parsed_data.description)" 
                         class="mt-2 text-xs text-green-700 dark:text-green-300">
                      <p class="font-medium flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        OCR Extracted:
                      </p>
                      <p v-if="attachedReceipt.parsed_data.amount">Amount: {{ attachedReceipt.parsed_data.amount }}</p>
                      <p v-if="attachedReceipt.parsed_data.description">Description: {{ attachedReceipt.parsed_data.description }}</p>
                    </div>
                  </div>
                  <button type="button" @click="removeAttachedReceipt" class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 ml-2" title="Remove">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div v-else class="flex items-center space-x-2">
                <input 
                  ref="receiptFileInput"
                  type="file" 
                  accept="image/*,application/pdf"
                  @change="handleReceiptUpload"
                  class="hidden"
                />
                <button 
                  type="button" 
                  @click="$refs.receiptFileInput.click()"
                  :disabled="uploadingReceipt"
                  class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  {{ uploadingReceipt ? '⏳ Uploading...' : '📷 Choose File' }}
                </button>
                <span class="text-xs text-gray-500">JPG, PNG, or PDF</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                💡 Tip: Upload a receipt to auto-fill amount and description using OCR!
              </p>
            </div>
            
            <div class="flex space-x-3">
              <button type="submit" class="btn-primary flex-1">
                {{ editingTransaction ? 'Update' : 'Create' }}
              </button>
              <button type="button" @click="closeModal" class="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Receipts Modal -->
      <div v-if="receiptsModalOpen" class="modal-overlay">
        <div class="modal-content max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
              Receipts for Transaction
            </h2>
            <button @click="closeReceiptsModal" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div v-if="selectedTransactionForReceipts" class="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <p class="font-medium text-gray-900 dark:text-white">{{ selectedTransactionForReceipts.description || 'Transaction' }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ new Date(selectedTransactionForReceipts.transaction_date).toLocaleDateString() }} 
              • {{ formatCurrencyWithCommas(selectedTransactionForReceipts.amount, getTransactionCurrency(selectedTransactionForReceipts)) }}
            </p>
          </div>
          
          <ReceiptUpload 
            v-if="selectedTransactionForReceipts"
            :transaction-id="selectedTransactionForReceipts.id"
            @uploaded="onReceiptUploaded"
            @deleted="onReceiptDeleted"
          />
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
const categoriesStore = useCategoriesStore()
const transactionsStore = useTransactionsStore()
const tagsStore = useTagsStore()
const { formatCurrencyWithCommas } = useCurrency()

// Helper to get currency for a transaction
const getTransactionCurrency = (transaction: any) => {
  const wallet = walletsStore.wallets.find((w: any) => w.id === transaction.wallet_id)
  return wallet?.currency || 'USD'
}

const showCreateModal = ref(false)
const editingTransaction = ref<any>(null)
const receiptsModalOpen = ref(false)
const selectedTransactionForReceipts = ref<any>(null)
const selectedTransactionTags = ref<any[]>([])
const attachedReceipt = ref<any>(null)
const uploadingReceipt = ref(false)
const receiptFileInput = ref<HTMLInputElement | null>(null)

const filters = ref({
  wallet_id: null,
  category_id: null,
  transaction_type: null,
  tag_id: null,
  search: '',
  min_amount: null,
  max_amount: null,
  sort_by: 'date',
  sort_order: 'desc',
})

const transactionForm = ref({
  wallet_id: null,
  category_id: null,
  transaction_type: 'expense',
  amount: 0,
  description: '',
  notes: '',
  transaction_date: new Date().toISOString().slice(0, 16),
  transfer_wallet_id: null,
})

const resetForm = () => {
  transactionForm.value = {
    wallet_id: null,
    category_id: null,
    transaction_type: 'expense',
    amount: 0,
    description: '',
    notes: '',
    transaction_date: new Date().toISOString().slice(0, 16),
    transfer_wallet_id: null,
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingTransaction.value = null
  selectedTransactionTags.value = []
  attachedReceipt.value = null
  resetForm()
}

const editTransaction = async (transaction: any) => {
  editingTransaction.value = transaction
  transactionForm.value = {
    wallet_id: transaction.wallet_id,
    category_id: transaction.category_id,
    transaction_type: transaction.transaction_type,
    amount: transaction.amount,
    description: transaction.description || '',
    notes: transaction.notes || '',
    transaction_date: new Date(transaction.transaction_date).toISOString().slice(0, 16),
    transfer_wallet_id: transaction.transfer_wallet_id,
  }
  
  // Load tags for this transaction
  const tagsStore = useTagsStore()
  selectedTransactionTags.value = await tagsStore.getTransactionTags(transaction.id)
}

const handleSaveTransaction = async () => {
  try {
    let transactionId
    if (editingTransaction.value) {
      await transactionsStore.updateTransaction(editingTransaction.value.id, transactionForm.value)
      transactionId = editingTransaction.value.id
    } else {
      const newTransaction = await transactionsStore.createTransaction(transactionForm.value)
      transactionId = newTransaction.id
    }
    
    // Link receipt to transaction if attached
    if (attachedReceipt.value && attachedReceipt.value.id) {
      try {
        const { $api } = useNuxtApp()
        await $api.put(`/receipts/${attachedReceipt.value.id}/link-transaction`, null, {
          params: { transaction_id: transactionId }
        })
      } catch (error) {
        console.error('Failed to link receipt to transaction:', error)
        // Continue anyway, receipt was uploaded but not linked
      }
    }
    
    // Save tags
    if (selectedTransactionTags.value.length > 0) {
      const tagsStore = useTagsStore()
      const tagIds = selectedTransactionTags.value.map(t => t.id)
      await tagsStore.addTagsToTransaction(transactionId, tagIds)
    }
    
    closeModal()
    await walletsStore.fetchWallets() // Refresh wallet balances
    await transactionsStore.fetchTransactions() // Refresh transactions
  } catch (error) {
    console.error('Failed to save transaction:', error)
    alert('Failed to save transaction. Please try again.')
  }
}

const deleteTransactionConfirm = async (id: number) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    try {
      await transactionsStore.deleteTransaction(id)
      await walletsStore.fetchWallets() // Refresh wallet balances
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      alert('Failed to delete transaction. Please try again.')
    }
  }
}

const applyFilters = () => {
  const params = Object.fromEntries(
    Object.entries(filters.value).filter(([_, v]) => v !== null && v !== '')
  )
  transactionsStore.fetchTransactions(params)
}

const resetFilters = () => {
  filters.value = {
    wallet_id: null,
    category_id: null,
    transaction_type: null,
    tag_id: null,
    search: '',
    min_amount: null,
    max_amount: null,
    sort_by: 'date',
    sort_order: 'desc',
  }
  transactionsStore.fetchTransactions()
}

const openReceiptsModal = (transaction: any) => {
  selectedTransactionForReceipts.value = transaction
  receiptsModalOpen.value = true
}

const closeReceiptsModal = () => {
  receiptsModalOpen.value = false
  selectedTransactionForReceipts.value = null
}

const onReceiptUploaded = (receipt: any) => {
  console.log('Receipt uploaded:', receipt)
}

const onReceiptDeleted = (receiptId: number) => {
  console.log('Receipt deleted:', receiptId)
}

const handleReceiptUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    alert('Invalid file type. Please upload an image (JPG, PNG, GIF) or PDF.')
    return
  }
  
  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    alert('File is too large. Maximum size is 10MB.')
    return
  }
  
  uploadingReceipt.value = true
  
  try {
    const { $api } = useNuxtApp()
    const formData = new FormData()
    formData.append('file', file)
    
    // Upload without transaction_id
    const response = await $api.post('/receipts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    attachedReceipt.value = response.data
    
    // Auto-fill form from OCR data
    if (response.data.parsed_data) {
      const parsed = response.data.parsed_data
      
      // Auto-fill amount if detected and not already filled
      if (parsed.amount && (!transactionForm.value.amount || transactionForm.value.amount === 0)) {
        transactionForm.value.amount = parsed.amount
      }
      
      // Auto-fill description if detected and not already filled
      if (parsed.description && !transactionForm.value.description) {
        transactionForm.value.description = parsed.description
      }
      
      // Auto-fill notes with OCR text if not already filled
      if (parsed.notes && !transactionForm.value.notes) {
        transactionForm.value.notes = parsed.notes
      }
    }
    
    // Show success message
    if (response.data.parsed_data && (response.data.parsed_data.amount || response.data.parsed_data.description)) {
      alert('Receipt uploaded! Form has been auto-filled with detected data. Please review and adjust if needed.')
    }
    
    // Clear the file input
    if (receiptFileInput.value) {
      receiptFileInput.value.value = ''
    }
  } catch (error: any) {
    console.error('Failed to upload receipt:', error)
    alert(error.response?.data?.detail || 'Failed to upload receipt. Please try again.')
    attachedReceipt.value = null
  } finally {
    uploadingReceipt.value = false
  }
}

const removeAttachedReceipt = async () => {
  if (!attachedReceipt.value) return
  
  if (confirm('Remove this receipt? It will be deleted permanently.')) {
    try {
      const { $api } = useNuxtApp()
      await $api.delete(`/receipts/${attachedReceipt.value.id}`)
      attachedReceipt.value = null
    } catch (error) {
      console.error('Failed to delete receipt:', error)
      alert('Failed to delete receipt. Please try again.')
    }
  }
}

const exportTransactions = () => {
  const { $api } = useNuxtApp()
  const params = new URLSearchParams(
    Object.fromEntries(
      Object.entries(filters.value).filter(([_, v]) => v !== null && v !== '')
    )
  )
  
  // Create a download link
  const url = `${$api.defaults.baseURL}/exports/transactions/csv?${params.toString()}`
  const token = localStorage.getItem('access_token')
  
  // Use fetch to download with auth
  fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    })
    .catch(error => {
      console.error('Failed to export transactions:', error)
      alert('Failed to export transactions. Please try again.')
    })
}

onMounted(async () => {
  await Promise.all([
    walletsStore.fetchWallets(),
    categoriesStore.fetchCategories(),
    tagsStore.fetchTags(),
    transactionsStore.fetchTransactions(),
  ])
})
</script>


