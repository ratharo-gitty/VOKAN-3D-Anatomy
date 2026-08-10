/**
 * Bake a homemade unisex muscular anatomy GLB from the project mesh.
 * - Neutral athletic proportions (not male/female scaled)
 * - Muscle-region inflate along normals for all 10 gym groups
 * - Preserves / widens fascia corridors for vertex coloring
 *
 * Usage: node scripts/bakeUnisexMuscular.mjs
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Minimal browser shims so GLTFLoader can skip embedded textures in Node
globalThis.self = globalThis;
class FakeImage {
  set onload(fn) {
    this._onload = fn;
  }
  set onerror(fn) {
    this._onerror = fn;
  }
  set src(_value) {
    queueMicrotask(() => {
      this.width = 1;
      this.height = 1;
      if (this._onload) this._onload();
    });
  }
}
globalThis.Image = FakeImage;
globalThis.createImageBitmap = async () => ({ width: 1, height: 1, close() {} });

// GLTFExporter binary path uses FileReader + Blob
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      Promise.resolve(blob.arrayBuffer()).then((buf) => {
        this.result = buf;
        if (typeof this.onloadend === 'function') this.onloadend({ target: this });
      });
    }
    readAsDataURL(blob) {
      Promise.resolve(blob.arrayBuffer()).then((buf) => {
        const b64 = Buffer.from(buf).toString('base64');
        this.result = `data:application/octet-stream;base64,${b64}`;
        if (typeof this.onloadend === 'function') this.onloadend({ target: this });
      });
    }
  };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MODELS = path.join(ROOT, 'public', 'models');
const TARGET = path.join(MODELS, 'human_body.glb');
const ORIGINAL = path.join(MODELS, 'human_body.original.glb');

/**
 * Gym chart groups (10): chest, shoulders, arms, forearms, abs, back,
 * glutes, quads, hamstrings, calves — inflate boosted for clearer relief.
 */
