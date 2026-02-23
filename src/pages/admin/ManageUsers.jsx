import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import toast from 'react-hot-toast'
import { Users, Mail, Phone, Shield, Ban, CheckCircle } from 'lucide-react'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['user', 'chef', 'restaurant'])
      .order('created_at', { ascending: false })

    if (!error) setUsers(data || [])
    setLoading(false)
  }

  async function toggleBlock(userId, currentlyBlocked) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_blocked: !currentlyBlocked })
      .eq('id', userId)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(currentlyBlocked ? 'User unblocked' : 'User blocked')
      setUsers(users.map(u => u.id === userId ? { ...u, is_blocked: !currentlyBlocked } : u))
    }
  }

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h1>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="No users match your search." />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">Phone</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">Role</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{user.full_name}</td>
                    <td className="px-5 py-3 text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {user.email}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {user.phone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {user.phone}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'chef' ? 'bg-indigo-100 text-indigo-700' :
                        user.role === 'restaurant' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {user.is_blocked ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleBlock(user.id, user.is_blocked)}
                        className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg transition ${
                          user.is_blocked
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {user.is_blocked ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Ban className="h-3.5 w-3.5" />
                            Block
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
