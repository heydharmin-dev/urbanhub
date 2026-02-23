import { Search, MapPin, ChefHat, DollarSign, Clock } from 'lucide-react'

const CUISINES = [
  'Indian', 'Italian', 'Chinese', 'Japanese', 'Mexican',
  'French', 'Thai', 'Mediterranean', 'American', 'Korean',
  'Middle Eastern', 'African', 'Caribbean', 'Fusion', 'Other',
]

export default function ChefFilters({ filters, onChange }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Search className="h-5 w-5 text-indigo-500" />
        Filter Providers
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={filters.location || ''}
              onChange={(e) => update('location', e.target.value)}
              placeholder="Any location"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Cuisine</label>
          <div className="relative">
            <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filters.specialty || ''}
              onChange={(e) => update('specialty', e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
            >
              <option value="">All cuisines</option>
              {CUISINES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Min Price/hr</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="number"
              min="0"
              value={filters.minPrice || ''}
              onChange={(e) => update('minPrice', e.target.value)}
              placeholder="Min"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Max Price/hr</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="number"
              min="0"
              value={filters.maxPrice || ''}
              onChange={(e) => update('maxPrice', e.target.value)}
              placeholder="Max"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Min Experience</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="number"
              min="0"
              value={filters.minExperience || ''}
              onChange={(e) => update('minExperience', e.target.value)}
              placeholder="Years"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {Object.values(filters).some(v => v !== '' && v !== undefined) && (
        <button
          onClick={() => onChange({ location: '', specialty: '', minPrice: '', maxPrice: '', minExperience: '' })}
          className="mt-3 text-sm text-indigo-500 hover:text-indigo-600"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}
