import { getCategory, getCategoryColors } from '../../lib/serviceCategories'
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

export default function ServiceCategoryBadge({ categoryId, size = 'sm', showIcon = true }) {
  const category = getCategory(categoryId)
  if (!category) return null

  const colors = getCategoryColors(category.color)
  const IconComponent = ICON_MAP[category.icon]

  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-sm px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  }

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${colors.bg} ${colors.text} ${sizeClasses[size]}`}>
      {showIcon && IconComponent && <IconComponent className={iconSizes[size]} />}
      {category.name}
    </span>
  )
}

// Export icon map for reuse
export { ICON_MAP }
