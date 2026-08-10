import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MUSCLE_GROUPS } from '../data/muscleData';

/*
 * VOKAN 3D Anatomy - Real Body GLB Model with Positional Muscle Heatmap Shader
 * 
 * Uses a real human body GLB mesh as the base silhouette.
 * A custom vertex shader maps each vertex position to the nearest
 * anatomical muscle region and colors it with the heatmap intensity.
 */

// Anatomical region definitions: bounding-box-like zones in model space
// Each region defines a center point and radii for ellipsoidal matching
const MUSCLE_REGIONS = {
  // CHEST
  chest_upper:     { center: [0, 0.38, 0.08], radii: [0.14, 0.06, 0.06], priority: 10 },
  chest_lower:     { center: [0, 0.30, 0.09], radii: [0.16, 0.07, 0.06], priority: 9 },

  // SHOULDERS
  delt_anterior_left:  { center: [-0.19, 0.40, 0.06], radii: [0.05, 0.06, 0.06], priority: 11 },
  delt_anterior_right: { center: [ 0.19, 0.40, 0.06], radii: [0.05, 0.06, 0.06], priority: 11 },
  delt_lateral_left:   { center: [-0.22, 0.42, 0.0],  radii: [0.05, 0.06, 0.06], priority: 12 },
  delt_lateral_right:  { center: [ 0.22, 0.42, 0.0],  radii: [0.05, 0.06, 0.06], priority: 12 },
  delt_posterior_left:  { center: [-0.19, 0.40, -0.06], radii: [0.05, 0.06, 0.06], priority: 11 },
  delt_posterior_right: { center: [ 0.19, 0.40, -0.06], radii: [0.05, 0.06, 0.06], priority: 11 },

  // ARMS
  biceps_left:     { center: [-0.26, 0.28, 0.03],  radii: [0.04, 0.08, 0.04], priority: 13 },
  biceps_right:    { center: [ 0.26, 0.28, 0.03],  radii: [0.04, 0.08, 0.04], priority: 13 },
  triceps_left:    { center: [-0.26, 0.28, -0.03], radii: [0.04, 0.08, 0.04], priority: 13 },
  triceps_right:   { center: [ 0.26, 0.28, -0.03], radii: [0.04, 0.08, 0.04], priority: 13 },
  forearms_left:   { center: [-0.32, 0.14, 0.0],   radii: [0.035, 0.09, 0.035], priority: 14 },
  forearms_right:  { center: [ 0.32, 0.14, 0.0],   radii: [0.035, 0.09, 0.035], priority: 14 },

  // BACK
  traps_upper:     { center: [0, 0.48, -0.04],  radii: [0.14, 0.05, 0.05], priority: 8 },
  traps_mid_lower: { center: [0, 0.35, -0.07],  radii: [0.12, 0.08, 0.05], priority: 7 },
  lats_left:       { center: [-0.12, 0.24, -0.06], radii: [0.08, 0.12, 0.05], priority: 6 },
  lats_right:      { center: [ 0.12, 0.24, -0.06], radii: [0.08, 0.12, 0.05], priority: 6 },
  erector_spinae:  { center: [0, 0.12, -0.07],  radii: [0.06, 0.12, 0.04], priority: 5 },

  // CORE
  abs_rectus:      { center: [0, 0.16, 0.08],   radii: [0.08, 0.12, 0.04], priority: 9 },
  obliques_left:   { center: [-0.10, 0.16, 0.06], radii: [0.05, 0.10, 0.05], priority: 8 },
  obliques_right:  { center: [ 0.10, 0.16, 0.06], radii: [0.05, 0.10, 0.05], priority: 8 },

  // GLUTES
  glutes_left:     { center: [-0.08, -0.04, -0.06], radii: [0.07, 0.07, 0.06], priority: 7 },
  glutes_right:    { center: [ 0.08, -0.04, -0.06], radii: [0.07, 0.07, 0.06], priority: 7 },

  // LEGS
  quads_left:      { center: [-0.08, -0.22, 0.03], radii: [0.06, 0.14, 0.06], priority: 6 },
  quads_right:     { center: [ 0.08, -0.22, 0.03], radii: [0.06, 0.14, 0.06], priority: 6 },
  hamstrings_left: { center: [-0.08, -0.22, -0.04], radii: [0.06, 0.14, 0.05], priority: 5 },
  hamstrings_right:{ center: [ 0.08, -0.22, -0.04], radii: [0.06, 0.14, 0.05], priority: 5 },
  calves_left:     { center: [-0.07, -0.48, -0.01], radii: [0.045, 0.10, 0.045], priority: 4 },
  calves_right:    { center: [ 0.07, -0.48, -0.01], radii: [0.045, 0.10, 0.045], priority: 4 },
};

