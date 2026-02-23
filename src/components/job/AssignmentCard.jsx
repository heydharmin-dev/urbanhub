import { MapPin, DollarSign, Briefcase, Building2, Calendar } from 'lucide-react'
import AssignmentStatusBadge from './AssignmentStatusBadge'
import ServiceCategoryBadge from '../ui/ServiceCategoryBadge'

const JOB_TYPE_LABELS = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  event_based: 'Event Based',
  contract: 'Contract',
}

const SALARY_TYPE_LABELS = {
  monthly: '/month',
  hourly: '/hour',
  fixed: ' (fixed)',
  negotiable: '',
}

export default function AssignmentCard({ assignment, actions }) {
  const job = assignment.job

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 text-lg">{job?.title || 'Untitled Request'}</h3>
            {job?.service_category && <ServiceCategoryBadge categoryId={job.service_category} size="xs" />}
          </div>
          {job?.restaurant && (
            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {job.restaurant.business_name} - {job.restaurant.city}
            </p>
          )}
        </div>
        <AssignmentStatusBadge status={assignment.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
        {job?.job_type && (
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-gray-400" />
            {JOB_TYPE_LABELS[job.job_type] || job.job_type}
          </div>
        )}
        {job?.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gray-400" />
            {job.location}
          </div>
        )}
        {job?.salary_amount && (
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-gray-400" />
            {job.salary_type === 'negotiable' ? 'Negotiable' : `$${job.salary_amount}${SALARY_TYPE_LABELS[job.salary_type]}`}
          </div>
        )}
        {job?.cuisine_type && (
          <div className="flex items-center gap-1.5">
            Skill: {job.cuisine_type}
          </div>
        )}
        {job?.start_date && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            Starts {new Date(job.start_date).toLocaleDateString()}
          </div>
        )}
        {job?.working_hours && (
          <div className="flex items-center gap-1.5">
            {job.working_hours}
          </div>
        )}
      </div>

      {job?.description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{job.description}</p>
      )}

      {assignment.admin_notes && (
        <div className="bg-blue-50 rounded-lg p-3 mb-3">
          <p className="text-xs font-medium text-blue-700 mb-1">Note from Admin:</p>
          <p className="text-sm text-blue-600">{assignment.admin_notes}</p>
        </div>
      )}

      <p className="text-xs text-gray-400 mb-2">
        Assigned on {new Date(assignment.assigned_at).toLocaleDateString()}
      </p>

      {actions && <div className="flex gap-2 pt-2 border-t border-gray-100">{actions}</div>}
    </div>
  )
}
