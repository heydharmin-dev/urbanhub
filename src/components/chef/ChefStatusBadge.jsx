const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  suspended: 'bg-gray-100 text-gray-700',
}

const statusLabels = {
  pending: 'Pending Review',
  approved: 'Verified',
  rejected: 'Rejected',
  suspended: 'Suspended',
}

export default function ChefStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.pending}`}>
      {statusLabels[status] || status}
    </span>
  )
}
