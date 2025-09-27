export type NotificationType = 'TRANSACTION' | 'ACCOUNT' | 'BUDGET' | 'CATEGORY'

export type NotificationLevel = 'INFO' | 'WARNING' | 'ALERT'

export interface Notification {
  id: number
  userId: number
  title: string
  message: string
  type: NotificationType
  level: NotificationLevel
  data: string // JSON string, can be parsed to an object if needed
  isRead: boolean
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}
