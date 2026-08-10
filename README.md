# VOKAN 3D Anatomy 🏋️‍♂️📊

> **Premium Grayscale 3D Human Muscle Anatomy Heatmap & Fitness Progress Visualizer**  
> Built for modern gym & workout tracking web applications. 

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r173-black.svg)](https://threejs.org/)
[![Open Source](https://img.shields.io/badge/Open%20Source-v1.0-green.svg)](#)

---

## 🌟 Overview

**VOKAN 3D Anatomy** provides a high-performance, interactive 3D human muscle anatomy visualizer designed specifically for fitness and gym applications. 

The baseline human model renders in a sleek, studio-lit **monochromatic grayscale** divided into key gym muscle groups. As users log workouts (bench press, squats, deadlifts, pull-ups, etc.), the anatomical engine calculates real-time progressive volume and overlay heatmap intensity—transitioning muscles from cool slate gray to vibrant cyan, yellow, fiery orange, and glowing magenta.

---

## ✨ Key Features

- 🦾 **Studio Grayscale Aesthetic**: Premium metallic dark slate anatomical baseline with ambient occlusion and directional studio lighting.
- 🎯 **Divided Gym Muscle Groups**: Segmented into 28 individual target muscle groups (Upper/Lower Chest, Front/Side/Rear Deltoids, Biceps, Triceps, Forearms, Upper/Mid Traps, Lats, Lower Back, Abs, Obliques, Glutes, Quads, Hamstrings, Calves).
- 🔴 **Dynamic Workout Heatmap**: Real-time intensity calculation based on weight (kg), reps, and sets.
- 🎥 **Interactive 3D Camera Controls**: 360° rotation, zoom, pan, and 5 preset camera angles (Front, Back, Upper Body, Lower Body, Arms).
- 📊 **Training Split & Volume Analytics**: Push/Pull/Legs volume distribution balance, top worked muscles ranking, and recovery index.
- 📝 **Preset & Custom Workout Logger**: Pre-mapped compound & isolation exercise library.
- ⚡ **Interactive Selection & Tooltips**: Click any muscle to inspect total volume lifted, anatomical function, and target exercises.
- 🔓 **Fully Open Source**: Distributed under the permissive MIT License with open-source medical/anatomy reference attributions.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18 + Vite
- **3D Graphics Engine**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Icons & UI**: Lucide React + Tailwind CSS
- **Effects**: Canvas Confetti + Custom Shader Materials

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ratharo-gitty/VOKAN-3D-Anatomy.git

# Navigate into the project directory
cd VOKAN-3D-Anatomy

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` in your browser to view the application.

---

## 📖 License & Attributions

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Open-Source References & Attributions
- **Z-Anatomy Atlas**: Open-source human anatomy model reference ([Website](https://www.z-anatomy.com/) | [Sketchfab Model](https://sketchfab.com/3d-models/myology-31b40fd809b14665b93773936d67c52c)).
- **BodyParts3D**: Database Center for Life Science (DBCLS), licensed under CC BY-SA 2.1 Japan.
