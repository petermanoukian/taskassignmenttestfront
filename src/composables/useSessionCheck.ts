// src\composables\useSessionCheck.ts
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import axiosApi from '@/plugins/axiosApi'; 
import { useAuthStore } from '@/stores/authStore';

export function useSessionCheck(intervalMs: number = 300000): void {
  const router = useRouter()
  const authStore = useAuthStore()
  let intervalId: number | undefined

  const checkSession = (): void => {
    axiosApi.get('/check-auth')
      .catch(error => {
        if (error.response?.status === 401) {
          authStore.logout()
          router.push('/login')
        }
      })
  }

  onMounted(() => {
    intervalId = window.setInterval(checkSession, intervalMs)
  })

  onBeforeUnmount(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })
}
