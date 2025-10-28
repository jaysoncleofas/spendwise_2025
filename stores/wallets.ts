import { defineStore } from 'pinia'

export const useWalletsStore = defineStore('wallets', {
  state: () => ({
    wallets: [] as any[],
    currentWallet: null as any,
  }),
  
  getters: {
    totalBalance: (state) => state.wallets.reduce((sum, w) => sum + w.balance, 0),
  },
  
  actions: {
    async fetchWallets() {
      const { $api } = useNuxtApp()
      const response = await $api.get('/wallets')
      this.wallets = response.data
    },
    
    async createWallet(data: any) {
      const { $api } = useNuxtApp()
      const response = await $api.post('/wallets', data)
      this.wallets.push(response.data)
      return response.data
    },
    
    async updateWallet(id: number, data: any) {
      const { $api } = useNuxtApp()
      const response = await $api.put(`/wallets/${id}`, data)
      const index = this.wallets.findIndex(w => w.id === id)
      if (index !== -1) {
        this.wallets[index] = response.data
      }
      return response.data
    },
    
    async deleteWallet(id: number) {
      const { $api } = useNuxtApp()
      await $api.delete(`/wallets/${id}`)
      this.wallets = this.wallets.filter(w => w.id !== id)
    },
    
    async addMoney(id: number, amount: number) {
      const { $api } = useNuxtApp()
      const response = await $api.post(`/wallets/${id}/add-money`, null, {
        params: { amount }
      })
      const index = this.wallets.findIndex(w => w.id === id)
      if (index !== -1) {
        this.wallets[index] = response.data
      }
      return response.data
    },
  },
})


