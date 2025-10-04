import { NextRequest, NextResponse } from 'next/server'
import { RAGService } from '@/services/ragService'

export async function GET(request: NextRequest) {
  try {
    const manifest = await RAGService.generateExportManifest()

    return NextResponse.json({
      success: true,
      data: manifest
    })
  } catch (error) {
    console.error('Error generating export manifest:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la génération du manifest'
      },
      { status: 500 }
    )
  }
}
