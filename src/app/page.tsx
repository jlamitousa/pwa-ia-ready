import { Suspense } from 'react'
import { EntityCatalog } from '@/components/EntityCatalog'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function HomePage() {
  return (
    <div className="rag-console">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Console d'Administration RAG
                </h1>
                <p className="mt-2 text-gray-600">
                  Gérez les métadonnées de votre base de données pour optimiser les capacités RAG
                </p>
              </div>
              
              <Suspense fallback={<LoadingSpinner />}>
                <EntityCatalog />
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
