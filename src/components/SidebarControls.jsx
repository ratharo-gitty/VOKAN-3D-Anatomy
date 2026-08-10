import React from 'react';
import { Camera, Eye, Flame, Layers, Box, Search, Tag, UserCheck, Palette } from 'lucide-react';
import { MUSCLE_GROUPS } from '../data/muscleData';

export default function SidebarControls({
  cameraPreset,
  onSetCameraPreset,
  bodyType = 'unisex',
  onSetBodyType,
  colorTheme = 'reference',
  onSetColorTheme,
  isHeatmapMode,
  onToggleHeatmap,
  isWireframe,
  onToggleWireframe,
  showSkeleton,
  onToggleSkeleton,
  showLabels,
  onToggleLabels,
  searchQuery,
  onSearchChange,
  onSelectMuscle
}) {
  const cameraAngles = [
    { id: 'front', label: 'Front View' },
    { id: 'back', label: 'Back View' },
    { id: 'upper', label: 'Chest & Arms' },
    { id: 'lower', label: 'Legs & Glutes' },
    { id: 'arms', label: 'Biceps & Shoulders' }
  ];

  const bodyTypes = [
    { id: 'unisex', label: 'Unisex Fit' },
    { id: 'male', label: 'Male Fit' },
    { id: 'female', label: 'Female Fit' }
  ];

  const themes = [
    { id: 'reference', label: 'Reference Écorché' },
    { id: 'grayscale', label: 'Studio Grayscale' }
  ];

  const searchResults = Object.values(MUSCLE_GROUPS).filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.latinName && m.latinName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full lg:w-72 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 flex flex-col gap-5 shadow-xl">
      {/* Anatomical Color Theme Selector */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2.5 flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span>Color Theme</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onSetColorTheme(theme.id)}
              className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                colorTheme === theme.id
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* Unisex / Male / Female Body Physique Selector */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2.5 flex items-center gap-2">
          <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Anatomy Physique</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {bodyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onSetBodyType(type.id)}
              className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                bodyType === type.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* 3D Visualizer Display Modes */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2.5 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Render Modes</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onToggleHeatmap}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
              isHeatmapMode
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-inner'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Heatmap</span>
          </button>

          <button
            onClick={onToggleWireframe}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
              isWireframe
                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50 shadow-inner'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Wireframe</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={onToggleLabels}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
              showLabels
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{showLabels ? 'Pins On' : '3D Pins'}</span>
          </button>

          <button
            onClick={onToggleSkeleton}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
              showSkeleton
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showSkeleton ? 'Rig On' : 'Rig Off'}</span>
          </button>
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* Camera Angles Presets */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2.5 flex items-center gap-2">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>Camera Perspective</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {cameraAngles.map((angle) => (
            <button
              key={angle.id}
              onClick={() => onSetCameraPreset(angle.id)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-medium text-left transition-all flex items-center justify-between border ${
                cameraPreset === angle.id
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-bold'
                  : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300 border-transparent hover:border-slate-700'
              }`}
            >
              <span>{angle.label}</span>
              {cameraPreset === angle.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* Search Muscle Group */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Locate Muscle</span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Latin / Gym muscle..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 pl-8 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        {searchQuery && (
          <div className="mt-2 max-h-40 overflow-y-auto custom-scrollbar flex flex-col gap-1 bg-slate-950 p-2 rounded-xl border border-slate-800">
            {searchResults.length > 0 ? (
              searchResults.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onSelectMuscle(m);
                    onSearchChange('');
                  }}
                  className="px-2 py-1.5 rounded-lg text-left text-xs hover:bg-slate-800 text-slate-200 hover:text-cyan-300 flex items-center justify-between"
                >
                  <span>{m.latinName || m.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{m.category}</span>
                </button>
              ))
            ) : (
              <div className="text-center py-2 text-xs text-slate-500">No muscles found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
