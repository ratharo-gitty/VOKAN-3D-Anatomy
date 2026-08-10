import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import HumanMuscleModel from './HumanMuscleModel';

// Camera Target Helper Controller
const CameraController = ({ cameraPreset }) => {
  const controlsRef = useRef();

  useEffect(() => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;
    switch (cameraPreset) {
      case 'front':
        controls.object.position.set(0, 0.4, 5.2);
        controls.target.set(0, 0.2, 0);
        break;
      case 'back':
        controls.object.position.set(0, 0.4, -5.2);
        controls.target.set(0, 0.2, 0);
        break;
      case 'upper':
        controls.object.position.set(0, 1.1, 3.2);
        controls.target.set(0, 1.0, 0);
        break;
      case 'lower':
        controls.object.position.set(0, -0.9, 3.2);
        controls.target.set(0, -0.9, 0);
        break;
      case 'arms':
        controls.object.position.set(2.2, 0.8, 2.5);
        controls.target.set(1.0, 0.8, 0);
        break;
      default:
        controls.object.position.set(0, 0.4, 5.2);
        controls.target.set(0, 0.2, 0);
    }
    controls.update();
  }, [cameraPreset]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      minDistance={2.0}
      maxDistance={8.5}
      maxPolarAngle={Math.PI / 1.8}
      minPolarAngle={Math.PI / 6}
    />
  );
};

export default function AnatomyViewport({
  muscleIntensities,
  isHeatmapMode,
  isWireframe,
  showSkeleton,
  selectedMuscle,
  onSelectMuscle,
  hoveredMuscle,
  onHoverMuscle,
  cameraPreset
}) {
  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
      {/* Grayscale Studio Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-90 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <Canvas shadows gl={{ antialias: true, alpha: false }}>
        <PerspectiveCamera makeDefault position={[0, 0.4, 5.2]} fov={45} />
        <CameraController cameraPreset={cameraPreset} />

        {/* Studio Lighting Setup for Grayscale Depth */}
        <ambientLight intensity={0.65} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.4}
          castShadow
          shadow-mapSize={1024}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#88aaff" />
        <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.6} penumbra={0.8} />

        {/* Dynamic Shadow Floor */}
        <ContactShadows
          position={[0, -2.4, 0]}
          opacity={0.65}
          scale={10}
          blur={2.5}
          far={4}
        />

        {/* 3D Human Muscular Model */}
        <HumanMuscleModel
          muscleIntensities={muscleIntensities}
          isHeatmapMode={isHeatmapMode}
          isWireframe={isWireframe}
          showSkeleton={showSkeleton}
          selectedMuscle={selectedMuscle}
          onSelectMuscle={onSelectMuscle}
          hoveredMuscle={hoveredMuscle}
          onHoverMuscle={onHoverMuscle}
        />

        {/* Hover 3D HTML Tooltip Badge */}
        {hoveredMuscle && !selectedMuscle && (
          <Html position={hoveredMuscle.position} center distanceFactor={6}>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-cyan-500/50 text-white text-xs font-semibold shadow-lg whitespace-nowrap pointer-events-none animate-fadeIn flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span>{hoveredMuscle.name}</span>
              <span className="text-slate-400 font-mono text-[10px]">
                ({muscleIntensities[hoveredMuscle.id] || 0} pts)
              </span>
            </div>
          </Html>
        )}
      </Canvas>
    </div>
  );
}
