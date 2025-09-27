import api from '@/services/api'
import type { Notification } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  const getNotifications = computed(() => notifications.value)
  const getNofisCount = computed(() => notifications.value.length)

  const fetchNotifications = async () => {
    const response = await api.get('/notifications/fetch')

    if (response.status === 200) {
      notifications.value = response.data.data
    }
  }

  return { getNotifications, getNofisCount, fetchNotifications }
})
