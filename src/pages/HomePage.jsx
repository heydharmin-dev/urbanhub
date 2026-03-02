import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SERVICE_CATEGORIES, getCategoryColors } from '../lib/serviceCategories'
import { ICON_MAP } from '../components/ui/ServiceCategoryBadge'
import {
  ArrowRight, Search, MapPin, Star, Shield, Clock,
  CheckCircle, BadgeCheck, HeartHandshake,
  Phone, ChevronRight, Award,
  ThumbsUp, Zap, ArrowUpRight
} from 'lucide-react'

const FEATURED_CATEGORIES = SERVICE_CATEGORIES.slice(0, 10)
const MORE_CATEGORIES = SERVICE_CATEGORIES.slice(10)

const POPULAR_SERVICES = [
  { name: 'Home Deep Cleaning', price: 'From $49', rating: '4.85', reviews: '12.4K', catId: 'cleaning' },
  { name: 'AC Repair & Service', price: 'From $29', rating: '4.82', reviews: '8.7K', catId: 'appliance_repair' },
  { name: 'Salon at Home', price: 'From $35', rating: '4.88', reviews: '15.2K', catId: 'salon_beauty' },
  { name: 'Personal Chef', price: 'From $59', rating: '4.91', reviews: '6.3K', catId: 'cooking' },
  { name: 'Plumbing Repair', price: 'From $25', rating: '4.79', reviews: '9.1K', catId: 'plumbing' },
  { name: 'Massage & Spa', price: 'From $45', rating: '4.90', reviews: '11.8K', catId: 'massage_spa' },
]

const STATS = [
  { value: '20+', label: 'Service Categories' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '4.8', label: 'Average Rating', icon: Star },
  { value: '10K+', label: 'Verified Pros' },
]

