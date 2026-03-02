import { useAdminStats } from '../../hooks/useAdminStats'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { Building2, Wrench, Clock, Briefcase, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

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
    { label: 'Total Providers', value: stats.totalChefs, icon: Wrench, color: 'bg-primary' },
    { label: 'Pending Approvals', value: stats.pendingChefs, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Open Requests', value: stats.openJobs, icon: Briefcase, color: 'bg-purple-500' },
    { label: 'Active Assignments', value: stats.activeAssignments, icon: CheckCircle, color: 'bg-green-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
