import { Badge } from "@/components/ui/badge"

const statusVariants = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50",
  approved: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50",
  rejected: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
  suspended: "bg-muted text-muted-foreground border-muted hover:bg-muted",
}

const statusLabels = {
  pending: "Pending Review",
  approved: "Verified",
  rejected: "Rejected",
  suspended: "Suspended",
}

export default function ChefStatusBadge({ status }) {
  return (
    <Badge variant="outline" className={statusVariants[status] || statusVariants.pending}>
      {statusLabels[status] || status}
    </Badge>
  )
}
