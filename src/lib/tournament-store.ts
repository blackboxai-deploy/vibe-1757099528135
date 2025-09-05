// In-memory tournament storage (in production, use a database)

interface Tournament {
  id: string
  code: string
  name: string
  status: 'waiting' | 'active' | 'finished'
  participants: Participant[]
  createdAt: string
}

interface Participant {
  id: string
  name: string
  joinedAt: string
  bestWpm: number
  bestAccuracy: number
}

// Global tournament store
let tournaments: Tournament[] = []

export const tournamentStore = {
  getAll: (): Tournament[] => tournaments,
  
  getByCode: (code: string): Tournament | undefined => 
    tournaments.find(t => t.code === code),
  
  create: (tournament: Omit<Tournament, 'id'>): Tournament => {
    const newTournament = {
      ...tournament,
      id: Math.random().toString(36).substring(2),
    }
    tournaments.push(newTournament)
    return newTournament
  },
  
  update: (code: string, updates: Partial<Tournament>): Tournament | null => {
    const index = tournaments.findIndex(t => t.code === code)
    if (index === -1) return null
    
    tournaments[index] = { ...tournaments[index], ...updates }
    return tournaments[index]
  },
  
  addParticipant: (code: string, participant: Participant): Tournament | null => {
    const tournament = tournaments.find(t => t.code === code)
    if (!tournament) return null
    
    tournament.participants.push(participant)
    return tournament
  }
}

export type { Tournament, Participant }