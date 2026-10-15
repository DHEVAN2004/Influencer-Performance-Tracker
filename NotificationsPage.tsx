import { useState } from 'react'
import Card from './Card.tsx'
import { FiBell, FiAlertTriangle, FiCheckCircle, FiInfo, FiX, FiSettings } from 'react-icons/fi'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  actionUrl?: string
  actionText?: string
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'success',
    title: 'Campaign Completed',
    message: 'Your "Summer Beauty Launch" campaign has been completed successfully with 95% ROI.',
    timestamp: '2025-01-15T10:30:00Z',
    isRead: false,
    actionUrl: '/campaigns',
    actionText: 'View Report'
  },
  {
    id: 'n2',
    type: 'warning',
    title: 'Influencer Performance Alert',
    message: 'Maya Ellis engagement rate has dropped below 5%. Consider reviewing content strategy.',
    timestamp: '2025-01-14T15:45:00Z',
    isRead: false,
    actionUrl: '/influencers/4',
    actionText: 'View Profile'
  },
  {
    id: 'n3',
    type: 'info',
    title: 'New Brand Partnership',
    message: 'TechCorp has sent you a partnership proposal. Check your messages for details.',
    timestamp: '2025-01-14T09:15:00Z',
    isRead: true,
    actionUrl: '/messages',
    actionText: 'View Message'
  },
  {
    id: 'n4',
    type: 'success',
    title: 'Milestone Achieved',
    message: 'Congratulations! Your total influencer network has reached 50K followers.',
    timestamp: '2025-01-13T14:20:00Z',
    isRead: true
  },
  {
    id: 'n5',
    type: 'error',
    title: 'Campaign Budget Alert',
    message: 'Smartphone Release campaign has exceeded 80% of allocated budget.',
    timestamp: '2025-01-12T11:30:00Z',
    isRead: false,
    actionUrl: '/campaigns',
    actionText: 'Review Budget'
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filteredNotifications = notifications.filter(notification =>
    filter === 'all' || !notification.isRead
  )

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <FiCheckCircle className="w-5 h-5 text-green-600" />
      case 'warning': return <FiAlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'error': return <FiAlertTriangle className="w-5 h-5 text-red-600" />
      case 'info': return <FiInfo className="w-5 h-5 text-blue-600" />
      default: return <FiBell className="w-5 h-5 text-slate-600" />
    }
  }

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800'
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800'
      case 'error': return 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800'
      case 'info': return 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800'
      default: return 'border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiBell className="w-6 h-6 text-sky-600" />
          <div>
            <h2 className="text-2xl font-semibold">Notifications</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Stay updated with your campaign performance</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-sm">
            <FiSettings className="w-4 h-4" />
            Settings
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            filter === 'all'
              ? 'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            filter === 'unread'
              ? 'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <FiBell className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-lg font-medium mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </p>
              <p className="text-sm">
                {filter === 'unread'
                  ? 'All caught up! Check back later for new updates.'
                  : 'You\'ll see notifications about campaigns, influencers, and partnerships here.'
                }
              </p>
            </div>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id}>
              <div className={`p-4 rounded-lg border ${getNotificationStyle(notification.type)} ${!notification.isRead ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-800 dark:text-slate-100">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-2">
                        {notification.actionUrl && notification.actionText && (
                          <button className="px-3 py-1 text-xs bg-sky-600 text-white rounded hover:bg-sky-700">
                            {notification.actionText}
                          </button>
                        )}
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-sky-600 hover:text-sky-700"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FiBell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">{notifications.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Success</p>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                {notifications.filter(n => n.type === 'success').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <FiAlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Warnings</p>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                {notifications.filter(n => n.type === 'warning').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Alerts</p>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                {notifications.filter(n => n.type === 'error').length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
