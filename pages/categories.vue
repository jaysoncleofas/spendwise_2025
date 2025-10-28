<template>
    <div class="px-4 sm:px-0">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <button @click="showCreateModal = true" class="btn-primary">
          + Add Category
        </button>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="category in categoriesStore.categories" 
          :key="category.id"
          class="card hover:shadow-lg transition-shadow border-l-4"
          :style="{ borderLeftColor: category.color || '#3B82F6' }"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1 flex items-start gap-3">
              <div 
                class="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                :style="{ backgroundColor: category.color || '#3B82F6' }"
              ></div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ category.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400" v-if="category.description">{{ category.description }}</p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button @click="editCategory(category)" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300" title="Edit">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button @click="deleteCategoryConfirm(category.id)" class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300" title="Delete">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div v-if="category.budget_limit" class="mt-4">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-gray-600 dark:text-gray-300">
                {{ category.budget_type === 'fixed' ? 'Fixed Budget' : 'Monthly Budget' }}
              </span>
              <div class="flex items-center gap-2">
                <span v-if="category.budget_type === 'fixed'" class="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  Fixed
                </span>
                <span v-if="category.budget_type === 'monthly' && category.budget_rollover" class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Rollover
                </span>
              </div>
            </div>
            <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {{ formatAmount(category.budget_limit) }}
            </div>
            <div v-if="category.budget_type === 'monthly' && category.budget_rollover && category.rollover_balance > 0" class="mt-2 text-sm text-green-600 dark:text-green-400">
              +{{ formatAmount(category.rollover_balance) }} carried over
            </div>
            <div v-if="category.budget_type === 'fixed' && category.budget_start_date" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Started: {{ formatDate(category.budget_start_date) }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="categoriesStore.categories.length === 0" class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400 text-lg mb-4">No categories yet</p>
        <button @click="showCreateModal = true" class="btn-primary">
          Create Your First Category
        </button>
      </div>

      <!-- Create/Edit Category Modal -->
      <div v-if="showCreateModal || editingCategory" class="modal-overlay">
        <div class="modal-content max-w-md w-full mx-4">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {{ editingCategory ? 'Edit Category' : 'Create New Category' }}
          </h2>
          <form @submit.prevent="handleSaveCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input v-model="categoryForm.name" type="text" required class="input-field" placeholder="e.g., Food, Transportation" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea v-model="categoryForm.description" class="input-field" rows="3" placeholder="Optional description"></textarea>
            </div>
            
            <!-- Color Picker -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="color in colorOptions"
                  :key="color"
                  @click.prevent="categoryForm.color = color"
                  type="button"
                  class="w-10 h-10 rounded-full border-4 transition-all hover:scale-110"
                  :class="categoryForm.color === color ? 'border-gray-800 dark:border-gray-200 scale-110' : 'border-gray-300 dark:border-gray-600'"
                  :style="{ backgroundColor: color }"
                ></button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Limit (Optional)</label>
              <input v-model.number="categoryForm.budget_limit" type="number" step="0.01" min="0" class="input-field" placeholder="0.00" />
            </div>
            
            <!-- Budget Type Selection -->
            <div v-if="categoryForm.budget_limit && categoryForm.budget_limit > 0" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget Type</label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    @click="categoryForm.budget_type = 'monthly'"
                    :class="[
                      'p-4 rounded-lg border-2 transition-all text-left',
                      categoryForm.budget_type === 'monthly'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700'
                    ]"
                  >
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-5 h-5" :class="categoryForm.budget_type === 'monthly' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span class="font-semibold text-gray-900 dark:text-white">Monthly</span>
                    </div>
                    <p class="text-xs text-gray-600 dark:text-gray-400">Resets every month</p>
                  </button>
                  
                  <button
                    type="button"
                    @click="categoryForm.budget_type = 'fixed'"
                    :class="[
                      'p-4 rounded-lg border-2 transition-all text-left',
                      categoryForm.budget_type === 'fixed'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700'
                    ]"
                  >
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-5 h-5" :class="categoryForm.budget_type === 'fixed' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      <span class="font-semibold text-gray-900 dark:text-white">Fixed</span>
                    </div>
                    <p class="text-xs text-gray-600 dark:text-gray-400">One-time budget</p>
                  </button>
                </div>
              </div>
              
              <!-- Fixed Budget Start Date -->
              <div v-if="categoryForm.budget_type === 'fixed'" class="p-4 bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-lg">
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">Start Date</label>
                <input 
                  v-model="categoryForm.budget_start_date" 
                  type="date" 
                  class="input-field"
                />
                <p class="text-xs text-gray-600 dark:text-gray-300 mt-2">
                  Track spending from this date until the budget is exhausted. Leave blank to start from today.
                </p>
              </div>
              
              <!-- Monthly Budget Rollover Option -->
              <div v-if="categoryForm.budget_type === 'monthly'" class="p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <label class="flex items-center cursor-pointer">
                      <input 
                        v-model="categoryForm.budget_rollover" 
                        type="checkbox" 
                        :true-value="1" 
                        :false-value="0"
                        class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">Enable Budget Rollover</span>
                    </label>
                  </div>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-300">
                  When enabled, unused budget will carry over to the next month instead of resetting.
                </p>
              </div>
            </div>
            
            <div class="flex space-x-3">
              <button type="submit" class="btn-primary flex-1">
                {{ editingCategory ? 'Update' : 'Create' }}
              </button>
              <button type="button" @click="closeModal" class="btn-secondary flex-1">
                Cancel
              </button>
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

