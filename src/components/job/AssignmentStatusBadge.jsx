import { Badge } from "@/components/ui/badge"

const statusVariants = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50",
  accepted: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50",
  declined: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
  completed: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
  cancelled: "bg-muted text-muted-foreground border-muted hover:bg-muted",
}

const statusLabels = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  completed: "Completed",
  cancelled: "Cancelled",
}

export default function AssignmentStatusBadge({ status }) {
  return (
    <Badge variant="outline" className={statusVariants[status] || statusVariants.cancelled}>
      {statusLabels[status] || status}
    </Badge>
  )
}
