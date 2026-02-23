import { useAdminStats } from '../../hooks/useAdminStats'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { Building2, Wrench, Clock, Briefcase, CheckCircle, Grid3X3 } from 'lucide-react'

export default function AdminDashboard() {
  const { stats, loading } = useAdminStats()

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const cards = [
    { label: 'Total Clients', value: stats.totalRestaurants, icon: Building2, color: 'bg-blue-500' },
    { label: 'Total Providers', value: stats.totalChefs, icon: Wrench, color: 'bg-indigo-500' },
    { label: 'Pending Approvals', value: stats.pendingChefs, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Open Requests', value: stats.openJobs, icon: Briefcase, color: 'bg-purple-500' },
    { label: 'Active Assignments', value: stats.activeAssignments, icon: CheckCircle, color: 'bg-green-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <card.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
