import { NextRequest, NextResponse } from 'next/server'
import { tournamentStore } from '@/lib/tournament-store'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const tournament = tournamentStore.getByCode(code)
  
  if (!tournament) {
    return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
  }

  return NextResponse.json(tournament)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const updates = await request.json()
    
    const tournament = tournamentStore.update(code, updates)
    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
    }
    
    return NextResponse.json(tournament)
  } catch (error) {
    console.error('Error updating tournament:', error)
    return NextResponse.json({ error: 'Failed to update tournament' }, { status: 500 })
  }
}