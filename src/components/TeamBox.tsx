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
  onAddPlayer: () => void
}

const PLAYER_CARD_HEIGHT = 56; // px, adjust if needed for your PlayerCard
const DIVIDER_HEIGHT = 32; // px, adjust for divider
const VISIBLE_CARDS = 5;

export default function TeamBox({ 
  teamName, 
  players, 
  selectedPlayer, 
  onPlayerSelect, 
  onPlayersReorder,
  onAddPlayer 
}: TeamBoxProps) {
  const [localPlayers, setLocalPlayers] = useState(players)

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

  // Combine starters and bench, but keep divider after 5th
  const sortedPlayers = [...localPlayers].sort((a, b) => a.position - b.position)
  const showDivider = sortedPlayers.length > 5

  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      <div className="p-4 pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 truncate">{teamName}</h2>
          <button
            onClick={onAddPlayer}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            + Add Player
          </button>
        </div>
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