export default function HomePage() {
  const [showAllCategories, setShowAllCategories] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-16 md:pt-24 md:pb-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.05] tracking-tight text-[#0a0a0a]">
              Home services,{' '}
              <span className="text-[#0a0a0a] underline decoration-[3px] underline-offset-8 decoration-[#0a0a0a]/20">
                delivered.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#6b6b6b] leading-relaxed max-w-lg">
              Expert professionals for every need — cleaning, repairs, beauty, wellness & more. At your doorstep, on your schedule.
            </p>

            {/* Search Bar */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#999]" />
                <input
                  type="text"
                  placeholder="Enter your location..."
                  className="w-full h-13 pl-12 pr-4 rounded-xl bg-[#f5f5f5] border border-transparent text-[15px] text-[#0a0a0a] placeholder:text-[#999] focus:outline-none focus:bg-white focus:border-[#0a0a0a]/20 focus:ring-1 focus:ring-[#0a0a0a]/10 transition-all"
                />
              </div>
              <Button
                size="lg"
                onClick={() => navigate('/register/restaurant')}
                className="h-13 px-8 rounded-xl bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white font-medium transition-all"
              >
                <Search className="h-4.5 w-4.5 mr-2" />
                Find Services
              </Button>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#888]">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-[#0a0a0a]" />
                Background verified
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-[#0a0a0a] fill-[#0a0a0a]" />
                4.8 avg. rating
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#0a0a0a]" />
                Same-day service
              </span>
            </div>
          </div>
        </div>

        {/* Thin divider */}
        <div className="h-px bg-[#eee]" />
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a]">What are you looking for?</h2>
              <p className="mt-1.5 text-[#888]">Browse from 20+ service categories</p>
            </div>
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#0a0a0a] hover:opacity-60 transition-opacity"
            >
              {showAllCategories ? 'Show less' : 'View all'}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-y-6 gap-x-4 md:gap-6">
            {FEATURED_CATEGORIES.map(cat => {
              const colors = getCategoryColors(cat.color)
              const IconComponent = ICON_MAP[cat.icon]
              return (
                <Link
                  key={cat.id}
                  to="/register/restaurant"
                  className="group flex flex-col items-center gap-3"
                >
                  <div className={`w-16 h-16 md:w-[72px] md:h-[72px] rounded-full ${colors.bg} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                    {IconComponent && <IconComponent className={`h-7 w-7 md:h-8 md:w-8 ${colors.icon}`} strokeWidth={1.7} />}
                  </div>
                  <span className="text-xs md:text-[13px] font-medium text-[#333] text-center leading-tight max-w-[80px]">
                    {cat.name}
                  </span>
                </Link>
              )
            })}
          </div>

          {showAllCategories && (
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-y-6 gap-x-4 md:gap-6 mt-8 animate-in fade-in slide-in-from-top-2 duration-300">
              {MORE_CATEGORIES.map(cat => {
                const colors = getCategoryColors(cat.color)
                const IconComponent = ICON_MAP[cat.icon]
                return (
                  <Link
                    key={cat.id}
                    to="/register/restaurant"
                    className="group flex flex-col items-center gap-3"
                  >
                    <div className={`w-16 h-16 md:w-[72px] md:h-[72px] rounded-full ${colors.bg} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                      {IconComponent && <IconComponent className={`h-7 w-7 md:h-8 md:w-8 ${colors.icon}`} strokeWidth={1.7} />}
                    </div>
                    <span className="text-xs md:text-[13px] font-medium text-[#333] text-center leading-tight max-w-[80px]">
                      {cat.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}

          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="sm:hidden mt-8 mx-auto flex items-center gap-1 text-sm font-medium text-[#0a0a0a]"
          >
            {showAllCategories ? 'Show less' : 'View all services'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ─── POPULAR SERVICES ─── */}
      <section className="py-14 md:py-20 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a]">Most booked services</h2>
            <p className="mt-1.5 text-[#888]">Popular services loved by our customers</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {POPULAR_SERVICES.map((service, i) => {
              const cat = SERVICE_CATEGORIES.find(c => c.id === service.catId)
              const colors = cat ? getCategoryColors(cat.color) : {}
              const IconComponent = cat ? ICON_MAP[cat.icon] : null
              return (
                <Link
                  key={i}
                  to="/register/restaurant"
                  className="group bg-white rounded-2xl border border-[#eee] p-5 hover:border-[#ccc] transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg || 'bg-gray-100'} flex items-center justify-center`}>
                      {IconComponent && <IconComponent className={`h-6 w-6 ${colors.icon || 'text-gray-500'}`} strokeWidth={1.7} />}
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#ccc] group-hover:text-[#0a0a0a] transition-colors" />
                  </div>

                  <h3 className="mt-4 text-[15px] font-semibold text-[#0a0a0a]">{service.name}</h3>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-sm text-[#555]">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      {service.rating}
                    </span>
                    <span className="text-xs text-[#999]">{service.reviews} reviews</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#f0f0f0] flex items-center justify-between">
                    <span className="text-sm font-medium text-[#0a0a0a]">{service.price}</span>
                    <span className="text-xs font-medium text-[#0a0a0a] opacity-0 group-hover:opacity-100 transition-opacity">
                      Book now →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a]">How UrbanHire works</h2>
            <p className="mt-2 text-[#888]">Get professional help in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-16 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                icon: Search,
                title: 'Choose a service',
                desc: 'Browse 20+ categories and select the service you need. Tell us the details and your preferred timing.',
              },
              {
                step: '02',
                icon: BadgeCheck,
                title: 'Get matched',
                desc: 'We assign a verified, top-rated professional based on your requirements and location.',
              },
              {
                step: '03',
                icon: ThumbsUp,
                title: 'Sit back & relax',
                desc: 'Your professional arrives on schedule. Pay securely and rate your experience.',
              },
            ].map((step, i) => (
              <div key={i} className="relative text-center md:text-left">
                {i < 2 && (
                  <div className="hidden md:block absolute top-7 left-[calc(100%_-_8px)] w-[calc(100%_-_56px)] border-t border-dashed border-[#ddd]" />
                )}
                <div className="w-14 h-14 rounded-2xl bg-[#0a0a0a] text-white flex items-center justify-center mx-auto md:mx-0 mb-5">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-semibold tracking-[0.15em] text-[#bbb] uppercase">Step {step.step}</span>
                <h3 className="text-lg font-semibold text-[#0a0a0a] mt-1.5 mb-2">{step.title}</h3>
                <p className="text-sm text-[#888] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-14 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-3xl md:text-4xl font-extrabold text-white">{stat.value}</span>
                  {stat.icon && <stat.icon className="h-5 w-5 text-amber-400 fill-amber-400" />}
                </div>
                <p className="text-sm text-white/50 mt-1.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST & SAFETY ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a]">How UrbanHire protects you</h2>
            <p className="mt-2 text-[#888]">Your safety and satisfaction are our top priority</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              {
                icon: Shield,
                title: 'Background Verified',
                desc: 'Every professional undergoes thorough background verification and identity checks.',
              },
              {
                icon: Award,
                title: 'Quality Assured',
                desc: 'Standardized training and regular quality audits ensure consistent service delivery.',
              },
              {
                icon: HeartHandshake,
                title: 'Happiness Guarantee',
                desc: 'Not satisfied? We offer free rework or full refund — no questions asked.',
              },
              {
                icon: Phone,
                title: 'Dedicated Support',
                desc: 'Our support team is available to help you before, during, and after your service.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#eee] p-6 hover:border-[#ccc] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#f5f5f5] flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-[#0a0a0a]" />
                </div>
                <h3 className="text-[15px] font-semibold text-[#0a0a0a] mb-1.5">{item.title}</h3>
                <p className="text-sm text-[#888] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-16 md:py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a]">Loved by thousands</h2>
            <p className="mt-2 text-[#888]">Here's what our customers have to say</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {[
              { name: 'Sarah M.', role: 'Homeowner', text: 'The deep cleaning service was exceptional. My apartment has never looked this spotless! The team was professional and thorough.', rating: 5, service: 'Home Cleaning' },
              { name: 'Raj K.', role: 'Business Owner', text: 'Found an amazing personal chef through UrbanHire. The food was restaurant-quality and the chef was incredibly professional.', rating: 5, service: 'Personal Chef' },
              { name: 'Fatima A.', role: 'Working Mom', text: 'The babysitting service is a lifesaver. Finding reliable, verified childcare has never been easier. Highly recommend!', rating: 5, service: 'Babysitting' },
            ].map((review, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#eee] p-6 hover:border-[#ccc] transition-colors"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[#555] leading-relaxed mb-5">"{review.text}"</p>
                <Separator className="mb-5" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0a0a0a]">{review.name}</p>
                    <p className="text-xs text-[#999]">{review.role}</p>
                  </div>
                  <span className="text-xs font-medium text-[#0a0a0a] bg-[#f0f0f0] px-2.5 py-1 rounded-full">
                    {review.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BECOME A PRO ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-[#0a0a0a] p-8 md:p-14">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="max-w-lg">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium mb-5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  Earn on your own terms
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
                  Become a service professional
                </h2>
                <p className="mt-3 text-white/50 leading-relaxed">
                  Join thousands of skilled professionals who earn great income through UrbanHire. Set your schedule, grow your career.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-sm text-white/60">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    Flexible hours
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    Weekly payouts
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    Training support
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <Button
                  size="lg"
                  asChild
                  className="h-13 px-8 rounded-xl bg-white hover:bg-white/90 text-[#0a0a0a] font-medium"
                >
                  <Link to="/register/chef">
                    Register as Professional
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <span className="text-xs text-white/30 text-center">Free to join — no subscription fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-16 md:py-20 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] mb-3">
            Ready to get started?
          </h2>
          <p className="text-[#888] mb-8 max-w-md mx-auto">
            Book your first service in minutes. Satisfaction guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              size="lg"
              asChild
              className="h-13 px-8 rounded-xl bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white font-medium"
            >
              <Link to="/register/restaurant">
                Book a Service
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-13 px-8 rounded-xl border-[#ddd] text-[#0a0a0a] hover:bg-[#f5f5f5]" asChild>
              <Link to="/register/chef">
                Join as Professional
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
