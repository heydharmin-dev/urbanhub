import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { Briefcase, CheckCircle, Clock, PlusCircle } from 'lucide-react'
import JobCard from '../../components/job/JobCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function RestaurantDashboard() {
  const { profile, restaurantProfile } = useAuth()
  const [stats, setStats] = useState({ open: 0, matched: 0, filled: 0 })
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!restaurantProfile) {
      setLoading(false)
      return
    }

    async function load() {
      const [openRes, matchedRes, filledRes, jobsRes] = await Promise.all([
        supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('restaurant_id', restaurantProfile.id).eq('status', 'open'),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('restaurant_id', restaurantProfile.id).eq('status', 'matched'),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('restaurant_id', restaurantProfile.id).eq('status', 'filled'),
        supabase.from('jobs').select(`
          *,
          assignments:job_assignments (
            id, status,
            chef:chef_profiles ( user:user_id ( full_name ) )
          )
        `).eq('restaurant_id', restaurantProfile.id).order('created_at', { ascending: false }).limit(5),
      ])

      setStats({
        open: openRes.count || 0,
        matched: matchedRes.count || 0,
        filled: filledRes.count || 0,
      })
      setRecentJobs(jobsRes.data || [])
      setLoading(false)
    }

    load()
  }, [restaurantProfile])

  if (loading) {
    return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
  }

  const statCards = [
    { label: 'Open Requests', value: stats.open, icon: Briefcase, color: 'text-green-600 bg-green-50' },
    { label: 'Matched', value: stats.matched, icon: Clock, color: 'text-blue-600 bg-blue-50' },
    { label: 'Filled', value: stats.filled, icon: CheckCircle, color: 'text-purple-600 bg-purple-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {restaurantProfile?.business_name || profile?.full_name}
          </h1>
          <p className="text-gray-500 mt-1">Manage your service requests and find the right provider</p>
        </div>
        <Link
          to="/restaurant/post-job"
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium transition"
        >
          <PlusCircle className="h-5 w-5" />
          Post a Request
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Service Requests</h2>
          <Link to="/restaurant/my-jobs" className="text-indigo-500 hover:text-indigo-600 text-sm font-medium">
            View All &rarr;
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No requests posted yet</h3>
            <p className="text-gray-500 mb-4">Post your first request to find the perfect service provider</p>
            <Link
              to="/restaurant/post-job"
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <PlusCircle className="h-4 w-4" />
              Post a Request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
