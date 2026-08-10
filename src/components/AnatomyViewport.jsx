import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import RealBodyModel from './HumanMuscleModel';

// Camera Target Helper Controller
const CameraController = ({ cameraPreset }) => {
  const controlsRef = useRef();

  useEffect(() => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;
    switch (cameraPreset) {
      case 'front':
        controls.object.position.set(0, 0.15, 1.4);
        controls.target.set(0, 0.1, 0);
        break;
      case 'back':
        controls.object.position.set(0, 0.15, -1.4);
        controls.target.set(0, 0.1, 0);
        break;
      case 'upper':
        controls.object.position.set(0, 0.45, 0.9);
        controls.target.set(0, 0.35, 0);
        break;
      case 'lower':
        controls.object.position.set(0, -0.25, 0.9);
        controls.target.set(0, -0.25, 0);
        break;
      case 'arms':
        controls.object.position.set(0.6, 0.3, 0.7);
        controls.target.set(0.2, 0.28, 0);
        break;
      default:
        controls.object.position.set(0, 0.15, 1.4);
        controls.target.set(0, 0.1, 0);
    }
    controls.update();
  }, [cameraPreset]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      minDistance={0.5}
      maxDistance={3.0}
      maxPolarAngle={Math.PI / 1.6}
      minPolarAngle={Math.PI / 8}
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
    <div
      className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl"
      style={{
        background: 'radial-gradient(ellipse at center, #0f1726 0%, #080d16 50%, #040609 100%)',
        border: '1px solid rgba(255,255,255,0.06)'
      }}
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <Canvas shadows gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}>
        <PerspectiveCamera makeDefault position={[0, 0.15, 1.4]} fov={40} near={0.01} far={50} />
        <CameraController cameraPreset={cameraPreset} />

        {/* Premium Studio Lighting Setup */}
        <ambientLight intensity={0.4} />

        {/* Key light - warm from top-right */}
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.8}
          castShadow
          shadow-mapSize={2048}
          shadow-camera-far={20}
          shadow-camera-near={0.1}
          color="#ffeedd"
        />

        {/* Fill light - cool from left */}
        <directionalLight position={[-4, 3, -2]} intensity={0.6} color="#aaccff" />

        {/* Rim / backlight for edge separation */}
        <directionalLight position={[0, 2, -5]} intensity={0.8} color="#6688cc" />

        {/* Subtle spotlight from below for dramatic effect */}
        <spotLight
          position={[0, -2, 2]}
          intensity={0.3}
          angle={0.8}
          penumbra={1}
          color="#334466"
        />

        {/* Floor shadows */}
        <ContactShadows
          position={[0, -0.72, 0]}
          opacity={0.5}
          scale={3}
          blur={3}
          far={2}
        />

        {/* The Real 3D Human Body Model */}
        <RealBodyModel
          muscleIntensities={muscleIntensities}
          isHeatmapMode={isHeatmapMode}
          isWireframe={isWireframe}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelectMuscle={onSelectMuscle}
          onHoverMuscle={onHoverMuscle}
        />

        {/* 3D Hover Tooltip */}
        {hoveredMuscle && !selectedMuscle && (
          <Html
            position={[
              hoveredMuscle.position?.[0] * 0.22 || 0,
              (hoveredMuscle.position?.[1] * 0.22 || 0) + 0.12,
              hoveredMuscle.position?.[2] * 0.22 || 0.15
            ]}
            center
            distanceFactor={2}
          >
            <div
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                background: 'rgba(8, 14, 28, 0.92)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0, 242, 254, 0.4)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 32px rgba(0, 242, 254, 0.15)'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#00f2fe',
                  boxShadow: '0 0 8px #00f2fe',
                  animation: 'pulse 2s infinite'
                }}
              />
              <span>{hoveredMuscle.name}</span>
              <span style={{ color: '#64748b', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}>
                {(muscleIntensities[hoveredMuscle.id] || 0).toFixed(1)} pts
              </span>
            </div>
          </Html>
        )}
      </Canvas>

      {/* Bottom corner watermark */}
      <div
        className="absolute bottom-3 left-3 flex items-center gap-2 pointer-events-none"
        style={{ opacity: 0.3 }}
      >
        <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#64748b', letterSpacing: '0.1em' }}>
          VOKAN 3D · GLB MODEL
        </span>
      </div>
    </div>
  );
}
