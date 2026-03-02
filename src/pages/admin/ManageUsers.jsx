import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import toast from 'react-hot-toast'
import { Users, Mail, Phone, Shield, Ban, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

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
      <h1 className="text-2xl font-bold text-foreground mb-6">Manage Users</h1>

      <div className="mb-4">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="No users match your search." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Phone</th>
                    <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/50">
                      <td className="px-5 py-3 text-sm font-medium text-foreground">{user.full_name}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {user.email}
                      </td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">
                        {user.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {user.phone}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={
                          user.role === 'chef' ? 'default' :
                          user.role === 'restaurant' ? 'secondary' : 'outline'
                        } className="gap-1">
                          <Shield className="h-3 w-3" />
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        {user.is_blocked ? (
                          <Badge variant="destructive">Blocked</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <Button
                          variant={user.is_blocked ? 'outline' : 'ghost'}
                          size="sm"
                          onClick={() => toggleBlock(user.id, user.is_blocked)}
                          className={user.is_blocked
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-red-600 hover:bg-red-50'
                          }
                        >
                          {user.is_blocked ? (
                            <>
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <Ban className="h-3.5 w-3.5 mr-1" />
                              Block
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
