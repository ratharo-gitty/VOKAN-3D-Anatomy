// Preset Workout Exercises Database with Muscle Target Map for VOKAN 3D Anatomy
export const EXERCISES = [
  {
    id: 'bench_press',
    name: 'Barbell Bench Press',
    category: 'Chest',
    equipment: 'Barbell',
    targets: {
      chest_lower: 1.0,
      chest_upper: 0.7,
      delt_anterior_left: 0.5,
      delt_anterior_right: 0.5,
      triceps_left: 0.6,
      triceps_right: 0.6
    }
  },
  {
    id: 'incline_bench_press',
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    equipment: 'Dumbbells',
    targets: {
      chest_upper: 1.0,
      chest_lower: 0.5,
      delt_anterior_left: 0.7,
      delt_anterior_right: 0.7,
      triceps_left: 0.5,
      triceps_right: 0.5
    }
  },
  {
    id: 'chest_flyes',
    name: 'Cable Pec Flyes',
    category: 'Chest',
    equipment: 'Cable Machine',
    targets: {
      chest_lower: 0.9,
      chest_upper: 0.9
    }
  },
  {
    id: 'overhead_press',
    name: 'Standing Military Press',
    category: 'Shoulders',
    equipment: 'Barbell',
    targets: {
      delt_anterior_left: 1.0,
      delt_anterior_right: 1.0,
      delt_lateral_left: 0.6,
      delt_lateral_right: 0.6,
      triceps_left: 0.6,
      triceps_right: 0.6,
      traps_upper: 0.4
    }
  },
  {
    id: 'lateral_raises',
    name: 'Dumbbell Lateral Raises',
    category: 'Shoulders',
    equipment: 'Dumbbells',
    targets: {
      delt_lateral_left: 1.0,
      delt_lateral_right: 1.0,
      traps_upper: 0.3
    }
  },
  {
    id: 'face_pulls',
    name: 'Cable Face Pulls',
    category: 'Shoulders',
    equipment: 'Cable Machine',
    targets: {
      delt_posterior_left: 1.0,
      delt_posterior_right: 1.0,
      traps_mid_lower: 0.8,
      traps_upper: 0.5
    }
  },
  {
    id: 'lat_pulldown',
    name: 'Wide-Grip Lat Pulldown',
    category: 'Back',
    equipment: 'Cable Machine',
    targets: {
      lats_left: 1.0,
      lats_right: 1.0,
      biceps_left: 0.6,
      biceps_right: 0.6,
      traps_mid_lower: 0.5
    }
  },
  {
    id: 'barbell_rows',
    name: 'Bent-Over Barbell Rows',
    category: 'Back',
    equipment: 'Barbell',
    targets: {
      lats_left: 0.8,
      lats_right: 0.8,
      traps_mid_lower: 0.9,
      erector_spinae: 0.7,
      biceps_left: 0.5,
      biceps_right: 0.5
    }
  },
  {
    id: 'deadlift',
    name: 'Conventional Barbell Deadlift',
    category: 'Back',
    equipment: 'Barbell',
    targets: {
      erector_spinae: 1.0,
      glutes_left: 0.9,
      glutes_right: 0.9,
      hamstrings_left: 0.8,
      hamstrings_right: 0.8,
      traps_upper: 0.7,
      forearms_left: 0.6,
      forearms_right: 0.6
    }
  },
  {
    id: 'barbell_squat',
    name: 'Barbell Back Squats',
    category: 'Legs',
    equipment: 'Barbell',
    targets: {
      quads_left: 1.0,
      quads_right: 1.0,
      glutes_left: 0.9,
      glutes_right: 0.9,
      erector_spinae: 0.5,
      abs_rectus: 0.4
    }
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift (RDL)',
    category: 'Legs',
    equipment: 'Barbell',
    targets: {
      hamstrings_left: 1.0,
      hamstrings_right: 1.0,
      glutes_left: 0.9,
      glutes_right: 0.9,
      erector_spinae: 0.7
    }
  },
  {
    id: 'leg_extensions',
    name: 'Quad Leg Extensions',
    category: 'Legs',
    equipment: 'Machine',
    targets: {
      quads_left: 1.0,
      quads_right: 1.0
    }
  },
  {
    id: 'calf_raises',
    name: 'Standing Calf Raises',
    category: 'Legs',
    equipment: 'Machine',
    targets: {
      calves_left: 1.0,
      calves_right: 1.0
    }
  },
  {
    id: 'bicep_curls',
    name: 'Dumbbell Bicep Curls',
    category: 'Arms',
    equipment: 'Dumbbells',
    targets: {
      biceps_left: 1.0,
      biceps_right: 1.0,
      forearms_left: 0.4,
      forearms_right: 0.4
    }
  },
  {
    id: 'tricep_pushdown',
    name: 'Cable Tricep Pushdown',
    category: 'Arms',
    equipment: 'Cable Machine',
    targets: {
      triceps_left: 1.0,
      triceps_right: 1.0
    }
  },
  {
    id: 'crunches',
    name: 'Hanging Leg Raises & Crunches',
    category: 'Core',
    equipment: 'Bodyweight',
    targets: {
      abs_rectus: 1.0,
      obliques_left: 0.6,
      obliques_right: 0.6
    }
  }
];

// Preset Workouts Templates
export const WORKOUT_PRESETS = [
  {
    name: 'Chest & Triceps Power Blast',
    description: 'Heavy bench press, incline dumbbells, and tricep pushdowns.',
    exercises: [
      { exerciseId: 'bench_press', sets: 4, reps: 8, weight: 80 },
      { exerciseId: 'incline_bench_press', sets: 3, reps: 10, weight: 26 },
      { exerciseId: 'chest_flyes', sets: 3, reps: 12, weight: 15 },
      { exerciseId: 'tricep_pushdown', sets: 4, reps: 12, weight: 30 }
    ]
  },
  {
    name: 'Back & Biceps V-Taper Destroyer',
    description: 'Deadlifts, lat pulldowns, bent-over rows, and hammer curls.',
    exercises: [
      { exerciseId: 'deadlift', sets: 4, reps: 5, weight: 120 },
      { exerciseId: 'lat_pulldown', sets: 4, reps: 10, weight: 65 },
      { exerciseId: 'barbell_rows', sets: 3, reps: 8, weight: 70 },
      { exerciseId: 'bicep_curls', sets: 4, reps: 12, weight: 16 }
    ]
  },
  {
    name: 'Legs & Glutes Quad-Dominant',
    description: 'Heavy squats, Romanian deadlifts, quad extensions, calf raises.',
    exercises: [
      { exerciseId: 'barbell_squat', sets: 4, reps: 8, weight: 100 },
      { exerciseId: 'romanian_deadlift', sets: 3, reps: 10, weight: 80 },
      { exerciseId: 'leg_extensions', sets: 3, reps: 15, weight: 50 },
      { exerciseId: 'calf_raises', sets: 4, reps: 15, weight: 60 }
    ]
  },
  {
    name: '3D Shoulders & Core Sculptor',
    description: 'Military press, lateral raises, face pulls, and leg raises.',
    exercises: [
      { exerciseId: 'overhead_press', sets: 4, reps: 8, weight: 50 },
      { exerciseId: 'lateral_raises', sets: 4, reps: 15, weight: 12 },
      { exerciseId: 'face_pulls', sets: 4, reps: 15, weight: 25 },
      { exerciseId: 'crunches', sets: 3, reps: 20, weight: 0 }
    ]
  }
];
