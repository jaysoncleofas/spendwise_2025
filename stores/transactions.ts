import { defineStore } from 'pinia'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [] as any[],
  }),
  
  actions: {
    async fetchTransactions(params: any = {}) {
      const { $api } = useNuxtApp()
      const response = await $api.get('/transactions', { params })
      this.transactions = response.data
    },
    
    async createTransaction(data: any) {
      const { $api } = useNuxtApp()
      const response = await $api.post('/transactions', data)
      this.transactions.unshift(response.data)
      return response.data
    },
    
    async updateTransaction(id: number, data: any) {
      const { $api } = useNuxtApp()
      const response = await $api.put(`/transactions/${id}`, data)
      const index = this.transactions.findIndex(t => t.id === id)
      if (index !== -1) {
        this.transactions[index] = response.data
      }
      return response.data
    },
    
    async deleteTransaction(id: number) {
      const { $api } = useNuxtApp()
      await $api.delete(`/transactions/${id}`)
      this.transactions = this.transactions.filter(t => t.id !== id)
    },
  },
})


