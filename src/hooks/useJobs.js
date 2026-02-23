import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export function useJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const { profile, restaurantProfile } = useAuth()

  const fetchJobs = useCallback(async (statusFilter) => {
    setLoading(true)

    let query = supabase
      .from('jobs')
      .select(`
        *,
        restaurant:restaurant_profiles (
          id, business_name, city, business_type,
          user:user_id ( full_name, email, phone )
        ),
        assignments:job_assignments (
          id, status, assigned_at, chef_response_notes,
          chef:chef_profiles (
            id, specialty, location, experience_years,
            user:user_id ( full_name, email )
          )
        )
      `)
      .order('created_at', { ascending: false })

    // Restaurant sees only their jobs
    if (profile?.role === 'restaurant' && restaurantProfile) {
      query = query.eq('restaurant_id', restaurantProfile.id)
    }

    // Filter by status if provided
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching jobs:', error)
      setJobs([])
    } else {
      setJobs(data || [])
    }

    setLoading(false)
  }, [profile, restaurantProfile])

  async function createJob(jobData) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single()

    if (!error) {
      setJobs(prev => [data, ...prev])
    }

    return { data, error }
  }

  async function updateJobStatus(jobId, status) {
    const { data, error } = await supabase
      .from('jobs')
      .update({ status })
      .eq('id', jobId)
      .select()
      .single()

    if (!error) {
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...data } : j))
    }

    return { data, error }
  }

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  return { jobs, loading, fetchJobs, createJob, updateJobStatus }
}
