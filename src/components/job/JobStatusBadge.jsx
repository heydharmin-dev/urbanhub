import { Badge } from "@/components/ui/badge"

const statusVariants = {
  open: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50",
  matched: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
  filled: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50",
  closed: "bg-muted text-muted-foreground border-muted hover:bg-muted",
}

const statusLabels = {
  open: "Open",
  matched: "Matched",
  filled: "Filled",
  closed: "Closed",
}

export default function JobStatusBadge({ status }) {
  return (
    <Badge variant="outline" className={statusVariants[status] || statusVariants.closed}>
      {statusLabels[status] || status}
    </Badge>
  )
}
