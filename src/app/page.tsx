'use client'

import { useState } from 'react'
import { Player, Play, Action } from '@/types'
import TeamBox from '@/components/TeamBox'
import ActionBox from '@/components/ActionBox'
import Scoreboard from '@/components/Scoreboard'
import PlayByPlayBox from '@/components/PlayByPlayBox'
import StatsBottomSheet from '@/components/StatsBottomSheet'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import SettingsBar from '@/components/SettingsBar'
import { offensiveActions, defensiveActions } from '@/data/actions'

// Sample data for demonstration
const sampleHomePlayers: Player[] = [
  { id: 'h1', name: 'Stephen Curry', team: 'home', position: 0, jerseyNumber: 30 },
  { id: 'h2', name: 'Klay Thompson', team: 'home', position: 1, jerseyNumber: 11 },
  { id: 'h3', name: 'Draymond Green', team: 'home', position: 2, jerseyNumber: 23 },
  { id: 'h4', name: 'Andrew Wiggins', team: 'home', position: 3, jerseyNumber: 22 },
  { id: 'h5', name: 'Kevon Looney', team: 'home', position: 4, jerseyNumber: 5 },
  { id: 'h6', name: 'Jordan Poole', team: 'home', position: 5, jerseyNumber: 3 },
  { id: 'h7', name: 'Donte DiVincenzo', team: 'home', position: 6, jerseyNumber: 0 },
]

const sampleAwayPlayers: Player[] = [
  { id: 'a1', name: 'LeBron James', team: 'away', position: 0, jerseyNumber: 23 },
  { id: 'a2', name: 'Anthony Davis', team: 'away', position: 1, jerseyNumber: 3 },
  { id: 'a3', name: 'Austin Reaves', team: 'away', position: 2, jerseyNumber: 12 },
  { id: 'a4', name: 'D\'Angelo Russell', team: 'away', position: 3, jerseyNumber: 1 },
  { id: 'a5', name: 'Rui Hachimura', team: 'away', position: 4, jerseyNumber: 28 },
  { id: 'a6', name: 'Lonnie Walker IV', team: 'away', position: 5, jerseyNumber: 4 },
  { id: 'a7', name: 'Christian Wood', team: 'away', position: 6, jerseyNumber: 35 },
]

