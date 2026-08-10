import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MUSCLE_GROUPS } from '../data/muscleData';

/*
 * VOKAN 3D Anatomy – Écorché-Style Muscle Model
 *
 * Uses the real GLB human body as a base silhouette (ghost mesh),
 * then overlays anatomically-shaped, individually-selectable muscle
 * meshes on top — styled in monochrome grayscale with subtle
 * striations, exactly like a classical écorché sculpture.
 *
 * Each muscle is a separate Three.js mesh → clickable, hoverable,
 * independently colorable by workout heatmap intensity.
 */

// ── Heatmap color palette ──────────────────────────────────────────
const HEAT = [
  new THREE.Color('#3A3D42'), // 0 – resting dark slate
  new THREE.Color('#00F2FE'), // 1 – cyan
  new THREE.Color('#FFD700'), // 2 – gold
  new THREE.Color('#FF5E00'), // 3 – fiery orange
  new THREE.Color('#FF0055'), // 4 – crimson
  new THREE.Color('#D900FF'), // 5 – magenta
];

function heatColor(intensity) {
  if (intensity <= 0) return HEAT[0].clone();
  const i = Math.min(Math.floor(intensity), HEAT.length - 2);
  return HEAT[i].clone().lerp(HEAT[i + 1], intensity - i);
}

// ── Muscle shape factory ───────────────────────────────────────────
// Creates anatomically-proportioned geometries for each muscle type
function muscleGeo(shape, sx, sy, sz) {
  let g;
  switch (shape) {
    // Flat fan-shaped pectoral
    case 'pectoral_upper':
    case 'pectoral_lower': {
      g = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
      g.scale(sx, sy * 0.6, sz * 0.7);
      break;
    }
    // Round deltoid cap
    case 'deltoid': {
      g = new THREE.SphereGeometry(1, 24, 20);
      g.scale(sx, sy, sz);
      break;
    }
    // Elongated spindle (bicep / tricep / hamstring)
    case 'bicep':
    case 'tricep':
    case 'hamstring': {
      g = new THREE.CapsuleGeometry(1, 1.8, 12, 24);
      g.scale(sx * 0.75, sy, sz * 0.75);
      break;
    }
    // Tapered cylinder forearm
    case 'forearm': {
      g = new THREE.CylinderGeometry(0.85, 0.55, 2, 20);
      g.scale(sx * 0.65, sy, sz * 0.65);
      break;
    }
    // Ribbed six-pack abs
    case 'abs': {
      g = new THREE.BoxGeometry(1, 1.4, 0.5, 4, 8, 2);
      // Add slight curvature
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const z = pos.getZ(i);
        pos.setZ(i, z + Math.cos(pos.getY(i) * 4.5) * 0.04);
      }
      g.scale(sx, sy, sz);
      break;
    }
    // Oblique wedge
    case 'oblique': {
      g = new THREE.CylinderGeometry(0.6, 0.9, 1.6, 16);
      g.scale(sx * 0.8, sy, sz * 0.6);
      break;
    }
    // Diamond-shaped trapezius
    case 'traps':
    case 'traps_mid': {
      g = new THREE.OctahedronGeometry(1, 2);
      g.scale(sx, sy * 0.7, sz * 0.5);
      break;
    }
    // Wide lat fan
    case 'lat': {
      g = new THREE.ConeGeometry(1, 2.2, 20);
      g.rotateZ(Math.PI);
      g.scale(sx, sy, sz * 0.6);
      break;
    }
    // Deep erector column
    case 'erector': {
      g = new THREE.CapsuleGeometry(0.5, 2.2, 8, 16);
      g.scale(sx * 0.6, sy, sz * 0.45);
      break;
    }
    // Rounded glute
    case 'glute': {
      g = new THREE.SphereGeometry(1, 24, 20);
      g.scale(sx, sy * 0.9, sz);
      break;
    }
    // Teardrop quad
    case 'quad': {
      g = new THREE.CapsuleGeometry(1, 2, 12, 24);
      g.scale(sx * 0.85, sy, sz * 0.85);
      break;
    }
    // Calf diamond
    case 'calf': {
      g = new THREE.CapsuleGeometry(0.85, 1.5, 12, 20);
      g.scale(sx * 0.75, sy, sz * 0.75);
      break;
    }
    default: {
      g = new THREE.SphereGeometry(1, 20, 20);
      g.scale(sx, sy, sz);
    }
  }
  g.computeVertexNormals();
  return g;
}

