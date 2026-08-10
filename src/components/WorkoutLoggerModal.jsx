import React, { useState } from 'react';
import { X, Plus, Dumbbell, Sparkles, Check, Flame } from 'lucide-react';
import { EXERCISES, WORKOUT_PRESETS } from '../data/exercisesData';

export default function WorkoutLoggerModal({
  isOpen,
  onClose,
  onLogWorkout,
  onLogPreset
}) {
  const [selectedExerciseId, setSelectedExerciseId] = useState(EXERCISES[0].id);
  const [weight, setWeight] = useState(60);
  const [reps, setReps] = useState(10);
  const [sets, setSets] = useState(3);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleCustomLog = (e) => {
    e.preventDefault();
    const exercise = EXERCISES.find((ex) => ex.id === selectedExerciseId);
    if (!exercise) return;

    onLogWorkout({
      exercise,
      weight: Number(weight),
      reps: Number(reps),
      sets: Number(sets)
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 800);
  };

  const handlePresetClick = (preset) => {
    onLogPreset(preset);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Log Workout Activity</h3>
              <p className="text-xs text-slate-400">Updates 3D muscle heatmap intensity instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          {/* Preset Workouts Quick Add */}
          <div>
            <div className="text-xs font-mono uppercase text-cyan-400 font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Click Preset Workouts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WORKOUT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(preset)}
                  className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
                >
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 flex items-center justify-between">
                    <span>{preset.name}</span>
                    <Flame className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px bg-slate-800 flex-1" />
            <span className="text-xs font-mono text-slate-500 uppercase">OR Custom Exercise</span>
            <div className="h-px bg-slate-800 flex-1" />
          </div>

          {/* Custom Exercise Form */}
          <form onSubmit={handleCustomLog} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Exercise</label>
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {EXERCISES.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.category} - {ex.equipment})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reps / Set</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total Sets</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Update Heatmap Progress</span>
            </button>
          </form>
        </div>

        {/* Success Toast Overlay */}
        {showSuccessToast && (
          <div className="absolute inset-0 bg-cyan-950/90 backdrop-blur-md flex items-center justify-center animate-fadeIn">
            <div className="text-center text-white">
              <div className="w-12 h-12 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center mx-auto mb-2 font-bold animate-bounce">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="text-sm font-bold">Heatmap Recalculated!</h4>
              <p className="text-xs text-cyan-200">3D muscle model updated live</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
