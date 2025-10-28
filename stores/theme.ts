import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false
  }),

  actions: {
    initTheme() {
      if (process.client) {
        // Check localStorage first
        const saved = localStorage.getItem('darkMode')
        if (saved !== null) {
          this.isDark = saved === 'true'
        } else {
          // Check system preference
          this.isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        this.applyTheme()
      }
    },

    toggleDarkMode() {
      this.isDark = !this.isDark
      this.applyTheme()
      if (process.client) {
        localStorage.setItem('darkMode', String(this.isDark))
      }
    },

    applyTheme() {
      if (process.client) {
        if (this.isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
  }
})

