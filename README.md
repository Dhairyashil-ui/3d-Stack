<div align="center">

# 🏛️ NAKSHA 2.0
### Next-Generation 3D Cadastral & Urban Habitation Digital Twin
**Smart India Hackathon (SIH 2026) Innovation**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-000000?style=flat-square&logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Electron](https://img.shields.io/badge/Electron-44.4-47848F?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)]()

<p align="center">
  <b>Sub-Centimeter RTK GNSS • Automated Drone Mesh • Volumetric Multi-Floor Stratification • MediaPipe Gesture Control</b>
</p>

</div>

---

## 📌 Executive Overview

**NAKSHA 2.0** (*National Geospatial Knowledge-based Land Survey of Urban Habitations*) is a state-of-the-art 3D cadastral and digital twin platform built for Urban Local Bodies (ULBs), Surveyors, and State Administrations across India. 

The platform bridges real-world satellite geospatial mapping with sub-centimeter volumetric property intelligence, enabling seamless navigation from the **entire Indian subcontinent map down to individual building doors and interior apartments**.

---

## 🌟 Key Capabilities

### 1. Multi-Scale Geospatial Pipeline
- **India Subcontinent to Door**: Smooth fluid flight transition from nationwide satellite tiles directly to city-level (Pune / Hinjawadi IT Park) cadastral parcels.
- **15-Second Procedural Quantum Build**: Dynamic animated 3D building assembly sequence with live telemetry and progress visualization.
- **Mid-Door Arrival & Target Lock**: Direct camera approach straight to unit doors with mid-door volumetric crosshairs and GNSS coordinates.

### 2. Volumetric 3D Stratification (ULPIN)
- **Authoritative 14-Digit ULPIN**: `State(2) + District(2) + Taluka(2) + Village(4) + Building(4)` (e.g., `27-25-04-0142-0089`).
- **Unit Cadastral Identifier**: `Building(4) + Floor(2) + Area(2) + Room(3)` (e.g., `0089-01-01-101`).
- **Interactive Shading**: Instant switching between **Photorealistic Materials**, **X-Ray Structural Inspection**, and **BIM Wireframe**.
- **Floor Isolation**: Tier-by-tier multi-level slice inspection from Ground Tier up to Floor 5.

### 3. Touch & Mobile-First Experience
- **Floating Glassmorphic Bottom Dock**: Rapid 1-tap navigation between Home, 3D Twin, BhuNaksha, and Public Portal.
- **Tactile Bottom Sheet Drawer**: On mobile devices, property records collapse into a clean mini-bar leaving the 3D twin unobstructed for touch manipulation.
- **Adaptive Touch Controls**: Pinch-to-zoom, touch orbit, and responsive search box that auto-minimizes on small screens.

### 4. MediaPipe AI Hand Gesture Navigation
- Touchless spatial inspection using camera-based hand tracking (`@mediapipe/tasks-vision`).
- Rotate, tilt, pan, and zoom the 3D twin in real time with intuitive hand gestures.

---

## 🏗️ Dual-World Spatial Architecture

```
                    REAL WORLD (Macro Geosphere)
                                │
                                ▼
        Google Maps Platform Photorealistic 3D Tiles / Leaflet
                                │
                                ▼
                       CESIUM / THREE.JS ENGINE
                                │
                                ▼
               NAKSHA AUTHORITATIVE GIS CADASTRE
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
          PARCEL BOUNDARY              BUILDING FOOTPRINT
        (PAR-000123 / Blue)           (BLD-000781 / Cyan)
                 │                             │
                 └──────────────┬──────────────┘
                                ▼
                     SELECT PROPERTY / ULPIN
                                │
                                ▼
               DIGITAL TWIN RECONSTRUCTION & ARRIVAL
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
        POINT CLOUD STRUCTURE          FLOORS & SLABS
      (Exterior Walls, Atrium)      (Ground to Tier 5)
                 │                             │
                 └──────────────┬──────────────┘
                                ▼
                     3D PROPERTY CARD HUD
        (14-Digit ULPIN, Room Volumetrics, RoR Verification)
```

---

## 📁 Repository Structure

```
3d-Stack/
├── .env.example             # Template for API keys and configuration
├── .gitignore               # Strict exclusion rules for clean version control
├── .oxlintrc.json           # High-performance linter configuration
├── index.html               # Web entry point
├── package.json             # Dependencies and build scripts
├── README.md                # Project documentation
├── render.yaml              # Cloud deployment specification
├── tsconfig.json            # Root TypeScript project reference
├── vite.config.ts           # Vite bundler & binary delivery middleware
├── electron/                # Desktop Electron application wrapper
│   └── main.cjs
├── ppcrc-3d-view/           # Standalone, portable 3D Digital Twin package
│   ├── assets/              # Self-contained GLB model & aerial imagery
│   ├── BuildingDigitalTwinViewer.tsx
│   ├── HandGestureController.tsx
│   ├── IndiaToPropertyMap.tsx
│   ├── Ppcrc3DView.tsx
│   ├── PropertyDetailsPanel.tsx
│   └── pccrcRoomCadastre.ts
├── public/                  # Static production web assets & downloads
│   ├── assets/              # Icons, logos, and UI graphics
│   ├── downloads/           # Official desktop installers & user manuals
│   ├── mediapipe/           # WASM runtimes for hand gesture AI
│   └── h.glb                # Optimized 3D Digital Twin GLB model
├── scripts/                 # Automated PDF & ULPIN validation utilities
├── server/                  # Lightweight Express backend server
└── src/                     # Core React application
    ├── components/          # Reusable UI widgets & layouts
    │   ├── bhunaksha/       # BhuNaksha cadastral map widgets
    │   ├── cesium/          # 3D geospatial viewers
    │   ├── common/          # Shared components (modals, tables)
    │   ├── desktop/         # Desktop-specific components & modals
    │   ├── layout/          # Header, Sidebar, MobileBottomNav, AdminLayout
    │   └── surveyor3d/      # Ground-truthing workflow panels
    ├── data/                # Authoritative mock stores & cadastral registries
    ├── pages/               # Portal routing destinations (Public, Surveyor, ULB)
    ├── ppcrc-3d-view/       # Integrated 3D twin orchestration
    ├── services/            # GIS calculation, spatial DB, and AI helpers
    └── utils/               # PDF generators & ULPIN formatting engines
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.x or later (v20+ recommended)
- **npm**: v9.x or later

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Dhairyashil-ui/3d-Stack.git
cd 3d-Stack

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
```

### Running Locally

```bash
# Start Vite development server
npm run dev

# Start Electron desktop wrapper (optional)
npm run desktop
```
Navigate to `http://localhost:5173/` in your browser.

### Production Build

```bash
# Typecheck and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, React Router 7 |
| **3D & Graphics Engine** | Three.js, OrbitControls, GLTFLoader, CesiumJS |
| **Geospatial & Mapping** | Leaflet, @turf/turf, Photorealistic 3D Tiles |
| **Computer Vision AI** | Google MediaPipe Vision (@mediapipe/tasks-vision) |
| **Styling & Motion** | Vanilla CSS, Glassmorphic Design System, Lucide Icons |
| **Desktop Environment** | Electron 44 |
| **Build & Tooling** | Vite 8, esbuild, oxlint |

---

## 🔒 Security & Data Integrity
- **Truth in Provenance**: All displayed records strictly segregate between actual ground-truthed RTK surveys and procedural approximations.
- **Privacy & Compliance**: Built adhering to the Guidelines for Indian Government Websites (GIGW) and Web Content Accessibility Guidelines (WCAG) 2.0 AA.

---

<div align="center">
  <b>Developed for Smart India Hackathon (SIH 2026)</b><br/>
  <i>National Geospatial Land Survey & Digital Twin Initiative</i>
</div>
