'use client'

import { useApp } from '@/app/providers'
import { Button } from '@/components/ui/Button'
import { Menu, Bell, User } from 'lucide-react'

export function Header() {
  const { sidebarOpen, setSidebarOpen } = useApp()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-900">
            Console d'Administration RAG
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
