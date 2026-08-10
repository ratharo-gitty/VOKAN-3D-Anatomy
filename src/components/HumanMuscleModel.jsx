import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MUSCLE_GROUPS, getHeatmapColor } from '../data/muscleData';

// Custom Anatomical Geometry Generators for Realistic Muscle Forms
const createMuscleGeometry = (shape) => {
  switch (shape) {
    case 'pectoral_upper':
      return new THREE.BoxGeometry(1.2, 0.45, 0.45, 16, 16, 16);
    case 'pectoral_lower':
      return new THREE.CylinderGeometry(0.55, 0.45, 0.65, 32);
    case 'deltoid':
      return new THREE.SphereGeometry(0.5, 24, 24);
    case 'bicep':
      return new THREE.CapsuleGeometry(0.32, 0.65, 16, 24);
    case 'tricep':
      return new THREE.CapsuleGeometry(0.35, 0.7, 16, 24);
    case 'forearm':
      return new THREE.CylinderGeometry(0.35, 0.2, 0.8, 24);
    case 'abs':
      return new THREE.BoxGeometry(0.85, 1.1, 0.25, 8, 16, 4);
    case 'oblique':
      return new THREE.CylinderGeometry(0.3, 0.4, 0.9, 16);
    case 'traps':
      return new THREE.ConeGeometry(0.85, 0.6, 16);
    case 'traps_mid':
      return new THREE.OctahedronGeometry(0.65, 2);
    case 'lat':
      return new THREE.CylinderGeometry(0.6, 0.2, 1.2, 24);
    case 'erector':
      return new THREE.BoxGeometry(0.4, 1.2, 0.3, 8, 16, 4);
    case 'glute':
      return new THREE.SphereGeometry(0.55, 24, 24);
    case 'quad':
      return new THREE.CapsuleGeometry(0.42, 1.1, 16, 24);
    case 'hamstring':
      return new THREE.CapsuleGeometry(0.38, 1.0, 16, 24);
    case 'calf':
      return new THREE.CapsuleGeometry(0.32, 0.8, 16, 24);
    default:
      return new THREE.SphereGeometry(0.4, 16, 16);
  }
};

// Single Muscle Component
const IndividualMuscle = ({
  muscle,
  intensity = 0,
  isHeatmapMode = true,
  isWireframe = false,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
  onUnhover
}) => {
  const meshRef = useRef();

  // Create geometry once per shape
  const geometry = useMemo(() => createMuscleGeometry(muscle.shape), [muscle.shape]);

  // Compute Color & Glow based on mode & intensity
  const { baseColor, emissiveColor, emissiveIntensity } = useMemo(() => {
    if (isSelected) {
      return {
        baseColor: '#00F2FE',
        emissiveColor: '#00F2FE',
        emissiveIntensity: 0.8
      };
    }

    if (isHovered) {
      return {
        baseColor: '#FFD700',
        emissiveColor: '#FFD700',
        emissiveIntensity: 0.6
      };
    }

    if (!isHeatmapMode || intensity === 0) {
      // Sleek Monochromatic Grayscale baseline
      return {
        baseColor: '#424750',
        emissiveColor: '#000000',
        emissiveIntensity: 0
      };
    }

    // Heatmap dynamic color
    const hexColor = getHeatmapColor(intensity);
    return {
      baseColor: hexColor,
      emissiveColor: hexColor,
      emissiveIntensity: Math.min(0.15 + intensity * 0.12, 0.75)
    };
  }, [intensity, isHeatmapMode, isSelected, isHovered]);

  // Subtle breathing/pulse animation if selected or peak intensity
  useFrame((state) => {
    if (meshRef.current && (isSelected || intensity > 4)) {
      const t = state.clock.getElapsedTime();
      const pulse = 1 + Math.sin(t * 4) * 0.03;
      meshRef.current.scale.set(
        muscle.scale[0] * pulse,
        muscle.scale[1] * pulse,
        muscle.scale[2] * pulse
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={muscle.position}
      rotation={muscle.rotation}
      scale={muscle.scale}
      geometry={geometry}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(muscle);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(muscle);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onUnhover();
      }}
    >
      <meshStandardMaterial
        color={baseColor}
        emissive={emissiveColor}
        emissiveIntensity={emissiveIntensity}
        roughness={isHeatmapMode && intensity > 0 ? 0.25 : 0.4}
        metalness={0.2}
        wireframe={isWireframe}
        transparent={true}
        opacity={0.92}
      />
    </mesh>
  );
};

// Skeleton & Body Core Alignment Lines
const HumanSkeletonRig = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Spine column */}
      <mesh position={[0, 0.8, -0.05]}>
        <cylinderGeometry args={[0.08, 0.1, 2.8, 16]} />
        <meshStandardMaterial color="#1F232B" roughness={0.8} metalness={0.5} />
      </mesh>
      {/* Pelvis region */}
      <mesh position={[0, -0.2, -0.05]}>
        <cylinderGeometry args={[0.45, 0.35, 0.4, 16]} />
        <meshStandardMaterial color="#262A33" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Ribcage frame */}
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.62, 16, 16]} />
        <meshStandardMaterial color="#1D2027" transparent opacity={0.3} wireframe />
      </mesh>
      {/* Head placeholder */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial color="#353A45" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.35, 16]} />
        <meshStandardMaterial color="#2D323E" roughness={0.6} />
      </mesh>
    </group>
  );
};

// Complete Human Anatomical Model
export default function HumanMuscleModel({
  muscleIntensities = {},
  isHeatmapMode = true,
  isWireframe = false,
  showSkeleton = true,
  selectedMuscle = null,
  onSelectMuscle,
  hoveredMuscle = null,
  onHoverMuscle
}) {
  const handleUnhover = () => {
    if (onHoverMuscle) onHoverMuscle(null);
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Internal structural skeleton */}
      {showSkeleton && <HumanSkeletonRig />}

      {/* Render all anatomical muscle groups */}
      {Object.values(MUSCLE_GROUPS).map((muscle) => {
        const intensity = muscleIntensities[muscle.id] || 0;
        const isSelected = selectedMuscle?.id === muscle.id;
        const isHovered = hoveredMuscle?.id === muscle.id;

        return (
          <IndividualMuscle
            key={muscle.id}
            muscle={muscle}
            intensity={intensity}
            isHeatmapMode={isHeatmapMode}
            isWireframe={isWireframe}
            isSelected={isSelected}
            isHovered={isHovered}
            onSelect={onSelectMuscle}
            onHover={onHoverMuscle}
            onUnhover={handleUnhover}
          />
        );
      })}
    </group>
  );
}
