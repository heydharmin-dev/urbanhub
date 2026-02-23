import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function ProtectedRoute({ allowedRoles }) {
  const { session, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (profile.is_blocked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Account Blocked</h2>
          <p className="text-gray-600">Your account has been blocked. Please contact support.</p>
        </div>
      </div>
    )
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    const redirectMap = {
      user: '/',
      chef: '/chef/dashboard',
      admin: '/admin/dashboard',
      restaurant: '/restaurant/dashboard',
    }
    return <Navigate to={redirectMap[profile.role] || '/'} replace />
  }

  return <Outlet />
}
