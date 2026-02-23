import { useState } from 'react'
import { useJobAssignments } from '../../hooks/useJobAssignments'
import AssignmentCard from '../../components/job/AssignmentCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import toast from 'react-hot-toast'
import { ClipboardList } from 'lucide-react'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'completed', label: 'Completed' },
  { key: 'declined', label: 'Declined' },
]

export default function MyAssignments() {
  const [activeTab, setActiveTab] = useState('all')
  const { assignments, loading, fetchAssignments, updateAssignmentStatus } = useJobAssignments()

  async function handleAccept(assignmentId) {
    const { error } = await updateAssignmentStatus(assignmentId, 'accepted')
    if (error) {
      toast.error('Failed to accept assignment')
    } else {
      toast.success('Assignment accepted!')
      fetchAssignments(activeTab)
    }
  }

  async function handleDecline(assignmentId) {
    const { error } = await updateAssignmentStatus(assignmentId, 'declined')
    if (error) {
      toast.error('Failed to decline assignment')
    } else {
      toast.success('Assignment declined')
      fetchAssignments(activeTab)
    }
  }

  const filteredAssignments = activeTab === 'all'
    ? assignments
    : assignments.filter(a => a.status === activeTab)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab.key
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : filteredAssignments.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No assignments found"
          description={activeTab === 'all' ? 'You have no assignments yet' : `No ${activeTab} assignments`}
        />
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map(assignment => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              actions={
                assignment.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleAccept(assignment.id)}
                      className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(assignment.id)}
                      className="text-sm text-red-500 hover:text-red-600 font-medium px-4 py-1.5"
                    >
                      Decline
                    </button>
                  </>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
