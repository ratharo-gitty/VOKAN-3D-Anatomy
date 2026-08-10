import * as THREE from 'three';

/*
 * VOKAN 3D Anatomy - Procedural Muscle Fiber Striation & Ambient Occlusion Texture Generator
 * 
 * Creates high-resolution normal maps and ambient occlusion textures that give 3D muscle meshes
 * realistic anatomical muscle fiber grooves, striations, and deep crevice shadowing.
 */

export function generateMuscleStriationNormalMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Fill with neutral normal map color (RGB 128, 128, 255)
  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, 1024, 1024);

  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;

  // Generate longitudinal muscle fiber grooves
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const idx = (y * 1024 + x) * 4;

      // Fine fiber striation frequency
      const striation = Math.sin(x * 0.4) * 0.5 + Math.sin(y * 0.15 + Math.sin(x * 0.05) * 5.0) * 0.5;
      const microStriation = Math.sin(x * 1.2) * 0.25;

      const deltaX = (striation + microStriation) * 45;
      const deltaY = (Math.cos(y * 0.3) * 0.2) * 45;

      // Compute normal vector perturbation
      const nx = Math.max(0, Math.min(255, 128 + deltaX));
      const ny = Math.max(0, Math.min(255, 128 + deltaY));
      const nz = 255;

      data[idx] = nx;
      data[idx + 1] = ny;
      data[idx + 2] = nz;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 16);
  return texture;
}

export function generateMuscleAmbientOcclusionMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base white AO
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 512);

  // Draw subtle muscle crevice gradient grooves
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  for (let y = 0; y < 512; y += 32) {
    ctx.fillRect(0, y, 512, 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 8);
  return texture;
}
