import { defineStore } from 'pinia'

export const useBudgetsStore = defineStore('budgets', {
  state: () => ({
    budgetStatuses: [] as any[],
    budgetAlerts: [] as any[],
    loading: false,
  }),
  
  actions: {
    async fetchBudgetStatus() {
      const { $api } = useNuxtApp()
      this.loading = true
      try {
        const response = await $api.get('/budgets/status')
        this.budgetStatuses = response.data
      } catch (error) {
        console.error('Failed to fetch budget status:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchBudgetAlerts() {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.get('/budgets/alerts')
        this.budgetAlerts = response.data
      } catch (error) {
        console.error('Failed to fetch budget alerts:', error)
        throw error
      }
    },
    
    async fetchBudgetHistory(categoryId: number, months: number = 6) {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.get(`/budgets/history/${categoryId}?months=${months}`)
        return response.data
      } catch (error) {
        console.error('Failed to fetch budget history:', error)
        throw error
      }
    },
  },
})

