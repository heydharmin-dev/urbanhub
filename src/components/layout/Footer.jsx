import { Briefcase } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-zinc-50 font-bold">UrbanHire</span>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} UrbanHire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