const MUSCLE_REGIONS = {
  // Chest
  chest_upper: { center: [0, 0.28, 0.08], radii: [0.048, 0.042, 0.052], inflate: 0.017 },
  chest_lower: { center: [0, 0.21, 0.08], radii: [0.050, 0.044, 0.052], inflate: 0.015 },
  chest_inner_left: { center: [-0.02, 0.25, 0.085], radii: [0.022, 0.035, 0.035], inflate: 0.012 },
  chest_inner_right: { center: [0.02, 0.25, 0.085], radii: [0.022, 0.035, 0.035], inflate: 0.012 },

  // Shoulders (3 heads)
  delt_anterior_left: { center: [-0.048, 0.29, 0.045], radii: [0.038, 0.048, 0.042], inflate: 0.020 },
  delt_anterior_right: { center: [0.048, 0.29, 0.045], radii: [0.038, 0.048, 0.042], inflate: 0.020 },
  delt_lateral_left: { center: [-0.060, 0.29, 0.010], radii: [0.038, 0.048, 0.042], inflate: 0.022 },
  delt_lateral_right: { center: [0.060, 0.29, 0.010], radii: [0.038, 0.048, 0.042], inflate: 0.022 },
  delt_posterior_left: { center: [-0.048, 0.29, -0.035], radii: [0.038, 0.048, 0.042], inflate: 0.018 },
  delt_posterior_right: { center: [0.048, 0.29, -0.035], radii: [0.038, 0.048, 0.042], inflate: 0.018 },

  // Arms
  biceps_left: { center: [-0.055, 0.20, 0.028], radii: [0.032, 0.058, 0.038], inflate: 0.014 },
  biceps_right: { center: [0.055, 0.20, 0.028], radii: [0.032, 0.058, 0.038], inflate: 0.014 },
  triceps_left: { center: [-0.055, 0.20, -0.028], radii: [0.032, 0.058, 0.038], inflate: 0.014 },
  triceps_right: { center: [0.055, 0.20, -0.028], radii: [0.032, 0.058, 0.038], inflate: 0.014 },

  // Forearms
  forearms_left: { center: [-0.065, 0.09, 0.010], radii: [0.030, 0.078, 0.032], inflate: 0.008 },
  forearms_right: { center: [0.065, 0.09, 0.010], radii: [0.030, 0.078, 0.032], inflate: 0.008 },
  forearm_flex_left: { center: [-0.062, 0.08, 0.022], radii: [0.022, 0.06, 0.022], inflate: 0.006 },
  forearm_flex_right: { center: [0.062, 0.08, 0.022], radii: [0.022, 0.06, 0.022], inflate: 0.006 },

  // Back
  traps_upper: { center: [0, 0.35, -0.015], radii: [0.052, 0.045, 0.042], inflate: 0.013 },
  traps_mid_lower: { center: [0, 0.25, -0.042], radii: [0.048, 0.068, 0.042], inflate: 0.012 },
  lats_left: { center: [-0.034, 0.16, -0.042], radii: [0.038, 0.080, 0.038], inflate: 0.017 },
  lats_right: { center: [0.034, 0.16, -0.042], radii: [0.038, 0.080, 0.038], inflate: 0.017 },
  erector_spinae: { center: [0, 0.06, -0.042], radii: [0.038, 0.080, 0.034], inflate: 0.009 },
  rhomboids: { center: [0, 0.28, -0.045], radii: [0.035, 0.04, 0.03], inflate: 0.008 },

  // Abs
  abs_rectus: { center: [0, 0.10, 0.062], radii: [0.040, 0.085, 0.038], inflate: 0.012 },
  abs_upper: { center: [0, 0.16, 0.065], radii: [0.036, 0.04, 0.032], inflate: 0.010 },
  abs_lower: { center: [0, 0.04, 0.058], radii: [0.034, 0.04, 0.032], inflate: 0.009 },
  obliques_left: { center: [-0.034, 0.09, 0.045], radii: [0.034, 0.068, 0.034], inflate: 0.010 },
  obliques_right: { center: [0.034, 0.09, 0.045], radii: [0.034, 0.068, 0.034], inflate: 0.010 },

  // Glutes
  glutes_left: { center: [-0.030, -0.04, -0.048], radii: [0.042, 0.062, 0.045], inflate: 0.016 },
  glutes_right: { center: [0.030, -0.04, -0.048], radii: [0.042, 0.062, 0.045], inflate: 0.016 },
  glute_med_left: { center: [-0.042, -0.02, -0.03], radii: [0.028, 0.04, 0.032], inflate: 0.010 },
  glute_med_right: { center: [0.042, -0.02, -0.03], radii: [0.028, 0.04, 0.032], inflate: 0.010 },

  // Quads
  quads_left: { center: [-0.028, -0.19, 0.038], radii: [0.038, 0.105, 0.042], inflate: 0.017 },
  quads_right: { center: [0.028, -0.19, 0.038], radii: [0.038, 0.105, 0.042], inflate: 0.017 },
  vastus_lat_left: { center: [-0.04, -0.2, 0.02], radii: [0.028, 0.09, 0.032], inflate: 0.012 },
  vastus_lat_right: { center: [0.04, -0.2, 0.02], radii: [0.028, 0.09, 0.032], inflate: 0.012 },
  vastus_med_left: { center: [-0.018, -0.22, 0.04], radii: [0.024, 0.07, 0.028], inflate: 0.010 },
  vastus_med_right: { center: [0.018, -0.22, 0.04], radii: [0.024, 0.07, 0.028], inflate: 0.010 },

  // Hamstrings
  hamstrings_left: { center: [-0.028, -0.19, -0.038], radii: [0.038, 0.105, 0.040], inflate: 0.013 },
  hamstrings_right: { center: [0.028, -0.19, -0.038], radii: [0.038, 0.105, 0.040], inflate: 0.013 },
  ham_lat_left: { center: [-0.038, -0.2, -0.03], radii: [0.026, 0.085, 0.03], inflate: 0.009 },
  ham_lat_right: { center: [0.038, -0.2, -0.03], radii: [0.026, 0.085, 0.03], inflate: 0.009 },

  // Calves
  calves_left: { center: [-0.028, -0.38, -0.022], radii: [0.032, 0.085, 0.034], inflate: 0.014 },
  calves_right: { center: [0.028, -0.38, -0.022], radii: [0.032, 0.085, 0.034], inflate: 0.014 },
  soleus_left: { center: [-0.026, -0.4, -0.01], radii: [0.026, 0.06, 0.028], inflate: 0.008 },
  soleus_right: { center: [0.026, -0.4, -0.01], radii: [0.026, 0.06, 0.028], inflate: 0.008 },
};

