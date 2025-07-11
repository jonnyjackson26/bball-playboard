'use client'

import { Play } from '@/types'

interface PlayByPlayBoxProps {
  plays: Play[]
}

export default function PlayByPlayBox({ plays }: PlayByPlayBoxProps) {
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  const getActionColor = (action: string) => {
    if (action.includes('MADE')) return 'text-green-600'
    if (action.includes('MISSED')) return 'text-red-600'
    if (action.includes('ASSIST')) return 'text-blue-600'
    if (action.includes('TURNOVER')) return 'text-red-600'
    if (action.includes('REBOUND')) return 'text-orange-600'
    if (action.includes('STEAL')) return 'text-purple-600'
    if (action.includes('BLOCK')) return 'text-yellow-600'
    if (action.includes('FOUL')) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col flex-1 min-h-0 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Play by Play</h3>
      <div className="space-y-2 flex-1 min-h-0 overflow-y-auto">
        {plays.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">🏀</div>
            <div>No plays recorded yet</div>
            <div className="text-sm">Select a player and action to record plays</div>
          </div>
        ) : (
          plays.map((play, index) => (
            <div
              key={play.id}
              className={`
                p-3 rounded-lg border-l-4 transition-all duration-200
                ${index === 0 
                  ? 'border-l-blue-500 bg-blue-50' 
                  : 'border-l-gray-300 bg-gray-50'
                }
                ${play.team === 'home' ? 'border-r-4 border-r-blue-200' : 'border-r-4 border-r-red-200'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{play.playerName}</span>
                    <span className={`font-medium ${getActionColor(play.action)}`}>
                      {play.action}
                    </span>
                    {play.points && (
                      <span className="text-green-600 font-bold">+{play.points}pts</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {formatTime(play.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 