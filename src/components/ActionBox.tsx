'use client'

import { Action } from '@/types'
import { offensiveActions, defensiveActions } from '@/data/actions'

interface ActionBoxProps {
  selectedPlayer: any
  onActionClick: (action: Action) => void
}

export default function ActionBox({ selectedPlayer, onActionClick }: ActionBoxProps) {
  const isDisabled = !selectedPlayer

  const ActionButton = ({ action }: { action: Action }) => (
    <button
      onClick={() => onActionClick(action)}
      disabled={isDisabled}
      className={`
        px-4 py-2 rounded-md font-medium text-sm transition-all duration-200
        ${isDisabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : action.category === 'offensive'
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }
      `}
    >
      {action.label}
    </button>
  )

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
      
      {/* Offensive Actions */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          Offensive Actions
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {offensiveActions.map((action) => (
            <ActionButton key={action.type} action={action} />
          ))}
        </div>
      </div>

      {/* Defensive Actions */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          Defensive Actions
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {defensiveActions.map((action) => (
            <ActionButton key={action.type} action={action} />
          ))}
        </div>
      </div>

      {isDisabled && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Select a player to enable actions
        </div>
      )}
    </div>
  )
} 