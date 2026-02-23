import { SERVICE_CATEGORIES, getCategoryColors } from '../../lib/serviceCategories'
import {
  ChefHat, SprayCan, Baby, HeartHandshake, Flower2, Scissors,
  Wrench, Zap, Hammer, Paintbrush, Bug, Settings, Dumbbell,
  PawPrint, Car, Shield, Flower, Shirt, Truck, PartyPopper
} from 'lucide-react'

const ICON_MAP = {
  ChefHat, SprayCan, Baby, HeartHandshake, Flower2, Scissors,
  Wrench, Zap, Hammer, Paintbrush, Bug, Settings, Dumbbell,
  PawPrint, Car, Shield, Flower, Shirt, Truck, PartyPopper,
}

export default function ServiceCategorySelector({ value, onChange, label = 'Service Category *', compact = false }) {
  if (compact) {
    return (
      <div>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition appearance-none"
        >
          <option value="">Select a service category</option>
          {SERVICE_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {SERVICE_CATEGORIES.map(cat => {
          const colors = getCategoryColors(cat.color)
          const IconComponent = ICON_MAP[cat.icon]
          const isSelected = value === cat.id

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange(cat.id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition text-center ${
                isSelected
                  ? `${colors.bg} ${colors.border} ${colors.text}`
                  : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {IconComponent && (
                <IconComponent className={`h-6 w-6 ${isSelected ? colors.icon : 'text-gray-400'}`} />
              )}
              <span className="text-xs font-medium leading-tight">{cat.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
