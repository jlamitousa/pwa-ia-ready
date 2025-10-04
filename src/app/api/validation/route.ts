import { NextRequest, NextResponse } from 'next/server'
import { RAGService } from '@/services/ragService'

export async function GET(request: NextRequest) {
  try {
    const validation = await RAGService.validateSchema()

    return NextResponse.json({
      success: true,
      data: validation
    })
  } catch (error) {
    console.error('Error validating schema:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la validation'
      },
      { status: 500 }
    )
  }
}
