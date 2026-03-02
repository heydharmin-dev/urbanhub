import { Search, MapPin, ChefHat, DollarSign, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

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
    <Card className="py-4">
      <CardContent className="px-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Filter Providers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Label className="mb-1">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={filters.location || ''}
                onChange={(e) => update('location', e.target.value)}
                placeholder="Any location"
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1">Cuisine</Label>
            <div className="relative">
              <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={filters.specialty || ''}
                onChange={(e) => update('specialty', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none"
              >
                <option value="">All cuisines</option>
                {CUISINES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label className="mb-1">Min Price/hr</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min="0"
                value={filters.minPrice || ''}
                onChange={(e) => update('minPrice', e.target.value)}
                placeholder="Min"
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1">Max Price/hr</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min="0"
                value={filters.maxPrice || ''}
                onChange={(e) => update('maxPrice', e.target.value)}
                placeholder="Max"
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1">Min Experience</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min="0"
                value={filters.minExperience || ''}
                onChange={(e) => update('minExperience', e.target.value)}
                placeholder="Years"
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {Object.values(filters).some(v => v !== '' && v !== undefined) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({ location: '', specialty: '', minPrice: '', maxPrice: '', minExperience: '' })}
            className="mt-3 text-primary"
          >
            Clear all filters
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
