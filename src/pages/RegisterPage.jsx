import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Briefcase, Wrench } from 'lucide-react'

export default function RegisterPage() {
  const { session, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Join UrbanHire</h1>
          <p className="text-gray-500 mt-2">Choose how you want to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Card */}
          <Link
            to="/register/restaurant"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition group border-2 border-transparent hover:border-indigo-400"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition">
              <Briefcase className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">I Need a Service</h2>
            <p className="text-gray-500 text-sm">
              Post your requirements and let us match you with verified professionals for any home or business service.
            </p>
            <div className="mt-4 text-indigo-500 font-semibold text-sm group-hover:text-indigo-600">
              Get Started &rarr;
            </div>
          </Link>

          {/* Provider Card */}
          <Link
            to="/register/chef"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition group border-2 border-transparent hover:border-indigo-400"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition">
              <Wrench className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">I'm a Service Provider</h2>
            <p className="text-gray-500 text-sm">
              Showcase your skills in any of our 20+ service categories and get matched with clients needing your expertise.
            </p>
            <div className="mt-4 text-indigo-500 font-semibold text-sm group-hover:text-indigo-600">
              Get Started &rarr;
            </div>
          </Link>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-500 hover:text-indigo-600 font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
