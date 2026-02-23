const statusStyles = {
  open: 'bg-green-100 text-green-700',
  matched: 'bg-blue-100 text-blue-700',
  filled: 'bg-purple-100 text-purple-700',
  closed: 'bg-gray-100 text-gray-600',
}

const statusLabels = {
  open: 'Open',
  matched: 'Matched',
  filled: 'Filled',
  closed: 'Closed',
}

export default function JobStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.closed}`}>
      {statusLabels[status] || status}
    </span>
  )
}
