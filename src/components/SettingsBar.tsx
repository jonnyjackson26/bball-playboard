import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';

interface SettingsBarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function SettingsBar({ onUndo, onRedo, canUndo, canRedo }: SettingsBarProps) {
  return (
    <div className="bg-white shadow flex items-center px-4 py-2 h-14 border-b border-gray-200">
      <button
        className="mr-2 p-2 rounded hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed relative group"
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Undo"
        tabIndex={0}
      >
        <Undo2 className="w-6 h-6 text-gray-700" />
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity duration-200">Undo</span>
      </button>
      <button
        className="p-2 rounded hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed relative group"
        onClick={onRedo}
        disabled={!canRedo}
        aria-label="Redo"
        tabIndex={0}
      >
        <Redo2 className="w-6 h-6 text-gray-700" />
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity duration-200">Redo</span>
      </button>
    </div>
  );
} 