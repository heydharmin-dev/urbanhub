import { useState } from 'react'
import { useJobs } from '../../hooks/useJobs'
import { SERVICE_CATEGORIES } from '../../lib/serviceCategories'
import JobCard from '../../components/job/JobCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import toast from 'react-hot-toast'
import { Briefcase } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'matched', label: 'Matched' },
  { key: 'filled', label: 'Filled' },
  { key: 'closed', label: 'Closed' },
]

export default function MyJobs() {
  const [activeTab, setActiveTab] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const { jobs, loading, fetchJobs, updateJobStatus } = useJobs()

  async function handleCloseJob(jobId) {
    const { error } = await updateJobStatus(jobId, 'closed')
    if (error) {
      toast.error('Failed to close request')
    } else {
      toast.success('Request closed')
      fetchJobs(activeTab)
    }
  }

  const filteredJobs = jobs.filter(j => {
    if (activeTab !== 'all' && j.status !== activeTab) return false
    if (categoryFilter !== 'all' && j.service_category !== categoryFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">My Service Requests</h1>

      <div className="flex flex-wrap items-center gap-4">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none">
          <option value="all">All Categories</option>
          {SERVICE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {TABS.map(tab => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No requests found"
          description={activeTab === 'all' ? 'Post your first request to get started' : `No ${activeTab} requests`}
        />
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              actions={
                job.status === 'open' ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCloseJob(job.id)}
                  >
                    Close Request
                  </Button>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
