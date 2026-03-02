import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'
import { Building2, MapPin, Phone, Globe, User, FileText } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const BUSINESS_TYPES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'catering', label: 'Catering Service' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'cloud_kitchen', label: 'Cloud Kitchen' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'individual', label: 'Individual' },
  { value: 'other', label: 'Other' },
]

export default function RestaurantProfile() {
  const { profile, restaurantProfile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    businessName: '',
    businessType: '',
    address: '',
    city: '',
    contactPerson: '',
    contactPhone: '',
    website: '',
    description: '',
  })

  useEffect(() => {
    if (profile && restaurantProfile) {
      setFormData({
        fullName: profile.full_name || '',
        phone: profile.phone || '',
        businessName: restaurantProfile.business_name || '',
        businessType: restaurantProfile.business_type || '',
        address: restaurantProfile.address || '',
        city: restaurantProfile.city || '',
        contactPerson: restaurantProfile.contact_person || '',
        contactPhone: restaurantProfile.contact_phone || '',
        website: restaurantProfile.website || '',
        description: restaurantProfile.description || '',
      })
    }
  }, [profile, restaurantProfile])

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const [profileRes, restaurantRes] = await Promise.all([
      supabase.from('profiles').update({
        full_name: formData.fullName,
        phone: formData.phone,
      }).eq('id', profile.id),
      supabase.from('restaurant_profiles').update({
        business_name: formData.businessName,
        business_type: formData.businessType,
        address: formData.address,
        city: formData.city,
        contact_person: formData.contactPerson,
        contact_phone: formData.contactPhone,
        website: formData.website || null,
        description: formData.description || null,
      }).eq('id', restaurantProfile.id),
    ])

    if (profileRes.error || restaurantRes.error) {
      toast.error('Failed to update profile')
    } else {
      toast.success('Profile updated!')
      await refreshProfile()
    }

    setLoading(false)
  }

  if (!restaurantProfile) {
    return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label className="mb-1">Email</Label>
              <Input
                type="email"
                value={profile?.email || ''}
                disabled
                className="bg-muted/50 text-muted-foreground"
              />
            </div>

            <div>
              <Label className="mb-1">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Info */}
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1">Business / Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label className="mb-1">Type</Label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition appearance-none"
              >
                {BUSINESS_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-1">City</Label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1">Contact Person</Label>
                <Input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="mb-1">Contact Phone</Label>
                <Input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label className="mb-1">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label className="mb-1">Description</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="pl-10 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
