import { cn } from "@/lib/utils"
import { Inbox } from "lucide-react"

export default function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div className={cn("text-center py-16 px-4", className)}>
      <Icon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" strokeWidth={1.5} />
      <h3 className="text-base font-medium text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      {action}
    </div>
  )
}
