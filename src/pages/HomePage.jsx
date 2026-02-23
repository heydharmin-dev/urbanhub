import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { SERVICE_CATEGORIES, getCategoryColors } from '../lib/serviceCategories'
import { ICON_MAP } from '../components/ui/ServiceCategoryBadge'
import { Briefcase, Users, CheckCircle, ArrowRight, Search, Star, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Home & Professional Services at Your Doorstep
            </h1>
            <p className="mt-4 text-lg md:text-xl text-indigo-200">
              From cleaning to cooking, plumbing to pet care — find verified professionals for every need.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/register/restaurant"
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                Book a Service
              </Link>
              <Link
                to="/register/chef"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition flex items-center gap-2"
              >
                <Briefcase className="h-5 w-5" />
                Become a Provider
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Our Services</h2>
          <p className="text-gray-500 text-center mb-10">Choose from 20+ professional service categories</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {SERVICE_CATEGORIES.map(cat => {
              const colors = getCategoryColors(cat.color)
              const IconComponent = ICON_MAP[cat.icon]
              return (
                <Link
                  key={cat.id}
                  to="/register/restaurant"
                  className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition bg-white"
                >
                  <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition`}>
                    {IconComponent && <IconComponent className={`h-7 w-7 ${colors.icon}`} />}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 text-center leading-tight">
                    {cat.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: 'Post a Request', desc: 'Tell us what service you need — cleaning, plumbing, cooking, or any of our 20+ categories.' },
              { icon: Users, title: 'We Match an Expert', desc: 'Our team reviews your request and assigns a verified, skilled professional.' },
              { icon: CheckCircle, title: 'Get it Done', desc: 'The provider accepts and completes the job. Rate your experience!' },
            ].map((step, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Verified Providers</h4>
              <p className="text-sm text-gray-500">Background checked & verified</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Rated & Reviewed</h4>
              <p className="text-sm text-gray-500">Quality assured by ratings</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">20+ Categories</h4>
              <p className="text-sm text-gray-500">Every service you need</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Whether you need a service done or want to offer your skills, UrbanHire connects you with the right people.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register/restaurant"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
            >
              I Need a Service <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/register/chef"
              className="border border-indigo-500 text-indigo-500 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              I'm a Service Provider
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
