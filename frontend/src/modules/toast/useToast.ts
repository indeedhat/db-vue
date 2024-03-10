import { reactive, computed, ComputedRef } from 'vue'

export interface Notification {
    id: number
    title?: string
    body: string
    type: string
}

interface Toast {
    getNotifications: ComputedRef<Notification[]>
    success: (body: string, timeout?: number, title?: string) => void
    error: (body: string, timeout?: number, title?: string) => void
    notice: (body: string, timeout?: number, title?: string) => void
    close: (notification: Notification) => void
}


const notifications = reactive<Notification[]>([])

export const useToast = (): Toast => {
    const getNotifications = computed<Notification[]>(() => notifications)

    const success = (body: string, timeout: number = 5000, title: string = "Success") => 
        createNotification('success', body, title, timeout)
    const notice = (body: string, timeout: number = 5000, title: string = "Notice") => 
        createNotification('notice', body, title, timeout)
    const error = (body: string, timeout: number = 5000, title: string = "Error") => 
        createNotification('danger', body, title, timeout)

    const createNotification = (type: string, body: string, title: string, timeout: number): void => {
        const notification = { id: +new Date(), body, type, title }
        notifications.push(notification)
        setTimeout(() => close(notification), timeout)
    }

    const close = (notification: Notification) => {
        const i = notifications.indexOf(notification)
        notifications.splice(i, 1)
    }

    return { getNotifications, success, error, notice, close }
}
