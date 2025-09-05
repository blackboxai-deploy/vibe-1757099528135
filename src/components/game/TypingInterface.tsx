'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface TypingInterfaceProps {
  text: string
  currentInput: string
  currentIndex: number
  onInputChange: (value: string) => void
  disabled: boolean
  isFinished: boolean
}

const TypingInterface = ({ 
  text, 
  currentInput, 
  currentIndex, 
  onInputChange, 
  disabled, 
  isFinished 
}: TypingInterfaceProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled && !isFinished) {
      inputRef.current?.focus()
    }
  }, [disabled, isFinished])

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = 'text-lg font-mono '
      
      if (index < currentInput.length) {
        // Already typed
        if (currentInput[index] === char) {
          className += 'text-green-400 bg-green-400/10'
        } else {
          className += 'text-red-400 bg-red-400/10'
        }
      } else if (index === currentInput.length) {
        // Current character to type
        className += 'text-white bg-blue-500 animate-pulse'
      } else {
        // Not yet typed
        className += 'text-slate-400'
      }
      
      return (
        <span key={index} className={className}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      )
    })
  }

  const getCompletionPercentage = () => {
    return Math.round((currentInput.length / text.length) * 100)
  }

  const getErrorCount = () => {
    let errors = 0
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] !== text[i]) {
        errors++
      }
    }
    return errors
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex justify-between items-center">
          <span>Type the text below</span>
          <div className="flex space-x-4 text-sm">
            <span className="text-blue-400">{getCompletionPercentage()}% Complete</span>
            <span className="text-red-400">{getErrorCount()} Errors</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>

        {/* Text display */}
        <div 
          className={`p-6 bg-slate-900 rounded-lg border-2 min-h-[120px] leading-7 ${
            isFocused ? 'border-blue-500' : 'border-slate-600'
          }`}
          onClick={() => inputRef.current?.focus()}
        >
          {renderText()}
        </div>

        {/* Input field */}
        <div className="relative">
          <Input
            ref={inputRef}
            value={currentInput}
            onChange={(e) => onInputChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled || isFinished}
            placeholder={disabled ? 'Wait for the race to start...' : 'Start typing here...'}
            className="bg-slate-700 border-slate-600 text-white text-lg font-mono p-4 focus:border-blue-500"
            autoComplete="off"
            spellCheck={false}
          />
          
          {/* Typing indicator */}
          {!disabled && !isFinished && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-6 bg-blue-500 animate-pulse rounded" />
            </div>
          )}
        </div>

        {/* Completion message */}
        {isFinished && (
          <div className="text-center p-4 bg-green-500/10 border border-green-500 rounded-lg">
            <div className="text-2xl text-green-400 font-bold mb-2">🎉 Congratulations!</div>
            <div className="text-green-300">You completed the race!</div>
          </div>
        )}

        {/* Instructions */}
        {disabled && !isFinished && (
          <div className="text-center text-slate-400 text-sm">
            Wait for the countdown to finish, then start typing to race!
          </div>
        )}

        {/* Typing tips */}
        {!disabled && !isFinished && currentInput.length === 0 && (
          <div className="text-slate-400 text-sm">
            <strong>Tips:</strong> Focus on accuracy first, speed will come naturally. 
            Use all your fingers and maintain proper posture.
          </div>
        )}

        {/* Real-time stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-700 rounded p-3">
            <div className="text-2xl font-bold text-blue-400">{currentInput.length}</div>
            <div className="text-xs text-slate-400">Characters</div>
          </div>
          <div className="bg-slate-700 rounded p-3">
            <div className="text-2xl font-bold text-green-400">
              {Math.max(0, currentInput.length - getErrorCount())}
            </div>
            <div className="text-xs text-slate-400">Correct</div>
          </div>
          <div className="bg-slate-700 rounded p-3">
            <div className="text-2xl font-bold text-red-400">{getErrorCount()}</div>
            <div className="text-xs text-slate-400">Errors</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TypingInterface