const categoriesStore = useCategoriesStore()
const { formatCurrencyWithCommas, getDefaultCurrency } = useCurrency()

const displayCurrency = computed(() => getDefaultCurrency())
const formatAmount = (amount: number) => formatCurrencyWithCommas(amount, displayCurrency.value)

const showCreateModal = ref(false)
const editingCategory = ref<any>(null)

const colorOptions = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#F43F5E', '#22C55E', '#A855F7', '#EAB308'
]

const categoryForm = ref({
  name: '',
  description: '',
  color: '#3B82F6' as string,
  budget_limit: null as number | null,
  budget_type: 'monthly' as string,
  budget_start_date: null as string | null,
  budget_rollover: 0,
  rollover_balance: 0.0,
})

const resetForm = () => {
  categoryForm.value = {
    name: '',
    description: '',
    color: '#3B82F6',
    budget_limit: null,
    budget_type: 'monthly',
    budget_start_date: null,
    budget_rollover: 0,
    rollover_balance: 0.0,
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const closeModal = () => {
  showCreateModal.value = false
  editingCategory.value = null
  resetForm()
}

const editCategory = (category: any) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    description: category.description || '',
    color: category.color || '#3B82F6',
    budget_limit: category.budget_limit,
    budget_type: category.budget_type || 'monthly',
    budget_start_date: category.budget_start_date ? category.budget_start_date.split('T')[0] : null,
    budget_rollover: category.budget_rollover || 0,
    rollover_balance: category.rollover_balance || 0.0,
  }
}

const handleSaveCategory = async () => {
  try {
    // Clean up the form data
    const formData = { ...categoryForm.value }
    
    // Only send budget fields if budget_limit is set
    if (!formData.budget_limit) {
      delete formData.budget_type
      delete formData.budget_start_date
      delete formData.budget_rollover
      delete formData.rollover_balance
    } else if (formData.budget_type === 'monthly') {
      // For monthly budgets, don't send start date
      delete formData.budget_start_date
    } else if (formData.budget_type === 'fixed' && !formData.budget_start_date) {
      // For fixed budgets without start date, use today
      formData.budget_start_date = new Date().toISOString().split('T')[0]
    }
    
    if (editingCategory.value) {
      await categoriesStore.updateCategory(editingCategory.value.id, formData)
    } else {
      await categoriesStore.createCategory(formData)
    }
    closeModal()
  } catch (error) {
    console.error('Failed to save category:', error)
    alert('Failed to save category. Please try again.')
  }
}

const deleteCategoryConfirm = async (id: number) => {
  if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
    try {
      await categoriesStore.deleteCategory(id)
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Failed to delete category. Please try again.')
    }
  }
}

onMounted(() => {
  categoriesStore.fetchCategories()
})
</script>


