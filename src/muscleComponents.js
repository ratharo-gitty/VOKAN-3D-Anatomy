/**
 * 24 chart muscle zones — combined full-body panel map.
 * Priority resolves overlaps; boundary detection paints navy seams.
 */

/** @typedef {{ id: string, name: string, priority: number, parts: { c: number[], r: number[] }[] }} MuscleComponent */

/** @type {MuscleComponent[]} */
export const MUSCLE_COMPONENTS = [
  // 1 Upper traps / neck front
  {
    id: 'traps_front',
    name: 'Upper traps / neck',
    priority: 8,
    parts: [
      { c: [0, 0.365, 0.0], r: [0.045, 0.040, 0.038] },
      { c: [-0.024, 0.375, 0.022], r: [0.020, 0.034, 0.024] },
      { c: [0.024, 0.375, 0.022], r: [0.020, 0.034, 0.024] },
    ],
  },
  // 2 Chest
  {
    id: 'pecs',
    name: 'Chest',
    priority: 11,
    parts: [
      { c: [-0.030, 0.255, 0.082], r: [0.040, 0.048, 0.048] },
      { c: [0.030, 0.255, 0.082], r: [0.040, 0.048, 0.048] },
    ],
  },
  // 3 Front delts
  {
    id: 'delts',
    name: 'Front deltoids',
    priority: 13,
    parts: [
      { c: [-0.056, 0.295, 0.030], r: [0.040, 0.050, 0.044] },
      { c: [0.056, 0.295, 0.030], r: [0.040, 0.050, 0.044] },
      { c: [-0.062, 0.290, 0.0], r: [0.036, 0.046, 0.040] },
      { c: [0.062, 0.290, 0.0], r: [0.036, 0.046, 0.040] },
    ],
  },
  // 4 Biceps
  {
    id: 'biceps',
    name: 'Biceps',
    priority: 14,
    parts: [
      { c: [-0.056, 0.195, 0.030], r: [0.032, 0.058, 0.036] },
      { c: [0.056, 0.195, 0.030], r: [0.032, 0.058, 0.036] },
    ],
  },
  // 5 Forearm extensors (outer)
  {
    id: 'forearm_extensors',
    name: 'Forearm extensors',
    priority: 15,
    parts: [
      { c: [-0.068, 0.085, -0.014], r: [0.028, 0.070, 0.030] },
      { c: [0.068, 0.085, -0.014], r: [0.028, 0.070, 0.030] },
    ],
  },
  // 6 Forearm flexors (inner)
  {
    id: 'forearm_flexors',
    name: 'Forearm flexors',
    priority: 15,
    parts: [
      { c: [-0.068, 0.085, 0.020], r: [0.028, 0.070, 0.030] },
      { c: [0.068, 0.085, 0.020], r: [0.028, 0.070, 0.030] },
    ],
  },
  // 7 Upper abs
  {
    id: 'abs_upper',
    name: 'Upper abs',
    priority: 10,
    parts: [{ c: [0, 0.155, 0.068], r: [0.038, 0.038, 0.034] }],
  },
  // 8 Upper obliques
  {
    id: 'obliques_upper',
    name: 'Upper obliques',
    priority: 10,
    parts: [
      { c: [-0.040, 0.125, 0.045], r: [0.030, 0.048, 0.032] },
      { c: [0.040, 0.125, 0.045], r: [0.030, 0.048, 0.032] },
    ],
  },
  // 9 Central / lower abs
  {
    id: 'abs_mid',
    name: 'Central / lower abs',
    priority: 10,
    parts: [
      { c: [0, 0.095, 0.065], r: [0.036, 0.032, 0.032] },
      { c: [0, 0.050, 0.060], r: [0.034, 0.032, 0.032] },
    ],
  },
  // 10 Lower obliques
  {
    id: 'obliques_lower',
    name: 'Lower obliques',
    priority: 10,
    parts: [
      { c: [-0.040, 0.055, 0.038], r: [0.030, 0.045, 0.032] },
      { c: [0.040, 0.055, 0.038], r: [0.030, 0.045, 0.032] },
    ],
  },
  // 11 Lower abdominal / pelvic V
  {
    id: 'abs_pelvic',
    name: 'Lower abs / pelvic',
    priority: 9,
    parts: [{ c: [0, 0.005, 0.052], r: [0.034, 0.030, 0.030] }],
  },
  // 12 Groin / inner thigh top
  {
    id: 'groin',
    name: 'Groin / inner thigh top',
    priority: 8,
    parts: [
      { c: [-0.016, -0.06, 0.028], r: [0.022, 0.045, 0.028] },
      { c: [0.016, -0.06, 0.028], r: [0.022, 0.045, 0.028] },
    ],
  },
  // 13 Traps / rhomboids back
  {
    id: 'traps_back',
    name: 'Traps / rhomboids',
    priority: 9,
    parts: [
      { c: [0, 0.34, -0.028], r: [0.052, 0.048, 0.042] },
      { c: [0, 0.27, -0.045], r: [0.045, 0.045, 0.038] },
    ],
  },
  // 14 Lats
  {
    id: 'lats',
    name: 'Lats',
    priority: 10,
    parts: [
      { c: [-0.036, 0.155, -0.044], r: [0.040, 0.082, 0.040] },
      { c: [0.036, 0.155, -0.044], r: [0.040, 0.082, 0.040] },
    ],
  },
  // 15 Lower back
  {
    id: 'lower_back',
    name: 'Lower back',
    priority: 8,
    parts: [{ c: [0, 0.04, -0.044], r: [0.036, 0.055, 0.034] }],
  },
  // 16 Triceps
  {
    id: 'triceps',
    name: 'Triceps',
    priority: 14,
    parts: [
      { c: [-0.056, 0.195, -0.030], r: [0.032, 0.058, 0.036] },
      { c: [0.056, 0.195, -0.030], r: [0.032, 0.058, 0.036] },
    ],
  },
  // 17 Rear delts
  {
    id: 'rear_delts',
    name: 'Rear deltoids',
    priority: 13,
    parts: [
      { c: [-0.052, 0.292, -0.038], r: [0.038, 0.048, 0.040] },
      { c: [0.052, 0.292, -0.038], r: [0.038, 0.048, 0.040] },
    ],
  },
  // 18 Lower lat / waist back
  {
    id: 'lats_lower',
    name: 'Lower lat / waist',
    priority: 9,
    parts: [
      { c: [-0.042, 0.08, -0.032], r: [0.032, 0.050, 0.032] },
      { c: [0.042, 0.08, -0.032], r: [0.032, 0.050, 0.032] },
    ],
  },
  // 19 Outer quads
  {
    id: 'quads_outer',
    name: 'Outer quads',
    priority: 9,
    parts: [
      { c: [-0.040, -0.20, 0.030], r: [0.034, 0.100, 0.040] },
      { c: [0.040, -0.20, 0.030], r: [0.034, 0.100, 0.040] },
    ],
  },
  // 20 Inner quads (vastus medialis)
  {
    id: 'quads_inner',
    name: 'Inner quads',
    priority: 9,
    parts: [
      { c: [-0.016, -0.22, 0.038], r: [0.026, 0.085, 0.034] },
      { c: [0.016, -0.22, 0.038], r: [0.026, 0.085, 0.034] },
    ],
  },
  // 21 Glutes
  {
    id: 'glutes',
    name: 'Glutes',
    priority: 10,
    parts: [
      { c: [-0.030, -0.04, -0.050], r: [0.042, 0.060, 0.046] },
      { c: [0.030, -0.04, -0.050], r: [0.042, 0.060, 0.046] },
    ],
  },
  // 22 Hamstrings
  {
    id: 'hamstrings',
    name: 'Hamstrings',
    priority: 9,
    parts: [
      { c: [-0.028, -0.20, -0.038], r: [0.036, 0.100, 0.040] },
      { c: [0.028, -0.20, -0.038], r: [0.036, 0.100, 0.040] },
    ],
  },
  // 23 Shins
  {
    id: 'shins',
    name: 'Shins',
    priority: 7,
    parts: [
      { c: [-0.028, -0.38, 0.028], r: [0.026, 0.075, 0.026] },
      { c: [0.028, -0.38, 0.028], r: [0.026, 0.075, 0.026] },
    ],
  },
  // 24 Calves rear
  {
    id: 'calves',
    name: 'Calves',
    priority: 8,
    parts: [
      { c: [-0.028, -0.39, -0.024], r: [0.032, 0.080, 0.034] },
      { c: [0.028, -0.39, -0.024], r: [0.032, 0.080, 0.034] },
    ],
  },
];

