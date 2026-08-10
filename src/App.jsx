import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { classifyMuscleVertex, isPlateBoundary, isChartSeam } from './muscleComponents';

// Bust GLB + module caches every load
const MODEL_URL = `/models/human_body.glb?v=icon24-${Date.now()}`;

// Icon-board palette
const SKIN = new THREE.Color('#B7C2CE'); // lighter blue-grey (head/hands/gaps)
const MUSCLE = new THREE.Color('#8B9AAB'); // panel fill
const SEAM = new THREE.Color('#152238'); // thick navy outlines

function makeToonGradient() {
  // 4-step toon ramp (RGBA)
  const data = new Uint8Array([
    70, 70, 70, 255, // shade
    130, 130, 130, 255,
    190, 190, 190, 255,
    245, 245, 245, 255, // lit
  ]);
  const tex = new THREE.DataTexture(data, 4, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

function paintIconAnatomy(geometry) {
  const pos = geometry.attributes.position;
  const colors = new Float32Array(pos.count * 3);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const { id, rim } = classifyMuscleVertex(x, y, z);

    let color = SKIN;
    if (id) {
      const onSeam = isChartSeam(x, y, z) || isPlateBoundary(x, y, z, id) || rim > 0.82;
      color = onSeam ? SEAM : MUSCLE;
    } else if (isChartSeam(x, y, z)) {
      color = SEAM;
    }

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

function BodyModel() {
  const { scene } = useGLTF(MODEL_URL);
  const gradientMap = useMemo(() => makeToonGradient(), []);

  const group = useMemo(() => {
    let sourceGeo = null;
    scene.traverse((child) => {
      if (child.isMesh && child.geometry && !sourceGeo) sourceGeo = child.geometry;
    });
    if (!sourceGeo) return null;

    const geo = sourceGeo.clone();
    if (!geo.attributes.normal) geo.computeVertexNormals();
    paintIconAnatomy(geo);

    const root = new THREE.Group();

    const outline = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({
        color: SEAM,
        side: THREE.BackSide,
      })
    );
    outline.scale.setScalar(1.018);
    root.add(outline);

    const body = new THREE.Mesh(
      geo,
      new THREE.MeshToonMaterial({
        vertexColors: true,
        gradientMap,
      })
    );
    body.castShadow = true;
    body.receiveShadow = true;
    root.add(body);

    return root;
  }, [scene, gradientMap]);

  if (!group) return null;
  return <primitive object={group} position={[0, -0.05, 0]} />;
}

useGLTF.preload(MODEL_URL);

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, background: '#EEF1F4' }}>
      <Canvas
        shadows
        gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
        onCreated={({ gl }) => {
          gl.setClearColor(0xeef1f4, 1);
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.04, 1.5]} fov={36} />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          target={[0, 0.02, 0]}
          minDistance={0.5}
          maxDistance={2.8}
        />

        {/* Soft, even infographic lighting */}
        <ambientLight intensity={0.85} />
        <hemisphereLight args={[0xffffff, 0xc8d0da, 0.55]} />
        <directionalLight position={[3, 5, 2]} intensity={0.45} castShadow />
        <directionalLight position={[-2.5, 2, -1.5]} intensity={0.22} />

        <ContactShadows
          position={[0, -0.52, 0]}
          opacity={0.12}
          scale={3}
          blur={3.5}
          far={2}
          color="#4b5563"
        />

        <BodyModel />
      </Canvas>
    </div>
  );
}
