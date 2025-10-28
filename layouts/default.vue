<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/dashboard" class="flex items-center gap-2 text-2xl font-bold text-primary-600 dark:text-primary-400">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                ExpenseWise
              </NuxtLink>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink 
                to="/dashboard" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-gray-100 dark:border-primary-400"
                inactive-class="border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
              >
                Dashboard
              </NuxtLink>
              <NuxtLink 
                to="/wallets" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-gray-100 dark:border-primary-400"
                inactive-class="border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
              >
                Wallets
              </NuxtLink>
              <NuxtLink 
                to="/transactions" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-gray-100 dark:border-primary-400"
                inactive-class="border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
              >
                Transactions
              </NuxtLink>
              <NuxtLink 
                to="/categories" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-gray-100 dark:border-primary-400"
                inactive-class="border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
              >
                Categories
              </NuxtLink>
              <NuxtLink 
                to="/budgets" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-gray-100 dark:border-primary-400"
                inactive-class="border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
              >
                Budgets
              </NuxtLink>
              <NuxtLink 
                to="/recurring" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-gray-100 dark:border-primary-400"
                inactive-class="border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
              >
                Recurring
              </NuxtLink>
              <NuxtLink 
                to="/tags" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-gray-100 dark:border-primary-400"
                inactive-class="border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
              >
                Tags
              </NuxtLink>
              <NuxtLink 
                to="/receipts" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-gray-100 dark:border-primary-400"
                inactive-class="border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
              >
                Receipts
              </NuxtLink>
              <NuxtLink 
                to="/analytics" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-gray-100 dark:border-primary-400"
                inactive-class="border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
              >
                Analytics
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <NotificationCenter />
            
            <!-- Dark Mode Toggle -->
            <button 
              @click="themeStore.toggleDarkMode()"
              class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title="Toggle dark mode"
            >
              <!-- Sun icon for light mode when dark mode is active -->
              <svg v-if="themeStore.isDark" class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <!-- Moon icon for dark mode when light mode is active -->
              <svg v-else class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            </button>
            
            <!-- Profile Link -->
            <NuxtLink 
              to="/profile"
              class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
              title="Profile Settings"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span class="hidden md:inline">{{ authStore.user?.username }}</span>
            </NuxtLink>
            
            <button @click="handleLogout" class="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '~/stores/theme'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const handleLogout = () => {
  authStore.logout()
}

onMounted(() => {
  themeStore.initTheme()
})
</script>


