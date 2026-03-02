import { useState } from 'react'
import { useJobAssignments } from '../../hooks/useJobAssignments'
import AssignmentCard from '../../components/job/AssignmentCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import toast from 'react-hot-toast'
import { ClipboardList } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

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
      <h1 className="text-2xl font-bold text-foreground">My Assignments</h1>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {TABS.map(tab => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
                    <Button
                      onClick={() => handleAccept(assignment.id)}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Accept
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDecline(assignment.id)}
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                    >
                      Decline
                    </Button>
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
