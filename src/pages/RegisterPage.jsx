import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Card, CardContent } from '@/components/ui/card'
import { Briefcase, Wrench } from 'lucide-react'

export default function RegisterPage() {
  const { session, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (session && profile) {
    const redirectMap = {
      chef: '/chef/dashboard',
      admin: '/admin/dashboard',
      restaurant: '/restaurant/dashboard',
    }
    return <Navigate to={redirectMap[profile.role] || '/'} replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Join UrbanHire</h1>
          <p className="text-muted-foreground mt-2">Choose how you want to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/register/restaurant">
            <Card className="h-full hover:shadow-md transition group border-2 border-transparent hover:border-primary/40">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/15 transition">
                  <Briefcase className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">I Need a Service</h2>
                <p className="text-sm text-muted-foreground">
                  Post your requirements and let us match you with verified professionals for any home or business service.
                </p>
                <div className="mt-4 text-primary font-medium text-sm">
                  Get Started &rarr;
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/register/chef">
            <Card className="h-full hover:shadow-md transition group border-2 border-transparent hover:border-primary/40">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/15 transition">
                  <Wrench className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">I'm a Service Provider</h2>
                <p className="text-sm text-muted-foreground">
                  Showcase your skills in any of our 20+ service categories and get matched with clients needing your expertise.
                </p>
                <div className="mt-4 text-primary font-medium text-sm">
                  Get Started &rarr;
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
