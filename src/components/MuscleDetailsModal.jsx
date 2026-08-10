import React from 'react';
import { X, Flame, Activity, Clock, Dumbbell, Zap, Plus, Info } from 'lucide-react';
import { EXERCISES } from '../data/exercisesData';
import { getHeatmapLevel } from '../data/muscleData';

export default function MuscleDetailsModal({
  muscle,
  intensity = 0,
  volume = 0,
  onClose,
  onAddManualBoost
}) {
  if (!muscle) return null;

  const status = getHeatmapLevel(intensity);

  // Find exercises targeting this muscle
  const targetingExercises = EXERCISES.filter((ex) => ex.targets && ex.targets[muscle.id]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: status.color }}
            />
            <h3 className="text-sm font-bold text-white">{muscle.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Metric Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Total Volume</div>
              <div className="text-base font-bold text-cyan-400 mt-0.5">{volume.toLocaleString()} kg</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Activity Level</div>
              <div className="text-base font-bold mt-0.5" style={{ color: status.color }}>
                {status.label}
              </div>
            </div>
          </div>

          {/* Muscle Description */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-slate-200 mb-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Anatomical Overview</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">{muscle.description}</p>
          </div>

          {/* Recommended Target Exercises */}
          <div>
            <div className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Exercises</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {targetingExercises.length > 0 ? (
                targetingExercises.map((ex) => (
                  <span
                    key={ex.id}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700"
                  >
                    {ex.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">Isolation exercises / compound movements</span>
              )}
            </div>
          </div>

          {/* Quick Boost Button */}
          <button
            onClick={() => onAddManualBoost(muscle.id)}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Quick Workout Boost (+100kg Volume)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
