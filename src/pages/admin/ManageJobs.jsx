import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useJobAssignments } from '../../hooks/useJobAssignments'
import { SERVICE_CATEGORIES } from '../../lib/serviceCategories'
import JobCard from '../../components/job/JobCard'
import ServiceCategoryBadge from '../../components/ui/ServiceCategoryBadge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'
import { Briefcase, Search, MapPin, Star, Clock } from 'lucide-react'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'matched', label: 'Matched' },
  { key: 'filled', label: 'Filled' },
  { key: 'closed', label: 'Closed' },
]

export default function ManageJobs() {
  const [activeTab, setActiveTab] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [assignModal, setAssignModal] = useState(null)
  const [providers, setProviders] = useState([])
  const [providersLoading, setProvidersLoading] = useState(false)
  const [providerSearch, setProviderSearch] = useState('')
  const [assigningId, setAssigningId] = useState(null)
  const [adminNotes, setAdminNotes] = useState('')
  const { createAssignment } = useJobAssignments()

  async function fetchJobs() {
    setLoading(true)
    const { data, error } = await supabase
      .from('jobs')
      .select(`*, restaurant:restaurant_profiles (id, business_name, city, business_type, user:user_id (full_name, email, phone)),
        assignments:job_assignments (id, status, assigned_at, chef:chef_profiles (id, specialty, location, experience_years, service_category, user:user_id (full_name, email)))`)
      .order('created_at', { ascending: false })
    if (!error) setJobs(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchJobs() }, [])

  async function fetchProviders(serviceCategory) {
    setProvidersLoading(true)
    let query = supabase
      .from('chef_profiles')
      .select(`id, specialty, location, experience_years, avg_rating, total_reviews, service_category, user:user_id (full_name, email, phone)`)
      .eq('verification_status', 'approved')
      .order('avg_rating', { ascending: false })
    if (serviceCategory) query = query.eq('service_category', serviceCategory)
    const { data, error } = await query
    if (!error) setProviders(data || [])
    setProvidersLoading(false)
  }

  function openAssignModal(job) {
    setAssignModal(job)
    setProviderSearch('')
    setAdminNotes('')
    fetchProviders(job.service_category)
  }

  async function handleAssign(providerId) {
    setAssigningId(providerId)
    const { error } = await createAssignment({ jobId: assignModal.id, chefId: providerId, adminNotes: adminNotes || null })
    if (error) toast.error('Failed to assign: ' + error.message)
    else { toast.success('Provider assigned!'); setAssignModal(null); fetchJobs() }
    setAssigningId(null)
  }

  async function handleUpdateStatus(jobId, status) {
    const { error } = await supabase.from('jobs').update({ status }).eq('id', jobId)
    if (error) toast.error('Failed to update')
    else { toast.success(`Request ${status}`); fetchJobs() }
  }

  const filteredJobs = jobs.filter(j => {
    if (activeTab !== 'all' && j.status !== activeTab) return false
    if (categoryFilter !== 'all' && j.service_category !== categoryFilter) return false
    return true
  })

  const assignedIds = assignModal?.assignments?.map(a => a.chef?.id) || []
  const filteredProviders = providers.filter(p => {
    if (assignedIds.includes(p.id)) return false
    if (!providerSearch) return true
    const term = providerSearch.toLowerCase()
    return p.user?.full_name?.toLowerCase().includes(term) || p.specialty?.toLowerCase().includes(term) || p.location?.toLowerCase().includes(term)
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>

      <div className="flex flex-wrap items-center gap-4">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
          <option value="all">All Categories</option>
          {SERVICE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === tab.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No requests found" description={activeTab === 'all' ? 'No service requests yet' : `No ${activeTab} requests`} />
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} showRestaurant actions={
              <div className="flex gap-2 w-full">
                {job.status === 'open' && (
                  <button onClick={() => openAssignModal(job)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition">Assign Provider</button>
                )}
                {job.status === 'matched' && (
                  <button onClick={() => handleUpdateStatus(job.id, 'filled')}
                    className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition">Mark Filled</button>
                )}
                {(job.status === 'open' || job.status === 'matched') && (
                  <button onClick={() => handleUpdateStatus(job.id, 'closed')}
                    className="text-sm text-red-500 hover:text-red-600 font-medium px-4 py-1.5">Close</button>
                )}
              </div>
            } />
          ))}
        </div>
      )}

      {assignModal && (
        <Modal isOpen={!!assignModal} onClose={() => setAssignModal(null)} title="Assign Provider" size="lg">
          <div className="space-y-4">
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{assignModal.title}</h3>
                <ServiceCategoryBadge categoryId={assignModal.service_category} size="xs" />
              </div>
              <p className="text-sm text-gray-600">{assignModal.restaurant?.business_name} - {assignModal.location}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                {assignModal.cuisine_type && <span>Skill: {assignModal.cuisine_type}</span>}
                <span>Exp: {assignModal.experience_required}+ years</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note for Provider (optional)</label>
              <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" placeholder="Add a note..." />
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search providers..." value={providerSearch} onChange={(e) => setProviderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {providersLoading ? (
                <div className="flex justify-center py-6"><LoadingSpinner /></div>
              ) : filteredProviders.length === 0 ? (
                <p className="text-center text-gray-500 py-6 text-sm">No matching providers</p>
              ) : (
                filteredProviders.map(p => (
                  <div key={p.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{p.user?.full_name}</p>
                        {p.service_category && <ServiceCategoryBadge categoryId={p.service_category} size="xs" showIcon={false} />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</span>
                        <span>{p.specialty}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.experience_years}y</span>
                        {p.avg_rating > 0 && <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" />{p.avg_rating}</span>}
                      </div>
                    </div>
                    <button onClick={() => handleAssign(p.id)} disabled={assigningId === p.id}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition disabled:opacity-50">
                      {assigningId === p.id ? 'Assigning...' : 'Assign'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
