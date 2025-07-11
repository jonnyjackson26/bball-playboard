# PlayBoard - Live Basketball Game Tracker

A Next.js web application for tracking basketball game stats and play-by-play in real-time.

## Features

- **Team Management**: Drag and drop player cards to reorder starters and bench players
- **Live Scoreboard**: Real-time score tracking with a professional scoreboard design
- **Action Tracking**: Comprehensive basketball actions including offensive and defensive plays
- **Play-by-Play**: Stack-style play history with newest plays on top
- **Player Selection**: Click-to-select players before recording actions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **@dnd-kit** for drag and drop functionality
- **Supabase** for backend (configured but not yet integrated)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Select a Player**: Click on any player card from either team
2. **Choose an Action**: Click on an action button (offensive or defensive)
3. **Record the Play**: The play will automatically be added to the play-by-play
4. **Reorder Players**: Drag and drop player cards to change their position
5. **Add Players**: Use the "Add Player" button to add new players to teams

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── ActionBox.tsx   # Action buttons
│   ├── PlayerCard.tsx  # Individual player card
│   ├── PlayByPlayBox.tsx # Play history
│   ├── Scoreboard.tsx  # Live scoreboard
│   └── TeamBox.tsx     # Team with players
├── data/               # Static data
│   └── actions.ts      # Basketball action definitions
├── lib/                # Utilities
│   └── supabase.ts     # Supabase client
└── types/              # TypeScript types
    └── index.ts        # Data model interfaces
```

## Basketball Actions

### Offensive Actions

- 2PT Made/Missed
- 3PT Made/Missed
- Free Throw Made/Missed
- Assist
- Turnover
- Offensive Rebound

### Defensive Actions

- Defensive Rebound
- Steal
- Block
- Foul

## Future Enhancements

- Supabase integration for data persistence
- User authentication
- Multiple game support
- Advanced statistics
- Export functionality
- Real-time collaboration
