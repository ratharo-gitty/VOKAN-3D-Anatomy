import React from 'react';
import { Activity, Award, BarChart3, ChevronRight, Zap, AlertTriangle, CheckCircle2, Flame } from 'lucide-react';
import { MUSCLE_GROUPS, HEATMAP_COLORS, getHeatmapLevel } from '../data/muscleData';

export default function AnalyticsSidebar({
  muscleIntensities,
  muscleVolumes,
  onSelectMuscle
}) {
  // Aggregate Top Worked Muscles
  const sortedMuscles = Object.values(MUSCLE_GROUPS)
    .map((m) => ({
      ...m,
      intensity: muscleIntensities[m.id] || 0,
      volume: muscleVolumes[m.id] || 0
    }))
    .sort((a, b) => b.intensity - a.intensity);

  const topMuscles = sortedMuscles.filter((m) => m.intensity > 0).slice(0, 6);

  // Category Breakdown Aggregates
  const categoryStats = {};
  Object.values(MUSCLE_GROUPS).forEach((m) => {
    const cat = m.category;
    if (!categoryStats[cat]) categoryStats[cat] = { intensity: 0, volume: 0, count: 0 };
    categoryStats[cat].intensity += muscleIntensities[m.id] || 0;
    categoryStats[cat].volume += muscleVolumes[m.id] || 0;
    categoryStats[cat].count += 1;
  });

  // Calculate Push vs Pull vs Legs Volume Balance Ratio
  const pushVol = (categoryStats['Chest']?.volume || 0) + (categoryStats['Shoulders']?.volume || 0) + (categoryStats['Arms']?.volume || 0) * 0.5;
  const pullVol = (categoryStats['Back']?.volume || 0) + (categoryStats['Arms']?.volume || 0) * 0.5;
  const legsVol = (categoryStats['Legs']?.volume || 0) + (categoryStats['Glutes']?.volume || 0);
  const totalVolSum = pushVol + pullVol + legsVol || 1;

  const pushPercent = Math.round((pushVol / totalVolSum) * 100);
  const pullPercent = Math.round((pullVol / totalVolSum) * 100);
  const legsPercent = Math.round((legsVol / totalVolSum) * 100);

  return (
    <div className="w-full lg:w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 flex flex-col gap-5 shadow-xl overflow-y-auto custom-scrollbar max-h-[85vh]">
      {/* Heatmap Spectrum Legend */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-yellow-400" />
            <span>Heatmap Scale</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Volume / Intensity</span>
        </div>

        <div className="flex h-3 w-full rounded-full overflow-hidden border border-slate-800 p-0.5 bg-slate-950">
          <div className="h-full w-1/5 bg-[#3D4148]" title="Idle / Rested" />
          <div className="h-full w-1/5 bg-[#00F2FE]" title="Light Activity" />
          <div className="h-full w-1/5 bg-[#FFD700]" title="Moderate Work" />
          <div className="h-full w-1/5 bg-[#FF5E00]" title="High Intensity" />
          <div className="h-full w-1/5 bg-[#D900FF]" title="Peak Overload" />
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2 px-1">
          <span>0 (Rest)</span>
          <span className="text-cyan-400">Light</span>
          <span className="text-yellow-400">Mod</span>
          <span className="text-orange-400">Heavy</span>
          <span className="text-purple-400">Max</span>
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* Push / Pull / Legs Training Balance */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2.5 flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Training Split Balance</span>
        </div>

        <div className="space-y-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          {/* Push Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Push (Chest/Delts/Tri)</span>
              <span className="text-cyan-400 font-mono font-bold">{pushPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full transition-all" style={{ width: `${pushPercent}%` }} />
            </div>
          </div>

          {/* Pull Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Pull (Back/Lats/Bi)</span>
              <span className="text-yellow-400 font-mono font-bold">{pullPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-yellow-400 h-full rounded-full transition-all" style={{ width: `${pullPercent}%` }} />
            </div>
          </div>

          {/* Legs Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Legs & Glutes</span>
              <span className="text-orange-400 font-mono font-bold">{legsPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-orange-400 h-full rounded-full transition-all" style={{ width: `${legsPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* Top Worked Muscles List */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            <span>Top Targeted Muscles</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">{topMuscles.length} active</span>
        </div>

        {topMuscles.length > 0 ? (
          <div className="flex flex-col gap-2">
            {topMuscles.map((m) => {
              const status = getHeatmapLevel(m.intensity);
              const maxIntensity = 7;
              const percent = Math.min(Math.round((m.intensity / maxIntensity) * 100), 100);

              return (
                <button
                  key={m.id}
                  onClick={() => onSelectMuscle(m)}
                  className="w-full p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all text-left group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-200 group-hover:text-cyan-300">
                      {m.name}
                    </span>
                    <span className="font-mono text-[11px] font-bold" style={{ color: status.color }}>
                      {m.volume} kg
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: status.color
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <Zap className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No workout logs recorded yet.</p>
            <p className="text-[11px] text-slate-500 mt-1">Click "Log Workout" or "Demo Data" to render heatmaps.</p>
          </div>
        )}
      </div>

      <div className="h-px bg-slate-800" />

      {/* Recovery Status Alert */}
      <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/50 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-cyan-300">Optimal Recovery Engine</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Muscles rendered in grayscale slate are fully rested and prime for progressive overload.
          </p>
        </div>
      </div>
    </div>
  );
}
