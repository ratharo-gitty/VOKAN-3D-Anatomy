// Comprehensive Anatomical Muscle Groups Definition for VOKAN 3D Anatomy
export const MUSCLE_GROUPS = {
  // UPPER BODY - FRONT
  chest_upper: {
    id: 'chest_upper',
    name: 'Upper Pectoralis (Clavicular)',
    category: 'Chest',
    region: 'Front Upper',
    side: 'Center',
    function: 'Shoulder flexion, horizontal adduction of upper arm',
    position: [0, 1.35, 0.42],
    scale: [0.75, 0.28, 0.35],
    rotation: [0.1, 0, 0],
    shape: 'pectoral_upper',
    recoveryHours: 48,
    description: 'The clavicular head of the pectoralis major. Essential for upper chest fullness and incline pressing movements.'
  },
  chest_lower: {
    id: 'chest_lower',
    name: 'Lower Pectoralis (Sternal)',
    category: 'Chest',
    region: 'Front Upper',
    side: 'Center',
    function: 'Arm adduction, internal rotation, horizontal pressing',
    position: [0, 1.15, 0.44],
    scale: [0.85, 0.38, 0.38],
    rotation: [0, 0, 0],
    shape: 'pectoral_lower',
    recoveryHours: 48,
    description: 'The sternocostal head of the pectoralis major. Creates lower chest definition and power in flat/decline bench press.'
  },
  delt_anterior_left: {
    id: 'delt_anterior_left',
    name: 'Anterior Deltoid (Front Shoulders Left)',
    category: 'Shoulders',
    region: 'Front Upper',
    side: 'Left',
    position: [-0.95, 1.42, 0.35],
    scale: [0.32, 0.35, 0.32],
    rotation: [0.1, 0.2, -0.2],
    shape: 'deltoid',
    recoveryHours: 36,
    description: 'Front shoulder head. Engaged heavily in overhead pressing, front raises, and pushing movements.'
  },
  delt_anterior_right: {
    id: 'delt_anterior_right',
    name: 'Anterior Deltoid (Front Shoulders Right)',
    category: 'Shoulders',
    region: 'Front Upper',
    side: 'Right',
    position: [0.95, 1.42, 0.35],
    scale: [0.32, 0.35, 0.32],
    rotation: [0.1, -0.2, 0.2],
    shape: 'deltoid',
    recoveryHours: 36,
    description: 'Front shoulder head. Engaged heavily in overhead pressing, front raises, and pushing movements.'
  },
  delt_lateral_left: {
    id: 'delt_lateral_left',
    name: 'Lateral Deltoid (Side Shoulder Left)',
    category: 'Shoulders',
    region: 'Side Upper',
    side: 'Left',
    position: [-1.15, 1.45, 0.1],
    scale: [0.35, 0.38, 0.35],
    rotation: [0, 0, -0.3],
    shape: 'deltoid',
    recoveryHours: 36,
    description: 'Side shoulder head responsible for arm abduction. Key muscle for broad shoulder frame width.'
  },
  delt_lateral_right: {
    id: 'delt_lateral_right',
    name: 'Lateral Deltoid (Side Shoulder Right)',
    category: 'Shoulders',
    region: 'Side Upper',
    side: 'Right',
    position: [1.15, 1.45, 0.1],
    scale: [0.35, 0.38, 0.35],
    rotation: [0, 0, 0.3],
    shape: 'deltoid',
    recoveryHours: 36,
    description: 'Side shoulder head responsible for arm abduction. Key muscle for broad shoulder frame width.'
  },
  biceps_left: {
    id: 'biceps_left',
    name: 'Biceps Brachii (Left)',
    category: 'Arms',
    region: 'Front Upper',
    side: 'Left',
    position: [-1.18, 0.98, 0.2],
    scale: [0.26, 0.45, 0.26],
    rotation: [0.1, 0, -0.1],
    shape: 'bicep',
    recoveryHours: 36,
    description: 'Two-headed arm flexor responsible for elbow flexion and forearm supination.'
  },
  biceps_right: {
    id: 'biceps_right',
    name: 'Biceps Brachii (Right)',
    category: 'Arms',
    region: 'Front Upper',
    side: 'Right',
    position: [1.18, 0.98, 0.2],
    scale: [0.26, 0.45, 0.26],
    rotation: [0.1, 0, 0.1],
    shape: 'bicep',
    recoveryHours: 36,
    description: 'Two-headed arm flexor responsible for elbow flexion and forearm supination.'
  },
  forearms_left: {
    id: 'forearms_left',
    name: 'Forearm Flexors & Extensors (Left)',
    category: 'Arms',
    region: 'Front Lower',
    side: 'Left',
    position: [-1.35, 0.4, 0.15],
    scale: [0.22, 0.5, 0.22],
    rotation: [0, 0, -0.15],
    shape: 'forearm',
    recoveryHours: 24,
    description: 'Forearm muscles controlling wrist extension/flexion and grip strength.'
  },
  forearms_right: {
    id: 'forearms_right',
    name: 'Forearm Flexors & Extensors (Right)',
    category: 'Arms',
    region: 'Front Lower',
    side: 'Right',
    position: [1.35, 0.4, 0.15],
    scale: [0.22, 0.5, 0.22],
    rotation: [0, 0, 0.15],
    shape: 'forearm',
    recoveryHours: 24,
    description: 'Forearm muscles controlling wrist extension/flexion and grip strength.'
  },
  abs_rectus: {
    id: 'abs_rectus',
    name: 'Rectus Abdominis (Six-Pack)',
    category: 'Core',
    region: 'Front Mid',
    side: 'Center',
    position: [0, 0.65, 0.42],
    scale: [0.48, 0.65, 0.25],
    rotation: [0, 0, 0],
    shape: 'abs',
    recoveryHours: 24,
    description: 'Paired vertical muscle running down abdomen. Flexes the lumbar spine.'
  },
  obliques_left: {
    id: 'obliques_left',
    name: 'External Obliques (Left)',
    category: 'Core',
    region: 'Front Mid',
    side: 'Left',
    position: [-0.48, 0.62, 0.35],
    scale: [0.28, 0.55, 0.28],
    rotation: [0, 0.3, -0.1],
    shape: 'oblique',
    recoveryHours: 24,
    description: 'Flank core muscles supporting torso rotation and lateral flexion.'
  },
  obliques_right: {
    id: 'obliques_right',
    name: 'External Obliques (Right)',
    category: 'Core',
    region: 'Front Mid',
    side: 'Right',
    position: [0.48, 0.62, 0.35],
    scale: [0.28, 0.55, 0.28],
    rotation: [0, -0.3, 0.1],
    shape: 'oblique',
    recoveryHours: 24,
    description: 'Flank core muscles supporting torso rotation and lateral flexion.'
  },

  // UPPER BODY - BACK
  traps_upper: {
    id: 'traps_upper',
    name: 'Upper Trapezius',
    category: 'Back',
    region: 'Back Upper',
    side: 'Center',
    position: [0, 1.55, -0.15],
    scale: [0.8, 0.35, 0.35],
    rotation: [0, 0, 0],
    shape: 'traps',
    recoveryHours: 36,
    description: 'Upper neck and shoulder elevation muscle. Targeted with shrugs and upright rows.'
  },
  traps_mid_lower: {
    id: 'traps_mid_lower',
    name: 'Mid & Lower Trapezius',
    category: 'Back',
    region: 'Back Upper',
    side: 'Center',
    position: [0, 1.15, -0.35],
    scale: [0.65, 0.55, 0.3],
    rotation: [0, 0, 0],
    shape: 'traps_mid',
    recoveryHours: 36,
    description: 'Scapular retraction and depression muscle. Vital for posture and upper back thickness.'
  },
  lats_left: {
    id: 'lats_left',
    name: 'Latissimus Dorsi (Left Lat)',
    category: 'Back',
    region: 'Back Mid',
    side: 'Left',
    position: [-0.55, 0.85, -0.32],
    scale: [0.48, 0.75, 0.32],
    rotation: [0, -0.2, 0.15],
    shape: 'lat',
    recoveryHours: 48,
    description: 'Broadest muscle of the back. Creates V-taper frame through pull-ups, rows, and pulldowns.'
  },
  lats_right: {
    id: 'lats_right',
    name: 'Latissimus Dorsi (Right Lat)',
    category: 'Back',
    region: 'Back Mid',
    side: 'Right',
    position: [0.55, 0.85, -0.32],
    scale: [0.48, 0.75, 0.32],
    rotation: [0, 0.2, -0.15],
    shape: 'lat',
    recoveryHours: 48,
    description: 'Broadest muscle of the back. Creates V-taper frame through pull-ups, rows, and pulldowns.'
  },
  erector_spinae: {
    id: 'erector_spinae',
    name: 'Erector Spinae (Lower Back)',
    category: 'Back',
    region: 'Back Lower',
    side: 'Center',
    position: [0, 0.45, -0.36],
    scale: [0.38, 0.65, 0.28],
    rotation: [0, 0, 0],
    shape: 'erector',
    recoveryHours: 48,
    description: 'Deep spinal erector column supporting posture, deadlifts, and spinal stabilization.'
  },
  triceps_left: {
    id: 'triceps_left',
    name: 'Triceps Brachii (Left)',
    category: 'Arms',
    region: 'Back Upper',
    side: 'Left',
    position: [-1.22, 0.96, -0.15],
    scale: [0.28, 0.48, 0.28],
    rotation: [-0.1, 0, -0.1],
    shape: 'tricep',
    recoveryHours: 36,
    description: 'Three-headed muscle making up 60% of upper arm size. Extends elbow joint.'
  },
  triceps_right: {
    id: 'triceps_right',
    name: 'Triceps Brachii (Right)',
    category: 'Arms',
    region: 'Back Upper',
    side: 'Right',
    position: [1.22, 0.96, -0.15],
    scale: [0.28, 0.48, 0.28],
    rotation: [-0.1, 0, 0.1],
    shape: 'tricep',
    recoveryHours: 36,
    description: 'Three-headed muscle making up 60% of upper arm size. Extends elbow joint.'
  },
  delt_posterior_left: {
    id: 'delt_posterior_left',
    name: 'Posterior Deltoid (Rear Shoulder Left)',
    category: 'Shoulders',
    region: 'Back Upper',
    side: 'Left',
    position: [-0.95, 1.4, -0.3],
    scale: [0.3, 0.32, 0.3],
    rotation: [-0.2, 0.2, -0.1],
    shape: 'deltoid',
    recoveryHours: 36,
    description: 'Rear shoulder head. Essential for shoulder balance and face pull movements.'
  },
  delt_posterior_right: {
    id: 'delt_posterior_right',
    name: 'Posterior Deltoid (Rear Shoulder Right)',
    category: 'Shoulders',
    region: 'Back Upper',
    side: 'Right',
    position: [0.95, 1.4, -0.3],
    scale: [0.3, 0.32, 0.3],
    rotation: [-0.2, -0.2, 0.1],
    shape: 'deltoid',
    recoveryHours: 36,
    description: 'Rear shoulder head. Essential for shoulder balance and face pull movements.'
  },

  // LOWER BODY
  glutes_left: {
    id: 'glutes_left',
    name: 'Gluteus Maximus (Left)',
    category: 'Glutes',
    region: 'Back Lower',
    side: 'Left',
    position: [-0.42, -0.18, -0.32],
    scale: [0.45, 0.48, 0.45],
    rotation: [0, -0.2, 0],
    shape: 'glute',
    recoveryHours: 48,
    description: 'Largest muscle in the human body. Drives hip extension in squats, deadlifts, and hip thrusts.'
  },
  glutes_right: {
    id: 'glutes_right',
    name: 'Gluteus Maximus (Right)',
    category: 'Glutes',
    region: 'Back Lower',
    side: 'Right',
    position: [0.42, -0.18, -0.32],
    scale: [0.45, 0.48, 0.45],
    rotation: [0, 0.2, 0],
    shape: 'glute',
    recoveryHours: 48,
    description: 'Largest muscle in the human body. Drives hip extension in squats, deadlifts, and hip thrusts.'
  },
  quads_left: {
    id: 'quads_left',
    name: 'Quadriceps Femoris (Left Thigh)',
    category: 'Legs',
    region: 'Front Lower',
    side: 'Left',
    position: [-0.45, -0.85, 0.15],
    scale: [0.42, 0.85, 0.42],
    rotation: [0, 0.1, -0.05],
    shape: 'quad',
    recoveryHours: 48,
    description: 'Four-headed front thigh muscle group responsible for knee extension.'
  },
  quads_right: {
    id: 'quads_right',
    name: 'Quadriceps Femoris (Right Thigh)',
    category: 'Legs',
    region: 'Front Lower',
    side: 'Right',
    position: [0.45, -0.85, 0.15],
    scale: [0.42, 0.85, 0.42],
    rotation: [0, -0.1, 0.05],
    shape: 'quad',
    recoveryHours: 48,
    description: 'Four-headed front thigh muscle group responsible for knee extension.'
  },
  hamstrings_left: {
    id: 'hamstrings_left',
    name: 'Hamstrings (Left Rear Thigh)',
    category: 'Legs',
    region: 'Back Lower',
    side: 'Left',
    position: [-0.45, -0.85, -0.22],
    scale: [0.38, 0.8, 0.38],
    rotation: [0, -0.1, -0.05],
    shape: 'hamstring',
    recoveryHours: 48,
    description: 'Posterior thigh muscles flex knee and extend hip (RDLs, leg curls).'
  },
  hamstrings_right: {
    id: 'hamstrings_right',
    name: 'Hamstrings (Right Rear Thigh)',
    category: 'Legs',
    region: 'Back Lower',
    side: 'Right',
    position: [0.45, -0.85, -0.22],
    scale: [0.38, 0.8, 0.38],
    rotation: [0, 0.1, 0.05],
    shape: 'hamstring',
    recoveryHours: 48,
    description: 'Posterior thigh muscles flex knee and extend hip (RDLs, leg curls).'
  },
  calves_left: {
    id: 'calves_left',
    name: 'Gastrocnemius & Soleus (Left Calf)',
    category: 'Legs',
    region: 'Front/Back Lower',
    side: 'Left',
    position: [-0.45, -1.82, -0.08],
    scale: [0.3, 0.65, 0.3],
    rotation: [0, 0, -0.02],
    shape: 'calf',
    recoveryHours: 24,
    description: 'Calf muscle complex driving plantar flexion (heel raises).'
  },
  calves_right: {
    id: 'calves_right',
    name: 'Gastrocnemius & Soleus (Right Calf)',
    category: 'Legs',
    region: 'Front/Back Lower',
    side: 'Right',
    position: [0.45, -1.82, -0.08],
    scale: [0.3, 0.65, 0.3],
    rotation: [0, 0, 0.02],
    shape: 'calf',
    recoveryHours: 24,
    description: 'Calf muscle complex driving plantar flexion (heel raises).'
  }
};

