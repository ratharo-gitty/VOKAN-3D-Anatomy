import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import HumanMuscleModel from './HumanMuscleModel';
import AnatomyLabels from './AnatomyLabels';

const CameraController = ({ cameraPreset }) => {
  const controlsRef = useRef();

  useEffect(() => {
    if (!controlsRef.current) return;
    const c = controlsRef.current;
    const presets = {
      front:  { pos: [0, 0.5, 5.5],  target: [0, 0.3, 0] },
      back:   { pos: [0, 0.5, -5.5], target: [0, 0.3, 0] },
      upper:  { pos: [0, 1.4, 3.5],  target: [0, 1.2, 0] },
      lower:  { pos: [0, -0.6, 3.5], target: [0, -0.8, 0] },
      arms:   { pos: [2.5, 1.0, 2.8], target: [1.1, 0.9, 0] },
    };
    const p = presets[cameraPreset] || presets.front;
    c.object.position.set(...p.pos);
    c.target.set(...p.target);
    c.update();
  }, [cameraPreset]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      minDistance={2.2}
      maxDistance={9.5}
      maxPolarAngle={Math.PI / 1.5}
      minPolarAngle={Math.PI / 8}
    />
  );
};

export default function AnatomyViewport({
  muscleIntensities,
  isHeatmapMode,
  isWireframe,
  showSkeleton,
  showLabels = true,
  selectedMuscle,
  onSelectMuscle,
  hoveredMuscle,
  onHoverMuscle,
  cameraPreset,
}) {
  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #111827 0%, #080c14 55%, #030508 100%)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Grid underlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.04] pointer-events-none" />

      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.5, 5.5]} fov={38} near={0.1} far={80} />
        <CameraController cameraPreset={cameraPreset} />

        {/* ── Studio Lighting ── */}
        <ambientLight intensity={0.35} color="#c8d0e0" />

        {/* Key — warm upper-right */}
        <directionalLight
          position={[4, 7, 5]}
          intensity={1.6}
          castShadow
          shadow-mapSize={2048}
          color="#ffecd2"
        />

        {/* Fill — cool left */}
        <directionalLight position={[-5, 4, -3]} intensity={0.5} color="#9ab8e8" />

        {/* Rim — backlight for silhouette edge */}
        <directionalLight position={[0, 3, -6]} intensity={0.7} color="#7090c0" />

        {/* Under-light drama */}
        <spotLight position={[0, -3, 3]} intensity={0.2} angle={0.9} penumbra={1} color="#2a3a55" />

        {/* Contact Shadows */}
        <ContactShadows position={[0, -2.5, 0]} opacity={0.45} scale={8} blur={3} far={5} />

        {/* ── 3D Écorché Muscle Model ── */}
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

        {/* ── 3D Écorché Muscle Name Pins & Labels ── */}
        <AnatomyLabels
          showLabels={showLabels}
          muscleIntensities={muscleIntensities}
          selectedMuscle={selectedMuscle}
          hoveredMuscle={hoveredMuscle}
          onSelectMuscle={onSelectMuscle}
        />

        {/* ── Hover Tooltip ── */}
        {hoveredMuscle && !selectedMuscle && (
          <Html
            position={[
              (hoveredMuscle.position?.[0] || 0) + 0.35,
              (hoveredMuscle.position?.[1] || 0) + 0.25,
              (hoveredMuscle.position?.[2] || 0) + 0.15,
            ]}
            center
            distanceFactor={5.5}
          >
            <div
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                background: 'rgba(6, 10, 20, 0.92)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(0,242,254,0.35)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00f2fe', boxShadow: '0 0 6px #00f2fe' }} />
              {hoveredMuscle.latinName || hoveredMuscle.name}
              <span style={{ color: '#64748b', fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                {(muscleIntensities[hoveredMuscle.id] || 0).toFixed(1)}pt
              </span>
            </div>
          </Html>
        )}
      </Canvas>

      {/* Watermark */}
      <div className="absolute bottom-3 left-3 pointer-events-none opacity-30">
        <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase">
          VOKAN 3D · ÉCORCHÉ ANATOMY
        </span>
      </div>
    </div>
  );
}
