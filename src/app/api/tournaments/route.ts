import { NextRequest, NextResponse } from 'next/server'
import { tournamentStore } from '@/lib/tournament-store'

export async function GET() {
  return NextResponse.json(tournamentStore.getAll())
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()
    
    if (!name) {
      return NextResponse.json({ error: 'Tournament name is required' }, { status: 400 })
    }

    // Generate unique tournament code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    
    const tournament = tournamentStore.create({
      code,
      name,
      status: 'waiting' as const,
      participants: [],
      createdAt: new Date().toISOString()
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.error('Error creating tournament:', error)
    return NextResponse.json({ error: 'Failed to create tournament' }, { status: 500 })
  }
}