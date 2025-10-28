import { defineStore } from 'pinia'

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    todaySummary: null as any,
    weekSummary: null as any,
    monthSummary: null as any,
    walletsSummary: [] as any[],
    topCategories: [] as any[],
    monthOverMonth: null as any,
    yearOverYear: null as any,
    spendingHeatmap: null as any,
  }),
  
  actions: {
    async fetchTodaySummary() {
      const { $api } = useNuxtApp()
      const response = await $api.get('/analytics/summary/today')
      this.todaySummary = response.data
    },
    
    async fetchWeekSummary() {
      const { $api } = useNuxtApp()
      const response = await $api.get('/analytics/summary/week')
      this.weekSummary = response.data
    },
    
    async fetchMonthSummary() {
      const { $api } = useNuxtApp()
      const response = await $api.get('/analytics/summary/month')
      this.monthSummary = response.data
    },
    
    async fetchCustomSummary(startDate: string, endDate: string) {
      const { $api } = useNuxtApp()
      const response = await $api.get('/analytics/summary/custom', {
        params: { start_date: startDate, end_date: endDate }
      })
      return response.data
    },
    
    async fetchWalletsSummary() {
      const { $api } = useNuxtApp()
      const response = await $api.get('/analytics/wallets/summary')
      this.walletsSummary = response.data
    },
    
    async fetchTopCategories(params: any = {}) {
      const { $api } = useNuxtApp()
      const response = await $api.get('/analytics/categories/top-expenses', { params })
      this.topCategories = response.data
    },
    
    async fetchMonthOverMonth(months: number = 6) {
      const { $api } = useNuxtApp()
      const response = await $api.get('/analytics/comparison/month-over-month', {
        params: { months }
      })
      this.monthOverMonth = response.data
    },
    
    async fetchYearOverYear(years: number = 3) {
      const { $api } = useNuxtApp()
      const response = await $api.get('/analytics/comparison/year-over-year', {
        params: { years }
      })
      this.yearOverYear = response.data
    },
    
    async fetchSpendingHeatmap(days: number = 30) {
      const { $api } = useNuxtApp()
      const response = await $api.get('/analytics/heatmap/spending-patterns', {
        params: { days }
      })
      this.spendingHeatmap = response.data
    },
  },
})