// ── Single Muscle Mesh ─────────────────────────────────────────────
function MusclePiece({
  muscle,
  intensity = 0,
  heatmap = true,
  wireframe = false,
  selected = false,
  hovered = false,
  onSelect,
  onHover,
  onUnhover,
}) {
  const ref = useRef();

  const geometry = useMemo(
    () => muscleGeo(muscle.shape, muscle.scale[0], muscle.scale[1], muscle.scale[2]),
    [muscle.shape, muscle.scale]
  );

  // Compute material properties
  const { color, emissive, emissiveI, rough, metal } = useMemo(() => {
    if (selected) return { color: '#00F2FE', emissive: '#00F2FE', emissiveI: 0.55, rough: 0.25, metal: 0.2 };
    if (hovered) return { color: '#E2E8F0', emissive: '#94A3B8', emissiveI: 0.3, rough: 0.3, metal: 0.15 };

    if (!heatmap || intensity <= 0) {
      // Écorché grayscale — subtle tonal variation per muscle for depth
      const base = 0.22 + (muscle.id.charCodeAt(0) % 10) * 0.008;
      const c = new THREE.Color().setHSL(0, 0, base);
      return { color: '#' + c.getHexString(), emissive: '#000000', emissiveI: 0, rough: 0.55, metal: 0.08 };
    }

    const hc = heatColor(intensity);
    return {
      color: '#' + hc.getHexString(),
      emissive: '#' + hc.getHexString(),
      emissiveI: Math.min(0.1 + intensity * 0.09, 0.65),
      rough: 0.3,
      metal: 0.12,
    };
  }, [intensity, heatmap, selected, hovered, muscle.id]);

  // Pulse selected / high-intensity muscles
  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (selected || intensity > 4.5) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 3.5) * 0.015;
      ref.current.scale.set(muscle.scale[0] * s, muscle.scale[1] * s, muscle.scale[2] * s);
    }
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      position={muscle.position}
      rotation={muscle.rotation}
      scale={muscle.scale}
      castShadow
      onClick={(e) => { e.stopPropagation(); onSelect(muscle); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(muscle); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); document.body.style.cursor = 'default'; }}
    >
      <meshPhysicalMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveI}
        roughness={rough}
        metalness={metal}
        wireframe={wireframe}
        clearcoat={0.15}
        clearcoatRoughness={0.4}
        transparent
        opacity={0.94}
      />
    </mesh>
  );
}

// ── Ghost body silhouette (loaded from GLB) ────────────────────────
function GhostBody({ visible }) {
  const { scene } = useGLTF('/models/human_body.glb');

  const geo = useMemo(() => {
    let g = null;
    scene.traverse((child) => {
      if (child.isMesh && !g) g = child.geometry.clone();
    });
    return g;
  }, [scene]);

  if (!geo || !visible) return null;

  return (
    <mesh geometry={geo}>
      <meshPhysicalMaterial
        color="#1a1d22"
        roughness={0.7}
        metalness={0.05}
        transparent
        opacity={0.12}
        depthWrite={false}
        wireframe
      />
    </mesh>
  );
}
useGLTF.preload('/models/human_body.glb');

// ── Inner skeleton rig ─────────────────────────────────────────────
function SkeletonRig() {
  return (
    <group>
      {/* Spine */}
      <mesh position={[0, 0.8, -0.05]}>
        <cylinderGeometry args={[0.06, 0.08, 2.6, 12]} />
        <meshStandardMaterial color="#15181e" roughness={0.85} metalness={0.3} />
      </mesh>
      {/* Pelvis */}
      <mesh position={[0, -0.15, -0.03]}>
        <cylinderGeometry args={[0.38, 0.3, 0.3, 14]} />
        <meshStandardMaterial color="#1a1e26" roughness={0.75} metalness={0.25} />
      </mesh>
      {/* Ribcage */}
      <mesh position={[0, 1.0, 0.02]}>
        <sphereGeometry args={[0.52, 14, 14]} />
        <meshStandardMaterial color="#14171d" transparent opacity={0.2} wireframe />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.15, 0.02]}>
        <sphereGeometry args={[0.32, 20, 20]} />
        <meshStandardMaterial color="#2a2e38" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.78, 0.01]}>
        <cylinderGeometry args={[0.14, 0.18, 0.3, 12]} />
        <meshStandardMaterial color="#222630" roughness={0.6} />
      </mesh>
    </group>
  );
}

// ── Complete Écorché Model ─────────────────────────────────────────
export default function HumanMuscleModel({
  muscleIntensities = {},
  isHeatmapMode = true,
  isWireframe = false,
  showSkeleton = true,
  selectedMuscle = null,
  onSelectMuscle,
  hoveredMuscle = null,
  onHoverMuscle,
}) {
  return (
    <group>
      {/* Semi-transparent body ghost silhouette */}
      <GhostBody visible={showSkeleton} />

      {/* Internal skeleton structure */}
      {showSkeleton && <SkeletonRig />}

      {/* Individual écorché muscle pieces */}
      {Object.values(MUSCLE_GROUPS).map((m) => (
        <MusclePiece
          key={m.id}
          muscle={m}
          intensity={muscleIntensities[m.id] || 0}
          heatmap={isHeatmapMode}
          wireframe={isWireframe}
          selected={selectedMuscle?.id === m.id}
          hovered={hoveredMuscle?.id === m.id}
          onSelect={onSelectMuscle}
          onHover={onHoverMuscle}
          onUnhover={() => onHoverMuscle(null)}
        />
      ))}
    </group>
  );
}
