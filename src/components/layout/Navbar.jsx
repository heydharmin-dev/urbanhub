import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import NotificationBell from '../notifications/NotificationBell'
import { Briefcase, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

export default function Navbar() {
  const { session, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const dashboardLink = profile?.role === 'admin'
    ? '/admin/dashboard'
    : profile?.role === 'chef'
    ? '/chef/dashboard'
    : profile?.role === 'restaurant'
    ? '/restaurant/dashboard'
    : '/'

  return (
    <nav className="bg-background border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">UrbanHire</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to={dashboardLink}>Dashboard</Link>
                </Button>
                <NotificationBell />
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/register/restaurant">Book a Service</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  UrbanHire
                </SheetTitle>
              </SheetHeader>
              <Separator />
              <div className="flex flex-col gap-1 p-2">
                {session ? (
                  <>
                    <SheetClose asChild>
                      <Button variant="ghost" className="justify-start" asChild>
                        <Link to={dashboardLink}>Dashboard</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Button variant="ghost" className="justify-start" asChild>
                        <Link to="/login">Login</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button className="justify-start" asChild>
                        <Link to="/register">Register</Link>
                      </Button>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
