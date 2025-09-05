'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function HomePage() {
  const [tournamentCode, setTournamentCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [newTournamentName, setNewTournamentName] = useState('')

  const createTournament = async () => {
    if (!newTournamentName.trim()) return
    
    setIsCreating(true)
    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTournamentName })
      })
      const data = await response.json()
      if (data.code) {
        window.location.href = `/tournament/${data.code}`
      }
    } catch (error) {
      console.error('Failed to create tournament:', error)
    }
    setIsCreating(false)
  }

  const joinTournament = () => {
    if (tournamentCode.trim()) {
      window.location.href = `/tournament/${tournamentCode.toUpperCase()}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center text-white mb-16">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              TypeSpeed Racer
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Race your way to victory! Type faster, drive faster, win harder.
            </p>
            <div className="flex justify-center space-x-4 mb-8">
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-100 border-yellow-400">
                Real-time Multiplayer
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-400">
                Tournament Mode
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-100 border-blue-400">
                AI Opponents
              </Badge>
            </div>
          </div>

          {/* Game Mode Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all">
              <CardHeader>
                <CardTitle className="text-yellow-400">🏁 Practice Mode</CardTitle>
                <CardDescription className="text-blue-100">
                  Hone your skills against AI opponents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/race?mode=practice">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    Start Practice
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all">
              <CardHeader>
                <CardTitle className="text-green-400">🏆 Quick Race</CardTitle>
                <CardDescription className="text-blue-100">
                  Jump into a multiplayer race instantly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/race?mode=multiplayer">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold">
                    Quick Race
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all">
              <CardHeader>
                <CardTitle className="text-purple-400">👥 Tournament</CardTitle>
                <CardDescription className="text-blue-100">
                  Compete in organized tournaments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter tournament code"
                    value={tournamentCode}
                    onChange={(e) => setTournamentCode(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                    onKeyPress={(e) => e.key === 'Enter' && joinTournament()}
                  />
                  <Button 
                    onClick={joinTournament}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    Join
                  </Button>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                      Create Tournament
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 text-white border-slate-700">
                    <DialogHeader>
                      <DialogTitle>Create New Tournament</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Create a tournament and share the code with friends
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Tournament name"
                        value={newTournamentName}
                        onChange={(e) => setNewTournamentName(e.target.value)}
                        className="bg-slate-800 border-slate-600"
                      />
                      <Button 
                        onClick={createTournament}
                        disabled={isCreating || !newTournamentName.trim()}
                        className="w-full bg-purple-500 hover:bg-purple-600"
                      >
                        {isCreating ? 'Creating...' : 'Create Tournament'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-8">Why TypeSpeed Racer?</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold mb-2">Real-time Racing</h3>
                <p className="text-sm text-blue-100">Watch your car accelerate as you type faster</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-4xl mb-3">🌐</div>
                <h3 className="text-lg font-semibold mb-2">Multiplayer</h3>
                <p className="text-sm text-blue-100">Race against players from around the world</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="text-lg font-semibold mb-2">Tournaments</h3>
                <p className="text-sm text-blue-100">Create private tournaments with friends</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                <p className="text-sm text-blue-100">Track your progress and improve over time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}