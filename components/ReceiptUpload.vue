<template>
  <div class="receipt-upload">
    <!-- Receipt List -->
    <div v-if="receipts.length > 0" class="mb-4">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
        </svg>
        Receipts ({{ receipts.length }})
      </h4>
      <div class="space-y-2">
        <div 
          v-for="receipt in receipts" 
          :key="receipt.id"
          class="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
        >
          <div class="flex items-center gap-2 flex-1">
            <svg v-if="receipt.file_type.startsWith('image/')" class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <svg v-else class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ receipt.original_filename }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(receipt.file_size) }} • {{ formatDate(receipt.uploaded_at) }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="downloadReceipt(receipt)"
              class="text-blue-600 hover:text-blue-800 text-sm"
              title="Download"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            </button>
            <button
              @click="viewReceipt(receipt)"
              class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
              title="View"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
            <button
              @click="deleteReceipt(receipt.id)"
              class="text-red-600 hover:text-red-800 text-sm"
              title="Delete"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Form -->
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <input
        ref="fileInput"
        type="file"
        accept="image/*,.pdf,.heic,.heif"
        @change="onFileSelected"
        class="hidden"
      />
      
      <div v-if="!selectedFile" class="text-center">
        <p class="text-sm text-gray-600 mb-2">📷 Upload Receipt</p>
        <button
          @click="$refs.fileInput.click()"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Choose File
        </button>
        <p class="text-xs text-gray-500 mt-2">Images (JPG, PNG, GIF, HEIC) or PDF (max 10MB)</p>
      </div>

      <div v-else class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
            </svg>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
          </div>
          <button
            @click="clearFile"
            class="text-red-600 hover:text-red-800"
            :disabled="uploading"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <button
          @click="uploadFile"
          :disabled="uploading"
          class="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg v-if="!uploading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          {{ uploading ? 'Uploading...' : 'Upload' }}
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-2 text-red-600 text-sm">
      {{ error }}
    </div>

    <!-- Preview Modal -->
    <div v-if="previewReceipt" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closePreview">
      <div class="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
        <div class="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
          <h3 class="font-semibold">{{ previewReceipt.original_filename }}</h3>
          <button @click="closePreview" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-4">
          <div v-if="!previewReceipt.blobUrl" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p class="text-gray-600 mt-4">Loading...</p>
          </div>
          <img 
            v-else-if="previewReceipt.file_type.startsWith('image/')"
            :src="previewReceipt.blobUrl"
            :alt="previewReceipt.original_filename"
            class="max-w-full h-auto"
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
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
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
import { ref, onMounted } from 'vue'

const props = defineProps<{
  transactionId: number
}>()

const emit = defineEmits(['uploaded', 'deleted'])

const receipts = ref<any[]>([])
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const error = ref('')
const previewReceipt = ref<any>(null)

const fetchReceipts = async () => {
  try {
    const response = await $fetch(`http://localhost:8000/api/receipts/transaction/${props.transactionId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    receipts.value = response
  } catch (err: any) {
    console.error('Failed to fetch receipts:', err)
  }
}

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      error.value = 'File size must be less than 10MB'
      return
    }
    
    // Validate file type - include HEIC format
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
      'image/heic', 'image/heif',  // Apple HEIC format
      'application/pdf'
    ]
    
    // Some browsers may not set the correct MIME type for HEIC, check extension too
    const fileName = file.name.toLowerCase()
    const isHeic = fileName.endsWith('.heic') || fileName.endsWith('.heif')
    
    if (!allowedTypes.includes(file.type) && !isHeic) {
      error.value = 'Invalid file type. Please upload an image (JPG, PNG, GIF, HEIC) or PDF.'
      return
    }
    
    error.value = ''
    selectedFile.value = file
  }
}

const uploadFile = async () => {
  if (!selectedFile.value) return
  
  uploading.value = true
  error.value = ''
  
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    
    const response = await $fetch(`http://localhost:8000/api/receipts?transaction_id=${props.transactionId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: formData
    })
    
    receipts.value.push(response)
    emit('uploaded', response)
    clearFile()
  } catch (err: any) {
    error.value = err.data?.detail || 'Failed to upload receipt'
  } finally {
    uploading.value = false
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

const viewReceipt = async (receipt: any) => {
  previewReceipt.value = {...receipt, blobUrl: null}
  
  // Fetch the receipt with authentication
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

const getReceiptUrl = (receipt: any) => {
  return receipt.blobUrl || ''
}

const deleteReceipt = async (receiptId: number) => {
  if (!confirm('Are you sure you want to delete this receipt?')) return
  
  try {
    await $fetch(`http://localhost:8000/api/receipts/${receiptId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    
    receipts.value = receipts.value.filter(r => r.id !== receiptId)
    emit('deleted', receiptId)
  } catch (err: any) {
    error.value = 'Failed to delete receipt'
  }
}

const clearFile = () => {
  selectedFile.value = null
  error.value = ''
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

const closePreview = () => {
  if (previewReceipt.value?.blobUrl) {
    window.URL.revokeObjectURL(previewReceipt.value.blobUrl)
  }
  previewReceipt.value = null
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  if (props.transactionId) {
    fetchReceipts()
  }
})
</script>

<style scoped>
.receipt-upload {
  /* Add any custom styles here */
}
</style>

