'use client'

import { Action } from '@/types'
import { offensiveActions, defensiveActions } from '@/data/actions'

interface ActionBoxProps {
  selectedPlayer: any
  onActionClick: (action: Action) => void
}

export default function ActionBox({ selectedPlayer, onActionClick }: ActionBoxProps) {
  const isDisabled = !selectedPlayer

  const ActionButton = ({ action, tooltip }: { action: Action, tooltip: string }) => (
    <button
      onClick={() => onActionClick(action)}
      disabled={isDisabled}
      title={tooltip}
      className={`
        px-3 py-2 rounded-md font-medium text-sm transition-all duration-200
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

  // Define the new action layout with tooltips
  const actionLayout = [
    [
      { action: offensiveActions.find(a => a.type === 'FREE_THROW_MADE')!, tooltip: 'Free Throw Made' },
      { action: offensiveActions.find(a => a.type === '2PT_MADE')!, tooltip: '2-Pointer Made' },
      { action: offensiveActions.find(a => a.type === '3PT_MADE')!, tooltip: '3-Pointer Made' }
    ],
    [
      { action: offensiveActions.find(a => a.type === 'FREE_THROW_MISSED')!, tooltip: 'Free Throw Missed' },
      { action: offensiveActions.find(a => a.type === '2PT_MISSED')!, tooltip: '2-Pointer Missed' },
      { action: offensiveActions.find(a => a.type === '3PT_MISSED')!, tooltip: '3-Pointer Missed' }
    ],
    [
      { action: offensiveActions.find(a => a.type === 'ASSIST')!, tooltip: 'Assist' },
      { action: offensiveActions.find(a => a.type === 'TURNOVER')!, tooltip: 'Turnover' },
      { action: offensiveActions.find(a => a.type === 'OFFENSIVE_REBOUND')!, tooltip: 'Offensive Rebound' }
    ],
    [
      { action: defensiveActions.find(a => a.type === 'DEFENSIVE_REBOUND')!, tooltip: 'Defensive Rebound' },
      { action: defensiveActions.find(a => a.type === 'STEAL')!, tooltip: 'Steal' },
      { action: defensiveActions.find(a => a.type === 'BLOCK')!, tooltip: 'Block' }
    ],
    [
      { action: defensiveActions.find(a => a.type === 'FOUL')!, tooltip: 'Foul' },
      { action: { type: 'TECHNICAL_FOUL', label: 'Tech', category: 'defensive' }, tooltip: 'Technical Foul' },
      { action: { type: 'FLAGRANT_FOUL', label: 'Flagrant', category: 'defensive' }, tooltip: 'Flagrant Foul' }
    ]
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="space-y-3">
        {actionLayout.map((row, rowIndex) => (
          <div key={rowIndex}>
            {rowIndex === 3 && (
              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              {row.map(({ action, tooltip }) => (
                <ActionButton key={action.type} action={action} tooltip={tooltip} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {isDisabled && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Select a player to enable actions
        </div>
      )}
    </div>
  )
} 