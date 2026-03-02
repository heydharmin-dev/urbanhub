import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useJobs } from '../../hooks/useJobs'
import { CATEGORY_MAP } from '../../lib/serviceCategories'
import ServiceCategorySelector from '../../components/ui/ServiceCategorySelector'
import toast from 'react-hot-toast'
import { Briefcase, MapPin, DollarSign, Clock, Users, Calendar, FileText, Gift } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const JOB_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'event_based', label: 'Event / One-time' },
  { value: 'contract', label: 'Contract' },
]

const SALARY_TYPES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'fixed', label: 'Fixed' },
  { value: 'negotiable', label: 'Negotiable' },
]

export default function PostJob() {
  const { restaurantProfile } = useAuth()
  const { createJob } = useJobs()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    serviceCategory: '',
    title: '',
    skillRequired: '',
    experienceRequired: '',
    location: restaurantProfile?.city || '',
    salaryAmount: '',
    salaryType: 'monthly',
    jobType: 'full_time',
    workingHours: '',
    providersNeeded: '1',
    startDate: '',
    duration: '',
    additionalInfo: '',
    benefits: '',
    description: '',
  })

  const selectedCategory = CATEGORY_MAP[formData.serviceCategory]

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formData.serviceCategory || !formData.title || !formData.location || !formData.jobType) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    const { error } = await createJob({
      restaurant_id: restaurantProfile.id,
      service_category: formData.serviceCategory,
      title: formData.title,
      cuisine_type: formData.skillRequired || null,  // nullable in DB now
      experience_required: formData.experienceRequired ? parseInt(formData.experienceRequired) : 0,
      location: formData.location,
      salary_amount: formData.salaryAmount ? parseFloat(formData.salaryAmount) : null,
      salary_type: formData.salaryType,
      job_type: formData.jobType,
      working_hours: formData.workingHours || null,
      chefs_needed: parseInt(formData.providersNeeded) || 1,
      start_date: formData.startDate || null,
      duration: formData.duration || null,
      kitchen_facilities: formData.additionalInfo || null,
      benefits: formData.benefits || null,
      description: formData.description || null,
    })
    if (error) {
      toast.error('Failed to post request: ' + error.message)
      setLoading(false)
      return
    }
    toast.success('Service request posted! Our team will match a provider soon.')
    navigate('/restaurant/my-jobs')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">Post a Service Request</h1>
      <p className="text-muted-foreground mb-6">Describe what you need and our team will find the perfect match</p>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <ServiceCategorySelector value={formData.serviceCategory}
              onChange={(val) => setFormData({ ...formData, serviceCategory: val, skillRequired: '' })} compact />

            <div>
              <Label className="mb-1">Title *</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input type="text" name="title" required value={formData.title} onChange={handleChange}
                  className="pl-10"
                  placeholder={selectedCategory ? `e.g., Need ${selectedCategory.name} professional` : 'Describe the service you need'} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1">{selectedCategory?.skillLabel || 'Skill'} Required</Label>
                {selectedCategory ? (
                  <select name="skillRequired" value={formData.skillRequired} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition appearance-none">
                    <option value="">Any</option>
                    {selectedCategory.skills.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <Input type="text" disabled placeholder="Select category first"
                    className="bg-muted/50 text-muted-foreground" />
                )}
              </div>
              <div>
                <Label className="mb-1">Min. Experience (Years)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input type="number" name="experienceRequired" min="0" value={formData.experienceRequired} onChange={handleChange}
                    className="pl-10" placeholder="0" />
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-1">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input type="text" name="location" required value={formData.location} onChange={handleChange}
                  className="pl-10" placeholder="City or area" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1">Budget</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input type="number" name="salaryAmount" min="0" step="0.01" value={formData.salaryAmount} onChange={handleChange}
                    className="pl-10" placeholder="Amount" />
                </div>
              </div>
              <div>
                <Label className="mb-1">Budget Type</Label>
                <select name="salaryType" value={formData.salaryType} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition appearance-none">
                  {SALARY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1">Service Type *</Label>
                <select name="jobType" required value={formData.jobType} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition appearance-none">
                  {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <Label className="mb-1">Preferred Timing</Label>
                <Input type="text" name="workingHours" value={formData.workingHours} onChange={handleChange}
                  placeholder="e.g., 9am - 6pm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1">Providers Needed</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input type="number" name="providersNeeded" min="1" value={formData.providersNeeded} onChange={handleChange}
                    className="pl-10" />
                </div>
              </div>
              <div>
                <Label className="mb-1">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                    className="pl-10" />
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-1">Duration</Label>
              <Input type="text" name="duration" value={formData.duration} onChange={handleChange}
                placeholder="e.g., Permanent, 6 months, one-time" />
            </div>

            <div>
              <Label className="mb-1">Additional Details</Label>
              <Textarea name="additionalInfo" rows={2} value={formData.additionalInfo} onChange={handleChange}
                className="resize-none"
                placeholder="Specific requirements, space details, tools needed..." />
            </div>

            <div>
              <Label className="mb-1">Benefits Offered</Label>
              <div className="relative">
                <Gift className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Textarea name="benefits" rows={2} value={formData.benefits} onChange={handleChange}
                  className="pl-10 resize-none"
                  placeholder="e.g., Meals, transport, accommodation..." />
              </div>
            </div>

            <div>
              <Label className="mb-1">Description</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Textarea name="description" rows={4} value={formData.description} onChange={handleChange}
                  className="pl-10 resize-none"
                  placeholder="Describe the service you need in detail..." />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Briefcase className="h-5 w-5 mr-2" />Post Service Request</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
