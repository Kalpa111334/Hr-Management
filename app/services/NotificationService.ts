import { Api } from '@/core/trpc'

class NotificationService {
  private static instance: NotificationService
  private swRegistration: ServiceWorkerRegistration | null = null

  private constructor() {
    this.initializeServiceWorker()
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  private async initializeServiceWorker() {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js')
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          console.warn('Notification permission not granted')
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }
  }

  async sendAttendanceReminder(userId: string, userName: string) {
    if (!this.swRegistration) return

    const currentTime = new Date()
    const options = {
      body: `Hi ${userName}, don't forget to mark your attendance for today!`,
      icon: '/icons/attendance-reminder.png',
      badge: '/icons/badge.png',
      tag: 'attendance-reminder',
      timestamp: currentTime.getTime(),
      actions: [
        {
          action: 'mark-attendance',
          title: 'Mark Attendance'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    }

    try {
      await this.swRegistration.showNotification('Attendance Reminder', options)
      
      // Store reminder in database
      await Api.notification.create.mutate({
        data: {
          userId,
          type: 'ATTENDANCE_REMINDER',
          title: 'Attendance Reminder',
          message: options.body,
          status: 'SENT',
          createdAt: currentTime
        }
      })
    } catch (error) {
      console.error('Failed to send attendance reminder:', error)
    }
  }

  async sendLeaveRequestNotification(adminId: string, employeeName: string, leaveType: string, startDate: string, endDate: string) {
    if (!this.swRegistration) return

    const options = {
      body: `New leave request from ${employeeName}\nType: ${leaveType}\nDuration: ${startDate} to ${endDate}`,
      icon: '/icons/leave-request.png',
      badge: '/icons/badge.png',
      tag: `leave-request-${employeeName}`,
      timestamp: new Date().getTime(),
      actions: [
        {
          action: 'approve',
          title: 'Approve'
        },
        {
          action: 'reject',
          title: 'Reject'
        }
      ]
    }

    try {
      await this.swRegistration.showNotification('New Leave Request', options)
      
      // Store notification in database
      await Api.notification.create.mutate({
        data: {
          userId: adminId,
          type: 'LEAVE_REQUEST',
          title: 'New Leave Request',
          message: options.body,
          status: 'SENT',
          createdAt: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to send leave request notification:', error)
    }
  }

  async scheduleAttendanceReminder(userId: string, userName: string, reminderTime: Date) {
    const now = new Date()
    const delay = reminderTime.getTime() - now.getTime()
    
    if (delay > 0) {
      setTimeout(() => {
        this.sendAttendanceReminder(userId, userName)
      }, delay)
    }
  }

  async sendLeaveStatusNotification(
    employeeId: string,
    status: 'APPROVED' | 'REJECTED',
    startDate: string,
    endDate: string
  ) {
    if (!this.swRegistration) return

    const statusText = status === 'APPROVED' ? 'approved' : 'rejected'
    const options = {
      body: `Your leave request from ${startDate} to ${endDate} has been ${statusText}.`,
      icon: '/icons/leave-status.png',
      badge: '/icons/badge.png',
      tag: `leave-status-${employeeId}-${new Date().getTime()}`,
      timestamp: new Date().getTime()
    }

    try {
      await this.swRegistration.showNotification(`Leave Request ${status}`, options)
      
      // Store notification in database
      await Api.notification.create.mutate({
        data: {
          userId: employeeId,
          type: 'LEAVE_STATUS',
          title: `Leave Request ${status}`,
          message: options.body,
          status: 'SENT',
          createdAt: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to send leave status notification:', error)
    }
  }
}

export const notificationService = NotificationService.getInstance() 