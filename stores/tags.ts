import { defineStore } from 'pinia'

export const useTagsStore = defineStore('tags', {
  state: () => ({
    tags: [] as any[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchTags() {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const response = await $api.get('/tags')
        this.tags = response.data
      } catch (error: any) {
        this.error = error.response?.data?.detail || 'Failed to fetch tags'
        console.error('Failed to fetch tags:', error)
      } finally {
        this.loading = false
      }
    },

    async createTag(tag: { name: string; color: string }) {
      try {
        const { $api } = useNuxtApp()
        const response = await $api.post('/tags', tag)
        this.tags.push(response.data)
        return response.data
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || 'Failed to create tag')
      }
    },

    async updateTag(id: number, updates: { name?: string; color?: string }) {
      try {
        const { $api } = useNuxtApp()
        const response = await $api.put(`/tags/${id}`, updates)
        const index = this.tags.findIndex(t => t.id === id)
        if (index !== -1) {
          this.tags[index] = response.data
        }
        return response.data
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || 'Failed to update tag')
      }
    },

    async deleteTag(id: number) {
      try {
        const { $api } = useNuxtApp()
        await $api.delete(`/tags/${id}`)
        this.tags = this.tags.filter(t => t.id !== id)
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || 'Failed to delete tag')
      }
    },

    async addTagsToTransaction(transactionId: number, tagIds: number[]) {
      try {
        const { $api } = useNuxtApp()
        const response = await $api.post(`/tags/transaction/${transactionId}/tags`, tagIds)
        return response.data
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || 'Failed to add tags to transaction')
      }
    },

    async getTransactionTags(transactionId: number) {
      try {
        const { $api } = useNuxtApp()
        const response = await $api.get(`/tags/transaction/${transactionId}/tags`)
        return response.data
      } catch (error: any) {
        console.error('Failed to get transaction tags:', error)
        return []
      }
    },

    async getSuggestions(query: string = '', limit: number = 10) {
      try {
        const { $api } = useNuxtApp()
        const response = await $api.get('/tags/suggestions', {
          params: { query, limit }
        })
        return response.data
      } catch (error: any) {
        console.error('Failed to get tag suggestions:', error)
        return []
      }
    }
  }
})

