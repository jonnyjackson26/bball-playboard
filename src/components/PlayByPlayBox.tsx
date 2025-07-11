'use client'

import { Play, Player } from '@/types'
import { useState } from 'react'
import { Edit2, Trash2, BarChart3 } from 'lucide-react'

interface PlayByPlayBoxProps {
  plays: Play[]
  homePlayers: Player[]
  awayPlayers: Player[]
  homeScore: number
  awayScore: number
  onEditPlay?: (playId: string, newPlayerName: string, newAction: string) => void
  onDeletePlay?: (playId: string) => void
  onOpenStats?: () => void
}

export default function PlayByPlayBox({ plays, homePlayers, awayPlayers, onEditPlay, onDeletePlay, onOpenStats }: PlayByPlayBoxProps) {
  const [editingPlayId, setEditingPlayId] = useState<string | null>(null)
  const [editPlayerName, setEditPlayerName] = useState('')
  const [editAction, setEditAction] = useState('')

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

  const formatPlayAction = (action: string, points?: number) => {
    // Remove the "0" suffix for non-scoring plays
    if (points && points > 0) {
      return `${action} +${points}pts`
    }
    return action
  }

  const handleEdit = (play: Play) => {
    setEditingPlayId(play.id)
    setEditPlayerName(play.playerName)
    setEditAction(play.action)
  }

  const handleSaveEdit = () => {
    if (editingPlayId && onEditPlay) {
      onEditPlay(editingPlayId, editPlayerName, editAction)
      setEditingPlayId(null)
      setEditPlayerName('')
      setEditAction('')
    }
  }

  const handleCancelEdit = () => {
    setEditingPlayId(null)
    setEditPlayerName('')
    setEditAction('')
  }

  const handleDelete = (playId: string) => {
    if (onDeletePlay) {
      onDeletePlay(playId)
    }
  }

  // Get all available players
  const allPlayers = [...homePlayers, ...awayPlayers]
  
  // Get all available actions
  const allActions = [
    'FT Made', '2PT Made', '3PT Made',
    'FT Miss', '2PT Miss', '3PT Miss',
    'Assist', 'Turnover', 'O Rebound',
    'D Rebound', 'Steal', 'Block',
    'Foul', 'Tech', 'Flagrant'
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      <div className="p-4 pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Play by Play</h3>
          <button
            onClick={onOpenStats}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span>See All Stats</span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 pb-4">
          {plays.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">🏀</div>
              <div>No plays recorded yet</div>
              <div className="text-sm">Select a player and action to record plays</div>
            </div>
          ) : (
            <div className="space-y-2">
              {plays.map((play, index) => (
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
                  {editingPlayId === play.id ? (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <select
                          value={editPlayerName}
                          onChange={(e) => setEditPlayerName(e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select Player</option>
                          {allPlayers.map(player => (
                            <option key={player.id} value={player.name}>
                              {player.name}
                            </option>
                          ))}
                        </select>
                        <select
                          value={editAction}
                          onChange={(e) => setEditAction(e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select Action</option>
                          {allActions.map(action => (
                            <option key={action} value={action}>
                              {action}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          disabled={!editPlayerName || !editAction}
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{play.playerName}</span>
                          <span className={`font-medium ${getActionColor(play.action)}`}>
                            {formatPlayAction(play.action, play.points)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-gray-500">
                          {formatTime(play.timestamp)}
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEdit(play)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit play"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(play.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete play"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 