export default function Home() {
  const [homePlayers, setHomePlayers] = useState(sampleHomePlayers)
  const [awayPlayers, setAwayPlayers] = useState(sampleAwayPlayers)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [plays, setPlays] = useState<Play[]>([])
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [undoStack, setUndoStack] = useState<{plays: Play[], homeScore: number, awayScore: number}[]>([])
  const [redoStack, setRedoStack] = useState<{plays: Play[], homeScore: number, awayScore: number}[]>([])
  const [isStatsOpen, setIsStatsOpen] = useState(false)

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player)
  }

  const handleActionClick = (action: Action) => {
    if (!selectedPlayer) return

    // Save current state to undo stack
    setUndoStack(prev => [{ plays, homeScore, awayScore }, ...prev])
    setRedoStack([])

    const newPlay: Play = {
      id: Date.now().toString(),
      playerId: selectedPlayer.id,
      playerName: selectedPlayer.name,
      action: action.label,
      timestamp: new Date(),
      team: selectedPlayer.team,
      points: action.points || 0
    }

    setPlays(prev => [newPlay, ...prev])

    if (action.points) {
      if (selectedPlayer.team === 'home') {
        setHomeScore(prev => prev + action.points!)
      } else {
        setAwayScore(prev => prev + action.points!)
      }
    }

    setSelectedPlayer(null)
  }

  const handleUndo = () => {
    if (undoStack.length === 0) return
    setRedoStack(prev => [{ plays, homeScore, awayScore }, ...prev])
    const last = undoStack[0]
    setUndoStack(prev => prev.slice(1))
    setPlays(last.plays)
    setHomeScore(last.homeScore)
    setAwayScore(last.awayScore)
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return
    setUndoStack(prev => [{ plays, homeScore, awayScore }, ...prev])
    const next = redoStack[0]
    setRedoStack(prev => prev.slice(1))
    setPlays(next.plays)
    setHomeScore(next.homeScore)
    setAwayScore(next.awayScore)
  }

  const handleEditPlay = (playId: string, newPlayerName: string, newAction: string) => {
    // Save current state to undo stack
    setUndoStack(prev => [{ plays, homeScore, awayScore }, ...prev])
    setRedoStack([])

    const updatedPlays = plays.map(play => {
      if (play.id === playId) {
        // Find the action to get points
        const action = [...offensiveActions, ...defensiveActions].find(a => a.label === newAction)
        const points = action?.points || 0
        
        return {
          ...play,
          playerName: newPlayerName,
          action: newAction,
          points: points
        }
      }
      return play
    })

    setPlays(updatedPlays)

    // Recalculate scores
    let newHomeScore = 0
    let newAwayScore = 0
    
    updatedPlays.forEach(play => {
      if (play.points) {
        if (play.team === 'home') {
          newHomeScore += play.points
        } else {
          newAwayScore += play.points
        }
      }
    })

    setHomeScore(newHomeScore)
    setAwayScore(newAwayScore)
  }

  const handleDeletePlay = (playId: string) => {
    // Save current state to undo stack
    setUndoStack(prev => [{ plays, homeScore, awayScore }, ...prev])
    setRedoStack([])

    const playToDelete = plays.find(play => play.id === playId)
    const updatedPlays = plays.filter(play => play.id !== playId)

    setPlays(updatedPlays)

    // Recalculate scores
    if (playToDelete && playToDelete.points) {
      if (playToDelete.team === 'home') {
        setHomeScore(prev => prev - playToDelete.points!)
      } else {
        setAwayScore(prev => prev - playToDelete.points!)
      }
    }
  }

  const handleExport = (format: 'csv' | 'xlsx' | 'txt') => {
    if (plays.length === 0) {
      alert('No plays to export')
      return
    }

    const formatTime = (timestamp: Date) => {
      return timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    }

    const formatDate = (timestamp: Date) => {
      return timestamp.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }

    const exportData = plays.map(play => ({
      Date: formatDate(play.timestamp),
      Time: formatTime(play.timestamp),
      Player: play.playerName,
      Action: play.action,
      Team: play.team === 'home' ? 'Home' : 'Away',
      Points: play.points || 0
    }))

    const headers = ['Date', 'Time', 'Player', 'Action', 'Team', 'Points']
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
      )
    ].join('\n')

    const txtContent = exportData.map(row => 
      `${row.Date} ${row.Time} - ${row.Player} (${row.Team}): ${row.Action}${row.Points > 0 ? ` (+${row.Points}pts)` : ''}`
    ).join('\n')

    let content = ''
    let filename = ''
    let mimeType = ''

    switch (format) {
      case 'csv':
        content = csvContent
        filename = `playbyplay_${new Date().toISOString().split('T')[0]}.csv`
        mimeType = 'text/csv'
        break
      case 'xlsx':
        // For XLSX, we'll create a simple CSV-like structure that Excel can open
        content = csvContent
        filename = `playbyplay_${new Date().toISOString().split('T')[0]}.xlsx`
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        break
      case 'txt':
        content = txtContent
        filename = `playbyplay_${new Date().toISOString().split('T')[0]}.txt`
        mimeType = 'text/plain'
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleHomePlayersReorder = (players: Player[]) => {
    setHomePlayers(players)
  }

  const handleAwayPlayersReorder = (players: Player[]) => {
    setAwayPlayers(players)
  }

  const handleAddHomePlayer = (name: string, jerseyNumber?: string | number) => {
    const newPlayer: Player = {
      id: `h${Date.now()}`,
      name: name,
      team: 'home',
      position: homePlayers.length,
      jerseyNumber: jerseyNumber
    }
    setHomePlayers(prev => [...prev, newPlayer])
  }

  const handleAddAwayPlayer = (name: string, jerseyNumber?: string | number) => {
    const newPlayer: Player = {
      id: `a${Date.now()}`,
      name: name,
      team: 'away',
      position: awayPlayers.length,
      jerseyNumber: jerseyNumber
    }
    setAwayPlayers(prev => [...prev, newPlayer])
  }

  // Determine which team is selected
  const selectedTeam = selectedPlayer?.team

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-100">
      <PanelGroup direction="horizontal" className="h-full w-full">
        {/* Left Column */}
        <Panel minSize={15} defaultSize={22} className="flex flex-col h-full">
          <PanelGroup direction="vertical" className="h-full">
            <Panel minSize={20} defaultSize={60} className="flex flex-col min-h-0">
              <TeamBox
                teamName="Lakers"
                players={awayPlayers}
                selectedPlayer={selectedPlayer}
                onPlayerSelect={handlePlayerSelect}
                onPlayersReorder={handleAwayPlayersReorder}
                onAddPlayer={handleAddAwayPlayer}
              />
            </Panel>
            <PanelResizeHandle className="h-2 bg-gray-300 hover:bg-gray-400 transition-colors cursor-row-resize flex items-center justify-center">
              <div className="w-8 h-1 rounded bg-gray-500" />
            </PanelResizeHandle>
            <Panel minSize={20} defaultSize={40} className="flex flex-col min-h-0">
              <ActionBox
                selectedPlayer={selectedPlayer && selectedTeam === 'away' ? selectedPlayer : null}
                onActionClick={handleActionClick}
              />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-gray-400 transition-colors cursor-col-resize flex items-center justify-center">
          <div className="h-8 w-1 rounded bg-gray-500" />
        </PanelResizeHandle>
        {/* Center Column */}
        <Panel minSize={20} defaultSize={56} className="flex flex-col h-full">
          {/* Fixed SettingsBar above the resizable PanelGroup */}
          <SettingsBar
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
            onExport={handleExport}
          />
          <PanelGroup direction="vertical" className="flex-1 min-h-0">
            <Panel minSize={20} defaultSize={35} className="flex flex-col min-h-0">
              <Scoreboard
                homeTeam="Warriors"
                awayTeam="Lakers"
                homeScore={homeScore}
                awayScore={awayScore}
              />
            </Panel>
            <PanelResizeHandle className="h-2 bg-gray-300 hover:bg-gray-400 transition-colors cursor-row-resize flex items-center justify-center">
              <div className="w-8 h-1 rounded bg-gray-500" />
            </PanelResizeHandle>
            <Panel minSize={20} defaultSize={65} className="flex flex-col min-h-0">
              <PlayByPlayBox 
                plays={plays} 
                homePlayers={homePlayers}
                awayPlayers={awayPlayers}
                homeScore={homeScore}
                awayScore={awayScore}
                onEditPlay={handleEditPlay}
                onDeletePlay={handleDeletePlay}
                onOpenStats={() => setIsStatsOpen(true)}
              />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-gray-400 transition-colors cursor-col-resize flex items-center justify-center">
          <div className="h-8 w-1 rounded bg-gray-500" />
        </PanelResizeHandle>
        {/* Right Column */}
        <Panel minSize={15} defaultSize={22} className="flex flex-col h-full">
          <PanelGroup direction="vertical" className="h-full">
            <Panel minSize={20} defaultSize={60} className="flex flex-col min-h-0">
              <TeamBox
                teamName="Warriors"
                players={homePlayers}
                selectedPlayer={selectedPlayer}
                onPlayerSelect={handlePlayerSelect}
                onPlayersReorder={handleHomePlayersReorder}
                onAddPlayer={handleAddHomePlayer}
              />
            </Panel>
            <PanelResizeHandle className="h-2 bg-gray-300 hover:bg-gray-400 transition-colors cursor-row-resize flex items-center justify-center">
              <div className="w-8 h-1 rounded bg-gray-500" />
            </PanelResizeHandle>
            <Panel minSize={20} defaultSize={40} className="flex flex-col min-h-0">
              <ActionBox
                selectedPlayer={selectedPlayer && selectedTeam === 'home' ? selectedPlayer : null}
                onActionClick={handleActionClick}
              />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
      
      {/* Stats Bottom Sheet */}
      <StatsBottomSheet
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        plays={plays}
        homePlayers={homePlayers}
        awayPlayers={awayPlayers}
        homeScore={homeScore}
        awayScore={awayScore}
      />
    </div>
  )
}
