import { useState } from 'react'
import { useJobs } from '../../hooks/useJobs'
import { SERVICE_CATEGORIES } from '../../lib/serviceCategories'
import JobCard from '../../components/job/JobCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import toast from 'react-hot-toast'
import { Briefcase } from 'lucide-react'

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
      <h1 className="text-2xl font-bold text-gray-900">My Service Requests</h1>

      <div className="flex flex-wrap items-center gap-4">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
          <option value="all">All Categories</option>
          {SERVICE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
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
                  <button
                    onClick={() => handleCloseJob(job.id)}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Close Request
                  </button>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
