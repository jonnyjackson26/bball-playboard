'use client'

import { Player } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

interface PlayerCardProps {
  player: Player
  isSelected: boolean
  onSelect: (player: Player) => void
}

export default function PlayerCard({ player, isSelected, onSelect }: PlayerCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: player.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        p-2 mb-1 rounded-lg border-2 flex items-center cursor-pointer select-none
        ${isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
        transition-all duration-200
      `}
      onClick={() => onSelect(player)}
      tabIndex={0}
      role="button"
    >
      {/* Drag handle */}
      <span
        {...attributes}
        {...listeners}
        onClick={e => e.stopPropagation()}
        className="mr-2 flex items-center cursor-grab active:cursor-grabbing"
        tabIndex={-1}
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </span>
      <div className="flex-1 flex items-center justify-between">
        <div>
          <div className="font-semibold text-gray-900 text-sm">{player.name}</div>
        </div>
        <div className="text-sm font-medium text-gray-600">
          #{player.jerseyNumber}
        </div>
      </div>
    </div>
  )
} 