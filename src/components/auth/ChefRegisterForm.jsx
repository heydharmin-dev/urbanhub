import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { CATEGORY_MAP } from '../../lib/serviceCategories'
import ServiceCategorySelector from '../ui/ServiceCategorySelector'
import toast from 'react-hot-toast'
import { User, Mail, Phone, Lock, MapPin, DollarSign, Clock, Upload, FileText, X, Wrench } from 'lucide-react'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

export default function ChefRegisterForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    serviceCategory: '',
    experienceYears: '',
    skills: [],
    location: '',
    pricePerHour: '',
    pricePerDay: '',
    bio: '',
  })
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const { signUp, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const selectedCategory = CATEGORY_MAP[formData.serviceCategory]
  const availableSkills = selectedCategory?.skills || []
  const skillLabel = selectedCategory?.skillLabel || 'Skills'

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleCategoryChange(categoryId) {
    setFormData({ ...formData, serviceCategory: categoryId, skills: [] })
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files)
    if (selected.length + files.length > 5) {
      toast.error('Maximum 5 files allowed')
      return
    }
    const valid = selected.filter(f => {
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 5MB limit`)
        return false
      }
      return true
    })
    setFiles([...files, ...valid])
  }

  function removeFile(index) {
    setFiles(files.filter((_, i) => i !== index))
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

  function toggleSkill(skill) {
    setFormData(prev => {
      const already = prev.skills.includes(skill)
      if (already) {
        return { ...prev, skills: prev.skills.filter(s => s !== skill) }
      }
      if (prev.skills.length >= 5) {
        toast.error('You can select up to 5 skills')
        return prev
      }
      return { ...prev, skills: [...prev.skills, skill] }
    })
  }

  function validateStep2() {
    if (!formData.serviceCategory) {
      toast.error('Please select a service category')
      return false
    }
    if (!formData.experienceYears || formData.skills.length === 0 || !formData.location) {
      toast.error('Please fill in all required fields')
      return false
    }
    if (!formData.pricePerHour && !formData.pricePerDay) {
      toast.error('Please set at least one price')
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
      role: 'chef',
    })

    if (authError) {
      toast.error(authError.message)
      setLoading(false)
      return
    }

    const userId = authData.user.id

    let documentUrls = []
    for (const file of files) {
      const filePath = `${userId}/${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('chef-documents')
        .upload(filePath, file)
      if (!uploadError) documentUrls.push(filePath)
    }

    const { error: profileError } = await supabase.from('chef_profiles').insert({
      user_id: userId,
      service_category: formData.serviceCategory,
      experience_years: parseInt(formData.experienceYears),
      specialty: formData.skills.join(', '),
      location: formData.location,
      price_per_hour: formData.pricePerHour ? parseFloat(formData.pricePerHour) : null,
      price_per_day: formData.pricePerDay ? parseFloat(formData.pricePerDay) : null,
      bio: formData.bio || null,
      document_urls: documentUrls,
    })

    if (profileError) {
      toast.error('Account created but profile failed. Please update from dashboard.')
      console.error('Profile error:', profileError)
    } else {
      toast.success('Profile submitted for review!')
    }

    await refreshProfile()
    navigate('/chef/dashboard')
    setLoading(false)
  }

  return (
    <div className="w-full max-w-lg">
      <Card>
        <CardHeader className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Join as Provider</h2>
          <p className="text-muted-foreground mt-2">Offer your professional skills on UrbanHire</p>
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
                <ServiceCategorySelector value={formData.serviceCategory} onChange={handleCategoryChange} />

                <div>
                  <Label className="mb-1">Experience (Years) *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="number" name="experienceYears" required min="0" value={formData.experienceYears} onChange={handleChange}
                      className="pl-10" placeholder="5" />
                  </div>
                </div>

                {formData.serviceCategory && (
                  <div>
                    <Label className="mb-1">
                      {skillLabel} * <span className="text-muted-foreground font-normal">(select up to 5)</span>
                    </Label>
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.skills.map(s => (
                          <Badge key={s} variant="default" className="gap-1 px-3 py-1">
                            {s}
                            <button type="button" onClick={() => toggleSkill(s)} className="hover:text-primary-foreground/80"><X className="h-3.5 w-3.5" /></button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {availableSkills.filter(s => !formData.skills.includes(s)).map(s => (
                        <Badge key={s} variant="outline" asChild>
                          <button type="button" onClick={() => toggleSkill(s)} disabled={formData.skills.length >= 5}
                            className="cursor-pointer hover:border-primary hover:text-primary transition disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1">
                            {s}
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="mb-1">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="text" name="location" required value={formData.location} onChange={handleChange}
                      className="pl-10" placeholder="Mumbai, Maharashtra" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1">Price / Hour</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="number" name="pricePerHour" min="0" step="0.01" value={formData.pricePerHour} onChange={handleChange}
                        className="pl-10" placeholder="500" />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1">Price / Day</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="number" name="pricePerDay" min="0" step="0.01" value={formData.pricePerDay} onChange={handleChange}
                        className="pl-10" placeholder="3000" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-1">Bio</Label>
                  <Textarea name="bio" rows={3} value={formData.bio} onChange={handleChange}
                    className="resize-none"
                    placeholder="Tell us about your experience and expertise..." />
                </div>

                <div>
                  <Label className="mb-1">Documents (optional, max 5, 5MB each)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition cursor-pointer">
                    <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload PDF, JPG, or PNG</p>
                    </label>
                  </div>
                  {files.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {files.map((file, i) => (
                        <li key={i} className="flex items-center justify-between text-sm bg-muted px-3 py-1.5 rounded">
                          <span className="flex items-center gap-2 text-muted-foreground truncate"><FileText className="h-4 w-4 shrink-0" />{file.name}</span>
                          <button type="button" onClick={() => removeFile(i)} className="text-destructive hover:text-destructive/80 ml-2">Remove</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" variant="default" disabled={loading} className="flex-1">
                    {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Wrench className="h-5 w-5" />Submit Application</>}
                  </Button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium">Sign In</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
