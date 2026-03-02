import { CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

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
    <div>
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50">
        <h4 className="font-semibold text-foreground text-sm">Notifications</h4>
        <Button
          variant="ghost"
          size="xs"
          className="text-primary hover:text-primary"
          onClick={onMarkAllAsRead}
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all read
        </Button>
      </div>
      <Separator />
      <ScrollArea className="max-h-80">
        {notifications.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">No notifications yet</p>
        ) : (
          notifications.map((n, index) => (
            <div key={n.id}>
              <button
                onClick={() => {
                  if (!n.is_read) onMarkAsRead(n.id)
                  onClose()
                }}
                className={`w-full text-left px-4 py-3 hover:bg-accent transition ${
                  !n.is_read ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  {!n.is_read && (
                    <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                  )}
                  <div className={!n.is_read ? '' : 'pl-4'}>
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              </button>
              {index < notifications.length - 1 && <Separator />}
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  )
}
