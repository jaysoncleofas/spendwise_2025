import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: (process.client ? localStorage.getItem('access_token') : null) as string | null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  
  actions: {
    async login(username: string, password: string) {
      const { $api } = useNuxtApp()
      
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      
      const response = await $api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      
      this.token = response.data.access_token
      if (process.client) {
        localStorage.setItem('access_token', response.data.access_token)
      }
      
      await this.fetchUser()
    },
    
    async register(data: any) {
      const { $api } = useNuxtApp()
      await $api.post('/auth/register', data)
    },
    
    async fetchUser() {
      const { $api } = useNuxtApp()
      const response = await $api.get('/auth/me')
      this.user = response.data
    },
    
    setUser(userData: any) {
      this.user = userData
    },
    
    logout() {
      this.user = null
      this.token = null
      if (process.client) {
        localStorage.removeItem('access_token')
      }
      navigateTo('/login')
    },
    
    async checkAuth() {
      if (!process.client) return
      
      const token = localStorage.getItem('access_token')
      if (token) {
        this.token = token
        try {
          await this.fetchUser()
        } catch (error) {
          this.logout()
        }
      }
    },
  },
})


