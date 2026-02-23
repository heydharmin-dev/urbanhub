import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { SERVICE_CATEGORIES, getCategoryColors, CATEGORY_MAP } from '../../lib/serviceCategories'
import { ICON_MAP } from '../../components/ui/ServiceCategoryBadge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'
import { Grid3X3, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react'

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data) {
      setCategories(data)
    } else {
      // If table doesn't exist yet (migration not run), show from local config
      setCategories(SERVICE_CATEGORIES.map((c, i) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        icon: c.icon,
        is_active: true,
        display_order: i,
      })))
    }
    setLoading(false)
  }

  async function toggleActive(categoryId, currentActive) {
    setUpdating(categoryId)
    const { error } = await supabase
      .from('service_categories')
      .update({ is_active: !currentActive })
      .eq('id', categoryId)

    if (error) {
      toast.error('Failed to update: ' + error.message)
    } else {
      toast.success(`Category ${!currentActive ? 'enabled' : 'disabled'}`)
      fetchCategories()
    }
    setUpdating(null)
  }

  // Merge DB categories with local config for icons/colors
  const enrichedCategories = categories.map(cat => {
    const localCat = CATEGORY_MAP[cat.id]
    return {
      ...cat,
      color: localCat?.color || 'slate',
      iconName: localCat?.icon || cat.icon,
      skillCount: localCat?.skills?.length || 0,
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Categories</h1>
        <button onClick={fetchCategories}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {enrichedCategories.map(cat => {
            const colors = getCategoryColors(cat.color)
            const IconComponent = ICON_MAP[cat.iconName]
            const isUpdating = updating === cat.id

            return (
              <div key={cat.id}
                className={`bg-white rounded-xl border p-4 transition ${cat.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                      {IconComponent ? <IconComponent className={`h-5 w-5 ${colors.icon}`} /> : <Grid3X3 className={`h-5 w-5 ${colors.icon}`} />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                      <p className="text-xs text-gray-500">{cat.skillCount} skills · ID: {cat.id}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleActive(cat.id, cat.is_active)}
                    disabled={isUpdating}
                    className="transition"
                    title={cat.is_active ? 'Disable category' : 'Enable category'}
                  >
                    {isUpdating ? (
                      <div className="h-6 w-6 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin" />
                    ) : cat.is_active ? (
                      <ToggleRight className="h-8 w-8 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-gray-300" />
                    )}
                  </button>
                </div>
                {cat.description && (
                  <p className="text-sm text-gray-500 mt-2">{cat.description}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
