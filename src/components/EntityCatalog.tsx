'use client'

import { useState, useEffect } from 'react'
import { RAGService } from '@/services/ragService'
import { EntityType, IntentCoverage } from '@/types/rag'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { 
  Plus, 
  Database, 
  Search, 
  BarChart3, 
  CheckCircle, 
  FileText, 
  Users,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { cn, formatPercentage, getCoverageColor } from '@/lib/utils'

export function EntityCatalog() {
  const [entities, setEntities] = useState<EntityType[]>([])
  const [coverage, setCoverage] = useState<IntentCoverage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [entitiesData, coverageData] = await Promise.all([
        RAGService.getEntityTypes(),
        RAGService.getIntentCoverage()
      ])
      setEntities(entitiesData)
      setCoverage(coverageData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const getEntityCoverage = (entityType: string): IntentCoverage | undefined => {
    return coverage.find(c => c.entityType === entityType)
  }

  const getCoverageBar = (percentage: number, color: string) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={cn("h-2 rounded-full transition-all duration-300", color)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
        <Button 
          onClick={loadData} 
          className="mt-2"
          variant="outline"
        >
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Catalogue des Entités</h2>
          <p className="text-gray-600">
            {entities.length} entité{entities.length > 1 ? 's' : ''} configurée{entities.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une entité
          </Button>
        </div>
      </div>

      {/* Grille des entités */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entities.map((entity) => {
          const entityCoverage = getEntityCoverage(entity.entityType)
          
          return (
            <div key={entity.entityType} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Header de l'entité */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Database className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {entity.titleSingular}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {entity.titlePlural}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {entity.primaryTable}.{entity.primaryKey}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Couverture des intents */}
              {entityCoverage && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <Search className="h-4 w-4 mr-1" />
                      Trouvable
                    </span>
                    <span className={cn("font-medium", getCoverageColor(entityCoverage.findable))}>
                      {formatPercentage(entityCoverage.findable / 100)}
                    </span>
                  </div>
                  {getCoverageBar(entityCoverage.findable, 'bg-blue-500')}

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Comparable
                    </span>
                    <span className={cn("font-medium", getCoverageColor(entityCoverage.comparable))}>
                      {formatPercentage(entityCoverage.comparable / 100)}
                    </span>
                  </div>
                  {getCoverageBar(entityCoverage.comparable, 'bg-green-500')}

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Vérifiable
                    </span>
                    <span className={cn("font-medium", getCoverageColor(entityCoverage.verifiable))}>
                      {formatPercentage(entityCoverage.verifiable / 100)}
                    </span>
                  </div>
                  {getCoverageBar(entityCoverage.verifiable, 'bg-yellow-500')}

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <FileText className="h-4 w-4 mr-1" />
                      Synthétisable
                    </span>
                    <span className={cn("font-medium", getCoverageColor(entityCoverage.summarizable))}>
                      {formatPercentage(entityCoverage.summarizable / 100)}
                    </span>
                  </div>
                  {getCoverageBar(entityCoverage.summarizable, 'bg-purple-500')}

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      Recommandable
                    </span>
                    <span className={cn("font-medium", getCoverageColor(entityCoverage.recommendable))}>
                      {formatPercentage(entityCoverage.recommendable / 100)}
                    </span>
                  </div>
                  {getCoverageBar(entityCoverage.recommendable, 'bg-pink-500')}
                </div>
              )}

              {/* Footer avec statistiques */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{entityCoverage?.totalFields || 0} champs</span>
                  <span>Dernière MAJ: {entity.updatedAt ? new Date(entity.updatedAt).toLocaleDateString('fr-FR') : 'N/A'}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Message si aucune entité */}
      {entities.length === 0 && (
        <div className="text-center py-12">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune entité configurée
          </h3>
          <p className="text-gray-500 mb-6">
            Commencez par ajouter votre première entité pour configurer les métadonnées RAG.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une entité
          </Button>
        </div>
      )}
    </div>
  )
}