/** Keep in sync with HumanMuscleModel.isAnatomicalFasciaVertex corridors */
function isAnatomicalFasciaVertex(x, y, z) {
  const ax = Math.abs(x);

  if (y > 0.42) return true;
  if (y > 0.28 && y < 0.38 && ax < 0.014 && z > 0.015) return true;

  if (z > 0.032 && y > 0.0 && y < 0.24) {
    if (ax < 0.0065) return true;
    if (
      ax < 0.042 &&
      (Math.abs(y - 0.175) < 0.007 ||
        Math.abs(y - 0.13) < 0.007 ||
        Math.abs(y - 0.085) < 0.007 ||
        Math.abs(y - 0.04) < 0.007)
    ) {
      return true;
    }
  }

  if (z > 0.02 && y > 0.02 && y < 0.2 && ax > 0.028 && ax < 0.048) {
    if (Math.abs(z - 0.04) < 0.012) return true;
  }

  if (z > 0.04 && y > 0.22 && y < 0.32 && ax > 0.008 && ax < 0.055) {
    if (Math.abs(y - (0.3 - ax * 0.9)) < 0.01) return true;
  }

  if (y > 0.24 && y < 0.34 && ax > 0.035 && ax < 0.075) {
    if (Math.abs(z) < 0.055 && (Math.abs(z - 0.02) < 0.008 || Math.abs(z + 0.018) < 0.008)) {
      return true;
    }
  }

  if (y > 0.12 && y < 0.26 && ax > 0.04 && ax < 0.08) {
    if (Math.abs(z) < 0.008) return true;
  }

  if (y > 0.02 && y < 0.14 && ax > 0.05 && ax < 0.085) {
    if (Math.abs(z) < 0.01) return true;
  }

  if (z < -0.028 && y > 0.0 && y < 0.36) {
    if (ax < 0.008) return true;
    if (y > 0.18 && y < 0.34 && ax > 0.018 && ax < 0.055 && Math.abs(z + 0.04) < 0.014) return true;
    if (y < 0.14 && Math.abs(z) > 0.032 && ax < 0.034 - y * 0.05) return true;
  }

  if (y > -0.1 && y < -0.01 && z < -0.03 && ax < 0.012) return true;
  if (y > -0.08 && y < 0.0 && z < -0.02 && ax > 0.02 && ax < 0.05) {
    if (Math.abs(y + 0.04) < 0.012) return true;
  }

  if (z > 0.018 && y > -0.34 && y < -0.08 && ax > 0.01 && ax < 0.05) {
    if (Math.abs(x - (x > 0 ? 0.032 : -0.032)) < 0.006) return true;
    if (Math.abs(y + 0.22) < 0.008 && ax < 0.04) return true;
  }
  if (y > -0.34 && y < -0.25 && Math.abs(z) > 0.016 && ax > 0.01 && ax < 0.046) return true;

  if (z < -0.018 && y > -0.34 && y < -0.1 && ax > 0.012 && ax < 0.048) {
    if (Math.abs(x - (x > 0 ? 0.028 : -0.028)) < 0.006) return true;
  }

  if (y > -0.5 && y < -0.36 && z < -0.01 && ax > 0.012 && ax < 0.042) return true;
  if (y > -0.52 && y < -0.4 && ax < 0.01 && z < -0.005) return true;

  return false;
}

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Athletic-neutral silhouette: soften hyper-male width, avoid wide hips */
function applyUnisexProportions(x, y, z) {
  let sx = x;
  let sy = y;
  let sz = z;

  sy *= 0.99;

  const shoulderBand = smoothstep(0.18, 0.24, y) * (1 - smoothstep(0.36, 0.42, y));
  sx *= 1 - 0.05 * shoulderBand;

  if (z > 0) {
    const chestBand = smoothstep(0.18, 0.24, y) * (1 - smoothstep(0.32, 0.38, y));
    sz *= 1 - 0.04 * chestBand;
  }

  const hipBand = smoothstep(-0.12, -0.06, y) * (1 - smoothstep(0.02, 0.08, y));
  sx *= 1 - 0.03 * hipBand;

  const waistBand = smoothstep(0.0, 0.04, y) * (1 - smoothstep(0.14, 0.2, y));
  sx *= 1 - 0.02 * waistBand;

  return [sx, sy, sz];
}

