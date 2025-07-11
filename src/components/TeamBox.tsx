'use client'

import { Player } from '@/types'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState, useEffect } from 'react'
import PlayerCard from './PlayerCard'

interface TeamBoxProps {
  teamName: string
  players: Player[]
  selectedPlayer: Player | null
  onPlayerSelect: (player: Player) => void
  onPlayersReorder: (players: Player[]) => void
  onAddPlayer: (name: string, jerseyNumber?: string | number) => void
  onEditPlayer?: (playerId: string, name: string, jerseyNumber?: string | number) => void
  onDeletePlayer?: (playerId: string) => void
}

const DIVIDER_HEIGHT = 32; // px, adjust for divider

export default function TeamBox({ 
  teamName, 
  players, 
  selectedPlayer, 
  onPlayerSelect, 
  onPlayersReorder,
  onAddPlayer,
  onEditPlayer,
  onDeletePlayer
}: TeamBoxProps) {
  const [localPlayers, setLocalPlayers] = useState(players)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newPlayerNumber, setNewPlayerNumber] = useState('')

  useEffect(() => {
    setLocalPlayers(players)
  }, [players])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = localPlayers.findIndex(p => p.id === active.id)
      const newIndex = localPlayers.findIndex(p => p.id === over?.id)
      const newPlayers = [...localPlayers]
      const [movedPlayer] = newPlayers.splice(oldIndex, 1)
      newPlayers.splice(newIndex, 0, movedPlayer)
      const updatedPlayers = newPlayers.map((player, index) => ({
        ...player,
        position: index
      }))
      setLocalPlayers(updatedPlayers)
      onPlayersReorder(updatedPlayers)
    }
  }

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      const jerseyNumber = newPlayerNumber.trim() || undefined
      onAddPlayer(newPlayerName.trim(), jerseyNumber)
      setNewPlayerName('')
      setNewPlayerNumber('')
      setShowAddForm(false)
    }
  }

  const handleCancelAdd = () => {
    setNewPlayerName('')
    setNewPlayerNumber('')
    setShowAddForm(false)
  }

  // Combine starters and bench, but keep divider after 5th
  const sortedPlayers = [...localPlayers].sort((a, b) => a.position - b.position)
  const showDivider = sortedPlayers.length > 5

  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      <div className="p-4 pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 truncate">{teamName}</h2>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              + Add Player
            </button>
          )}
        </div>
        
        {/* Add Player Form */}
        {showAddForm && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-3">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Player Name
                </label>
                <input
                  id="playerName"
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Enter player name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddPlayer()
                    if (e.key === 'Escape') handleCancelAdd()
                  }}
                />
              </div>
              <div>
                <label htmlFor="jerseyNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Jersey Number (Optional)
                </label>
                <input
                  id="jerseyNumber"
                  type="text"
                  maxLength={6}
                  value={newPlayerNumber}
                  onChange={(e) => setNewPlayerNumber(e.target.value)}
                  placeholder="e.g., 23, 00, 1A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddPlayer()
                    if (e.key === 'Escape') handleCancelAdd()
                  }}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddPlayer}
                  disabled={!newPlayerName.trim()}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Add Player
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sortedPlayers.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="h-full overflow-y-auto px-4 pb-4">
              {sortedPlayers.map((player, idx) => (
                <div key={player.id + (showDivider && idx === 4 ? '-with-divider' : '')}>
                  <PlayerCard
                    player={player}
                    isSelected={selectedPlayer?.id === player.id}
                    onSelect={onPlayerSelect}
                    onEdit={onEditPlayer}
                    onDelete={onDeletePlayer}
                  />
                  {/* Divider after 5th card if there are more */}
                  {showDivider && idx === 4 && (
                    <div className="flex items-center my-2" style={{ height: DIVIDER_HEIGHT }}>
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="px-3 text-sm text-gray-500 font-medium">BENCH</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
} 