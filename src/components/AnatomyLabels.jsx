import React from 'react';
import { Html } from '@react-three/drei';
import { MUSCLE_GROUPS } from '../data/muscleData';

export default function AnatomyLabels({
  showLabels = true,
  muscleIntensities = {},
  selectedMuscle = null,
  hoveredMuscle = null,
  onSelectMuscle
}) {
  if (!showLabels) return null;

  // Filter main representative muscle pins to avoid clutter
  const keyLabelIds = [
    'chest_upper',
    'delt_anterior_right',
    'biceps_right',
    'abs_rectus',
    'obliques_left',
    'quads_left',
    'calves_right',
    'traps_upper',
    'lats_left',
    'triceps_right',
    'glutes_left',
    'hamstrings_right'
  ];

  return (
    <group>
      {keyLabelIds.map((id) => {
        const muscle = MUSCLE_GROUPS[id];
        if (!muscle) return null;

        const isSelected = selectedMuscle?.id === muscle.id;
        const isHovered = hoveredMuscle?.id === muscle.id;
        const intensity = muscleIntensities[muscle.id] || 0;

        // Position label slightly offset from muscle center for leader line alignment
        const pinPos = [
          muscle.position[0],
          muscle.position[1],
          muscle.position[2]
        ];

        return (
          <Html
            key={muscle.id}
            position={pinPos}
            center
            distanceFactor={5.2}
            zIndexRange={[100, 0]}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelectMuscle(muscle);
              }}
              className={`group cursor-pointer select-none transition-all duration-300 flex items-center gap-2 ${
                isSelected ? 'scale-110 z-30' : isHovered ? 'scale-105 z-20' : 'opacity-85 hover:opacity-100 z-10'
              }`}
            >
              {/* Pin Indicator Dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full border border-white/50 transition-all ${
                  isSelected
                    ? 'bg-cyan-400 shadow-[0_0_12px_#00f2fe] scale-125'
                    : isHovered
                    ? 'bg-yellow-400 shadow-[0_0_10px_#ffd700]'
                    : intensity > 0
                    ? 'bg-orange-400 shadow-[0_0_8px_#ff5e00]'
                    : 'bg-slate-300 shadow-[0_0_6px_rgba(255,255,255,0.4)]'
                }`}
              />

              {/* Label Badge */}
              <div
                className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold tracking-tight whitespace-nowrap transition-all border shadow-lg ${
                  isSelected
                    ? 'bg-cyan-950/90 text-cyan-300 border-cyan-400/80 shadow-cyan-500/20'
                    : isHovered
                    ? 'bg-slate-900/90 text-yellow-300 border-yellow-400/80'
                    : 'bg-slate-950/80 text-slate-200 border-slate-700/80 backdrop-blur-md group-hover:border-cyan-500/50 group-hover:text-cyan-300'
                }`}
              >
                <span>{muscle.latinName || muscle.name}</span>
                {intensity > 0 && (
                  <span className="ml-1 text-[9px] text-cyan-400 font-normal">
                    ({intensity.toFixed(1)}pt)
                  </span>
                )}
              </div>
            </div>
          </Html>
        );
      })}
    </group>
  );
}
