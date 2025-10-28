<template>
  <div class="px-4 sm:px-0">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h1>

    <!-- Profile Overview Card -->
    <div class="card mb-6">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
        <!-- Avatar Section -->
        <div class="flex flex-col items-center space-y-3">
          <div class="relative">
            <div v-if="avatarPreview || user?.avatar_url" 
                 class="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-4 border-primary-500">
              <img 
                :src="avatarPreview || getAvatarUrl(user.avatar_url)" 
                alt="Profile"
                class="w-full h-full object-cover"
              />
            </div>
            <div v-else 
                 class="w-32 h-32 rounded-full bg-primary-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-primary-500">
              {{ getInitials(user?.full_name || user?.username) }}
            </div>
            
            <!-- Edit Avatar Badge -->
            <button
              @click="triggerFileInput"
              class="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg transition-colors"
              title="Change avatar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>
          
          <input
            ref="fileInput"
            type="file"
            accept="image/*,.heic,.heif"
            @change="handleFileSelect"
            class="hidden"
          />
          
          <div class="flex gap-2">
            <button
              v-if="avatarFile"
              @click="uploadAvatar"
              :disabled="uploadingAvatar"
              class="btn-sm bg-green-600 hover:bg-green-700 text-white"
            >
              {{ uploadingAvatar ? 'Uploading...' : 'Save Photo' }}
            </button>
            <button
              v-if="user?.avatar_url && !avatarFile"
              @click="deleteAvatar"
              class="btn-sm bg-red-600 hover:bg-red-700 text-white"
            >
              Remove Photo
            </button>
          </div>
        </div>

        <!-- User Info Summary -->
        <div class="flex-1 text-center md:text-left">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ user?.full_name || 'No Name' }}</h2>
          <p class="text-gray-600 dark:text-gray-400">@{{ user?.username }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">{{ user?.email }}</p>
          <div class="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ user?.home_currency || 'USD' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Form -->
    <div class="card mb-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h2>
      
      <form @submit.prevent="updateProfile" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <input
                v-model="profileForm.email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <!-- Username -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input
                v-model="profileForm.username"
                type="text"
                required
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="username"
              />
            </div>
          </div>

          <!-- Full Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <input
                v-model="profileForm.full_name"
                type="text"
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          <!-- Home Currency -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Home Currency
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <select
                v-model="profileForm.home_currency"
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors appearance-none cursor-pointer"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CNY">CNY - Chinese Yuan</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Update Button -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="resetProfileForm"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="updatingProfile"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ updatingProfile ? 'Updating...' : 'Update Profile' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Change Password -->
    <div class="card">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h2>
      
      <form @submit.prevent="changePassword" class="space-y-5 max-w-xl">
        <!-- Current Password -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Current Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <input
              v-model="passwordForm.current_password"
              type="password"
              required
              class="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              placeholder="Enter your current password"
            />
          </div>
        </div>

        <!-- New Password -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            New Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
            </div>
            <input
              v-model="passwordForm.new_password"
              type="password"
              required
              minlength="6"
              class="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              placeholder="Enter new password"
            />
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Must be at least 6 characters long</p>
        </div>

        <!-- Confirm New Password -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Confirm New Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <input
              v-model="passwordForm.confirm_password"
              type="password"
              required
              minlength="6"
              class="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              placeholder="Confirm your new password"
            />
          </div>
        </div>

        <!-- Change Password Button -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="resetPasswordForm"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="changingPassword"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ changingPassword ? 'Changing...' : 'Change Password' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'default'
})

const config = useRuntimeConfig()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

// Profile form
const profileForm = ref({
  email: '',
  username: '',
  full_name: '',
  home_currency: 'USD'
})

// Password form
const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

// Avatar handling
const fileInput = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)

// Loading states
const updatingProfile = ref(false)
const changingPassword = ref(false)
const uploadingAvatar = ref(false)

// Messages
const successMessage = ref('')
const errorMessage = ref('')

// Initialize form with user data
watch(user, (newUser) => {
  if (newUser) {
    profileForm.value = {
      email: newUser.email || '',
      username: newUser.username || '',
      full_name: newUser.full_name || '',
      home_currency: newUser.home_currency || 'USD'
    }
  }
}, { immediate: true })

const getInitials = (name: string) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getAvatarUrl = (avatarUrl: string | null) => {
  if (!avatarUrl) return null
  return `${config.public.apiBase}/${avatarUrl}`
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Check if it's an image - include HEIC support
    const fileName = file.name.toLowerCase()
    const isHeic = fileName.endsWith('.heic') || fileName.endsWith('.heif')
    
    if (!file.type.startsWith('image/') && !isHeic) {
      showError('Please select an image file (JPG, PNG, GIF, HEIC supported)')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size must be less than 5MB')
      return
    }
    
    avatarFile.value = file
    
    // Create preview - Note: HEIC may not preview in all browsers
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.onerror = () => {
      // If preview fails (e.g., for HEIC), still allow upload
      showError('Preview not available for this format, but you can still upload')
      avatarPreview.value = null
    }
    reader.readAsDataURL(file)
  }
}

const uploadAvatar = async () => {
  if (!avatarFile.value) return
  
  uploadingAvatar.value = true
  
  try {
    const formData = new FormData()
    formData.append('file', avatarFile.value)
    
    const response = await $fetch(`${config.public.apiBase}/api/profile/me/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: formData
    })
    
    // Update user in store
    authStore.setUser(response as any)
    
    // Reset
    avatarFile.value = null
    avatarPreview.value = null
    
    showSuccess('Avatar updated successfully!')
  } catch (error: any) {
    showError(error.data?.detail || 'Failed to upload avatar')
  } finally {
    uploadingAvatar.value = false
  }
}

const deleteAvatar = async () => {
  if (!confirm('Are you sure you want to remove your profile photo?')) return
  
  try {
    const response = await $fetch(`${config.public.apiBase}/api/profile/me/avatar`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    // Update user in store
    authStore.setUser(response as any)
    
    showSuccess('Avatar removed successfully!')
  } catch (error: any) {
    showError(error.data?.detail || 'Failed to remove avatar')
  }
}

const updateProfile = async () => {
  updatingProfile.value = true
  
  try {
    const response = await $fetch(`${config.public.apiBase}/api/profile/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileForm.value)
    })
    
    // Update user in store
    authStore.setUser(response as any)
    
    showSuccess('Profile updated successfully!')
  } catch (error: any) {
    showError(error.data?.detail || 'Failed to update profile')
  } finally {
    updatingProfile.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    showError('New passwords do not match')
    return
  }
  
  changingPassword.value = true
  
  try {
    await $fetch(`${config.public.apiBase}/api/profile/me/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        current_password: passwordForm.value.current_password,
        new_password: passwordForm.value.new_password
      })
    })
    
    resetPasswordForm()
    showSuccess('Password changed successfully!')
  } catch (error: any) {
    showError(error.data?.detail || 'Failed to change password')
  } finally {
    changingPassword.value = false
  }
}

const resetProfileForm = () => {
  if (user.value) {
    profileForm.value = {
      email: user.value.email || '',
      username: user.value.username || '',
      full_name: user.value.full_name || '',
      home_currency: user.value.home_currency || 'USD'
    }
  }
}

const resetPasswordForm = () => {
  passwordForm.value = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  }
}

const showSuccess = (message: string) => {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

const showError = (message: string) => {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 3000)
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}
</style>

