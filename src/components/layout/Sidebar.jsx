import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, User, ClipboardList, Users,
  BarChart3, Building2, PlusCircle, Briefcase, Wrench, Grid3X3
} from 'lucide-react'

const navItems = {
  restaurant: [
    { to: '/restaurant/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/restaurant/post-job', label: 'Post a Request', icon: PlusCircle },
    { to: '/restaurant/my-jobs', label: 'My Requests', icon: Briefcase },
    { to: '/restaurant/profile', label: 'My Profile', icon: Building2 },
  ],
  chef: [
    { to: '/chef/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/chef/assignments', label: 'My Assignments', icon: ClipboardList },
    { to: '/chef/profile', label: 'My Profile', icon: User },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Overview', icon: BarChart3 },
    { to: '/admin/jobs', label: 'Service Requests', icon: Briefcase },
    { to: '/admin/chefs', label: 'Providers', icon: Wrench },
    { to: '/admin/categories', label: 'Categories', icon: Grid3X3 },
    { to: '/admin/users', label: 'Users', icon: Users },
  ],
}

export default function Sidebar({ role }) {
  const items = navItems[role] || []

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] hidden lg:block">
      <nav className="p-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
