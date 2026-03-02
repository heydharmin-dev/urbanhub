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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

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
      <h1 className="text-2xl font-bold text-foreground mb-6">Manage Providers</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
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
            <Card key={chef.id}>
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground text-lg">{chef.profiles?.full_name}</h3>
                      <ChefStatusBadge status={chef.verification_status} />
                      {chef.service_category && <ServiceCategoryBadge categoryId={chef.service_category} size="xs" />}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
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
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      {chef.profiles?.email} {chef.profiles?.phone ? `| ${chef.profiles.phone}` : ''}
                    </p>
                    {chef.bio && <p className="text-sm text-muted-foreground mt-2">{chef.bio}</p>}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {chef.document_urls?.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewDocuments(chef)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Docs ({chef.document_urls.length})
                      </Button>
                    )}
                    {activeTab === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(chef.id)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(chef.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {activeTab === 'approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspend(chef.id)}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Suspend
                      </Button>
                    )}
                    {(activeTab === 'rejected' || activeTab === 'suspended') && (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(chef.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Re-approve
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(chef.id)}
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Provider" size="sm">
        <div className="space-y-4">
          <div>
            <Label className="mb-1">Reason (optional)</Label>
            <Textarea
              rows={3}
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              className="resize-none"
              placeholder="Reason for rejection..."
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowRejectModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              className="flex-1"
            >
              Reject
            </Button>
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
              className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition"
            >
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Document {i + 1}</span>
              <span className="text-sm text-primary ml-auto">View &rarr;</span>
            </a>
          ))}
        </div>
      </Modal>
    </div>
  )
}
