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
            <svg v-if="receipt.file_type.startsWith('image/')" class="w-5 h-5 text-primary-500 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <p class="text-sm text-gray-600 mb-2">Upload Receipt</p>
        <button
          @click="$refs.fileInput.click()"
          class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400"
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

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  transactionId: number
}>()

const emit = defineEmits(['uploaded', 'deleted'])

const config = useRuntimeConfig()
const receipts = ref<any[]>([])
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const error = ref('')

const fetchReceipts = async () => {
  try {
    const response = await $fetch(`${config.public.apiBase}/receipts/transaction/${props.transactionId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    receipts.value = response
  } catch (err: any) {
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
    
    // Use fetch instead of $fetch for FormData (better multipart/form-data handling)
    const token = localStorage.getItem('access_token')
    const url = `${config.public.apiBase}/receipts${props.transactionId ? `?transaction_id=${props.transactionId}` : ''}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type - browser will set it with boundary for multipart/form-data
      },
      body: formData
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Upload failed' }))
      throw new Error(errorData.detail || `Upload failed: ${response.status}`)
    }
    
    const responseData = await response.json()
    receipts.value.push(responseData)
    emit('uploaded', responseData)
    clearFile()
  } catch (err: any) {
    error.value = err.message || err.data?.detail || 'Failed to upload receipt'
  } finally {
    uploading.value = false
  }
}

// Removed downloadReceipt, viewReceipt, and getReceiptUrl functions - buttons removed from UI

const deleteReceipt = async (receiptId: number) => {
  if (!confirm('Are you sure you want to delete this receipt?')) return
  
  try {
    await $fetch(`${config.public.apiBase}/receipts/${receiptId}`, {
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

