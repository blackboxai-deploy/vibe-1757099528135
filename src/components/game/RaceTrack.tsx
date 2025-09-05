'use client'

interface Player {
  id: string
  name: string
  position: number
  wpm: number
  accuracy: number
  progress: number
  isFinished: boolean
}

interface RaceTrackProps {
  players: Player[]
}

const RaceTrack = ({ players }: RaceTrackProps) => {
  const trackWidth = 800
  const trackHeight = 200
  const laneHeight = trackHeight / Math.max(players.length, 4)

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Race Track</h3>
        <div className="text-sm text-slate-400">🏁 Finish Line</div>
      </div>
      
      <div className="relative bg-slate-900 rounded-lg p-4 overflow-x-auto">
        <svg 
          width={trackWidth} 
          height={trackHeight}
          className="w-full"
          viewBox={`0 0 ${trackWidth} ${trackHeight}`}
        >
          {/* Track lanes */}
          {players.map((player, index) => {
            const laneY = index * laneHeight
            const carX = (player.progress / 100) * (trackWidth - 60)
            const carColor = player.id.startsWith('ai') 
              ? ['#ef4444', '#f59e0b', '#10b981'][index % 3] 
              : '#3b82f6'
            
            return (
              <g key={player.id}>
                {/* Lane background */}
                <rect
                  x="0"
                  y={laneY}
                  width={trackWidth}
                  height={laneHeight}
                  fill={index % 2 === 0 ? '#1e293b' : '#0f172a'}
                  stroke="#475569"
                  strokeWidth="1"
                />
                
                {/* Lane dividers */}
                <line
                  x1="0"
                  y1={laneY}
                  x2={trackWidth}
                  y2={laneY}
                  stroke="#475569"
                  strokeWidth="1"
                  strokeDasharray="10,5"
                />
                
                {/* Finish line */}
                <rect
                  x={trackWidth - 20}
                  y={laneY}
                  width="20"
                  height={laneHeight}
                  fill="#ffffff"
                  opacity="0.8"
                />
                <rect
                  x={trackWidth - 20}
                  y={laneY}
                  width="10"
                  height={laneHeight / 2}
                  fill="#000000"
                />
                <rect
                  x={trackWidth - 10}
                  y={laneY + laneHeight / 2}
                  width="10"
                  height={laneHeight / 2}
                  fill="#000000"
                />
                
                {/* Car */}
                <g transform={`translate(${carX}, ${laneY + 10})`}>
                  {/* Car body */}
                  <rect
                    x="0"
                    y="0"
                    width="50"
                    height={laneHeight - 20}
                    rx="5"
                    fill={carColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  
                  {/* Car windows */}
                  <rect
                    x="8"
                    y="5"
                    width="34"
                    height={laneHeight - 30}
                    rx="3"
                    fill="#87ceeb"
                    opacity="0.7"
                  />
                  
                  {/* Car wheels */}
                  <circle
                    cx="12"
                    cy={laneHeight - 15}
                    r="6"
                    fill="#2d3748"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle
                    cx="38"
                    cy={laneHeight - 15}
                    r="6"
                    fill="#2d3748"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  
                  {/* Speed lines (when moving fast) */}
                  {player.wpm > 40 && (
                    <>
                      <line x1="-10" y1="10" x2="-5" y2="10" stroke="#ffff00" strokeWidth="2" opacity="0.8" />
                      <line x1="-12" y1="15" x2="-7" y2="15" stroke="#ffff00" strokeWidth="2" opacity="0.6" />
                      <line x1="-8" y1="20" x2="-3" y2="20" stroke="#ffff00" strokeWidth="2" opacity="0.4" />
                    </>
                  )}
                  
                  {/* Victory animation */}
                  {player.isFinished && (
                    <>
                      <circle cx="25" cy="-10" r="3" fill="#ffd700" opacity="0.8">
                        <animate attributeName="r" values="3;8;3" dur="1s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="15" cy="-15" r="2" fill="#ffd700" opacity="0.6">
                        <animate attributeName="r" values="2;6;2" dur="1.2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="35" cy="-12" r="2" fill="#ffd700" opacity="0.7">
                        <animate attributeName="r" values="2;7;2" dur="0.8s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                </g>
                
                {/* Player info */}
                <text
                  x="5"
                  y={laneY + laneHeight - 5}
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {player.name}
                </text>
                
                <text
                  x={trackWidth - 150}
                  y={laneY + 15}
                  fill="#ffffff"
                  fontSize="10"
                >
                  {player.wpm} WPM | {player.accuracy}%
                </text>
              </g>
            )
          })}
          
          {/* Track border */}
          <rect
            x="0"
            y="0"
            width={trackWidth}
            height={trackHeight}
            fill="none"
            stroke="#475569"
            strokeWidth="2"
          />
        </svg>
      </div>
      
      {/* Position indicator */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {players
          .sort((a, b) => b.progress - a.progress)
          .map((player, index) => (
            <div 
              key={player.id} 
              className={`text-center p-2 rounded ${
                index === 0 ? 'bg-yellow-500/20 border border-yellow-500' : 'bg-slate-700'
              }`}
            >
              <div className={`text-lg font-bold ${index === 0 ? 'text-yellow-400' : 'text-white'}`}>
                #{index + 1}
              </div>
              <div className="text-sm text-slate-300">{player.name}</div>
              <div className="text-xs text-slate-400">{Math.round(player.progress)}%</div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default RaceTrack