// Muscle Intensity Color Ramp Generator
export const HEATMAP_COLORS = {
  0: '#3D4148',    // Unworked Gray/Slate
  1: '#00F2FE',    // Teal / Soft Cyan (Light Activity)
  2: '#FFD700',    // Bright Yellow (Moderate Activity)
  3: '#FF5E00',    // Fiery Orange (High Activity)
  4: '#FF0055',    // Neon Red / Pink (Extreme Hit)
  5: '#D900FF'     // Hyper Purple Glow (Max Overload)
};

export const getHeatmapColor = (intensity) => {
  if (intensity <= 0) return MUSCLE_GROUPS.chest_upper ? '#3D4148' : '#2A2E35';
  if (intensity < 1.5) return '#00F2FE';
  if (intensity < 3.0) return '#FFD700';
  if (intensity < 4.5) return '#FF5E00';
  if (intensity < 6.0) return '#FF0055';
  return '#D900FF';
};

export const getHeatmapLevel = (intensity) => {
  if (intensity <= 0) return { label: 'Idle / Rested', color: '#6C727F' };
  if (intensity < 1.5) return { label: 'Light Hit', color: '#00F2FE' };
  if (intensity < 3.0) return { label: 'Moderate Work', color: '#FFD700' };
  if (intensity < 4.5) return { label: 'High Intensity', color: '#FF5E00' };
  if (intensity < 6.0) return { label: 'Extreme Load', color: '#FF0055' };
  return { label: 'Peak Overload', color: '#D900FF' };
};
