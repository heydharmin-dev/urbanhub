import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import RestaurantRegisterForm from '../components/auth/RestaurantRegisterForm'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function RestaurantRegisterPage() {
  const { session, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (session && profile) {
    return <Navigate to="/restaurant/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <RestaurantRegisterForm />
    </div>
  )
}
