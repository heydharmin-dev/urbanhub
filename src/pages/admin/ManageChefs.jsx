import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { SERVICE_CATEGORIES } from '../../lib/serviceCategories'
import ServiceCategoryBadge from '../../components/ui/ServiceCategoryBadge'
import ChefStatusBadge from '../../components/chef/ChefStatusBadge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'
import { Wrench, MapPin, Clock, DollarSign, CheckCircle, XCircle, Ban, Eye, FileText } from 'lucide-react'

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'suspended', label: 'Suspended' },
]

export default function ManageChefs() {
  const [activeTab, setActiveTab] = useState('pending')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [chefs, setChefs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedChef, setSelectedChef] = useState(null)
  const [rejectNotes, setRejectNotes] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showDocsModal, setShowDocsModal] = useState(false)
  const [docUrls, setDocUrls] = useState([])

  useEffect(() => {
    fetchChefs()
  }, [activeTab])

  async function fetchChefs() {
    setLoading(true)
    const { data, error } = await supabase
      .from('chef_profiles')
      .select(`
        *,
        profiles!chef_profiles_user_id_fkey (
          full_name, email, phone
        )
      `)
      .eq('verification_status', activeTab)
      .order('created_at', { ascending: false })

    if (!error) setChefs(data || [])
    setLoading(false)
  }

  async function handleApprove(chefId) {
    const { error } = await supabase
      .from('chef_profiles')
      .update({ verification_status: 'approved', admin_notes: null })
      .eq('id', chefId)

    if (error) toast.error(error.message)
    else {
      toast.success('Provider approved!')
      fetchChefs()
    }
  }

  async function handleReject(chefId) {
    setSelectedChef(chefId)
    setRejectNotes('')
    setShowRejectModal(true)
  }

  async function confirmReject() {
    const { error } = await supabase
      .from('chef_profiles')
      .update({ verification_status: 'rejected', admin_notes: rejectNotes || null })
      .eq('id', selectedChef)

    if (error) toast.error(error.message)
    else {
      toast.success('Provider rejected')
      setShowRejectModal(false)
      fetchChefs()
    }
  }

  async function handleSuspend(chefId) {
    const { error } = await supabase
      .from('chef_profiles')
      .update({ verification_status: 'suspended' })
      .eq('id', chefId)

    if (error) toast.error(error.message)
    else {
      toast.success('Provider suspended')
      fetchChefs()
    }
  }

  async function handleDelete(chefId) {
    if (!confirm('Delete this provider profile permanently?')) return
    const { error } = await supabase.from('chef_profiles').delete().eq('id', chefId)
    if (error) toast.error(error.message)
    else {
      toast.success('Provider deleted')
      fetchChefs()
    }
  }

  async function viewDocuments(chef) {
    if (!chef.document_urls?.length) {
      toast.error('No documents uploaded')
      return
    }
    const urls = await Promise.all(
      chef.document_urls.map(async (path) => {
        const { data } = await supabase.storage
          .from('chef-documents')
          .createSignedUrl(path, 3600)
        return data?.signedUrl
      })
    )
    setDocUrls(urls.filter(Boolean))
    setShowDocsModal(true)
  }

  const filteredChefs = chefs.filter(c => {
    if (categoryFilter !== 'all' && c.service_category !== categoryFilter) return false
    return true
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Providers</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
          <option value="all">All Categories</option>
          {SERVICE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition ${
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
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredChefs.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title={`No ${activeTab} providers`}
          description={`There are no ${activeTab} provider applications.`}
        />
      ) : (
        <div className="space-y-4">
          {filteredChefs.map((chef) => (
            <div key={chef.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{chef.profiles?.full_name}</h3>
                    <ChefStatusBadge status={chef.verification_status} />
                    {chef.service_category && <ServiceCategoryBadge categoryId={chef.service_category} size="xs" />}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Wrench className="h-4 w-4" />
                      {chef.specialty}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {chef.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {chef.experience_years}y exp
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {chef.price_per_hour ? `$${chef.price_per_hour}/hr` : `$${chef.price_per_day}/day`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {chef.profiles?.email} {chef.profiles?.phone ? `| ${chef.profiles.phone}` : ''}
                  </p>
                  {chef.bio && <p className="text-sm text-gray-500 mt-2">{chef.bio}</p>}
                </div>

                <div className="flex flex-wrap gap-2">
                  {chef.document_urls?.length > 0 && (
                    <button
                      onClick={() => viewDocuments(chef)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      Docs ({chef.document_urls.length})
                    </button>
                  )}
                  {activeTab === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(chef.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(chef.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </>
                  )}
                  {activeTab === 'approved' && (
                    <button
                      onClick={() => handleSuspend(chef.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      <Ban className="h-4 w-4" />
                      Suspend
                    </button>
                  )}
                  {(activeTab === 'rejected' || activeTab === 'suspended') && (
                    <button
                      onClick={() => handleApprove(chef.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Re-approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(chef.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Provider" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
            <textarea
              rows={3}
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              placeholder="Reason for rejection..."
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowRejectModal(false)}
              className="flex-1 border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmReject}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        </div>
      </Modal>

      {/* Documents Modal */}
      <Modal isOpen={showDocsModal} onClose={() => setShowDocsModal(false)} title="Provider Documents" size="lg">
        <div className="space-y-3">
          {docUrls.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <FileText className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">Document {i + 1}</span>
              <span className="text-sm text-indigo-500 ml-auto">View →</span>
            </a>
          ))}
        </div>
      </Modal>
    </div>
  )
}
