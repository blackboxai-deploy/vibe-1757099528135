import { NextRequest, NextResponse } from 'next/server'
import { tournamentStore } from '@/lib/tournament-store'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const { playerName } = await request.json()
    
    if (!playerName) {
      return NextResponse.json({ error: 'Player name is required' }, { status: 400 })
    }

    const tournament = tournamentStore.getByCode(code)
    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
    }
    
    // Check if player already joined
    const existingPlayer = tournament.participants.find((p) => p.name === playerName)
    if (existingPlayer) {
      return NextResponse.json({ error: 'Player name already taken' }, { status: 400 })
    }

    // Add new participant
    const newParticipant = {
      id: Math.random().toString(36).substring(2),
      name: playerName,
      joinedAt: new Date().toISOString(),
      bestWpm: 0,
      bestAccuracy: 0
    }

    const updatedTournament = tournamentStore.addParticipant(code, newParticipant)
    
    return NextResponse.json({
      tournament: updatedTournament,
      participant: newParticipant
    })
  } catch (error) {
    console.error('Error joining tournament:', error)
    return NextResponse.json({ error: 'Failed to join tournament' }, { status: 500 })
  }
}