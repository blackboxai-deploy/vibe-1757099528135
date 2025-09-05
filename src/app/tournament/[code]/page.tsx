'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

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

function TournamentContent() {
  const params = useParams()
  const tournamentCode = params?.code as string

  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [playerName, setPlayerName] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load tournament data
  useEffect(() => {
    const loadTournament = async () => {
      try {
        const response = await fetch(`/api/tournaments/${tournamentCode}`)
        if (response.ok) {
          const data = await response.json()
          setTournament(data)
        } else {
          setError('Tournament not found')
        }
      } catch (err) {
        setError('Failed to load tournament')
      }
      setLoading(false)
    }

    if (tournamentCode) {
      loadTournament()
    }
  }, [tournamentCode])

  const joinTournament = async () => {
    if (!playerName.trim()) return

    setIsJoining(true)
    try {
      const response = await fetch(`/api/tournaments/${tournamentCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: playerName.trim() })
      })

      if (response.ok) {
        const data = await response.json()
        setTournament(data.tournament)
        setIsJoined(true)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to join tournament')
      }
    } catch (err) {
      setError('Failed to join tournament')
    }
    setIsJoining(false)
  }

  const startRace = () => {
    window.location.href = `/race?mode=tournament&tournament=${tournamentCode}`
  }

  const copyTournamentLink = () => {
    const link = `${window.location.origin}/tournament/${tournamentCode}`
    navigator.clipboard.writeText(link)
    // You could add a toast notification here
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading tournament...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 text-white max-w-md">
          <CardHeader>
            <CardTitle className="text-red-400">Tournament Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">{error}</p>
            <Link href="/">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Tournament Lobby</h1>
            <div className="flex items-center space-x-4">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500">
                Code: {tournamentCode}
              </Badge>
              <Badge variant="outline" className={`
                ${tournament?.status === 'waiting' ? 'text-yellow-400 border-yellow-400' : ''}
                ${tournament?.status === 'active' ? 'text-green-400 border-green-400' : ''}
                ${tournament?.status === 'finished' ? 'text-red-400 border-red-400' : ''}
              `}>
                {tournament?.status === 'waiting' ? '⏳ Waiting' : ''}
                {tournament?.status === 'active' ? '🏁 Active' : ''}
                {tournament?.status === 'finished' ? '✅ Finished' : ''}
              </Badge>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
              ← Back to Menu
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tournament Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{tournament?.name}</CardTitle>
                <CardDescription className="text-slate-400">
                  Tournament created on {tournament?.createdAt ? new Date(tournament.createdAt).toLocaleDateString() : 'Unknown'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <div className="text-sm text-slate-400">Tournament Link</div>
                    <div className="font-mono text-sm bg-slate-900 p-2 rounded">
                      {typeof window !== 'undefined' ? `${window.location.origin}/tournament/${tournamentCode}` : ''}
                    </div>
                  </div>
                  <Button 
                    onClick={copyTournamentLink}
                    variant="outline" 
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Participants ({tournament?.participants?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tournament?.participants && tournament.participants.length > 0 ? (
                  <div className="space-y-3">
                    {tournament.participants.map((participant, index) => (
                      <div key={participant.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{participant.name}</div>
                            <div className="text-xs text-slate-400">
                              Joined {new Date(participant.joinedAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {participant.bestWpm > 0 && (
                            <>
                              <div className="text-sm text-green-400">{participant.bestWpm} WPM</div>
                              <div className="text-xs text-slate-400">{participant.bestAccuracy}% accuracy</div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No participants yet. Be the first to join!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions Panel */}
          <div className="space-y-6">
            {!isJoined ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Join Tournament</CardTitle>
                  <CardDescription className="text-slate-400">
                    Enter your name to participate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && joinTournament()}
                  />
                  <Button 
                    onClick={joinTournament}
                    disabled={isJoining || !playerName.trim()}
                    className="w-full bg-purple-500 hover:bg-purple-600"
                  >
                    {isJoining ? 'Joining...' : 'Join Tournament'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-green-400">✓ You're In!</CardTitle>
                  <CardDescription className="text-slate-400">
                    Welcome to the tournament, {playerName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={startRace}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    🏁 Start Racing
                  </Button>
                  <Separator className="bg-slate-600" />
                  <div className="text-sm text-slate-400">
                    Share the tournament code with friends so they can join:
                  </div>
                  <div className="text-center font-mono text-2xl font-bold text-purple-400 bg-slate-900 p-3 rounded">
                    {tournamentCode}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tournament Rules */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Tournament Rules</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 space-y-2">
                <div>• Type as fast and accurately as possible</div>
                <div>• Your car speed matches your typing speed</div>
                <div>• Accuracy affects your final score</div>
                <div>• Race against all tournament participants</div>
                <div>• Best overall performance wins!</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TournamentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white text-xl">Loading tournament...</div>}>
      <TournamentContent />
    </Suspense>
  )
}