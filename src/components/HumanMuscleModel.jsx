import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MUSCLE_GROUPS } from '../data/muscleData';
import { generateMuscleStriationNormalMap, generateMuscleAmbientOcclusionMap } from '../utils/textureGenerator';

/*
 * VOKAN 3D Anatomy — Exact Écorché Reference-Matched 3D Human Body Engine
 * 
 * 1:1 Match with Anatomical Écorché Reference Diagrams:
 * - Anatomical Color Modes:
 *   1. "reference" (Default): Deep Terracotta Red muscle bellies + Creamy White Tendons & Fascia
 *   2. "grayscale": Sleek Metallic Dark Slate muscle bellies + White Tendons & Fascia
 *   3. "heatmap": Dynamic workout progressive volume visualizer
 * - Sculpted Muscle Bellies & Anatomical Fascia Insertions:
 *   * Linea Alba & 3 Horizontal Abdominal Tendon Intersections
 *   * Thoracolumbar Back Aponeurosis Diamond & Spine Groove
 *   * Serratus Anterior Ribcage Finger Slips
 *   * Quadriceps Patellar Tendons & Calcaneal Achilles Heel Tendons
 *   * Cranial Skull & Neck Tendon Cap
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

// Checks if a vertex belongs to anatomical fascia/tendon/bone insertions matching reference image
function isAnatomicalFasciaVertex(x, y, z) {
  // 1. Skull & Cranial Cap (Matching reference image white head structure)
  if (y > 0.42) return true;

  // 2. Clavicles & Sternum Center Line
  if (y > 0.28 && y < 0.38 && Math.abs(x) < 0.012 && z > 0.02) return true;

  // 3. Linea Alba & Abdominal Tendinous Intersections (Front Core)
  if (z > 0.035 && y > 0.02 && y < 0.22) {
    if (Math.abs(x) < 0.005) return true;
    if (Math.abs(x) < 0.035 && (Math.abs(y - 0.16) < 0.006 || Math.abs(y - 0.11) < 0.006 || Math.abs(y - 0.06) < 0.006)) {
      return true;
    }
  }

  // 4. Thoracolumbar Spinal Aponeurosis / Fascia (Back Spine Diamond)
  if (z < -0.032 && y > 0.02 && y < 0.34) {
    if (Math.abs(x) < 0.006) return true;
    if (y < 0.12 && Math.abs(z) > 0.035 && Math.abs(x) < (0.028 - y * 0.06)) return true;
  }

  // 5. Patellar & Knee Tendon Insertions (Front Knees)
  if (y > -0.32 && y < -0.27 && Math.abs(z) > 0.018 && Math.abs(x) > 0.012 && Math.abs(x) < 0.04) {
    return true;
  }

  // 6. Calcaneal Achilles Heel Tendons (Back Heel)
  if (y > -0.48 && y < -0.39 && z < -0.012 && Math.abs(x) > 0.016 && Math.abs(x) < 0.036) {
    return true;
  }

  return false;
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

// 3D Anatomical Fascia & Tendon Overlay Component (1:1 Reference Match)
function AnatomicalFasciaOverlay({ colorTheme = 'reference' }) {
  const fasciaColor = colorTheme === 'reference' ? '#F3EFE6' : '#E2E8F0';

  return (
    <group position={[0, -0.05, 0]}>
      {/* Front Linea Alba (White Abdominal Tendon Line) */}
      <mesh position={[0, 0.11, 0.065]}>
        <boxGeometry args={[0.006, 0.18, 0.005]} />
        <meshStandardMaterial color={fasciaColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Horizontal Abdominal Tendon Intersections */}
      {[0.16, 0.11, 0.06].map((yPos, i) => (
        <mesh key={i} position={[0, yPos, 0.064]}>
          <boxGeometry args={[0.065, 0.005, 0.004]} />
          <meshStandardMaterial color={fasciaColor} roughness={0.3} metalness={0.1} />
        </mesh>
      ))}

      {/* Serratus Anterior Rib Interdigitation Fingers */}
      {[-0.038, 0.038].map((xPos, sideIdx) =>
        [0.18, 0.14, 0.10].map((yPos, i) => (
          <mesh key={`${sideIdx}-${i}`} position={[xPos, yPos, 0.045]} rotation={[0, sideIdx === 0 ? 0.3 : -0.3, -0.2]}>
            <boxGeometry args={[0.022, 0.004, 0.004]} />
            <meshStandardMaterial color={fasciaColor} roughness={0.35} metalness={0.1} />
          </mesh>
        ))
      )}

      {/* Back Thoracolumbar Spinal Aponeurosis (White Back Fascia Diamond) */}
      <mesh position={[0, 0.15, -0.042]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.055, 0.055, 0.004]} />
        <meshStandardMaterial color={fasciaColor} roughness={0.35} metalness={0.1} />
      </mesh>

      {/* Spinal Groove Line */}
      <mesh position={[0, 0.22, -0.043]}>
        <boxGeometry args={[0.006, 0.26, 0.004]} />
        <meshStandardMaterial color={fasciaColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Iliotibial (IT) Lateral Thigh Fascia Bands */}
      {[-0.042, 0.042].map((xPos, i) => (
        <mesh key={i} position={[xPos, -0.18, 0.010]}>
          <boxGeometry args={[0.004, 0.16, 0.012]} />
          <meshStandardMaterial color={fasciaColor} roughness={0.3} metalness={0.1} />
        </mesh>
      ))}

      {/* Knee Patellar Tendons */}
      {[-0.028, 0.028].map((xPos, i) => (
        <mesh key={i} position={[xPos, -0.29, 0.038]}>
          <boxGeometry args={[0.016, 0.032, 0.005]} />
          <meshStandardMaterial color={fasciaColor} roughness={0.3} metalness={0.1} />
        </mesh>
      ))}

      {/* Achilles Heel Tendons */}
      {[-0.026, 0.026].map((xPos, i) => (
        <mesh key={i} position={[xPos, -0.42, -0.024]}>
          <boxGeometry args={[0.012, 0.07, 0.005]} />
          <meshStandardMaterial color={fasciaColor} roughness={0.3} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

export default function HumanMuscleModel({
  bodyType = 'unisex',
  colorTheme = 'reference', // 'reference' (Red/Terracotta + White), 'grayscale' (Slate + White)
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

  // Procedural muscle striation normal map & AO map
  const muscleNormalMap = useMemo(() => generateMuscleStriationNormalMap(), []);
  const muscleAoMap = useMemo(() => generateMuscleAmbientOcclusionMap(), []);

  // Body scale per physique mode
  const bodyScale = useMemo(() => {
    switch (bodyType) {
      case 'unisex':
        return [0.98, 0.99, 0.94];
      case 'male':
        return [1.02, 1.0, 0.98];
      case 'female':
        return [0.94, 0.98, 0.90];
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

  // Update vertex colors dynamically (muscle bellies vs anatomical fascia lines)
  useEffect(() => {
    if (!bodyGeometry || vertexMap.length === 0) return;

    const pos = bodyGeometry.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    // Baseline muscle color palette
    const baseTerracottaRed = new THREE.Color('#B53A2A'); // Reference image écorché red
    const baseSlate = new THREE.Color('#3A3D42');         // Dark slate écorché
    const fasciaWhite = colorTheme === 'reference' ? new THREE.Color('#F5F2EB') : new THREE.Color('#CBD5E1');

    const baseColor = colorTheme === 'reference' ? baseTerracottaRed : baseSlate;

    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);

      if (isAnatomicalFasciaVertex(vx, vy, vz)) {
        colors[i * 3] = fasciaWhite.r;
        colors[i * 3 + 1] = fasciaWhite.g;
        colors[i * 3 + 2] = fasciaWhite.b;
        continue;
      }

      const { id, dist } = vertexMap[i];
      let color;

      if (!isHeatmapMode || !id) {
        color = baseColor;
      } else {
        const intensity = muscleIntensities[id] || 0;

        if (selectedMuscle && id === selectedMuscle.id) {
          color = new THREE.Color('#00F2FE');
        } else if (hoveredMuscle && id === hoveredMuscle.id) {
          color = new THREE.Color('#FFD700');
        } else if (intensity > 0) {
          color = getInterpolatedHeatColor(intensity);
          const blendFactor = Math.max(0, 1 - dist);
          color = baseColor.clone().lerp(color, blendFactor);
        } else {
          color = baseColor;
        }
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    bodyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    bodyGeometry.attributes.color.needsUpdate = true;
  }, [bodyGeometry, muscleIntensities, isHeatmapMode, colorTheme, selectedMuscle, hoveredMuscle, vertexMap]);

  // Gentle idle breathing animation
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.scale.y = bodyScale[1] + Math.sin(t * 1.5) * 0.0015;
    }
  });

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
      {/* Real 3D Anatomical Human Body Mesh with Muscle Striation Normal Map */}
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
          normalMap={muscleNormalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          aoMap={muscleAoMap}
          aoMapIntensity={0.6}
          roughness={0.32}
          metalness={0.15}
          wireframe={isWireframe}
          clearcoat={0.30}
          clearcoatRoughness={0.25}
          reflectivity={0.5}
        />
      </mesh>

      {/* Anatomical Fascia & Tendon Accents (1:1 Match with Reference Image) */}
      <AnatomicalFasciaOverlay colorTheme={colorTheme} />

      {/* Skeleton Wireframe Rig Overlay */}
      {showSkeleton && (
        <mesh geometry={bodyGeometry} scale={[1.002, 1.002, 1.002]}>
          <meshBasicMaterial
            color="#1E293B"
            wireframe={true}
            transparent={true}
            opacity={0.12}
          />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload('/models/human_body.glb');