/**
 * @returns {{ id: string|null, rim: number }}
 * rim in [0,1] — closer to 1 means near plate edge (seam candidate)
 */
export function classifyMuscleVertex(x, y, z) {
  let bestId = null;
  let bestPriority = -1;
  let bestDist = Infinity;

  for (const comp of MUSCLE_COMPONENTS) {
    for (const part of comp.parts) {
      const dx = (x - part.c[0]) / part.r[0];
      const dy = (y - part.c[1]) / part.r[1];
      const dz = (z - part.c[2]) / part.r[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist <= 1) {
        if (comp.priority > bestPriority || (comp.priority === bestPriority && dist < bestDist)) {
          bestId = comp.id;
          bestPriority = comp.priority;
          bestDist = dist;
        }
      }
    }
  }

  return { id: bestId, rim: bestId ? bestDist : 0 };
}

/** True if this plate borders another plate or skin nearby */
export function isPlateBoundary(x, y, z, id) {
  if (!id) return false;
  const eps = 0.011;
  const offsets = [
    [eps, 0, 0],
    [-eps, 0, 0],
    [0, eps, 0],
    [0, -eps, 0],
    [0, 0, eps],
    [0, 0, -eps],
  ];
  for (const [ox, oy, oz] of offsets) {
    const other = classifyMuscleVertex(x + ox, y + oy, z + oz).id;
    if (other !== id) return true;
  }
  return false;
}

/** Extra anatomical seam corridors matching the icon panel cuts */
export function isChartSeam(x, y, z) {
  const ax = Math.abs(x);

  // Abs grid
  if (z > 0.035 && y > 0.0 && y < 0.22) {
    if (ax < 0.006) return true;
    if (
      ax < 0.040 &&
      (Math.abs(y - 0.175) < 0.005 ||
        Math.abs(y - 0.130) < 0.005 ||
        Math.abs(y - 0.090) < 0.005 ||
        Math.abs(y - 0.050) < 0.005)
    ) {
      return true;
    }
  }
  // Sternum
  if (z > 0.05 && y > 0.22 && y < 0.32 && ax < 0.006) return true;
  // Spine
  if (z < -0.03 && y > 0.0 && y < 0.38 && ax < 0.007) return true;
  // Glute split
  if (y > -0.09 && y < -0.01 && z < -0.03 && ax < 0.01) return true;
  // Knee
  if (y > -0.33 && y < -0.26 && Math.abs(z) > 0.015 && ax > 0.01 && ax < 0.045) return true;
  // Achilles
  if (y > -0.52 && y < -0.40 && ax < 0.01 && z < -0.005) return true;

  return false;
}
