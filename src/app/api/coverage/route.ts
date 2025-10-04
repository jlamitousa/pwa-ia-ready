import { NextRequest, NextResponse } from 'next/server'
import { RAGService } from '@/services/ragService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entityType')
    
    const coverage = await RAGService.getIntentCoverage(entityType || undefined)

    return NextResponse.json({
      success: true,
      data: coverage
    })
  } catch (error) {
    console.error('Error fetching coverage:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
