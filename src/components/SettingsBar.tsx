import React, { useState } from 'react';
import { Undo2, Redo2, Download } from 'lucide-react';

interface SettingsBarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExport: (format: 'csv' | 'xlsx' | 'txt') => void;
}

export default function SettingsBar({ onUndo, onRedo, canUndo, canRedo, onExport }: SettingsBarProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (format: 'csv' | 'xlsx' | 'txt') => {
    onExport(format);
    setShowExportMenu(false);
  };

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
        className="mr-2 p-2 rounded hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed relative group"
        onClick={onRedo}
        disabled={!canRedo}
        aria-label="Redo"
        tabIndex={0}
      >
        <Redo2 className="w-6 h-6 text-gray-700" />
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity duration-200">Redo</span>
      </button>
      
      {/* Export Button with Dropdown */}
      <div className="relative">
        <button
          className="p-2 rounded hover:bg-gray-200 transition relative group"
          onClick={() => setShowExportMenu(!showExportMenu)}
          aria-label="Export"
          tabIndex={0}
        >
          <Download className="w-6 h-6 text-gray-700" />
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity duration-200">Export</span>
        </button>
        
        {showExportMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[120px]">
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
              onClick={() => handleExport('csv')}
            >
              Export as CSV
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
              onClick={() => handleExport('xlsx')}
            >
              Export as XLSX
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
              onClick={() => handleExport('txt')}
            >
              Export as TXT
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 