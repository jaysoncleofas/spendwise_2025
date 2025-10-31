<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
        </svg>
        Receipt Search
      </h1>
      <p class="text-gray-600 dark:text-gray-400">Search and filter all your receipts</p>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <!-- Text Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input
            v-model="filters.query"
            type="text"
            placeholder="Filename, transaction, or text..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            @input="searchReceipts"
          />
        </div>

        <!-- File Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File Type</label>
          <select
            v-model="filters.file_type"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            @change="searchReceipts"
          >
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        <!-- Date Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date From</label>
          <input
            v-model="filters.start_date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            @change="searchReceipts"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date To</label>
          <input
            v-model="filters.end_date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            @change="searchReceipts"
          />
        </div>

        <!-- Clear Filters -->
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="text-gray-600 dark:text-gray-400 mt-4">Loading receipts...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
      <p class="text-red-600 dark:text-red-300">{{ error }}</p>
    </div>

    <!-- Results -->
    <div v-else>
      <!-- Results Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <p class="text-gray-600 dark:text-gray-400">
          Found <span class="font-bold text-gray-900 dark:text-white">{{ results.total }}</span> receipt(s)
        </p>
      </div>

      <!-- No Results -->
      <div v-if="results.receipts.length === 0" class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
        <p class="text-gray-600 dark:text-gray-400">No receipts found. Try adjusting your filters.</p>
      </div>

      <!-- Results Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="receipt in results.receipts"
          :key="receipt.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
        >
          <!-- Receipt Info -->
          <div class="p-4">
            <!-- File Icon Header -->
            <div class="flex items-center gap-3 mb-4">
              <div class="flex-shrink-0">
                <svg v-if="receipt.file_type && receipt.file_type.startsWith('image/')" class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <svg v-else class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 dark:text-white truncate" :title="receipt.original_filename">
                  {{ receipt.original_filename }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Uploaded: {{ formatDate(receipt.uploaded_at) }}
                </p>
              </div>
            </div>

            <!-- Transaction Details -->
            <div v-if="receipt.transaction" class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Related Transaction</p>
              
              <div class="space-y-2 text-sm">
                <!-- Description -->
                <div v-if="receipt.transaction.description">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Description</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ receipt.transaction.description }}</p>
                </div>
                
                <!-- Amount and Type -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Amount</p>
                    <p :class="[
                      'font-semibold',
                      receipt.transaction.transaction_type === 'income' ? 'text-green-600 dark:text-green-400' : 
                      receipt.transaction.transaction_type === 'expense' ? 'text-red-600 dark:text-red-400' :
                      'text-blue-600 dark:text-blue-400'
                    ]">
                      {{ formatTransactionAmount(receipt.transaction.amount, receipt.transaction.wallet?.currency) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Type</p>
                    <span :class="[
                      'px-2 py-1 rounded text-xs font-medium capitalize',
                      receipt.transaction.transaction_type === 'income' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 
                      receipt.transaction.transaction_type === 'expense' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                      'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    ]">
                      {{ receipt.transaction.transaction_type }}
                    </span>
                  </div>
                </div>
                
                <!-- Category -->
                <div v-if="receipt.transaction.category">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Category</p>
                  <p class="text-gray-900 dark:text-white">{{ receipt.transaction.category.name }}</p>
                </div>
                
                <!-- Wallet -->
                <div v-if="receipt.transaction.wallet">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Wallet</p>
                  <p class="text-gray-900 dark:text-white">{{ receipt.transaction.wallet.name }} ({{ receipt.transaction.wallet.currency }})</p>
                </div>
                
                <!-- Transaction Date -->
                <div v-if="receipt.transaction.transaction_date">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Transaction Date</p>
                  <p class="text-gray-900 dark:text-white">{{ formatDate(receipt.transaction.transaction_date) }}</p>
                </div>
                
                <!-- Notes -->
                <div v-if="receipt.transaction.notes">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Notes</p>
                  <p class="text-gray-700 dark:text-gray-300">{{ receipt.transaction.notes }}</p>
                </div>
              </div>
            </div>
            
            <!-- No Transaction Linked -->
            <div v-else class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <p class="text-xs text-gray-400 dark:text-gray-500 italic">Not linked to any transaction</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="results.total > results.limit" class="mt-6 flex justify-center gap-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <span class="px-4 py-2 bg-gray-100 rounded">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'default'
})

const config = useRuntimeConfig()
const { formatTransactionAmount } = useCurrency()

const filters = ref({
  query: '',
  file_type: '',
  start_date: '',
  end_date: '',
})

const results = ref({
  total: 0,
  limit: 12,
  offset: 0,
  receipts: []
})

const loading = ref(false)
const error = ref('')
const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.ceil(results.value.total / results.value.limit)
})

let searchTimeout: any = null

const searchReceipts = () => {
  // Debounce search
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    results.value.offset = 0
    fetchReceipts()
  }, 300)
}

const fetchReceipts = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const params: any = {
      limit: results.value.limit,
      offset: results.value.offset
    }
    
    if (filters.value.query) params.query = filters.value.query
    if (filters.value.file_type) params.file_type = filters.value.file_type
    if (filters.value.start_date) params.start_date = filters.value.start_date
    if (filters.value.end_date) params.end_date = filters.value.end_date
    
    const queryString = new URLSearchParams(params).toString()
    
    const response = await $fetch(`${config.public.apiBase}/receipts/search?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    
    results.value = response
  } catch (err: any) {
    error.value = err.data?.detail || 'Failed to search receipts'
    console.error('Receipt search error:', err)
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  filters.value = {
    query: '',
    file_type: '',
    start_date: '',
    end_date: '',
  }
  searchReceipts()
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    results.value.offset = (currentPage.value - 1) * results.value.limit
    fetchReceipts()
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    results.value.offset = (currentPage.value - 1) * results.value.limit
    fetchReceipts()
  }
}

// Removed viewReceipt, downloadReceipt, and closePreview functions - no longer displaying text or allowing downloads

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Removed formatFileSize - not displaying file size anymore

onMounted(() => {
  fetchReceipts()
})
</script>

