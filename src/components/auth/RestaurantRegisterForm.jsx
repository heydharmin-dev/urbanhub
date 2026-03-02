import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'
import { User, Mail, Phone, Lock, MapPin, Building2, Globe, Briefcase } from 'lucide-react'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const BUSINESS_TYPES = [
  { value: 'residential', label: 'Residential / Home' },
  { value: 'commercial', label: 'Commercial / Office' },
  { value: 'individual', label: 'Individual' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'catering', label: 'Catering Service' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'cloud_kitchen', label: 'Cloud Kitchen' },
  { value: 'other', label: 'Other' },
]

export default function RestaurantRegisterForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: '',
    address: '',
    city: '',
    contactPerson: '',
    contactPhone: '',
    website: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const { signUp, refreshProfile } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function validateStep1() {
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return false
    }
    return true
  }

  function validateStep2() {
    if (!formData.businessName || !formData.businessType || !formData.address || !formData.city || !formData.contactPerson || !formData.contactPhone) {
      toast.error('Please fill in all required fields')
      return false
    }
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateStep2()) return

    setLoading(true)

    const { data: authData, error: authError } = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone,
      role: 'restaurant',
    })

    if (authError) {
      toast.error(authError.message)
      setLoading(false)
      return
    }

    const userId = authData.user.id

    const { error: profileError } = await supabase.from('restaurant_profiles').insert({
      user_id: userId,
      business_name: formData.businessName,
      business_type: formData.businessType,
      address: formData.address,
      city: formData.city,
      contact_person: formData.contactPerson,
      contact_phone: formData.contactPhone,
      website: formData.website || null,
      description: formData.description || null,
    })

    if (profileError) {
      toast.error('Account created but profile failed. Please update from dashboard.')
      console.error('Profile error:', profileError)
    } else {
      toast.success('Welcome! Your account is ready.')
    }

    await refreshProfile()
    navigate('/restaurant/dashboard')
    setLoading(false)
  }

  return (
    <div className="w-full max-w-lg">
      <Card>
        <CardHeader className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Create Client Account</h2>
          <p className="text-muted-foreground mt-2">Find verified professionals for any service</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`h-2 w-16 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-2 w-16 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">Step {step} of 2</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <Label className="mb-1">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="text" name="fullName" required value={formData.fullName} onChange={handleChange}
                      className="pl-10" placeholder="Your full name" />
                  </div>
                </div>
                <div>
                  <Label className="mb-1">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="pl-10" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <Label className="mb-1">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      className="pl-10" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div>
                  <Label className="mb-1">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="password" name="password" required value={formData.password} onChange={handleChange}
                      className="pl-10" placeholder="Min 6 characters" />
                  </div>
                </div>
                <div>
                  <Label className="mb-1">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                      className="pl-10" placeholder="Confirm password" />
                  </div>
                </div>
                <Button type="button" variant="default" className="w-full" onClick={() => validateStep1() && setStep(2)}>
                  Next Step
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label className="mb-1">Name / Business Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="text" name="businessName" required value={formData.businessName} onChange={handleChange}
                      className="pl-10" placeholder="Your name or business name" />
                  </div>
                </div>

                <div>
                  <Label className="mb-1">Type *</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                  >
                    <SelectTrigger className="w-full pl-10">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1">Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="text" name="address" required value={formData.address} onChange={handleChange}
                      className="pl-10" placeholder="123 Main St" />
                  </div>
                </div>

                <div>
                  <Label className="mb-1">City *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="text" name="city" required value={formData.city} onChange={handleChange}
                      className="pl-10" placeholder="Mumbai" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1">Contact Person *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="text" name="contactPerson" required value={formData.contactPerson} onChange={handleChange}
                        className="pl-10" placeholder="Contact name" />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1">Contact Phone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="tel" name="contactPhone" required value={formData.contactPhone} onChange={handleChange}
                        className="pl-10" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-1">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="url" name="website" value={formData.website} onChange={handleChange}
                      className="pl-10" placeholder="https://www.example.com" />
                  </div>
                </div>

                <div>
                  <Label className="mb-1">Description</Label>
                  <Textarea name="description" rows={3} value={formData.description} onChange={handleChange}
                    className="resize-none"
                    placeholder="Tell us about yourself or your business..." />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" variant="default" disabled={loading} className="flex-1">
                    {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Building2 className="h-5 w-5" />Create Account</>}
                  </Button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary/80 font-medium">Sign In</Link>
            </p>
            <p className="mt-2">Want to offer services?{' '}
              <Link to="/register/chef" className="text-primary hover:text-primary/80 font-medium">Register as Provider</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
