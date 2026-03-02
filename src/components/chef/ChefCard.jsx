import { Link } from 'react-router-dom'
import { MapPin, Star, Clock, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ServiceCategoryBadge from '../ui/ServiceCategoryBadge'

export default function ChefCard({ chef }) {
  const profile = chef.profiles
  const name = profile?.full_name || 'Provider'

  return (
    <Link to={`/chef/${chef.id}`} className="block">
      <Card className="overflow-hidden py-0 hover:shadow-md hover:border-primary/30 transition">
        <div className="h-32 bg-gradient-to-br from-primary/80 to-purple-400 flex items-center justify-center">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={name} className="h-20 w-20 rounded-full object-cover border-2 border-white" />
          ) : (
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold text-white">
              {name[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-lg">{name}</h3>
          </div>
          <div className="flex items-center gap-2">
            {chef.service_category && <ServiceCategoryBadge categoryId={chef.service_category} size="xs" />}
            <span className="text-primary font-medium text-sm">{chef.specialty}</span>
          </div>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{chef.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{chef.experience_years} years experience</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 shrink-0" />
              <span>
                {chef.price_per_hour ? `$${chef.price_per_hour}/hr` : ''}
                {chef.price_per_hour && chef.price_per_day ? ' · ' : ''}
                {chef.price_per_day ? `$${chef.price_per_day}/day` : ''}
              </span>
            </div>
          </div>

          <Separator className="my-3" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-foreground">
                {chef.avg_rating > 0 ? Number(chef.avg_rating).toFixed(1) : 'New'}
              </span>
              {chef.total_reviews > 0 && (
                <span className="text-sm text-muted-foreground">({chef.total_reviews})</span>
              )}
            </div>
            <span className="text-sm text-primary font-medium">View Profile →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
