import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useAdminStats() {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalChefs: 0,
    pendingChefs: 0,
    openJobs: 0,
    activeAssignments: 0,
  })
  const [loading, setLoading] = useState(true)

  async function fetchStats() {
    setLoading(true)

    const [restaurants, chefs, pending, openJobs, activeAssignments] = await Promise.all([
      supabase.from('restaurant_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('chef_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('chef_profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('job_assignments').select('*', { count: 'exact', head: true }).eq('status', 'accepted'),
    ])

    setStats({
      totalRestaurants: restaurants.count || 0,
      totalChefs: chefs.count || 0,
      pendingChefs: pending.count || 0,
      openJobs: openJobs.count || 0,
      activeAssignments: activeAssignments.count || 0,
    })
    setLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, refetch: fetchStats }
}
