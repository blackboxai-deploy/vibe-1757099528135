'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import RaceTrack from '@/components/game/RaceTrack'
import TypingInterface from '@/components/game/TypingInterface'
import GameStats from '@/components/game/GameStats'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

function RaceContent() {
  const searchParams = useSearchParams()
  const mode = searchParams?.get('mode') || 'practice'

interface Player {
  id: string
  name: string
  position: number
  wpm: number
  accuracy: number
  progress: number
  isFinished: boolean
}

interface GameState {
  text: string
  players: Player[]
  gameStatus: 'waiting' | 'racing' | 'finished'
  countdown: number
  raceId: string
}

  const [gameState, setGameState] = useState<GameState>({
    text: '',
    players: [],
    gameStatus: 'waiting',
    countdown: 0,
    raceId: ''
  })

  const [currentInput, setCurrentInput] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [playerProgress, setPlayerProgress] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [ws, setWs] = useState<WebSocket | null>(null)

  // Generate race text
  const generateRaceText = useCallback(() => {
    const texts = [
      "The quick brown fox jumps over the lazy dog. Speed and accuracy are the keys to victory in this thrilling typing race.",
      "Racing through words at lightning speed, fingers dance across the keyboard in perfect harmony with thoughts and dreams.",
      "In the world of competitive typing, every keystroke matters and every second counts toward achieving greatness.",
      "Champions are made not by luck but by dedication, practice, and the relentless pursuit of perfection in every race.",
      "The finish line awaits those brave enough to push their limits and type their way to glory and eternal fame."
    ]
    return texts[Math.floor(Math.random() * texts.length)]
  }, [])

  // Initialize game
  useEffect(() => {
    const raceText = generateRaceText()
    const raceId = Math.random().toString(36).substring(2, 8)
    
    setGameState(prev => ({
      ...prev,
      text: raceText,
      raceId
    }))

    // Add player
    const playerId = Math.random().toString(36).substring(2, 8)
    const playerName = `Player-${playerId.substring(0, 4)}`
    
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      position: 1,
      wpm: 0,
      accuracy: 100,
      progress: 0,
      isFinished: false
    }

    // Add AI opponents for practice mode
    let allPlayers = [newPlayer]
    if (mode === 'practice') {
      const aiPlayers: Player[] = [
        { id: 'ai1', name: 'SpeedBot', position: 2, wpm: 0, accuracy: 100, progress: 0, isFinished: false },
        { id: 'ai2', name: 'TypeMaster', position: 3, wpm: 0, accuracy: 100, progress: 0, isFinished: false },
        { id: 'ai3', name: 'KeyboardKing', position: 4, wpm: 0, accuracy: 100, progress: 0, isFinished: false }
      ]
      allPlayers = [...allPlayers, ...aiPlayers]
    }

    setGameState(prev => ({
      ...prev,
      players: allPlayers
    }))

    // Start countdown
    startCountdown()
  }, [mode, generateRaceText])

  const startCountdown = () => {
    setGameState(prev => ({ ...prev, countdown: 3 }))
    
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.countdown > 1) {
          return { ...prev, countdown: prev.countdown - 1 }
        } else {
          clearInterval(interval)
          return { ...prev, gameStatus: 'racing', countdown: 0 }
        }
      })
    }, 1000)
  }

  // Handle typing input
  const handleInputChange = (value: string) => {
    if (gameState.gameStatus !== 'racing') return
    
    if (!startTime) {
      setStartTime(Date.now())
    }

    setCurrentInput(value)
    
    const newIndex = value.length
    setCurrentIndex(newIndex)
    
    // Calculate progress
    const progress = Math.min((newIndex / gameState.text.length) * 100, 100)
    setPlayerProgress(progress)
    
    // Calculate WPM
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60 // minutes
      const wordsTyped = value.trim().split(' ').length
      const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0
      setWpm(currentWpm)
    }
    
    // Calculate accuracy
    let correctChars = 0
    for (let i = 0; i < Math.min(value.length, gameState.text.length); i++) {
      if (value[i] === gameState.text[i]) {
        correctChars++
      }
    }
    const newAccuracy = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100
    setAccuracy(newAccuracy)
    
    // Check if finished
    if (value === gameState.text) {
      setIsFinished(true)
      setGameState(prev => ({ ...prev, gameStatus: 'finished' }))
    }

    // Update player in game state
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => 
        player.id === prev.players[0]?.id 
          ? { ...player, wpm: wpm, accuracy: newAccuracy, progress, isFinished: value === gameState.text }
          : player
      )
    }))
  }

  // Simulate AI players (practice mode)
  useEffect(() => {
    if (mode === 'practice' && gameState.gameStatus === 'racing') {
      const interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          players: prev.players.map(player => {
            if (player.id.startsWith('ai') && !player.isFinished) {
              const speed = player.id === 'ai1' ? 0.4 : player.id === 'ai2' ? 0.6 : 0.5
              const newProgress = Math.min(player.progress + speed, 100)
              const aiWpm = Math.round(45 + Math.random() * 20)
              const aiAccuracy = Math.round(92 + Math.random() * 7)
              
              return {
                ...player,
                progress: newProgress,
                wpm: aiWpm,
                accuracy: aiAccuracy,
                isFinished: newProgress >= 100
              }
            }
            return player
          })
        }))
      }, 100)

      return () => clearInterval(interval)
    }
  }, [mode, gameState.gameStatus])

  const restartRace = () => {
    setCurrentInput('')
    setCurrentIndex(0)
    setStartTime(null)
    setWpm(0)
    setAccuracy(100)
    setPlayerProgress(0)
    setIsFinished(false)
    
    const newText = generateRaceText()
    setGameState(prev => ({
      ...prev,
      text: newText,
      gameStatus: 'waiting',
      players: prev.players.map(player => ({
        ...player,
        progress: 0,
        wpm: 0,
        accuracy: 100,
        isFinished: false
      }))
    }))
    
    startCountdown()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">TypeSpeed Racer</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {mode === 'practice' ? '🏁 Practice Mode' : mode === 'multiplayer' ? '🌐 Multiplayer' : '🏆 Tournament'}
              </Badge>
              <Badge variant="outline" className="text-green-400 border-green-400">
                Race ID: {gameState.raceId}
              </Badge>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
              ← Back to Menu
            </Button>
          </Link>
        </div>

        {/* Countdown */}
        {gameState.gameStatus === 'waiting' && gameState.countdown > 0 && (
          <div className="text-center mb-8">
            <div className="text-8xl font-bold text-yellow-400 animate-pulse">
              {gameState.countdown}
            </div>
            <p className="text-xl text-white mt-4">Get ready to race!</p>
          </div>
        )}

        {/* Race Track */}
        <div className="mb-6">
          <RaceTrack players={gameState.players} />
        </div>

        {/* Game Stats */}
        <div className="mb-6">
          <GameStats 
            wpm={wpm}
            accuracy={accuracy}
            progress={playerProgress}
            players={gameState.players}
            gameStatus={gameState.gameStatus}
          />
        </div>

        {/* Typing Interface */}
        <div className="mb-6">
          <TypingInterface
            text={gameState.text}
            currentInput={currentInput}
            currentIndex={currentIndex}
            onInputChange={handleInputChange}
            disabled={gameState.gameStatus !== 'racing'}
            isFinished={isFinished}
          />
        </div>

        {/* Game Over */}
        {gameState.gameStatus === 'finished' && (
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-yellow-400">
                🏁 Race Finished!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-green-400">{wpm}</p>
                  <p className="text-sm text-slate-400">WPM</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">{accuracy}%</p>
                  <p className="text-sm text-slate-400">Accuracy</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">
                    {gameState.players.findIndex(p => p.id === gameState.players[0]?.id) + 1}
                  </p>
                  <p className="text-sm text-slate-400">Position</p>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button onClick={restartRace} className="bg-green-500 hover:bg-green-600">
                  Race Again
                </Button>
                <Link href="/">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Back to Menu
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function RacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white text-xl">Loading...</div>}>
      <RaceContent />
    </Suspense>
  )
}