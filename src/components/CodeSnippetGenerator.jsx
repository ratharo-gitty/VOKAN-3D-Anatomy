import React, { useState } from 'react';
import { Code, Copy, Check, Terminal, FileJson, Sparkles } from 'lucide-react';

export default function CodeSnippetGenerator({ selectedMuscle, muscleIntensities }) {
  const [activeTab, setActiveTab] = useState('react');
  const [copied, setCopied] = useState(false);

  const snippets = {
    react: `import { Vokan3DAnatomy, MUSCLE_GROUPS } from 'vokan-3d-anatomy';

function FitnessApp() {
  // Pass muscle intensity levels (0 to 5) from your workout log
  const muscleHeatmapData = {
    chest_lower: 4.2, // High intensity hit
    lats_left: 3.5,
    lats_right: 3.5,
    biceps_left: 2.1,
    quads_left: 4.8
  };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Vokan3DAnatomy
        muscleIntensities={muscleHeatmapData}
        isHeatmapMode={true}
        cameraPreset="front"
        onSelectMuscle={(muscle) => console.log('Selected:', muscle.name)}
      />
    </div>
  );
}`,

    threejs: `import * as THREE from 'three';
import { MUSCLE_GROUPS, getHeatmapColor } from './muscleData.js';

// Setup Three.js Scene with Grayscale Baseline
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Iterate over VOKAN Muscle Anatomy Definitions
Object.values(MUSCLE_GROUPS).forEach(muscle => {
  const geometry = new THREE.SphereGeometry(0.4, 24, 24);
  const material = new THREE.MeshStandardMaterial({
    color: getHeatmapColor(muscle.intensity || 0), // Grayscale slate to Heatmap glow
    roughness: 0.35,
    metalness: 0.2
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...muscle.position);
  scene.add(mesh);
});`,

    json: JSON.stringify(
      {
        version: '1.0.0',
        name: 'VOKAN 3D Anatomy Muscle Map',
        muscleGroupsCount: 28,
        categories: ['Chest', 'Shoulders', 'Arms', 'Back', 'Core', 'Glutes', 'Legs'],
        heatmapScale: {
          0: '#3D4148 (Unworked Gray)',
          1: '#00F2FE (Light Cyan)',
          2: '#FFD700 (Moderate Gold)',
          3: '#FF5E00 (Heavy Orange)',
          4: '#FF0055 (Extreme Red)',
          5: '#D900FF (Peak Magenta)'
        }
      },
      null,
      2
    )
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-left">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Developer Integration Code
          </h4>
        </div>
        <button
          onClick={handleCopy}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-3 bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('react')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'react'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          React Component
        </button>
        <button
          onClick={() => setActiveTab('threejs')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'threejs'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Three.js / WebGL
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === 'json'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Muscle Schema JSON
        </button>
      </div>

      {/* Code Display */}
      <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300/90 overflow-x-auto custom-scrollbar max-h-48 leading-relaxed">
        <code>{snippets[activeTab]}</code>
      </pre>
    </div>
  );
}
