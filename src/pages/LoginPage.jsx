import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoginForm from '../components/auth/LoginForm'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function LoginPage() {
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
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <LoginForm />
    </div>
  )
}
