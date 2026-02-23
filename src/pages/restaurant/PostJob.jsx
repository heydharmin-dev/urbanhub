import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useJobs } from '../../hooks/useJobs'
import { CATEGORY_MAP } from '../../lib/serviceCategories'
import ServiceCategorySelector from '../../components/ui/ServiceCategorySelector'
import toast from 'react-hot-toast'
import { Briefcase, MapPin, DollarSign, Clock, Users, Calendar, FileText, Gift } from 'lucide-react'

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
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Post a Service Request</h1>
      <p className="text-gray-500 mb-6">Describe what you need and our team will find the perfect match</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <ServiceCategorySelector value={formData.serviceCategory}
          onChange={(val) => setFormData({ ...formData, serviceCategory: val, skillRequired: '' })} compact />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" name="title" required value={formData.title} onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder={selectedCategory ? `e.g., Need ${selectedCategory.name} professional` : 'Describe the service you need'} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{selectedCategory?.skillLabel || 'Skill'} Required</label>
            {selectedCategory ? (
              <select name="skillRequired" value={formData.skillRequired} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition appearance-none">
                <option value="">Any</option>
                {selectedCategory.skills.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <input type="text" disabled placeholder="Select category first"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-400" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min. Experience (Years)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="number" name="experienceRequired" min="0" value={formData.experienceRequired} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" placeholder="0" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" name="location" required value={formData.location} onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" placeholder="City or area" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="number" name="salaryAmount" min="0" step="0.01" value={formData.salaryAmount} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" placeholder="Amount" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget Type</label>
            <select name="salaryType" value={formData.salaryType} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition appearance-none">
              {SALARY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
            <select name="jobType" required value={formData.jobType} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition appearance-none">
              {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Timing</label>
            <input type="text" name="workingHours" value={formData.workingHours} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" placeholder="e.g., 9am - 6pm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Providers Needed</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="number" name="providersNeeded" min="1" value={formData.providersNeeded} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input type="text" name="duration" value={formData.duration} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="e.g., Permanent, 6 months, one-time" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
          <textarea name="additionalInfo" rows={2} value={formData.additionalInfo} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
            placeholder="Specific requirements, space details, tools needed..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Benefits Offered</label>
          <div className="relative">
            <Gift className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea name="benefits" rows={2} value={formData.benefits} onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
              placeholder="e.g., Meals, transport, accommodation..." />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea name="description" rows={4} value={formData.description} onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
              placeholder="Describe the service you need in detail..." />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Briefcase className="h-5 w-5" />Post Service Request</>}
        </button>
      </form>
    </div>
  )
}
