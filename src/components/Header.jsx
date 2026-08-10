import React from 'react';
import { Activity, Flame, PlusCircle, RefreshCw, Github, Sparkles, ShieldCheck, Dumbbell } from 'lucide-react';

export default function Header({
  onOpenLogger,
  onResetData,
  onLoadSampleData,
  totalVolume,
  activeMusclesCount
}) {
  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
      {/* Brand Title & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
          <Dumbbell className="w-6 h-6 text-white transform -rotate-12" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-xl text-white tracking-wider">
              VOKAN <span className="bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">3D ANATOMY</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase">
              v1.0 Open Source
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Grayscale Human Muscle Heatmap & Progress Engine for Fitness Apps
          </p>
        </div>
      </div>

      {/* Quick Stats Badges */}
      <div className="hidden md:flex items-center gap-6 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <div className="text-left">
            <div className="text-[10px] uppercase font-mono text-slate-400">Active Muscles</div>
            <div className="text-sm font-bold text-white">{activeMusclesCount} / 28</div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800" />

        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <div className="text-left">
            <div className="text-[10px] uppercase font-mono text-slate-400">Total Volume</div>
            <div className="text-sm font-bold text-cyan-400">{totalVolume.toLocaleString()} kg</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onLoadSampleData}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all hover:border-cyan-500/50"
          title="Load realistic workout progress sample data"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>Demo Data</span>
        </button>

        <button
          onClick={onOpenLogger}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Workout</span>
        </button>

        <button
          onClick={onResetData}
          className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
          title="Clear all logged workout data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <a
          href="https://github.com/ratharo-gitty/VOKAN-3D-Anatomy"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          title="View on GitHub Repository"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
