'use client'

import { Player } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface PlayerCardProps {
  player: Player
  isSelected: boolean
  onSelect: (player: Player) => void
  onEdit?: (playerId: string, name: string, jerseyNumber?: string | number) => void
  onDelete?: (playerId: string) => void
}

export default function PlayerCard({ player, isSelected, onSelect, onEdit, onDelete }: PlayerCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(player.name)
  const [editJerseyNumber, setEditJerseyNumber] = useState(player.jerseyNumber?.toString() || '')

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

  const formatJerseyNumber = (jerseyNumber?: string | number) => {
    if (!jerseyNumber) return null
    if (typeof jerseyNumber === 'number') {
      return `#${jerseyNumber}`
    }
    // For string jersey numbers, check if it's numeric
    const numValue = parseInt(jerseyNumber)
    if (!isNaN(numValue)) {
      return `#${jerseyNumber}`
    }
    // For non-numeric strings, don't add hashtag
    return jerseyNumber
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(player.id, editName, editJerseyNumber || undefined)
      setIsEditing(false)
      setShowMenu(false)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      const confirmed = window.confirm(`Are you sure you want to delete ${player.name}?`)
      if (confirmed) {
        onDelete(player.id)
        setShowMenu(false)
      }
    }
  }

  const handleCancelEdit = () => {
    setEditName(player.name)
    setEditJerseyNumber(player.jerseyNumber?.toString() || '')
    setIsEditing(false)
    setShowMenu(false)
  }

  const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setShowMenu(true)
    setMenuPosition({ x: event.clientX, y: event.clientY })
  }

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="p-2 mb-1 rounded-lg border-2 border-blue-300 bg-blue-50"
      >
        <div className="space-y-2">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Player name"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEdit()
              if (e.key === 'Escape') handleCancelEdit()
            }}
          />
          <input
            type="text"
            value={editJerseyNumber}
            onChange={(e) => setEditJerseyNumber(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Jersey number (optional)"
            maxLength={6}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEdit()
              if (e.key === 'Escape') handleCancelEdit()
            }}
          />
          <div className="flex space-x-1">
            <button
              onClick={handleEdit}
              disabled={!editName.trim()}
              className="flex-1 px-2 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        p-2 mb-1 rounded-lg border-2 flex items-center cursor-pointer select-none group
        ${isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
        transition-all duration-200
      `}
      onClick={() => onSelect(player)}
      tabIndex={0}
      role="button"
      onContextMenu={handleContextMenu}
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
        <div className="flex items-center space-x-2">
          <div className="font-semibold text-gray-900 text-sm">{player.name}</div>
        </div>
        {player.jerseyNumber && (
          <div className="text-sm font-medium text-gray-600">
            {formatJerseyNumber(player.jerseyNumber)}
          </div>
        )}
      </div>
      
      {/* Context menu opened via right-click */}
      {showMenu && menuPosition && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div
            className="fixed z-50 w-36 bg-white border border-gray-200 rounded-lg shadow-lg"
            style={{ left: menuPosition.x + 2, top: menuPosition.y + 2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
                setShowMenu(false)
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Edit className="w-3 h-3" />
              <span>Edit</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(false)
                handleDelete()
              }}
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
} 