// Heatmap color palette
const HEAT_COLORS = [
  new THREE.Color('#3D4148'), // 0 - idle gray
  new THREE.Color('#00F2FE'), // 1 - cyan
  new THREE.Color('#FFD700'), // 2 - gold
  new THREE.Color('#FF5E00'), // 3 - orange
  new THREE.Color('#FF0055'), // 4 - red
  new THREE.Color('#D900FF'), // 5 - magenta
];

function getHeatColor(intensity) {
  if (intensity <= 0) return HEAT_COLORS[0];
  const idx = Math.min(Math.floor(intensity), HEAT_COLORS.length - 2);
  const t = intensity - idx;
  const c = new THREE.Color();
  c.lerpColors(HEAT_COLORS[idx], HEAT_COLORS[idx + 1], t);
  return c;
}

// Determine which muscle region a 3D point belongs to
function classifyVertex(x, y, z) {
  let bestId = null;
  let bestDist = Infinity;
  let bestPriority = -1;

  for (const [id, region] of Object.entries(MUSCLE_REGIONS)) {
    const dx = (x - region.center[0]) / region.radii[0];
    const dy = (y - region.center[1]) / region.radii[1];
    const dz = (z - region.center[2]) / region.radii[2];
    const dist = dx * dx + dy * dy + dz * dz;

    if (dist < 1.0) { // Inside ellipsoid
      if (region.priority > bestPriority || (region.priority === bestPriority && dist < bestDist)) {
        bestId = id;
        bestDist = dist;
        bestPriority = region.priority;
      }
    }
  }
  return { id: bestId, dist: bestDist };
}

// The Real Body Model Component
function RealBodyModel({
  muscleIntensities = {},
  isHeatmapMode = true,
  isWireframe = false,
  selectedMuscle = null,
  hoveredMuscle = null,
  onSelectMuscle,
  onHoverMuscle
}) {
  const meshRef = useRef();
  const { scene } = useGLTF('/models/human_body.glb');

  // Clone & extract the body mesh
  const bodyGeometry = useMemo(() => {
    let geo = null;
    scene.traverse((child) => {
      if (child.isMesh && !geo) {
        geo = child.geometry.clone();
      }
    });
    return geo;
  }, [scene]);

  // Store per-vertex muscle region classification
  const vertexMuscleMap = useMemo(() => {
    if (!bodyGeometry) return [];
    const pos = bodyGeometry.attributes.position;
    const map = new Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      map[i] = classifyVertex(pos.getX(i), pos.getY(i), pos.getZ(i));
    }
    return map;
  }, [bodyGeometry]);

  // Build & update per-vertex color attribute based on intensities
  useEffect(() => {
    if (!bodyGeometry || vertexMuscleMap.length === 0) return;

    const pos = bodyGeometry.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const baseGray = new THREE.Color('#3D4148');

    for (let i = 0; i < pos.count; i++) {
      const { id, dist } = vertexMuscleMap[i];
      let color;

      if (!isHeatmapMode || !id) {
        color = baseGray;
      } else {
        const intensity = muscleIntensities[id] || 0;

        if (selectedMuscle && id === selectedMuscle.id) {
          color = new THREE.Color('#00F2FE');
        } else if (hoveredMuscle && id === hoveredMuscle.id) {
          color = new THREE.Color('#FFD700');
        } else if (intensity > 0) {
          color = getHeatColor(intensity);
          // Feather edges: blend toward gray at the ellipsoid boundary
          const feather = Math.max(0, 1 - dist);
          color = baseGray.clone().lerp(color, feather);
        } else {
          color = baseGray;
        }
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    bodyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    bodyGeometry.attributes.color.needsUpdate = true;
  }, [bodyGeometry, muscleIntensities, isHeatmapMode, selectedMuscle, hoveredMuscle, vertexMuscleMap]);

  // Subtle idle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      // Very subtle breathing motion
      const t = state.clock.getElapsedTime();
      meshRef.current.scale.y = 1.0 + Math.sin(t * 1.2) * 0.002;
    }
  });

  // Raycasting click handler -> identify which muscle was clicked
  const handleClick = (e) => {
    e.stopPropagation();
    const point = e.point;
    // Transform to local space
    const local = meshRef.current.worldToLocal(point.clone());
    const { id } = classifyVertex(local.x, local.y, local.z);
    if (id && MUSCLE_GROUPS[id]) {
      onSelectMuscle(MUSCLE_GROUPS[id]);
    }
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const point = e.point;
    const local = meshRef.current.worldToLocal(point.clone());
    const { id } = classifyVertex(local.x, local.y, local.z);
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
    <mesh
      ref={meshRef}
      geometry={bodyGeometry}
      onClick={handleClick}
      onPointerMove={handlePointerOver}
      onPointerOut={handlePointerOut}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        vertexColors
        roughness={0.35}
        metalness={0.15}
        wireframe={isWireframe}
        envMapIntensity={0.6}
      />
    </mesh>
  );
}

// Preload the GLB
useGLTF.preload('/models/human_body.glb');

export default RealBodyModel;
