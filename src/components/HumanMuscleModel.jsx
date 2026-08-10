import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MUSCLE_GROUPS } from '../data/muscleData';

/*
 * VOKAN 3D Anatomy — Unisex Fit Athletic Human Body 3D GLB Model Engine
 * 
 * Renders a fit, athletic unisex/neutral human body mesh model.
 * Maps all 28,391 vertices to 28 distinct gym muscle groups.
 * In grayscale baseline, renders a metallic slate écorché;
 * in heatmap mode, dynamic workout load colors light up the corresponding
 * muscle regions on the real body mesh.
 */

const MUSCLE_REGIONS = {
  // CHEST
  chest_upper:          { center: [0, 0.28, 0.08], radii: [0.045, 0.040, 0.050], priority: 10 },
  chest_lower:          { center: [0, 0.21, 0.08], radii: [0.048, 0.042, 0.050], priority: 9 },

  // SHOULDERS
  delt_anterior_left:   { center: [-0.048, 0.29, 0.045], radii: [0.035, 0.045, 0.040], priority: 11 },
  delt_anterior_right:  { center: [ 0.048, 0.29, 0.045], radii: [0.035, 0.045, 0.040], priority: 11 },
  delt_lateral_left:    { center: [-0.058, 0.29, 0.010], radii: [0.035, 0.045, 0.040], priority: 12 },
  delt_lateral_right:   { center: [ 0.058, 0.29, 0.010], radii: [0.035, 0.045, 0.040], priority: 12 },
  delt_posterior_left:  { center: [-0.048, 0.29, -0.035], radii: [0.035, 0.045, 0.040], priority: 11 },
  delt_posterior_right: { center: [ 0.048, 0.29, -0.035], radii: [0.035, 0.045, 0.040], priority: 11 },

  // ARMS
  biceps_left:          { center: [-0.055, 0.20, 0.025], radii: [0.030, 0.055, 0.035], priority: 13 },
  biceps_right:         { center: [ 0.055, 0.20, 0.025], radii: [0.030, 0.055, 0.035], priority: 13 },
  triceps_left:         { center: [-0.055, 0.20, -0.025], radii: [0.030, 0.055, 0.035], priority: 13 },
  triceps_right:        { center: [ 0.055, 0.20, -0.025], radii: [0.030, 0.055, 0.035], priority: 13 },
  forearms_left:        { center: [-0.065, 0.09, 0.010], radii: [0.028, 0.075, 0.030], priority: 14 },
  forearms_right:       { center: [ 0.065, 0.09, 0.010], radii: [0.028, 0.075, 0.030], priority: 14 },

  // BACK
  traps_upper:          { center: [0, 0.35, -0.015], radii: [0.048, 0.042, 0.040], priority: 8 },
  traps_mid_lower:      { center: [0, 0.25, -0.040], radii: [0.045, 0.065, 0.040], priority: 7 },
  lats_left:            { center: [-0.032, 0.16, -0.040], radii: [0.035, 0.075, 0.035], priority: 6 },
  lats_right:           { center: [ 0.032, 0.16, -0.040], radii: [0.035, 0.075, 0.035], priority: 6 },
  erector_spinae:       { center: [0, 0.06, -0.040], radii: [0.035, 0.075, 0.032], priority: 5 },

  // CORE
  abs_rectus:           { center: [0, 0.10, 0.060], radii: [0.038, 0.080, 0.035], priority: 9 },
  obliques_left:        { center: [-0.032, 0.09, 0.045], radii: [0.032, 0.065, 0.032], priority: 8 },
  obliques_right:       { center: [ 0.032, 0.09, 0.045], radii: [0.032, 0.065, 0.032], priority: 8 },

  // GLUTES
  glutes_left:          { center: [-0.028, -0.04, -0.045], radii: [0.038, 0.058, 0.042], priority: 7 },
  glutes_right:         { center: [ 0.028, -0.04, -0.045], radii: [0.038, 0.058, 0.042], priority: 7 },

  // LEGS
  quads_left:           { center: [-0.028, -0.19, 0.035], radii: [0.035, 0.100, 0.040], priority: 6 },
  quads_right:          { center: [ 0.028, -0.19, 0.035], radii: [0.035, 0.100, 0.040], priority: 6 },
  hamstrings_left:      { center: [-0.028, -0.19, -0.035], radii: [0.035, 0.100, 0.038], priority: 5 },
  hamstrings_right:     { center: [ 0.028, -0.19, -0.035], radii: [0.035, 0.100, 0.038], priority: 5 },
  calves_left:          { center: [-0.028, -0.38, -0.020], radii: [0.030, 0.080, 0.032], priority: 4 },
  calves_right:         { center: [ 0.028, -0.38, -0.020], radii: [0.030, 0.080, 0.032], priority: 4 },
};

const HEAT_RAMP = [
  new THREE.Color('#3A3D42'), // 0 - Resting Slate
  new THREE.Color('#00F2FE'), // 1 - Neon Cyan
  new THREE.Color('#FFD700'), // 2 - Gold Yellow
  new THREE.Color('#FF5E00'), // 3 - Fiery Orange
  new THREE.Color('#FF0055'), // 4 - Crimson Red
  new THREE.Color('#D900FF'), // 5 - Hyper Magenta
];

function getInterpolatedHeatColor(intensity) {
  if (intensity <= 0) return HEAT_RAMP[0].clone();
  const idx = Math.min(Math.floor(intensity), HEAT_RAMP.length - 2);
  const t = intensity - idx;
  return HEAT_RAMP[idx].clone().lerp(HEAT_RAMP[idx + 1], t);
}

