import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { CATEGORY_MAP } from '../../lib/serviceCategories'
import ServiceCategoryBadge from '../../components/ui/ServiceCategoryBadge'
import toast from 'react-hot-toast'
import { User, Mail, Phone, MapPin, Wrench, DollarSign, Clock, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function ChefProfile() {
  const { profile, chefProfile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  })
  const [chefData, setChefData] = useState({
    experience_years: chefProfile?.experience_years || '',
    specialty: chefProfile?.specialty || '',
    location: chefProfile?.location || '',
    price_per_hour: chefProfile?.price_per_hour || '',
    price_per_day: chefProfile?.price_per_day || '',
    bio: chefProfile?.bio || '',
  })

  const category = CATEGORY_MAP[chefProfile?.service_category]
  const skills = category?.skills || []

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const [profileRes, chefRes] = await Promise.all([
      supabase
        .from('profiles')
        .update({ full_name: profileData.full_name, phone: profileData.phone })
        .eq('id', profile.id),
      supabase
        .from('chef_profiles')
        .update({
          experience_years: parseInt(chefData.experience_years),
          specialty: chefData.specialty,
          location: chefData.location,
          price_per_hour: chefData.price_per_hour ? parseFloat(chefData.price_per_hour) : null,
          price_per_day: chefData.price_per_day ? parseFloat(chefData.price_per_day) : null,
          bio: chefData.bio || null,
        })
        .eq('user_id', profile.id),
    ])

    if (profileRes.error || chefRes.error) {
      toast.error('Failed to update profile')
    } else {
      toast.success('Profile updated!')
      refreshProfile()
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Service Profile</h1>
        {chefProfile?.service_category && <ServiceCategoryBadge categoryId={chefProfile.service_category} size="sm" />}
      </div>

      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="font-semibold text-foreground">Personal Info</h3>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    required
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label className="mb-1">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-1">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  disabled
                  value={profile?.email || ''}
                  className="pl-10 bg-muted/50 text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>

            <h3 className="font-semibold text-foreground pt-2">Professional Info</h3>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1">Experience (Years)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="number"
                    min="0"
                    required
                    value={chefData.experience_years}
                    onChange={(e) => setChefData({ ...chefData, experience_years: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label className="mb-1">{category?.skillLabel || 'Specialty'}</Label>
                <div className="relative">
                  <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <select
                    required
                    value={chefData.specialty}
                    onChange={(e) => setChefData({ ...chefData, specialty: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition appearance-none"
                  >
                    <option value="">Select</option>
                    {skills.length > 0
                      ? skills.map(s => <option key={s} value={s}>{s}</option>)
                      : <option value={chefData.specialty}>{chefData.specialty}</option>
                    }
                  </select>
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-1">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  required
                  value={chefData.location}
                  onChange={(e) => setChefData({ ...chefData, location: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1">Price / Hour ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={chefData.price_per_hour}
                    onChange={(e) => setChefData({ ...chefData, price_per_hour: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label className="mb-1">Price / Day ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={chefData.price_per_day}
                    onChange={(e) => setChefData({ ...chefData, price_per_day: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-1">Bio</Label>
              <Textarea
                rows={4}
                value={chefData.bio}
                onChange={(e) => setChefData({ ...chefData, bio: e.target.value })}
                className="resize-none"
                placeholder="Tell clients about your experience and skills..."
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
