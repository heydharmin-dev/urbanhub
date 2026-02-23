import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [chefProfile, setChefProfile] = useState(null)
  const [restaurantProfile, setRestaurantProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId) {
    // Retry a few times since the trigger may not have created the profile yet
    for (let i = 0; i < 3; i++) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (data) return data
      if (error) console.error('Error fetching profile (attempt ' + (i + 1) + '):', error)
      // Wait a bit before retrying
      if (i < 2) await new Promise(r => setTimeout(r, 500))
    }
    return null
  }

  async function fetchChefProfile(userId) {
    const { data, error } = await supabase
      .from('chef_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) return null
    return data
  }

  async function fetchRestaurantProfile(userId) {
    const { data, error } = await supabase
      .from('restaurant_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) return null
    return data
  }

  const loadUser = useCallback(async (sess) => {
    if (!sess?.user) {
      setProfile(null)
      setChefProfile(null)
      setLoading(false)
      return
    }

    const profileData = await fetchProfile(sess.user.id)
    setProfile(profileData)

    if (profileData?.role === 'chef') {
      const chefData = await fetchChefProfile(sess.user.id)
      setChefProfile(chefData)
      setRestaurantProfile(null)
    } else if (profileData?.role === 'restaurant') {
      const restData = await fetchRestaurantProfile(sess.user.id)
      setRestaurantProfile(restData)
      setChefProfile(null)
    } else {
      setChefProfile(null)
      setRestaurantProfile(null)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess)
      loadUser(sess)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
      if (_event === 'SIGNED_IN') {
        loadUser(sess)
      } else if (_event === 'SIGNED_OUT') {
        setProfile(null)
        setChefProfile(null)
        setRestaurantProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [loadUser])

  async function signUp({ email, password, fullName, phone, role = 'user' }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role,
        },
      },
    })
    if (!error && data.session) {
      setSession(data.session)
      await loadUser(data.session)
    }
    return { data, error }
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error && data.session) {
      setSession(data.session)
      await loadUser(data.session)
    }
    return { data, error }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setSession(null)
      setProfile(null)
      setChefProfile(null)
      setRestaurantProfile(null)
    }
    return { error }
  }

  const value = {
    session,
    profile,
    chefProfile,
    restaurantProfile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile: () => session && loadUser(session),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
