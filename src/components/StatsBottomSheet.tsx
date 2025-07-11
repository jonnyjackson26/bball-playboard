'use client'

import { useState, useEffect } from 'react'
import { Play, Player } from '@/types'
import { X, TrendingUp, Target, Trophy, Users, BarChart3, Zap, Award } from 'lucide-react'

interface StatsBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  plays: Play[]
  homePlayers: Player[]
  awayPlayers: Player[]
  homeScore: number
  awayScore: number
}

interface PlayerStats {
  player: Player
  points: number
  fieldGoalsMade: number
  fieldGoalsAttempted: number
  threePointersMade: number
  threePointersAttempted: number
  freeThrowsMade: number
  freeThrowsAttempted: number
  assists: number
  rebounds: number
  steals: number
  blocks: number
  turnovers: number
  fouls: number
}

interface TeamStats {
  team: 'home' | 'away'
  players: Player[]
  totalPoints: number
  fieldGoalPercentage: number
  threePointPercentage: number
  freeThrowPercentage: number
  totalRebounds: number
  totalAssists: number
  totalSteals: number
  totalBlocks: number
  totalTurnovers: number
  totalFouls: number
}

export default function StatsBottomSheet({ 
  isOpen, 
  onClose, 
  plays, 
  homePlayers, 
  awayPlayers, 
  homeScore, 
  awayScore 
}: StatsBottomSheetProps) {
  const [activeTab, setActiveTab] = useState<'box-score' | 'shooting' | 'top-performers' | 'team-stats'>('box-score')
  const [isVisible, setIsVisible] = useState(false)

  // Handle ESC key to close bottom sheet
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      setIsVisible(true)
      document.addEventListener('keydown', handleEscKey)
      // Prevent body scroll when bottom sheet is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300) // Match the transition duration
  }

  // Calculate player statistics
  const calculatePlayerStats = (): PlayerStats[] => {
    const allPlayers = [...homePlayers, ...awayPlayers]
    const playerStatsMap = new Map<string, PlayerStats>()

    // Initialize stats for all players
    allPlayers.forEach(player => {
      playerStatsMap.set(player.id, {
        player,
        points: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        threePointersMade: 0,
        threePointersAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0
      })
    })

    // Calculate stats from plays
    plays.forEach(play => {
      const stats = playerStatsMap.get(play.playerId)
      if (!stats) return

      if (play.action.includes('2PT Made')) {
        stats.points += 2
        stats.fieldGoalsMade += 1
        stats.fieldGoalsAttempted += 1
      } else if (play.action.includes('3PT Made')) {
        stats.points += 3
        stats.fieldGoalsMade += 1
        stats.fieldGoalsAttempted += 1
        stats.threePointersMade += 1
        stats.threePointersAttempted += 1
      } else if (play.action.includes('FT Made')) {
        stats.points += 1
        stats.freeThrowsMade += 1
        stats.freeThrowsAttempted += 1
      } else if (play.action.includes('2PT Miss')) {
        stats.fieldGoalsAttempted += 1
      } else if (play.action.includes('3PT Miss')) {
        stats.fieldGoalsAttempted += 1
        stats.threePointersAttempted += 1
      } else if (play.action.includes('FT Miss')) {
        stats.freeThrowsAttempted += 1
      } else if (play.action.includes('Assist')) {
        stats.assists += 1
      } else if (play.action.includes('O Rebound') || play.action.includes('D Rebound')) {
        stats.rebounds += 1
      } else if (play.action.includes('Steal')) {
        stats.steals += 1
      } else if (play.action.includes('Block')) {
        stats.blocks += 1
      } else if (play.action.includes('Turnover')) {
        stats.turnovers += 1
      } else if (play.action.includes('Foul')) {
        stats.fouls += 1
      }
    })

    return Array.from(playerStatsMap.values())
  }

  // Calculate team statistics
  const calculateTeamStats = (): TeamStats[] => {
    const homeStats: TeamStats = {
      team: 'home',
      players: homePlayers,
      totalPoints: homeScore,
      fieldGoalPercentage: 0,
      threePointPercentage: 0,
      freeThrowPercentage: 0,
      totalRebounds: 0,
      totalAssists: 0,
      totalSteals: 0,
      totalBlocks: 0,
      totalTurnovers: 0,
      totalFouls: 0
    }

    const awayStats: TeamStats = {
      team: 'away',
      players: awayPlayers,
      totalPoints: awayScore,
      fieldGoalPercentage: 0,
      threePointPercentage: 0,
      freeThrowPercentage: 0,
      totalRebounds: 0,
      totalAssists: 0,
      totalSteals: 0,
      totalBlocks: 0,
      totalTurnovers: 0,
      totalFouls: 0
    }

    const playerStats = calculatePlayerStats()
    
    playerStats.forEach(stat => {
      if (stat.player.team === 'home') {
        homeStats.totalRebounds += stat.rebounds
        homeStats.totalAssists += stat.assists
        homeStats.totalSteals += stat.steals
        homeStats.totalBlocks += stat.blocks
        homeStats.totalTurnovers += stat.turnovers
        homeStats.totalFouls += stat.fouls
      } else {
        awayStats.totalRebounds += stat.rebounds
        awayStats.totalAssists += stat.assists
        awayStats.totalSteals += stat.steals
        awayStats.totalBlocks += stat.blocks
        awayStats.totalTurnovers += stat.turnovers
        awayStats.totalFouls += stat.fouls
      }
    })

    // Calculate percentages
    const homePlayerStats = playerStats.filter(stat => stat.player.team === 'home')
    const awayPlayerStats = playerStats.filter(stat => stat.player.team === 'away')

    const homeTotalFGA = homePlayerStats.reduce((sum, stat) => sum + stat.fieldGoalsAttempted, 0)
    const homeTotalFGM = homePlayerStats.reduce((sum, stat) => sum + stat.fieldGoalsMade, 0)
    const homeTotal3PA = homePlayerStats.reduce((sum, stat) => sum + stat.threePointersAttempted, 0)
    const homeTotal3PM = homePlayerStats.reduce((sum, stat) => sum + stat.threePointersMade, 0)
    const homeTotalFTA = homePlayerStats.reduce((sum, stat) => sum + stat.freeThrowsAttempted, 0)
    const homeTotalFTM = homePlayerStats.reduce((sum, stat) => sum + stat.freeThrowsMade, 0)

    const awayTotalFGA = awayPlayerStats.reduce((sum, stat) => sum + stat.fieldGoalsAttempted, 0)
    const awayTotalFGM = awayPlayerStats.reduce((sum, stat) => sum + stat.fieldGoalsMade, 0)
    const awayTotal3PA = awayPlayerStats.reduce((sum, stat) => sum + stat.threePointersAttempted, 0)
    const awayTotal3PM = awayPlayerStats.reduce((sum, stat) => sum + stat.threePointersMade, 0)
    const awayTotalFTA = awayPlayerStats.reduce((sum, stat) => sum + stat.freeThrowsAttempted, 0)
    const awayTotalFTM = awayPlayerStats.reduce((sum, stat) => sum + stat.freeThrowsMade, 0)

    homeStats.fieldGoalPercentage = homeTotalFGA > 0 ? (homeTotalFGM / homeTotalFGA) * 100 : 0
    homeStats.threePointPercentage = homeTotal3PA > 0 ? (homeTotal3PM / homeTotal3PA) * 100 : 0
    homeStats.freeThrowPercentage = homeTotalFTA > 0 ? (homeTotalFTM / homeTotalFTA) * 100 : 0

    awayStats.fieldGoalPercentage = awayTotalFGA > 0 ? (awayTotalFGM / awayTotalFGA) * 100 : 0
    awayStats.threePointPercentage = awayTotal3PA > 0 ? (awayTotal3PM / awayTotal3PA) * 100 : 0
    awayStats.freeThrowPercentage = awayTotalFTA > 0 ? (awayTotalFTM / awayTotalFTA) * 100 : 0

    return [homeStats, awayStats]
  }

  const playerStats = calculatePlayerStats()
  const teamStats = calculateTeamStats()

  // Get top performers
  const topScorers = [...playerStats].sort((a, b) => b.points - a.points).slice(0, 5)
  const topAssists = [...playerStats].sort((a, b) => b.assists - a.assists).slice(0, 5)
  const topRebounders = [...playerStats].sort((a, b) => b.rebounds - a.rebounds).slice(0, 5)

  const formatPercentage = (value: number) => {
    return value > 0 ? `${value.toFixed(1)}%` : '0.0%'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end pointer-events-none">
      {/* Backdrop - completely transparent, just for click handling */}
      <div 
        className="absolute inset-0 pointer-events-auto"
        onClick={handleClose}
      />
      
      {/* Bottom Sheet */}
      <div 
        className="relative w-full bg-white rounded-t-2xl shadow-2xl transition-all duration-300 ease-out max-h-[85vh] overflow-hidden pointer-events-auto"
        style={{ 
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease-out'
        }}
      >
        {/* Handle indicator */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full" />
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Advanced Statistics</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('box-score')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'box-score'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Box Score
          </button>
          <button
            onClick={() => setActiveTab('shooting')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'shooting'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Shooting
          </button>
          <button
            onClick={() => setActiveTab('top-performers')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'top-performers'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            Top Performers
          </button>
          <button
            onClick={() => setActiveTab('team-stats')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'team-stats'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Team Stats
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'box-score' && (
            <div className="p-6 min-h-[500px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Home Team */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Home Team</h3>
                  <div className="space-y-3">
                    {playerStats
                      .filter(stat => stat.player.team === 'home')
                      .map(stat => (
                        <div key={stat.player.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-blue-600">{stat.player.jerseyNumber}</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{stat.player.name}</div>
                              <div className="text-xs text-gray-500">{stat.player.position === 0 ? 'PG' : stat.player.position === 1 ? 'SG' : stat.player.position === 2 ? 'SF' : stat.player.position === 3 ? 'PF' : 'C'}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-blue-600">{stat.points} pts</div>
                            <div className="text-xs text-gray-500">
                              {stat.fieldGoalsMade}/{stat.fieldGoalsAttempted} FG • {stat.assists} AST • {stat.rebounds} REB
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Away Team */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">Away Team</h3>
                  <div className="space-y-3">
                    {playerStats
                      .filter(stat => stat.player.team === 'away')
                      .map(stat => (
                        <div key={stat.player.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-red-600">{stat.player.jerseyNumber}</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{stat.player.name}</div>
                              <div className="text-xs text-gray-500">{stat.player.position === 0 ? 'PG' : stat.player.position === 1 ? 'SG' : stat.player.position === 2 ? 'SF' : stat.player.position === 3 ? 'PF' : 'C'}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-red-600">{stat.points} pts</div>
                            <div className="text-xs text-gray-500">
                              {stat.fieldGoalsMade}/{stat.fieldGoalsAttempted} FG • {stat.assists} AST • {stat.rebounds} REB
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shooting' && (
            <div className="p-6 min-h-[500px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teamStats.map((team, index) => (
                  <div key={team.team} className={`rounded-lg p-4 ${team.team === 'home' ? 'bg-blue-50' : 'bg-red-50'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${team.team === 'home' ? 'text-blue-900' : 'text-red-900'}`}>
                      {team.team === 'home' ? 'Home Team' : 'Away Team'} Shooting
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-700">Field Goal %</span>
                          <span className="text-lg font-bold text-gray-900">{formatPercentage(team.fieldGoalPercentage)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${team.team === 'home' ? 'bg-blue-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(team.fieldGoalPercentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-700">3-Point %</span>
                          <span className="text-lg font-bold text-gray-900">{formatPercentage(team.threePointPercentage)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${team.team === 'home' ? 'bg-blue-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(team.threePointPercentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-700">Free Throw %</span>
                          <span className="text-lg font-bold text-gray-900">{formatPercentage(team.freeThrowPercentage)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${team.team === 'home' ? 'bg-blue-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(team.freeThrowPercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'top-performers' && (
            <div className="p-6 min-h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Top Scorers */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <Zap className="w-5 h-5 text-yellow-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Top Scorers</h3>
                  </div>
                  <div className="space-y-3">
                    {topScorers.map((stat, index) => (
                      <div key={stat.player.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-yellow-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{stat.player.name}</div>
                            <div className="text-xs text-gray-500">{stat.player.team === 'home' ? 'Home' : 'Away'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-yellow-600">{stat.points} pts</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Assists */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <Award className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Top Assists</h3>
                  </div>
                  <div className="space-y-3">
                    {topAssists.map((stat, index) => (
                      <div key={stat.player.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{stat.player.name}</div>
                            <div className="text-xs text-gray-500">{stat.player.team === 'home' ? 'Home' : 'Away'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">{stat.assists} AST</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Rebounders */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Top Rebounders</h3>
                  </div>
                  <div className="space-y-3">
                    {topRebounders.map((stat, index) => (
                      <div key={stat.player.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-green-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{stat.player.name}</div>
                            <div className="text-xs text-gray-500">{stat.player.team === 'home' ? 'Home' : 'Away'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{stat.rebounds} REB</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team-stats' && (
            <div className="p-6 min-h-[500px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teamStats.map((team, index) => (
                  <div key={team.team} className={`rounded-lg p-4 ${team.team === 'home' ? 'bg-blue-50' : 'bg-red-50'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${team.team === 'home' ? 'text-blue-900' : 'text-red-900'}`}>
                      {team.team === 'home' ? 'Home Team' : 'Away Team'} Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">{team.totalPoints}</div>
                        <div className="text-sm text-gray-500">Total Points</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">{team.totalAssists}</div>
                        <div className="text-sm text-gray-500">Assists</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">{team.totalRebounds}</div>
                        <div className="text-sm text-gray-500">Rebounds</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">{team.totalSteals}</div>
                        <div className="text-sm text-gray-500">Steals</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">{team.totalBlocks}</div>
                        <div className="text-sm text-gray-500">Blocks</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">{team.totalTurnovers}</div>
                        <div className="text-sm text-gray-500">Turnovers</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">{team.totalFouls}</div>
                        <div className="text-sm text-gray-500">Fouls</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">{formatPercentage(team.fieldGoalPercentage)}</div>
                        <div className="text-sm text-gray-500">FG%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 