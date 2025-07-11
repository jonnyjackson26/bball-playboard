'use client'

interface ScoreboardProps {
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
}

export default function Scoreboard({ homeTeam, awayTeam, homeScore, awayScore }: ScoreboardProps) {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg shadow-lg px-8 py-6 flex items-center justify-center w-full h-full">
      <div className="flex flex-row items-center justify-center w-full gap-12">
        {/* Away Team */}
        <div className="flex flex-col items-center min-w-[100px]">
          <div className="text-lg font-semibold mb-1 text-gray-200 truncate">{awayTeam}</div>
          <div className="text-5xl font-bold text-white tabular-nums">{awayScore}</div>
        </div>
        {/* VS */}
        <div className="flex flex-col items-center mx-4">
          <div className="text-2xl font-bold text-gray-400">VS</div>
        </div>
        {/* Home Team */}
        <div className="flex flex-col items-center min-w-[100px]">
          <div className="text-lg font-semibold mb-1 text-gray-200 truncate">{homeTeam}</div>
          <div className="text-5xl font-bold text-white tabular-nums">{homeScore}</div>
        </div>
      </div>
    </div>
  )
} 