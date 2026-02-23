import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import NotificationBell from '../notifications/NotificationBell'
import { Briefcase, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { session, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const dashboardLink = profile?.role === 'admin'
    ? '/admin/dashboard'
    : profile?.role === 'chef'
    ? '/chef/dashboard'
    : profile?.role === 'restaurant'
    ? '/restaurant/dashboard'
    : '/'

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-indigo-500" />
            <span className="text-xl font-bold text-gray-900">UrbanHire</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {session ? (
              <>
                <Link to={dashboardLink} className="text-gray-600 hover:text-indigo-500 font-medium transition">
                  Dashboard
                </Link>
                <NotificationBell />
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 font-medium transition"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-500 font-medium transition">
                  Login
                </Link>
                <Link
                  to="/register/restaurant"
                  className="text-gray-600 hover:text-indigo-500 font-medium transition"
                >
                  Book a Service
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {session ? (
              <>
                <Link
                  to={dashboardLink}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-gray-600 hover:bg-indigo-50 rounded-lg"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false) }}
                  className="block w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-gray-600 hover:bg-indigo-50 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 bg-indigo-500 text-white rounded-lg text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
