import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export function useJobAssignments() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const { profile, chefProfile } = useAuth()

  const fetchAssignments = useCallback(async (statusFilter) => {
    setLoading(true)

    let query = supabase
      .from('job_assignments')
      .select(`
        *,
        job:jobs (
          id, title, cuisine_type, location, salary_amount, salary_type,
          job_type, working_hours, start_date, duration, description,
          chefs_needed, experience_required, kitchen_facilities, benefits, status,
          restaurant:restaurant_profiles (
            business_name, city, business_type
          )
        ),
        chef:chef_profiles (
          id, specialty, location, experience_years,
          user:user_id ( full_name, email, phone )
        )
      `)
      .order('assigned_at', { ascending: false })

    // Chef sees only their assignments
    if (profile?.role === 'chef' && chefProfile) {
      query = query.eq('chef_id', chefProfile.id)
    }

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching assignments:', error)
      setAssignments([])
    } else {
      setAssignments(data || [])
    }

    setLoading(false)
  }, [profile, chefProfile])

  async function createAssignment({ jobId, chefId, adminNotes }) {
    const { data, error } = await supabase
      .from('job_assignments')
      .insert({
        job_id: jobId,
        chef_id: chefId,
        assigned_by: profile.id,
        admin_notes: adminNotes || null,
      })
      .select()
      .single()

    if (!error) {
      // Also update job status to 'matched'
      await supabase
        .from('jobs')
        .update({ status: 'matched' })
        .eq('id', jobId)
    }

    return { data, error }
  }

  async function updateAssignmentStatus(assignmentId, status, notes) {
    const updateData = {
      status,
      responded_at: new Date().toISOString(),
    }
    if (notes) updateData.chef_response_notes = notes

    const { data, error } = await supabase
      .from('job_assignments')
      .update(updateData)
      .eq('id', assignmentId)
      .select()
      .single()

    if (!error) {
      setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, ...data } : a))

      // If accepted, update job to filled
      if (status === 'accepted' && data.job_id) {
        await supabase
          .from('jobs')
          .update({ status: 'filled' })
          .eq('id', data.job_id)
      }
    }

    return { data, error }
  }

  useEffect(() => {
    fetchAssignments()
  }, [fetchAssignments])

  return { assignments, loading, fetchAssignments, createAssignment, updateAssignmentStatus }
}
