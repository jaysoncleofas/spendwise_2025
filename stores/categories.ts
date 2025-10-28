import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as any[],
  }),
  
  actions: {
    async fetchCategories() {
      const { $api } = useNuxtApp()
      const response = await $api.get('/categories')
      this.categories = response.data
    },
    
    async createCategory(data: any) {
      const { $api } = useNuxtApp()
      const response = await $api.post('/categories', data)
      this.categories.push(response.data)
      return response.data
    },
    
    async updateCategory(id: number, data: any) {
      const { $api } = useNuxtApp()
      const response = await $api.put(`/categories/${id}`, data)
      const index = this.categories.findIndex(c => c.id === id)
      if (index !== -1) {
        this.categories[index] = response.data
      }
      return response.data
    },
    
    async deleteCategory(id: number) {
      const { $api } = useNuxtApp()
      await $api.delete(`/categories/${id}`)
      this.categories = this.categories.filter(c => c.id !== id)
    },
  },
})


