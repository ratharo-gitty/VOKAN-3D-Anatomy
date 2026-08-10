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
      front:  { pos: [0, 0.05, 1.35],  target: [0, 0.02, 0] },
      back:   { pos: [0, 0.05, -1.35], target: [0, 0.02, 0] },
      upper:  { pos: [0, 0.22, 0.85],  target: [0, 0.20, 0] },
      lower:  { pos: [0, -0.22, 0.85], target: [0, -0.22, 0] },
      arms:   { pos: [0.55, 0.18, 0.65], target: [0.05, 0.18, 0] },
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
      minDistance={0.4}
      maxDistance={2.8}
      maxPolarAngle={Math.PI / 1.5}
      minPolarAngle={Math.PI / 8}
    />
  );
};

export default function AnatomyViewport({
  bodyType = 'unisex',
  muscleIntensities,
  isHeatmapMode,
  isWireframe,
  showSkeleton,
  showLabels = false,
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
        background: 'radial-gradient(ellipse at 50% 40%, #0f172a 0%, #080d1a 55%, #03060d 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Grid underlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />

      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.05, 1.35]} fov={40} near={0.01} far={50} />
        <CameraController cameraPreset={cameraPreset} />

        {/* ── Studio Lighting ── */}
        <ambientLight intensity={0.45} color="#cbd5e1" />

        {/* Key light — warm top-right */}
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.8}
          castShadow
          shadow-mapSize={2048}
          color="#fff7ed"
        />

        {/* Fill light — cool left */}
        <directionalLight position={[-4, 3, -2]} intensity={0.6} color="#93c5fd" />

        {/* Rim light — back edge separation */}
        <directionalLight position={[0, 2, -5]} intensity={0.85} color="#38bdf8" />

        {/* Under-light drama */}
        <spotLight position={[0, -2, 2]} intensity={0.3} angle={0.9} penumbra={1} color="#1e293b" />

        {/* Contact Shadows */}
        <ContactShadows position={[0, -0.52, 0]} opacity={0.55} scale={3} blur={2.5} far={2} />

        {/* ── Real 3D Unisex/Fit Human Body Model ── */}
        <HumanMuscleModel
          bodyType={bodyType}
          muscleIntensities={muscleIntensities}
          isHeatmapMode={isHeatmapMode}
          isWireframe={isWireframe}
          showSkeleton={showSkeleton}
          selectedMuscle={selectedMuscle}
          onSelectMuscle={onSelectMuscle}
          hoveredMuscle={hoveredMuscle}
          onHoverMuscle={onHoverMuscle}
        />

        {/* ── 3D Muscle Name Pins & Labels ── */}
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
              hoveredMuscle.position?.[0] * 0.10 || 0,
              (hoveredMuscle.position?.[1] * 0.20 || 0) + 0.05,
              hoveredMuscle.position?.[2] * 0.10 || 0.08
            ]}
            center
            distanceFactor={2.2}
          >
            <div
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                background: 'rgba(8, 14, 28, 0.94)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(0,242,254,0.4)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 32px rgba(0,242,254,0.2)'
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00f2fe', boxShadow: '0 0 8px #00f2fe' }} />
              <span>{hoveredMuscle.latinName || hoveredMuscle.name}</span>
              <span style={{ color: '#64748b', fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                {(muscleIntensities[hoveredMuscle.id] || 0).toFixed(1)}pt
              </span>
            </div>
          </Html>
        )}
      </Canvas>

      {/* Watermark */}
      <div className="absolute bottom-3 left-3 pointer-events-none opacity-40">
        <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">
          VOKAN 3D · UNISEX FIT ATHLETIC ANATOMY
        </span>
      </div>
    </div>
  );
}
