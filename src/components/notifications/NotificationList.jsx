import { CheckCheck } from 'lucide-react'

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function NotificationList({ notifications, onMarkAsRead, onMarkAllAsRead, onClose }) {
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <h4 className="font-semibold text-gray-900 text-sm">Notifications</h4>
        <button
          onClick={onMarkAllAsRead}
          className="text-xs text-indigo-500 hover:text-indigo-600 flex items-center gap-1"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">No notifications yet</p>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                if (!n.is_read) onMarkAsRead(n.id)
                onClose()
              }}
              className={`w-full text-left px-4 py-3 border-b last:border-0 hover:bg-gray-50 transition ${
                !n.is_read ? 'bg-indigo-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                {!n.is_read && (
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                )}
                <div className={!n.is_read ? '' : 'pl-4'}>
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
