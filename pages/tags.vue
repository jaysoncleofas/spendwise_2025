<template>
  <div class="px-4 sm:px-0">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
        </svg>
        Tags
      </h1>
      <button @click="showCreateModal = true" class="btn-primary">
        + Create Tag
      </button>
    </div>

    <!-- Tag Analytics -->
    <div v-if="tagAnalytics" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tags</h3>
        <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ tagAnalytics.total_tags }}</p>
      </div>
      <div class="card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Tagged Transactions</h3>
        <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ tagAnalytics.tagged_transactions }}</p>
      </div>
      <div class="card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Most Used</h3>
        <p class="text-xl font-semibold text-purple-600 dark:text-purple-400" v-if="tagAnalytics.most_used_tags.length">
          {{ tagAnalytics.most_used_tags[0].name }} ({{ tagAnalytics.most_used_tags[0].usage_count}})
        </p>
        <p class="text-gray-400 dark:text-gray-500" v-else>-</p>
      </div>
      <div class="card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Top Spending Tag</h3>
        <p class="text-xl font-semibold text-red-600 dark:text-red-400" v-if="tagAnalytics.top_spending_tags.length">
          {{ tagAnalytics.top_spending_tags[0].name }} ({{ formatAmount(tagAnalytics.top_spending_tags[0].total_amount) }})
        </p>
        <p class="text-gray-400 dark:text-gray-500" v-else>-</p>
      </div>
    </div>

    <!-- Tags List -->
    <div class="card">
      <div v-if="tagsStore.loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>

      <div v-else-if="tagsStore.tags.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        No tags yet. Create your first tag to organize your transactions!
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="tag in tagsStore.tags"
          :key="tag.id"
          class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span
                class="w-4 h-4 rounded-full flex-shrink-0"
                :style="{ backgroundColor: tag.color }"
              ></span>
              <span class="font-medium text-lg text-gray-900 dark:text-white">{{ tag.name }}</span>
            </div>
            <div class="flex gap-2">
              <button
                @click="editTag(tag)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                title="Edit"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                @click="deleteTagConfirm(tag.id)"
                class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                title="Delete"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Used in {{ tag.usage_count || 0 }} transaction{{ tag.usage_count !== 1 ? 's' : '' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingTag"
      class="modal-overlay"
      @click.self="closeModal"
    >
      <div class="modal-content max-w-md w-full mx-4">
        <h2 class="text-2xl font-bold mb-4">
          {{ editingTag ? 'Edit Tag' : 'Create New Tag' }}
        </h2>
        <form @submit.prevent="saveTag" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
            <input
              v-model="tagForm.name"
              type="text"
              required
              maxlength="50"
              class="input-field"
              placeholder="e.g., Work, Personal, Travel"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="color in colorOptions"
                :key="color"
                @click.prevent="tagForm.color = color"
                type="button"
                class="w-10 h-10 rounded-full border-4 transition"
                :class="tagForm.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'"
                :style="{ backgroundColor: color }"
              ></button>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="submit" class="btn-primary flex-1">
              {{ editingTag ? 'Save Changes' : 'Create Tag' }}
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

import { ref, onMounted } from 'vue'
import { useTagsStore } from '~/stores/tags'

const tagsStore = useTagsStore()
const { formatCurrencyWithCommas, getDefaultCurrency } = useCurrency()

const displayCurrency = computed(() => getDefaultCurrency())
const formatAmount = (amount: number) => formatCurrencyWithCommas(amount, displayCurrency.value)

const showCreateModal = ref(false)
const editingTag = ref<any>(null)
const tagAnalytics = ref<any>(null)

const colorOptions = [
  '#EF4444', // red
  '#F59E0B', // amber
  '#10B981', // green
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#6B7280', // gray
  '#14B8A6', // teal
  '#F97316', // orange
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#A855F7', // violet
]

const tagForm = ref({
  name: '',
  color: colorOptions[0]
})

const editTag = (tag: any) => {
  editingTag.value = tag
  tagForm.value = {
    name: tag.name,
    color: tag.color
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingTag.value = null
  tagForm.value = {
    name: '',
    color: colorOptions[0]
  }
}

const saveTag = async () => {
  try {
    if (editingTag.value) {
      await tagsStore.updateTag(editingTag.value.id, tagForm.value)
    } else {
      await tagsStore.createTag(tagForm.value)
    }
    closeModal()
  } catch (error: any) {
    alert(error.message)
  }
}

const deleteTagConfirm = async (id: number) => {
  if (confirm('Are you sure you want to delete this tag? It will be removed from all transactions.')) {
    try {
      await tagsStore.deleteTag(id)
    } catch (error: any) {
      alert(error.message)
    }
  }
}

const fetchTagAnalytics = async () => {
  try {
    const { $api } = useNuxtApp()
    const response = await $api.get('/tags/analytics/summary')
    tagAnalytics.value = response.data
  } catch (error) {
    console.error('Failed to fetch tag analytics:', error)
  }
}

onMounted(async () => {
  await tagsStore.fetchTags()
  await fetchTagAnalytics()
})
</script>

