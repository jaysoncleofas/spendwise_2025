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
          <!-- Preview Thumbnail -->
          <div class="bg-gray-100 dark:bg-gray-700 h-48 flex items-center justify-center">
            <svg v-if="receipt.file_type.startsWith('image/')" class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <svg v-else class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>

          <!-- Receipt Info -->
          <div class="p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white truncate mb-2" :title="receipt.original_filename">
              {{ receipt.original_filename }}
            </h3>
            
            <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <p class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ formatDate(receipt.uploaded_at) }}
              </p>
              <p class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                {{ formatFileSize(receipt.file_size) }}
              </p>
              <p class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                {{ receipt.file_type.split('/')[1].toUpperCase() }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="viewReceipt(receipt)"
                class="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center justify-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                View
              </button>
              <button
                @click="downloadReceipt(receipt)"
                class="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm flex items-center justify-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download
              </button>
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

    <!-- Preview Modal -->
    <div v-if="previewReceipt" class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4" @click.self="closePreview">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white">{{ previewReceipt.original_filename }}</h3>
          <button @click="closePreview" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-4 bg-white dark:bg-gray-900">
          <div v-if="!previewReceipt.blobUrl" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
            <p class="text-gray-600 dark:text-gray-400 mt-4">Loading...</p>
          </div>
          <img 
            v-else-if="previewReceipt.file_type.startsWith('image/')"
            :src="previewReceipt.blobUrl"
            :alt="previewReceipt.original_filename"
            class="max-w-full h-auto rounded"
          />
          <div v-else class="text-center py-8">
            <div class="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p>PDF Document</p>
            </div>
            <a
              :href="previewReceipt.blobUrl"
              target="_blank"
              class="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 inline-block"
            >
              Open PDF in new tab
            </a>
          </div>
        </div>
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
const previewReceipt = ref<any>(null)

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
    
    const response = await $fetch(`http://localhost:8000/api/receipts/search?${queryString}`, {
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

const viewReceipt = async (receipt: any) => {
  previewReceipt.value = {...receipt, blobUrl: null}
  
  try {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`http://localhost:8000/api/receipts/${receipt.id}/download`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) throw new Error('Failed to load receipt')
    
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    previewReceipt.value.blobUrl = blobUrl
  } catch (err: any) {
    error.value = 'Failed to load receipt'
    console.error(err)
  }
}

const downloadReceipt = async (receipt: any) => {
  try {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`http://localhost:8000/api/receipts/${receipt.id}/download`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) throw new Error('Download failed')
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = receipt.original_filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (err: any) {
    error.value = 'Failed to download receipt'
  }
}

const closePreview = () => {
  if (previewReceipt.value?.blobUrl) {
    window.URL.revokeObjectURL(previewReceipt.value.blobUrl)
  }
  previewReceipt.value = null
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

onMounted(() => {
  fetchReceipts()
})
</script>

