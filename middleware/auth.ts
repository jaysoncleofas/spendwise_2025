export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware on server-side
  if (!process.client) return
  
  const authStore = useAuthStore()
  
  // Restore token from localStorage if not in store
  if (!authStore.token) {
    const token = localStorage.getItem('access_token')
    if (token) {
      authStore.token = token
    }
  }
  
  // If we have a token, verify it by fetching user (only once)
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUser()
    } catch (error) {
      // Token is invalid, clear everything
      localStorage.removeItem('access_token')
      authStore.token = null
      authStore.user = null
    }
  }
  
  // Redirect logic
  const isPublicPage = to.path === '/login' || to.path === '/register' || to.path === '/'
  
  if (!authStore.token && !isPublicPage) {
    return navigateTo('/login')
  }
  
  if (authStore.token && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/dashboard')
  }
})