function classifyBodyVertex(x, y, z) {
  let bestId = null;
  let bestDist = Infinity;
  let bestPriority = -1;

  for (const [id, region] of Object.entries(MUSCLE_REGIONS)) {
    const dx = (x - region.center[0]) / region.radii[0];
    const dy = (y - region.center[1]) / region.radii[1];
    const dz = (z - region.center[2]) / region.radii[2];
    const dist = dx * dx + dy * dy + dz * dz;

    if (dist <= 1.0) {
      if (region.priority > bestPriority || (region.priority === bestPriority && dist < bestDist)) {
        bestId = id;
        bestDist = dist;
        bestPriority = region.priority;
      }
    }
  }
  return { id: bestId, dist: bestDist };
}

export default function HumanMuscleModel({
  bodyType = 'unisex',
  muscleIntensities = {},
  isHeatmapMode = true,
  isWireframe = false,
  showSkeleton = true,
  selectedMuscle = null,
  onSelectMuscle,
  hoveredMuscle = null,
  onHoverMuscle
}) {
  const meshRef = useRef();
  const { scene } = useGLTF('/models/human_body.glb');

  // Body mesh scale transformation according to physique mode
  const bodyScale = useMemo(() => {
    switch (bodyType) {
      case 'unisex':
        return [0.98, 0.99, 0.94]; // Balanced unisex athletic fit
      case 'male':
        return [1.02, 1.0, 0.98];  // Broad V-taper frame
      case 'female':
        return [0.94, 0.98, 0.90]; // Fit female athletic frame
      default:
        return [0.98, 0.99, 0.94];
    }
  }, [bodyType]);

  // Clone real 3D human body geometry
  const bodyGeometry = useMemo(() => {
    let geo = null;
    scene.traverse((child) => {
      if (child.isMesh && !geo) {
        geo = child.geometry.clone();
      }
    });
    return geo;
  }, [scene]);

  // Compute vertex muscle mapping table once
  const vertexMap = useMemo(() => {
    if (!bodyGeometry) return [];
    const pos = bodyGeometry.attributes.position;
    const map = new Array(pos.count);

    for (let i = 0; i < pos.count; i++) {
      map[i] = classifyBodyVertex(pos.getX(i), pos.getY(i), pos.getZ(i));
    }
    return map;
  }, [bodyGeometry]);

  // Update vertex colors dynamically on intensity / selection state change
  useEffect(() => {
    if (!bodyGeometry || vertexMap.length === 0) return;

    const pos = bodyGeometry.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const baseSlate = new THREE.Color('#3A3D42');

    for (let i = 0; i < pos.count; i++) {
      const { id, dist } = vertexMap[i];
      let color;

      if (!isHeatmapMode || !id) {
        color = baseSlate;
      } else {
        const intensity = muscleIntensities[id] || 0;

        if (selectedMuscle && id === selectedMuscle.id) {
          color = new THREE.Color('#00F2FE');
        } else if (hoveredMuscle && id === hoveredMuscle.id) {
          color = new THREE.Color('#FFD700');
        } else if (intensity > 0) {
          color = getInterpolatedHeatColor(intensity);
          const blendFactor = Math.max(0, 1 - dist);
          color = baseSlate.clone().lerp(color, blendFactor);
        } else {
          color = baseSlate;
        }
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    bodyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    bodyGeometry.attributes.color.needsUpdate = true;
  }, [bodyGeometry, muscleIntensities, isHeatmapMode, selectedMuscle, hoveredMuscle, vertexMap]);

  // Gentle idle animation
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.scale.y = bodyScale[1] + Math.sin(t * 1.5) * 0.0015;
    }
  });

  // Handle Raycasting click on the real human body mesh
  const handleClick = (e) => {
    e.stopPropagation();
    if (!meshRef.current) return;
    const point = e.point;
    const local = meshRef.current.worldToLocal(point.clone());
    const { id } = classifyBodyVertex(local.x, local.y, local.z);
    if (id && MUSCLE_GROUPS[id]) {
      onSelectMuscle(MUSCLE_GROUPS[id]);
    }
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    if (!meshRef.current) return;
    const point = e.point;
    const local = meshRef.current.worldToLocal(point.clone());
    const { id } = classifyBodyVertex(local.x, local.y, local.z);
    if (id && MUSCLE_GROUPS[id]) {
      onHoverMuscle(MUSCLE_GROUPS[id]);
      document.body.style.cursor = 'pointer';
    } else {
      onHoverMuscle(null);
      document.body.style.cursor = 'default';
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    onHoverMuscle(null);
    document.body.style.cursor = 'default';
  };

  if (!bodyGeometry) return null;

  return (
    <group position={[0, -0.05, 0]} scale={bodyScale}>
      {/* Real 3D Athletic Human Body Mesh */}
      <mesh
        ref={meshRef}
        geometry={bodyGeometry}
        onClick={handleClick}
        onPointerMove={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          vertexColors
          roughness={0.35}
          metalness={0.18}
          wireframe={isWireframe}
          clearcoat={0.25}
          clearcoatRoughness={0.3}
          reflectivity={0.5}
        />
      </mesh>

      {/* Wireframe Skeleton Rig Overlay */}
      {showSkeleton && (
        <mesh geometry={bodyGeometry} scale={[1.002, 1.002, 1.002]}>
          <meshBasicMaterial
            color="#1E293B"
            wireframe={true}
            transparent={true}
            opacity={0.15}
          />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload('/models/human_body.glb');
