import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import AnatomyViewport from './components/AnatomyViewport';
import SidebarControls from './components/SidebarControls';
import AnalyticsSidebar from './components/AnalyticsSidebar';
import WorkoutLoggerModal from './components/WorkoutLoggerModal';
import MuscleDetailsModal from './components/MuscleDetailsModal';
import CodeSnippetGenerator from './components/CodeSnippetGenerator';
import Footer from './components/Footer';
import { MUSCLE_GROUPS } from './data/muscleData';
import confetti from 'canvas-confetti';

export default function App() {
  // State
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [isHeatmapMode, setIsHeatmapMode] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showLabels, setShowLabels] = useState(false); // Default to false (clean body view without text badges)
  const [cameraPreset, setCameraPreset] = useState('front');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [hoveredMuscle, setHoveredMuscle] = useState(null);
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [showCodeSnippet, setShowCodeSnippet] = useState(true);

  // Calculate Muscle Volume and Heatmap Intensity Scores dynamically from logged workouts
  const { muscleIntensities, muscleVolumes, totalVolume, activeMusclesCount } = useMemo(() => {
    const intensities = {};
    const volumes = {};

    Object.keys(MUSCLE_GROUPS).forEach((key) => {
      intensities[key] = 0;
      volumes[key] = 0;
    });

    let totalVol = 0;

    workoutLogs.forEach((log) => {
      const { targets } = log.exercise;
      const logVolume = log.weight * log.reps * log.sets;
      totalVol += logVolume;

      if (targets) {
        Object.entries(targets).forEach(([muscleId, factor]) => {
          if (intensities[muscleId] !== undefined) {
            const addedIntensity = (logVolume / 100) * factor;
            intensities[muscleId] = Math.min(intensities[muscleId] + addedIntensity, 10);
            volumes[muscleId] += Math.round(logVolume * factor);
          }
        });
      }
    });

    const activeCount = Object.values(intensities).filter((v) => v > 0).length;

    return {
      muscleIntensities: intensities,
      muscleVolumes: volumes,
      totalVolume: totalVol,
      activeMusclesCount: activeCount
    };
  }, [workoutLogs]);

  // Load Initial Demo Sample Data
  const handleLoadSampleData = () => {
    const sampleLogs = [
      {
        exercise: {
          id: 'bench_press',
          name: 'Barbell Bench Press',
          targets: { chest_lower: 1.0, chest_upper: 0.7, delt_anterior_left: 0.5, delt_anterior_right: 0.5, triceps_left: 0.6, triceps_right: 0.6 }
        },
        weight: 90,
        reps: 8,
        sets: 4
      },
      {
        exercise: {
          id: 'lat_pulldown',
          name: 'Lat Pulldown',
          targets: { lats_left: 1.0, lats_right: 1.0, biceps_left: 0.6, biceps_right: 0.6 }
        },
        weight: 70,
        reps: 10,
        sets: 4
      },
      {
        exercise: {
          id: 'barbell_squat',
          name: 'Barbell Squat',
          targets: { quads_left: 1.0, quads_right: 1.0, glutes_left: 0.9, glutes_right: 0.9 }
        },
        weight: 110,
        reps: 8,
        sets: 4
      },
      {
        exercise: {
          id: 'lateral_raises',
          name: 'Lateral Raises',
          targets: { delt_lateral_left: 1.0, delt_lateral_right: 1.0 }
        },
        weight: 14,
        reps: 15,
        sets: 4
      }
    ];

    setWorkoutLogs(sampleLogs);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F2FE', '#FFD700', '#FF5E00']
    });
  };

  const handleLogWorkout = (logEntry) => {
    setWorkoutLogs((prev) => [...prev, logEntry]);
  };

  const handleLogPreset = (preset) => {
    const newLogs = preset.exercises.map((item) => {
      const exData = {
        id: item.exerciseId,
        name: item.exerciseId.replace('_', ' ').toUpperCase(),
        targets: MUSCLE_GROUPS[item.exerciseId]
          ? { [item.exerciseId]: 1.0 }
          : { chest_lower: 0.8, triceps_left: 0.5, triceps_right: 0.5 }
      };

      return {
        exercise: exData,
        weight: item.weight,
        reps: item.reps,
        sets: item.sets
      };
    });

    setWorkoutLogs((prev) => [...prev, ...newLogs]);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#00F2FE', '#FFD700', '#FF3B00']
    });
  };

  const handleAddManualBoost = (muscleId) => {
    const boostLog = {
      exercise: {
        id: 'manual_boost',
        name: 'Manual Iso Boost',
        targets: { [muscleId]: 1.0 }
      },
      weight: 50,
      reps: 10,
      sets: 2
    };

    setWorkoutLogs((prev) => [...prev, boostLog]);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all logged workout progress?')) {
      setWorkoutLogs([]);
      setSelectedMuscle(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header Navigation */}
      <Header
        onOpenLogger={() => setIsLoggerOpen(true)}
        onResetData={handleResetData}
        onLoadSampleData={handleLoadSampleData}
        totalVolume={totalVolume}
        activeMusclesCount={activeMusclesCount}
      />

      {/* Main Studio Viewport & Sidebar Controls Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Control Panel */}
          <SidebarControls
            cameraPreset={cameraPreset}
            onSetCameraPreset={setCameraPreset}
            isHeatmapMode={isHeatmapMode}
            onToggleHeatmap={() => setIsHeatmapMode(!isHeatmapMode)}
            isWireframe={isWireframe}
            onToggleWireframe={() => setIsWireframe(!isWireframe)}
            showSkeleton={showSkeleton}
            onToggleSkeleton={() => setShowSkeleton(!showSkeleton)}
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels(!showLabels)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectMuscle={setSelectedMuscle}
          />

          {/* Center 3D Anatomical Grayscale & Heatmap Canvas */}
          <div className="flex-1 h-[550px] lg:h-[720px]">
            <AnatomyViewport
              muscleIntensities={muscleIntensities}
              isHeatmapMode={isHeatmapMode}
              isWireframe={isWireframe}
              showSkeleton={showSkeleton}
              showLabels={showLabels}
              selectedMuscle={selectedMuscle}
              onSelectMuscle={setSelectedMuscle}
              hoveredMuscle={hoveredMuscle}
              onHoverMuscle={setHoveredMuscle}
              cameraPreset={cameraPreset}
            />
          </div>

          {/* Right Fitness & Muscle Analytics Panel */}
          <AnalyticsSidebar
            muscleIntensities={muscleIntensities}
            muscleVolumes={muscleVolumes}
            onSelectMuscle={setSelectedMuscle}
          />
        </div>

        {/* Developer Integration Code Generator Showcase Section */}
        {showCodeSnippet && (
          <CodeSnippetGenerator
            selectedMuscle={selectedMuscle}
            muscleIntensities={muscleIntensities}
          />
        )}
      </main>

      {/* Footer & Open Source Attribution */}
      <Footer />

      {/* Workout Logger Modal */}
      <WorkoutLoggerModal
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        onLogWorkout={handleLogWorkout}
        onLogPreset={handleLogPreset}
      />

      {/* Muscle Details Inspection Modal */}
      <MuscleDetailsModal
        muscle={selectedMuscle}
        intensity={selectedMuscle ? muscleIntensities[selectedMuscle.id] || 0 : 0}
        volume={selectedMuscle ? muscleVolumes[selectedMuscle.id] || 0 : 0}
        onClose={() => setSelectedMuscle(null)}
        onAddManualBoost={handleAddManualBoost}
      />
    </div>
  );
}
