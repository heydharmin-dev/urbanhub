import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import ChefStatusBadge from '../../components/chef/ChefStatusBadge'
import ServiceCategoryBadge from '../../components/ui/ServiceCategoryBadge'
import AssignmentCard from '../../components/job/AssignmentCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'
import { ClipboardList, CheckCircle, AlertCircle, XCircle, Briefcase } from 'lucide-react'

export default function ChefDashboard() {
  const { profile, chefProfile } = useAuth()
  const [pendingAssignments, setPendingAssignments] = useState([])
  const [stats, setStats] = useState({ pending: 0, active: 0, completed: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (chefProfile) fetchData()
  }, [chefProfile?.id])

  async function fetchData() {
    const [pendingRes, statsRes] = await Promise.all([
      supabase
        .from('job_assignments')
        .select(`
          *,
          job:jobs (
            title, cuisine_type, location, salary_amount, salary_type,
            job_type, working_hours, start_date, duration, description, service_category,
            restaurant:restaurant_profiles ( business_name, city )
          )
        `)
        .eq('chef_id', chefProfile.id)
        .eq('status', 'pending')
        .order('assigned_at', { ascending: false })
        .limit(5),
      Promise.all([
        supabase.from('job_assignments').select('*', { count: 'exact', head: true }).eq('chef_id', chefProfile.id).eq('status', 'pending'),
        supabase.from('job_assignments').select('*', { count: 'exact', head: true }).eq('chef_id', chefProfile.id).eq('status', 'accepted'),
        supabase.from('job_assignments').select('*', { count: 'exact', head: true }).eq('chef_id', chefProfile.id).eq('status', 'completed'),
      ]),
    ])

    setPendingAssignments(pendingRes.data || [])
    setStats({
      pending: statsRes[0].count || 0,
      active: statsRes[1].count || 0,
      completed: statsRes[2].count || 0,
    })
    setLoading(false)
  }

  async function handleAccept(assignmentId) {
    const { error } = await supabase
      .from('job_assignments')
      .update({ status: 'accepted', responded_at: new Date().toISOString() })
      .eq('id', assignmentId)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Assignment accepted!')
      fetchData()
    }
  }

  async function handleDecline(assignmentId) {
    const { error } = await supabase
      .from('job_assignments')
      .update({ status: 'declined', responded_at: new Date().toISOString() })
      .eq('id', assignmentId)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Assignment declined')
      fetchData()
    }
  }

  const status = chefProfile?.verification_status

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-gray-500">Status:</span>
          <ChefStatusBadge status={status || 'pending'} />
          {chefProfile?.service_category && <ServiceCategoryBadge categoryId={chefProfile.service_category} size="sm" />}
        </div>
      </div>

      {status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Profile Under Review</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Your profile is currently being reviewed by our admin team. You will be notified once verified. This usually takes 24-48 hours.
            </p>
          </div>
        </div>
      )}

      {status === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Profile Not Approved</h3>
            <p className="text-sm text-red-700 mt-1">
              {chefProfile?.admin_notes || 'Your profile was not approved. Please update your profile and contact support.'}
            </p>
          </div>
        </div>
      )}

      {status === 'approved' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <ClipboardList className="h-8 w-8 text-yellow-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-500">Pending Assignments</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <Briefcase className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-500">Active Assignments</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <CheckCircle className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending Assignments</h2>
              <Link to="/chef/assignments" className="text-sm text-indigo-500 hover:text-indigo-600">
                View all &rarr;
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : pendingAssignments.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No pending assignments</p>
            ) : (
              <div className="space-y-4">
                {pendingAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    actions={
                      <>
                        <button
                          onClick={() => handleAccept(assignment.id)}
                          className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDecline(assignment.id)}
                          className="text-sm text-red-500 hover:text-red-600 font-medium px-4 py-1.5"
                        >
                          Decline
                        </button>
                      </>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