function muscleInflateAmount(x, y, z) {
  if (isAnatomicalFasciaVertex(x, y, z)) return 0;

  if (y > 0.4) return 0;
  if (y < -0.48) return 0;
  if (Math.abs(x) > 0.09 && y < 0.12 && y > -0.05) return 0;

  let best = 0;
  for (const region of Object.values(MUSCLE_REGIONS)) {
    const dx = (x - region.center[0]) / region.radii[0];
    const dy = (y - region.center[1]) / region.radii[1];
    const dz = (z - region.center[2]) / region.radii[2];
    const dist2 = dx * dx + dy * dy + dz * dz;
    if (dist2 <= 1.0) {
      const falloff = 1 - Math.sqrt(dist2);
      const amount = region.inflate * falloff * falloff;
      if (amount > best) best = amount;
    }
  }

  // Soft global athletic fill so non-region gaps don't stay skinny
  const torso =
    y > -0.45 && y < 0.4 && Math.abs(x) < 0.08 ? 0.0035 * (1 - Math.abs(x) / 0.08) : 0;
  return Math.max(best, torso);
}

function morphGeometry(geometry) {
  geometry.computeVertexNormals();
  const pos = geometry.attributes.position;
  const nrm = geometry.attributes.normal;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    [x, y, z] = applyUnisexProportions(x, y, z);

    const inflate = muscleInflateAmount(x, y, z);
    if (inflate > 0 && nrm) {
      x += nrm.getX(i) * inflate;
      y += nrm.getY(i) * inflate;
      z += nrm.getZ(i) * inflate;
    }

    pos.setXYZ(i, x, y, z);
  }

  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function loadGltf(buffer) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.parse(
      buffer,
      '',
      (gltf) => resolve(gltf),
      (err) => reject(err)
    );
  });
}

function exportGltfBinary(scene) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (result) => {
        if (result instanceof ArrayBuffer) resolve(Buffer.from(result));
        else reject(new Error('Expected binary GLB ArrayBuffer from exporter'));
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

async function main() {
  if (!existsSync(TARGET) && !existsSync(ORIGINAL)) {
    throw new Error(`Missing model at ${TARGET}`);
  }

  mkdirSync(MODELS, { recursive: true });

  if (!existsSync(ORIGINAL) && existsSync(TARGET)) {
    copyFileSync(TARGET, ORIGINAL);
    console.log(`Backed up original → ${path.relative(ROOT, ORIGINAL)}`);
  }

  const sourcePath = existsSync(ORIGINAL) ? ORIGINAL : TARGET;
  const fileBuf = readFileSync(sourcePath);
  const arrayBuffer = fileBuf.buffer.slice(fileBuf.byteOffset, fileBuf.byteOffset + fileBuf.byteLength);

  console.log(`Loading ${path.relative(ROOT, sourcePath)}…`);
  const gltf = await loadGltf(arrayBuffer);

  let meshCount = 0;
  const exportRoot = new THREE.Group();
  exportRoot.name = 'UnisexMuscleAnatomy';

  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;
    meshCount += 1;
    const geo = child.geometry.clone();
    geo.applyMatrix4(child.matrixWorld);
    morphGeometry(geo);

    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.72, metalness: 0.03 })
    );
    mesh.name = child.name || `body_${meshCount}`;
    exportRoot.add(mesh);
  });

  if (meshCount === 0) throw new Error('No meshes found in GLB');

  const out = await exportGltfBinary(exportRoot);
  writeFileSync(TARGET, out);
  console.log(
    `Wrote unisex muscular asset → ${path.relative(ROOT, TARGET)} (${(out.length / 1024).toFixed(1)} KB, ${meshCount} mesh, ${Object.keys(MUSCLE_REGIONS).length} regions)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
