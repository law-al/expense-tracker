<template>
  <u-slideover
    v-model:open="openNotiPanel"
    :close="{ onClick: () => emit('closeNotifications') }"
    :overlay="true"
    :content="{
      onFocusOutside: () => emit('closeNotifications'),
      onPointerDownOutside: () => emit('closeNotifications'),
    }"
    title="Notifications"
    :ui="{
      content:
        'bg-gradient-to-b from-[#0a0a0f] to-[#111122] text-white z-[1000] w-[100vw] shadow-xl',
      title: 'text-white font-semibold text-2xl',
      body: 'text-white',
      close: 'bg-white/10 text-white hover:!bg-white hover:text-gray-900 transition cursor-pointer',
      overlay: 'bg-black/50 backdrop-blur-sm z-[999]',
      header: 'border-b border-white/10',
    }"
  >
    <template #body>
      <div class="p-4">
        <h2 class="text-lg font-semibold text-white mb-4">Recent Activity</h2>

        <!-- loading state (optional) -->
        <div v-if="isLoading" class="text-gray-400 text-sm">Loading...</div>

        <div v-else class="">
          <div v-if="getNotifications.length === 0" class="text-gray-400 text-sm">
            No notifications available.
          </div>

          <div v-else class="flex flex-col gap-4">
            <div
              v-for="notification in getNotifications"
              :key="notification.id"
              class="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <!-- icon container -->
              <div
                class="p-2 rounded-full flex items-center justify-center"
                :class="getNotificationType(notification.type).color"
              >
                <u-icon
                  :name="getNotificationType(notification.type).icon || 'i-mdi-bell-outline'"
                  class="size-5"
                />
              </div>

              <!-- message + time -->
              <div>
                <p class="text-sm text-gray-200">
                  {{ notification.message }}
                </p>
                <span class="text-xs text-gray-500 mt-1 block">
                  {{ formatTimeAgo(notification.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </u-slideover>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification.store'
import type { NotificationType } from '@/types'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { formatDistanceToNow } from 'date-fns'

const notificationStore = useNotificationStore()
const { getNotifications } = storeToRefs(notificationStore)

const props = defineProps<{
  openNotifications: boolean
}>()

const openNotiPanel = ref(props.openNotifications)

const emit = defineEmits<{
  (e: 'closeNotifications'): void
}>()

watch(
  () => props.openNotifications,
  (newVal) => {
    openNotiPanel.value = newVal
  },
)

const isLoading = ref(false)

const getNotificationType = (type: NotificationType): { icon: string; color: string } => {
  switch (type) {
    case 'ACCOUNT':
      return { icon: 'i-mdi-bank-outline', color: 'text-indigo-400' }
    case 'BUDGET':
      return { icon: 'i-mdi-currency-usd', color: 'text-green-400' }
    case 'CATEGORY':
      return { icon: 'i-mdi-tag-outline', color: 'text-yellow-400' }
    case 'TRANSACTION':
      return { icon: 'i-mdi-swap-horizontal', color: 'text-blue-400' }
    default:
      return { icon: 'i-mdi-bell-outline', color: 'text-gray-400' }
  }
}

const formatTimeAgo = (timestamp: string): string => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
}

onMounted(async () => {
  try {
    await notificationStore.fetchNotifications()
  } catch (error) {
    console.error('Error fetching notifications:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped></style>
