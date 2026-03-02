import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { SERVICE_CATEGORIES, getCategoryColors } from "@/lib/serviceCategories"
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

export default function ServiceCategorySelector({ value, onChange, label = "Service Category *", compact = false }) {
  if (compact) {
    return (
      <div>
        {label && <Label className="mb-1.5">{label}</Label>}
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
      {label && <Label className="mb-2">{label}</Label>}
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
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition text-center",
                isSelected
                  ? `${colors.bg} ${colors.border} ${colors.text}`
                  : "border-border hover:border-muted-foreground/30 text-muted-foreground hover:bg-muted"
              )}
            >
              {IconComponent && (
                <IconComponent className={cn("h-6 w-6", isSelected ? colors.icon : "text-muted-foreground/50")} />
              )}
              <span className="text-xs font-medium leading-tight">{cat.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
