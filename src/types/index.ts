export interface Player {
  id: string
  name: string
  team: 'home' | 'away'
  position: number // 0-4 for starters, 5+ for bench
  jerseyNumber?: string | number
}

export interface Play {
  id: string
  playerId: string
  playerName: string
  action: string
  timestamp: Date
  team: 'home' | 'away'
  points?: number
}

export interface Game {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  status: 'active' | 'finished'
  createdAt: Date
}

export type ActionType = 
  // Offensive Actions
  | '2PT_MADE' | '2PT_MISSED' | '3PT_MADE' | '3PT_MISSED' 
  | 'FREE_THROW_MADE' | 'FREE_THROW_MISSED' | 'ASSIST' | 'TURNOVER' | 'OFFENSIVE_REBOUND'
  // Defensive Actions
  | 'DEFENSIVE_REBOUND' | 'STEAL' | 'BLOCK' | 'FOUL'
  // Additional Foul Types
  | 'TECHNICAL_FOUL' | 'FLAGRANT_FOUL'

export interface Action {
  type: ActionType
  label: string
  category: 'offensive' | 'defensive'
  points?: number
} 