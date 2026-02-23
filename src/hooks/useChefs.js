import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useChefs(filters = {}) {
  const [chefs, setChefs] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  const PAGE_SIZE = 12

  async function fetchChefs(page = 1) {
    setLoading(true)

    let query = supabase
      .from('chef_profiles')
      .select(`
        *,
        profiles!chef_profiles_user_id_fkey (
          full_name, email, phone, avatar_url
        )
      `, { count: 'exact' })
      .eq('verification_status', 'approved')

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    if (filters.specialty) {
      query = query.eq('specialty', filters.specialty)
    }
    if (filters.minPrice !== undefined && filters.minPrice !== '') {
      query = query.gte('price_per_hour', filters.minPrice)
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
      query = query.lte('price_per_hour', filters.maxPrice)
    }
    if (filters.minExperience !== undefined && filters.minExperience !== '') {
      query = query.gte('experience_years', filters.minExperience)
    }

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    query = query.order('avg_rating', { ascending: false }).range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching chefs:', error)
    } else {
      setChefs(data || [])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchChefs(1)
  }, [filters.location, filters.specialty, filters.minPrice, filters.maxPrice, filters.minExperience])

  return { chefs, loading, totalCount, fetchChefs, pageSize: PAGE_SIZE }
}
