# PPCRC 3D View (Standalone Module)

> **Complete End-to-End Cadastral 3D Experience:**
> **India Subcontinent Map** ➔ **Pune / Hinjawadi Aerial Flight** ➔ **3D Building Digital Twin** ➔ **15-Second Futuristic Construction** ➔ **Entrance Flythrough** ➔ **Door Arrival & Volumetric Centroid** ➔ **Authoritative Cadastral HUD**

This self-contained folder contains everything needed to render the PPCRC 3D View in any React, Vite, Next.js, or TypeScript application.

---

## 📁 Folder Structure

```
ppcrc-3d-view/
├── Ppcrc3DView.tsx              # Master Orchestrator Component (India map -> door -> HUD)
├── IndiaToPropertyMap.tsx       # India Subcontinent 3D/2D Satellite flight component
├── BuildingDigitalTwinViewer.tsx# 3D Three.js digital twin viewer with construction & door inspection
├── PropertyDetailsPanel.tsx     # Authoritative Cadastral details HUD card
├── HandGestureController.tsx    # Optional MediaPipe webcam hand gesture controller
├── pccrcRoomCadastre.ts         # Authoritative room cadastre dataset & coordinates
├── types.ts                     # TypeScript definitions & interfaces
├── index.ts                     # Unified public exports
├── README.md                    # Integration guide & props documentation
└── assets/
    ├── h.glb                    # 3D GLB Model of PPCRC Building (11.9 MB)
    └── pccrc_building_centered_aerial.jpg # High-res satellite aerial image (60 KB)
```

---

## 🚀 Quick Integration in Another Project (e.g. SurveyNaksha)

### Step 1: Copy the Folder
Copy this `ppcrc-3d-view` folder directly into your target project:
```
your-project/
  └── src/
      └── components/
          └── ppcrc-3d-view/
```

### Step 2: Install Required Dependencies
In your target project terminal, install:
```bash
npm install three lucide-react
npm install --save-dev @types/three
```

*(Optional: if you want webcam hand-gesture navigation)*
```bash
npm install @mediapipe/tasks-vision
```

### Step 3: Copy Assets to `public/`
Copy the 3D model and aerial image from `ppcrc-3d-view/assets/` into your target project's `public/` directory:
```bash
# Windows PowerShell example:
Copy-Item "src\components\ppcrc-3d-view\assets\*" "public\"

# Linux / Mac example:
cp src/components/ppcrc-3d-view/assets/* public/
```
*Note: If you prefer hosting the assets in a subfolder or CDN (e.g. `/models/h.glb`), simply pass the `modelUrl` and `aerialImageUrl` props to `<Ppcrc3DView />`!*

---

## 💻 Code Usage Examples

### 1. Basic Drop-in (Full Flow from India Map to Door)
```tsx
import React from 'react';
import { Ppcrc3DView } from './components/ppcrc-3d-view';

export default function PropertyViewerPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Ppcrc3DView />
    </div>
  );
}
```

### 2. Direct 3D Building View (Skip India Map)
```tsx
import React from 'react';
import { Ppcrc3DView } from './components/ppcrc-3d-view';

export default function DirectBuildingTwinPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Ppcrc3DView 
        initialState="twin_active"
        initialRoom="A-119"
      />
    </div>
  );
}
```

### 3. Custom Assets Location & Event Callbacks
```tsx
import React from 'react';
import { Ppcrc3DView, RoomCadastreRecord, DisplayMode } from './components/ppcrc-3d-view';

export default function CustomPropertyViewer() {
  const handleDoorArrival = (roomCode: string, cadastre: RoomCadastreRecord) => {
    console.log(`Arrived at door: ${roomCode}`, cadastre);
  };

  const handleDisplayMode = (mode: DisplayMode) => {
    console.log(`Display mode changed: ${mode}`); // 'realistic' | 'xray' | 'wireframe'
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Ppcrc3DView 
        initialRoom="A-101"
        initialUlpin="27250401420089"
        initialBuildingId="0089-01-01-101"
        modelUrl="/assets/models/h.glb"
        aerialImageUrl="/assets/imagery/pccrc_building_centered_aerial.jpg"
        onArrivedAtDoor={handleDoorArrival}
        onDisplayModeChange={handleDisplayMode}
      />
    </div>
  );
}
```

---

## ⚙️ Props Reference (`Ppcrc3DViewProps`)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `initialState` | `'initial_map' \| 'zooming_to_prop' \| 'twin_active'` | `'initial_map'` | Start at India Map, zooming flight, or 3D Digital Twin |
| `initialRoom` | `string` | `'A-101'` | Default target room door code (e.g. `'A-101'`, `'A-119'`) |
| `initialUlpin` | `string` | `'27250401420089'` | 14-digit authoritative ULPIN identifier |
| `initialBuildingId` | `string` | `'0089-01-01-101'` | Building-Floor-Area-Room unit code |
| `modelUrl` | `string` | `'/h.glb'` | Path or URL to the 3D GLB model |
| `aerialImageUrl` | `string` | `'/pccrc_building_centered_aerial.jpg'` | Path or URL to the satellite aerial imagery |
| `showSearchBox` | `boolean` | `true` | Show/hide the top-right search and minimize button |
| `onArrivedAtDoor` | `(room: string, cad: RoomCadastreRecord) => void` | `undefined` | Fired when camera arrives in front of room door |
| `onRoomSelected` | `(room: string, cad: RoomCadastreRecord) => void` | `undefined` | Fired when room is clicked or selected from HUD |
| `onDisplayModeChange` | `(mode: DisplayMode) => void` | `undefined` | Fired when mode switches between realistic, xray, wireframe |
| `onStateChange` | `(state: Ppcrc3DViewState) => void` | `undefined` | Fired on map zoom or twin activation |
| `className` | `string` | `undefined` | Optional CSS class name for container |
| `style` | `React.CSSProperties` | `undefined` | Optional inline styles for container |

---

## 🌐 Browser URL Parameters Support

The component automatically checks URL search parameters (if in browser) without requiring `react-router`:
- `?search=1` : Triggers the zoom flight from India map into the property immediately on load
- `?direct=1` : Jumps straight to the 3D building twin
- `?room=A-119` : Specifies the target room door to navigate to
