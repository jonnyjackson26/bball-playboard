import { Action } from '@/types'

export const actions: Action[] = [
  // Offensive Actions
  { type: '2PT_MADE', label: '2PT Made', category: 'offensive', points: 2 },
  { type: '2PT_MISSED', label: '2PT Missed', category: 'offensive' },
  { type: '3PT_MADE', label: '3PT Made', category: 'offensive', points: 3 },
  { type: '3PT_MISSED', label: '3PT Missed', category: 'offensive' },
  { type: 'FREE_THROW_MADE', label: 'Free Throw Made', category: 'offensive', points: 1 },
  { type: 'FREE_THROW_MISSED', label: 'Free Throw Missed', category: 'offensive' },
  { type: 'ASSIST', label: 'Assist', category: 'offensive' },
  { type: 'TURNOVER', label: 'Turnover', category: 'offensive' },
  { type: 'OFFENSIVE_REBOUND', label: 'Offensive Rebound', category: 'offensive' },
  
  // Defensive Actions
  { type: 'DEFENSIVE_REBOUND', label: 'Defensive Rebound', category: 'defensive' },
  { type: 'STEAL', label: 'Steal', category: 'defensive' },
  { type: 'BLOCK', label: 'Block', category: 'defensive' },
  { type: 'FOUL', label: 'Foul', category: 'defensive' },
  { type: 'TECHNICAL_FOUL', label: 'Tech', category: 'defensive' },
  { type: 'FLAGRANT_FOUL', label: 'Flagrant', category: 'defensive' },
]

export const offensiveActions = actions.filter(action => action.category === 'offensive')
export const defensiveActions = actions.filter(action => action.category === 'defensive') 