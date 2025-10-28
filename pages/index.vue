<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
    <div class="text-center">
      <div class="flex items-center justify-center gap-4 mb-4">
        <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 class="text-6xl font-bold text-white">ExpenseWise</h1>
      </div>
      <p class="text-xl text-white mb-8">Smart Expense Management Made Simple</p>
      <div class="space-x-4">
        <NuxtLink to="/login" class="btn-primary bg-white text-primary-600 hover:bg-gray-100">
          Login
        </NuxtLink>
        <NuxtLink to="/register" class="btn-primary">
          Get Started
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  ssr: false
})

const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isAuthenticated) {
    navigateTo('/dashboard')
  }
})
</script>


