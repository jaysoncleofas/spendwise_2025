<template>
  <div class="tag-input">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
      </svg>
      Tags
    </label>
    
    <!-- Selected Tags -->
    <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mb-3">
      <span
        v-for="tag in selectedTags"
        :key="tag.id"
        class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm text-white font-medium"
        :style="{ backgroundColor: tag.color }"
      >
        {{ tag.name }}
        <button
          @click="removeTag(tag.id)"
          class="hover:opacity-75 ml-1"
          type="button"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </span>
    </div>

    <!-- Tag Input with Autocomplete -->
    <div class="relative">
      <input
        v-model="searchQuery"
        @input="onSearchInput"
        @focus="showSuggestions = true"
        @blur="onBlur"
        type="text"
        placeholder="Add tags..."
        class="input-field pr-10"
      />
      
      <button
        v-if="searchQuery && !isCreatingNewTag"
        @click="createNewTag"
        type="button"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
        title="Create new tag"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </button>

      <!-- Suggestions Dropdown -->
      <div
        v-if="showSuggestions && (suggestions.length > 0 || searchQuery)"
        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
      >
        <!-- Existing Tag Suggestions -->
        <button
          v-for="tag in suggestions"
          :key="tag.id"
          @mousedown.prevent="selectTag(tag)"
          type="button"
          class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
        >
          <span
            class="w-3 h-3 rounded-full flex-shrink-0"
            :style="{ backgroundColor: tag.color }"
          ></span>
          <span>{{ tag.name }}</span>
          <span class="text-xs text-gray-500 ml-auto">({{ tag.usage_count || 0 }})</span>
        </button>

        <!-- Create New Tag Option -->
        <button
          v-if="searchQuery && !suggestions.find(t => t.name.toLowerCase() === searchQuery.toLowerCase())"
          @mousedown.prevent="createNewTag"
          type="button"
          class="w-full text-left px-4 py-2 hover:bg-gray-100 border-t border-gray-200 text-blue-600 font-medium flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create "{{ searchQuery }}"
        </button>
      </div>
    </div>

    <!-- Create New Tag Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showCreateModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Create New Tag</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
            <input
              v-model="newTagName"
              type="text"
              class="input-field"
              placeholder="Enter tag name"
              @keyup.enter="saveNewTag"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="color in colorOptions"
                :key="color"
                @click="newTagColor = color"
                type="button"
                class="w-8 h-8 rounded-full border-2"
                :class="newTagColor === color ? 'border-gray-800' : 'border-gray-300'"
                :style="{ backgroundColor: color }"
              ></button>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              @click="saveNewTag"
              type="button"
              class="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create
            </button>
            <button
              @click="showCreateModal = false"
              type="button"
              class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useTagsStore } from '~/stores/tags'

const props = defineProps<{
  modelValue: any[]
}>()

const emit = defineEmits(['update:modelValue'])

const tagsStore = useTagsStore()
const selectedTags = ref<any[]>([...props.modelValue])
const searchQuery = ref('')
const suggestions = ref<any[]>([])
const showSuggestions = ref(false)
const showCreateModal = ref(false)
const newTagName = ref('')
const newTagColor = ref('#6B7280')
const isCreatingNewTag = ref(false)

const colorOptions = [
  '#EF4444', // red
  '#F59E0B', // amber
  '#10B981', // green
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#6B7280', // gray
  '#14B8A6', // teal
]

const onSearchInput = async () => {
  if (searchQuery.value.length >= 1) {
    const results = await tagsStore.getSuggestions(searchQuery.value)
    // Filter out already selected tags
    suggestions.value = results.filter((tag: any) => 
      !selectedTags.value.find(t => t.id === tag.id)
    )
  } else {
    suggestions.value = []
  }
}

const selectTag = (tag: any) => {
  if (!selectedTags.value.find(t => t.id === tag.id)) {
    selectedTags.value.push(tag)
    emit('update:modelValue', selectedTags.value)
  }
  searchQuery.value = ''
  suggestions.value = []
}

const removeTag = (tagId: number) => {
  selectedTags.value = selectedTags.value.filter(t => t.id !== tagId)
  emit('update:modelValue', selectedTags.value)
}

const createNewTag = () => {
  newTagName.value = searchQuery.value
  newTagColor.value = colorOptions[Math.floor(Math.random() * colorOptions.length)]
  showCreateModal.value = true
  showSuggestions.value = false
}

const saveNewTag = async () => {
  if (!newTagName.value.trim()) return
  
  isCreatingNewTag.value = true
  try {
    const newTag = await tagsStore.createTag({
      name: newTagName.value.trim(),
      color: newTagColor.value
    })
    
    selectTag(newTag)
    
    showCreateModal.value = false
    newTagName.value = ''
    searchQuery.value = ''
  } catch (error: any) {
    alert(error.message)
  } finally {
    isCreatingNewTag.value = false
  }
}

const onBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

watch(() => props.modelValue, (newValue) => {
  selectedTags.value = [...newValue]
})

onMounted(() => {
  tagsStore.fetchTags()
})
</script>

<style scoped>
.tag-input {
  /* Add any custom styles here */
}
</style>

