'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Player {
  id: string
  name: string
  position: number
  wpm: number
  accuracy: number
  progress: number
  isFinished: boolean
}

interface GameStatsProps {
  wpm: number
  accuracy: number
  progress: number
  players: Player[]
  gameStatus: 'waiting' | 'racing' | 'finished'
}

const GameStats = ({ wpm, accuracy, progress, players, gameStatus }: GameStatsProps) => {
  const currentPlayer = players[0]
  const position = players
    .sort((a, b) => b.progress - a.progress)
    .findIndex(p => p.id === currentPlayer?.id) + 1

  const getWpmColor = (wpm: number) => {
    if (wpm >= 80) return 'text-purple-400'
    if (wpm >= 60) return 'text-green-400'
    if (wpm >= 40) return 'text-yellow-400'
    if (wpm >= 20) return 'text-orange-400'
    return 'text-red-400'
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-400'
    if (accuracy >= 85) return 'text-yellow-400'
    if (accuracy >= 75) return 'text-orange-400'
    return 'text-red-400'
  }

  const getPositionColor = (position: number) => {
    if (position === 1) return 'text-yellow-400'
    if (position === 2) return 'text-gray-300'
    if (position === 3) return 'text-amber-600'
    return 'text-slate-400'
  }

  const getWpmRating = (wpm: number) => {
    if (wpm >= 80) return 'Expert'
    if (wpm >= 60) return 'Advanced'
    if (wpm >= 40) return 'Intermediate'
    if (wpm >= 20) return 'Beginner'
    return 'Learning'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* WPM Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-400">Words Per Minute</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${getWpmColor(wpm)}`}>
            {wpm}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {getWpmRating(wpm)}
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                wpm >= 80 ? 'bg-purple-500' :
                wpm >= 60 ? 'bg-green-500' :
                wpm >= 40 ? 'bg-yellow-500' :
                wpm >= 20 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(wpm * 1.25, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Accuracy Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-400">Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${getAccuracyColor(accuracy)}`}>
            {accuracy}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {accuracy >= 95 ? 'Excellent' : accuracy >= 85 ? 'Good' : accuracy >= 75 ? 'Fair' : 'Needs Work'}
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                accuracy >= 95 ? 'bg-green-500' :
                accuracy >= 85 ? 'bg-yellow-500' :
                accuracy >= 75 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Progress Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-400">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-400">
            {Math.round(progress)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Race Completion
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Position Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-400">Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${getPositionColor(position)}`}>
            #{position}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            of {players.length} racers
          </div>
          <div className="mt-3">
            {position === 1 && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">
                🏆 Leading
              </Badge>
            )}
            {position === 2 && (
              <Badge className="bg-gray-500/20 text-gray-300 border-gray-500">
                🥈 2nd Place
              </Badge>
            )}
            {position === 3 && (
              <Badge className="bg-amber-600/20 text-amber-600 border-amber-600">
                🥉 3rd Place
              </Badge>
            )}
            {position > 3 && (
              <Badge variant="outline" className="text-slate-400 border-slate-600">
                Keep Going!
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live Leaderboard */}
      {players.length > 1 && gameStatus === 'racing' && (
        <Card className="bg-slate-800 border-slate-700 md:col-span-2 lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Live Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {players
                .sort((a, b) => b.progress - a.progress)
                .map((player, index) => (
                  <div 
                    key={player.id}
                    className={`p-3 rounded-lg border ${
                      player.id === currentPlayer?.id 
                        ? 'bg-blue-500/10 border-blue-500' 
                        : 'bg-slate-700 border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        index === 2 ? 'text-amber-600' : 'text-slate-400'
                      }`}>
                        #{index + 1}
                      </span>
                      <span className="text-sm text-slate-400">
                        {Math.round(player.progress)}%
                      </span>
                    </div>
                    <div className="text-white font-medium truncate">
                      {player.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {player.wpm} WPM • {player.accuracy}%
                    </div>
                    {player.isFinished && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500 text-xs mt-2">
                        ✓ Finished
                      </Badge>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default GameStats