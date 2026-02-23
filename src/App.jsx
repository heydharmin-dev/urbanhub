import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'

// Public pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ChefRegisterPage from './pages/ChefRegisterPage'
import RestaurantRegisterPage from './pages/RestaurantRegisterPage'
import NotFoundPage from './pages/NotFoundPage'

// Client (restaurant) pages
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard'
import PostJob from './pages/restaurant/PostJob'
import MyJobs from './pages/restaurant/MyJobs'
import RestaurantProfile from './pages/restaurant/RestaurantProfile'

// Provider (chef) pages
import ChefDashboard from './pages/chef/ChefDashboard'
import MyAssignments from './pages/chef/MyAssignments'
import ChefProfile from './pages/chef/ChefProfile'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageChefs from './pages/admin/ManageChefs'
import ManageUsers from './pages/admin/ManageUsers'
import ManageJobs from './pages/admin/ManageJobs'
import ManageCategories from './pages/admin/ManageCategories'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '12px', padding: '12px 16px' },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/chef" element={<ChefRegisterPage />} />
          <Route path="/register/restaurant" element={<RestaurantRegisterPage />} />
          {/* Alias routes for new branding */}
          <Route path="/register/provider" element={<ChefRegisterPage />} />
          <Route path="/register/client" element={<RestaurantRegisterPage />} />

          {/* Client (restaurant) routes */}
          <Route element={<ProtectedRoute allowedRoles={['restaurant']} />}>
            <Route element={<DashboardLayout role="restaurant" />}>
              <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
              <Route path="/restaurant/post-job" element={<PostJob />} />
              <Route path="/restaurant/my-jobs" element={<MyJobs />} />
              <Route path="/restaurant/profile" element={<RestaurantProfile />} />
            </Route>
          </Route>

          {/* Provider (chef) routes */}
          <Route element={<ProtectedRoute allowedRoles={['chef']} />}>
            <Route element={<DashboardLayout role="chef" />}>
              <Route path="/chef/dashboard" element={<ChefDashboard />} />
              <Route path="/chef/assignments" element={<MyAssignments />} />
              <Route path="/chef/profile" element={<ChefProfile />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout role="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/chefs" element={<ManageChefs />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/jobs" element={<ManageJobs />} />
              <Route path="/admin/categories" element={<ManageCategories />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
