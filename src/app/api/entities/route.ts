import { NextRequest, NextResponse } from 'next/server'
import { RAGService } from '@/services/ragService'
import { EntityTypeResponse } from '@/types/api'

export async function GET(request: NextRequest) {
  try {
    const entities = await RAGService.getEntityTypes()
    const coverage = await RAGService.getIntentCoverage()
    
    const response: EntityTypeResponse[] = entities.map(entity => {
      const entityCoverage = coverage.find(c => c.entityType === entity.entityType)
      
      return {
        entityType: entity.entityType,
        titleSingular: entity.titleSingular,
        titlePlural: entity.titlePlural,
        primaryTable: entity.primaryTable,
        primaryKey: entity.primaryKey,
        defaultSummaryTemplate: entity.defaultSummaryTemplate || '',
        fieldCount: entityCoverage?.totalFields || 0,
        coverage: {
          findable: entityCoverage?.findable || 0,
          comparable: entityCoverage?.comparable || 0,
          verifiable: entityCoverage?.verifiable || 0,
          summarizable: entityCoverage?.summarizable || 0,
          recommendable: entityCoverage?.recommendable || 0
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: response
    })
  } catch (error) {
    console.error('Error fetching entities:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newEntity = await RAGService.createEntityType({
      entityType: body.entityType,
      titleSingular: body.titleSingular,
      titlePlural: body.titlePlural,
      primaryTable: body.primaryTable,
      primaryKey: body.primaryKey,
      defaultSummaryTemplate: body.defaultSummaryTemplate || ''
    })

    return NextResponse.json({
      success: true,
      data: newEntity
    })
  } catch (error) {
    console.error('Error creating entity:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la création'
      },
      { status: 500 }
    )
  }
}
