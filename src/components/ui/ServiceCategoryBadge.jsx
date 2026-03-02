import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { getCategory, getCategoryColors } from "@/lib/serviceCategories"
import {
  ChefHat, SprayCan, Baby, HeartHandshake, Flower2, Scissors,
  Wrench, Zap, Hammer, Paintbrush, Bug, Settings, Dumbbell,
  PawPrint, Car, Shield, Flower, Shirt, Truck, PartyPopper
} from "lucide-react"

const ICON_MAP = {
  ChefHat, SprayCan, Baby, HeartHandshake, Flower2, Scissors,
  Wrench, Zap, Hammer, Paintbrush, Bug, Settings, Dumbbell,
  PawPrint, Car, Shield, Flower, Shirt, Truck, PartyPopper,
}

const sizeClasses = {
  xs: "text-xs px-2 py-0.5",
  sm: "text-sm px-2.5 py-1",
  md: "text-sm px-3 py-1.5",
}

const iconSizes = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
}

export default function ServiceCategoryBadge({ categoryId, size = "sm", showIcon = true }) {
  const category = getCategory(categoryId)
  if (!category) return null

  const colors = getCategoryColors(category.color)
  const IconComponent = ICON_MAP[category.icon]

  return (
    <Badge variant="outline" className={cn(colors.bg, colors.text, colors.border, sizeClasses[size], "border")}>
      {showIcon && IconComponent && <IconComponent className={cn(iconSizes[size], "mr-1")} />}
      {category.name}
    </Badge>
  )
}

export { ICON_MAP }
