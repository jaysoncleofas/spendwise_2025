<template>
  <div class="relative">
    <!-- Notification Bell -->
    <button
      @click="toggleNotifications"
      class="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      title="Notifications"
    >
      <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
      </svg>
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Notifications Dropdown -->
    <div
      v-if="showNotifications"
      class="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
      @click.stop
    >
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="font-semibold text-lg">Notifications</h3>
        <div class="flex gap-2">
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Mark all read
          </button>
          <button
            @click="checkForAlerts"
            class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            title="Check for new alerts"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13.407l-1.405-1.405A2.032 2.032 0 0118 10.841V8a6.002 6.002 0 00-4-5.659V2a2 2 0 10-4 0v.341C7.67 3.165 6 5.388 6 8v2.841c0 .538-.214 1.055-.595 1.436L4 13.407m16 0H4m16 0v1a3 3 0 01-3 3H7a3 3 0 01-3-3v-1m16 0H4"></path>
            <line x1="4" y1="4" x2="20" y2="20" stroke-linecap="round" stroke-width="2"></line>
          </svg>
          <p>No notifications</p>
        </div>

        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20': notification.is_read === 0 }"
          @click="markAsRead(notification.id)"
        >
          <div class="flex justify-between items-start mb-1">
            <h4 class="font-medium text-sm">{{ notification.title }}</h4>
            <button
              @click.stop="deleteNotification(notification.id)"
              class="text-gray-400 hover:text-red-600"
              title="Delete notification"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {{ notification.message }}
          </p>
          <p class="text-xs text-gray-500">
            {{ formatDate(notification.created_at) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div
      v-if="showNotifications"
      @click="showNotifications = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showNotifications = ref(false)
const notifications = ref<any[]>([])
const unreadCount = ref(0)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    fetchNotifications()
  }
}

const fetchNotifications = async () => {
  try {
    const { $api } = useNuxtApp()
    const response = await $api.get('/notifications')
    notifications.value = response.data
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
  }
}

const fetchUnreadCount = async () => {
  try {
    const { $api } = useNuxtApp()
    const response = await $api.get('/notifications/unread-count')
    unreadCount.value = response.data.count
  } catch (error) {
    console.error('Failed to fetch unread count:', error)
  }
}

const markAsRead = async (id: number) => {
  try {
    const { $api } = useNuxtApp()
    await $api.put(`/notifications/${id}/read`)
    
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.is_read = 1
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

const markAllAsRead = async () => {
  try {
    const { $api } = useNuxtApp()
    await $api.put('/notifications/read-all')
    
    notifications.value.forEach(n => n.is_read = 1)
    unreadCount.value = 0
  } catch (error) {
    console.error('Failed to mark all as read:', error)
  }
}

const deleteNotification = async (id: number) => {
  try {
    const { $api } = useNuxtApp()
    await $api.delete(`/notifications/${id}`)
    
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      if (notifications.value[index].is_read === 0) {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      notifications.value.splice(index, 1)
    }
  } catch (error) {
    console.error('Failed to delete notification:', error)
  }
}

const checkForAlerts = async () => {
  try {
    const { $api } = useNuxtApp()
    await $api.post('/notifications/check-alerts')
    
    // Refresh notifications
    await fetchNotifications()
    await fetchUnreadCount()
  } catch (error) {
    console.error('Failed to check for alerts:', error)
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return date.toLocaleDateString()
}

onMounted(() => {
  fetchUnreadCount()
  // Refresh unread count every 30 seconds
  setInterval(fetchUnreadCount, 30000)
})
</script>

