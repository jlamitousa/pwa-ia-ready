'use client'

import { useApp } from '@/app/providers'
import { cn } from '@/lib/utils'
import { 
  Database, 
  Settings, 
  FileText, 
  CheckCircle, 
  BarChart3, 
  Users, 
  Shield,
  Download,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

const navigation = [
  { name: 'Catalogue', href: '/', icon: Database, current: true },
  { name: 'Entités', href: '/entities', icon: FileText, current: false },
  { name: 'Règles', href: '/rules', icon: CheckCircle, current: false },
  { name: 'Facettes', href: '/facets', icon: BarChart3, current: false },
  { name: 'Recommandations', href: '/recommendations', icon: Users, current: false },
  { name: 'Permissions', href: '/permissions', icon: Shield, current: false },
  { name: 'Export', href: '/export', icon: Download, current: false },
  { name: 'Paramètres', href: '/settings', icon: Settings, current: false },
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp()

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">
            RAG Console
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-5 px-2">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={cn(
                    item.current
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md border-l-4'
                  )}
                >
                  <item.icon
                    className={cn(
                      item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 h-5 w-5'
                    )}
                  />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>Version 1.0.0</p>
            <p>Console RAG Admin</p>
          </div>
        </div>
      </div>
    </>
  )
}
