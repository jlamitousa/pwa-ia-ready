import { NextRequest, NextResponse } from 'next/server'
import { RAGService } from '@/services/ragService'

export async function GET(
  request: NextRequest,
  { params }: { params: { entityType: string } }
) {
  try {
    const entity = await RAGService.getEntityType(params.entityType)
    
    if (!entity) {
      return NextResponse.json(
        {
          success: false,
          error: 'Entité non trouvée'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: entity
    })
  } catch (error) {
    console.error('Error fetching entity:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { entityType: string } }
) {
  try {
    const body = await request.json()
    
    const updatedEntity = await RAGService.updateEntityType(params.entityType, {
      titleSingular: body.titleSingular,
      titlePlural: body.titlePlural,
      primaryTable: body.primaryTable,
      primaryKey: body.primaryKey,
      defaultSummaryTemplate: body.defaultSummaryTemplate
    })

    return NextResponse.json({
      success: true,
      data: updatedEntity
    })
  } catch (error) {
    console.error('Error updating entity:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { entityType: string } }
) {
  try {
    await RAGService.deleteEntityType(params.entityType)

    return NextResponse.json({
      success: true,
      message: 'Entité supprimée avec succès'
    })
  } catch (error) {
    console.error('Error deleting entity:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression'
      },
      { status: 500 }
    )
  }
}
