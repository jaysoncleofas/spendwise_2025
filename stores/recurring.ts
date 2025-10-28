import { defineStore } from 'pinia'

export const useRecurringStore = defineStore('recurring', {
  state: () => ({
    recurringTransactions: [] as any[],
    loading: false,
  }),
  
  actions: {
    async fetchRecurringTransactions(includeInactive: boolean = false) {
      const { $api } = useNuxtApp()
      this.loading = true
      try {
        const response = await $api.get(`/recurring?include_inactive=${includeInactive}`)
        this.recurringTransactions = response.data
      } catch (error) {
        console.error('Failed to fetch recurring transactions:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async createRecurringTransaction(data: any) {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.post('/recurring', data)
        await this.fetchRecurringTransactions()
        return response.data
      } catch (error) {
        console.error('Failed to create recurring transaction:', error)
        throw error
      }
    },
    
    async updateRecurringTransaction(id: number, data: any) {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.put(`/recurring/${id}`, data)
        await this.fetchRecurringTransactions()
        return response.data
      } catch (error) {
        console.error('Failed to update recurring transaction:', error)
        throw error
      }
    },
    
    async pauseRecurringTransaction(id: number) {
      const { $api } = useNuxtApp()
      try {
        await $api.post(`/recurring/${id}/pause`)
        await this.fetchRecurringTransactions()
      } catch (error) {
        console.error('Failed to pause recurring transaction:', error)
        throw error
      }
    },
    
    async resumeRecurringTransaction(id: number) {
      const { $api } = useNuxtApp()
      try {
        await $api.post(`/recurring/${id}/resume`)
        await this.fetchRecurringTransactions()
      } catch (error) {
        console.error('Failed to resume recurring transaction:', error)
        throw error
      }
    },
    
    async deleteRecurringTransaction(id: number) {
      const { $api } = useNuxtApp()
      try {
        await $api.delete(`/recurring/${id}`)
        await this.fetchRecurringTransactions()
      } catch (error) {
        console.error('Failed to delete recurring transaction:', error)
        throw error
      }
    },
    
    async processRecurringTransactions() {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.post('/recurring/process')
        return response.data
      } catch (error) {
        console.error('Failed to process recurring transactions:', error)
        throw error
      }
    },
  },
})

