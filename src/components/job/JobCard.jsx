import { MapPin, DollarSign, Clock, Users, Calendar, Briefcase } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import JobStatusBadge from './JobStatusBadge'
import ServiceCategoryBadge from '../ui/ServiceCategoryBadge'

const JOB_TYPE_LABELS = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  event_based: 'Event / One-time',
  contract: 'Contract',
}

const SALARY_TYPE_LABELS = {
  monthly: '/month',
  hourly: '/hour',
  fixed: ' (fixed)',
  negotiable: '',
}

export default function JobCard({ job, showRestaurant = false, actions }) {
  return (
    <Card className="py-0 hover:shadow-md transition">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-lg">{job.title}</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {job.service_category && <ServiceCategoryBadge categoryId={job.service_category} size="xs" />}
              {showRestaurant && job.restaurant && (
                <span className="text-sm text-muted-foreground">{job.restaurant.business_name} - {job.restaurant.city}</span>
              )}
            </div>
          </div>
          <JobStatusBadge status={job.status} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-muted-foreground/70" />
            {JOB_TYPE_LABELS[job.job_type] || job.job_type}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-muted-foreground/70" />
            {job.location}
          </div>
          {job.salary_amount && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-muted-foreground/70" />
              {job.salary_type === 'negotiable' ? 'Negotiable' : `$${job.salary_amount}${SALARY_TYPE_LABELS[job.salary_type]}`}
            </div>
          )}
          {job.cuisine_type && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground/70" />
              {job.cuisine_type}
            </div>
          )}
          {job.chefs_needed > 1 && (
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-muted-foreground/70" />
              {job.chefs_needed} providers needed
            </div>
          )}
          {job.start_date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground/70" />
              Starts {new Date(job.start_date).toLocaleDateString()}
            </div>
          )}
        </div>

        {job.experience_required > 0 && (
          <p className="text-xs text-muted-foreground mb-2">Min. {job.experience_required} years experience required</p>
        )}

        {job.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.description}</p>
        )}

        {job.assignments && job.assignments.length > 0 && (
          <>
            <Separator className="mb-3" />
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Assigned Provider(s):</p>
              {job.assignments.map(a => (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{a.chef?.user?.full_name || 'Unknown'}</span>
                  <span className={`text-xs font-medium ${
                    a.status === 'accepted' ? 'text-green-600' :
                    a.status === 'declined' ? 'text-red-600' :
                    a.status === 'pending' ? 'text-yellow-600' : 'text-muted-foreground'
                  }`}>{a.status}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {actions && (
          <>
            <Separator className="mb-2" />
            <div className="flex gap-2 pt-2">{actions}</div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
