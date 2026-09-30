// NAKSHA V2.0 - Futuristic 3D Building Digital Twin Engine
// Requirements Implemented:
// 1. Floor Pattern: Exact match to reference photo (Terracotta rust-red tiles with cream grid, black granite borders, radial bar-inlaid pathways, central concentric marble rings with potted plants, and high-gloss specular reflections)
// 2. Full Door Visible on Zoom: Comfortable distance (3.65m) so the entire double door, architrave, closer, and skirting are fully visible without cut-off
// 3. Detail Mark on Door Mid: Positioned directly at the center/middle of the door, NOT above/upside
// 4. Straight-on frontal zoom without showing from another angle
// 5. No camera hijacking/attaching: When camera comes in range of a room, just show its details while camera remains 100% free
// 6. Interactive Controls: X-Ray Mode, Realistic Colors, BIM Wireframe, Floor Isolator

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Sparkles, 
  Scan, 
  Layers, 
  RotateCcw, 
  ShieldCheck, 
  MapPin,
  Compass,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { getRoomCadastre, PCCRC_ROOMS_CADASTRE } from './pccrcRoomCadastre';
import { HandGestureController } from './HandGestureController';
import { 
  DisplayMode, 
  RoomDoorGeometry, 
  RoomCadastreRecord, 
  BuildingDigitalTwinViewerProps 
} from './types';

export { type DisplayMode, type RoomDoorGeometry };

export function getRoomDoorGeometry(roomCode: string): RoomDoorGeometry {
  if (roomCode.includes('101')) {
    return {
      roomCode: 'A-101',
      floor: 1,
      doorMidPos: new THREE.Vector3(11.47, 1.23, -7.40),
      normal: new THREE.Vector3(-1, 0, 0)
    };
  }
  const digits = roomCode.replace(/[^0-9]/g, '');
  const f = Math.min(Math.max(parseInt(digits[0] || '1', 10), 1), 5);
  const r = parseInt(digits.slice(1) || '19', 10);

  const floorBaseY = (f - 1) * 4.2;
  const midY = floorBaseY + 1.23; // Exact middle of 2.44m door leaves

  let midX = 11.47;
  let midZ = -7.40;
  let normal = new THREE.Vector3(-1, 0, 0); // Faces -X into corridor

  if (r >= 11 && r <= 13) {
    // Left Gallery (faces +X into corridor)
    midX = -11.47;
    normal = new THREE.Vector3(1, 0, 0);
    if (r === 11) midZ = -7.40;
    else if (r === 12) midZ = -12.60;
    else if (r === 13) midZ = -17.80;
  } else if (r >= 14 && r <= 16) {
    // Rear Gallery (faces +Z into corridor)
    normal = new THREE.Vector3(0, 0, 1);
    midZ = -24.07;
    if (r === 14) midX = -5.50;
    else if (r === 15) midX = 0.00;
    else if (r === 16) midX = 5.50;
  } else {
    // Right Gallery (faces -X into corridor, includes A-119)
    midX = 11.47;
    normal = new THREE.Vector3(-1, 0, 0);
    if (r === 17) midZ = -17.80;
    else if (r === 18) midZ = -12.60;
    else if (r === 19) midZ = -7.40;
  }

  return {
    roomCode,
    floor: f,
    doorMidPos: new THREE.Vector3(midX, midY, midZ),
    normal
  };
}

interface RoomDoorRecord {
  roomCode: string;
  floor: number;
  doorMidPos: THREE.Vector3;
  normal: THREE.Vector3;
  worldPos: THREE.Vector3;
  mesh?: THREE.Mesh;
  cadastre: RoomCadastreRecord;
}

// ---------------------------------------------------------------------------
// Procedural High-Resolution Texture for Authentic Atrium Floor (2048x2048)
// Matches user reference photo: Terracotta rust-red tiles with cream grid,
// black granite borders with corner accents, radial pathways with black bars,
// and concentric center rings with green-grey glass tile center.
// ---------------------------------------------------------------------------
function createAtriumFloorTexture(): THREE.CanvasTexture {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = size / 2;
  const cy = size / 2;

  // 1. Deep Black Polished Granite Perimeter
  ctx.fillStyle = '#0f1115';
  ctx.fillRect(0, 0, size, size);

  // 2. Terracotta Rust-Red Quadrants with Cream Marble Grid Lines
  const quadInset = 160;
  const quadW = cx - quadInset - 80;
  const quadH = cy - quadInset - 80;
  const tileSize = 60;
  const groutSize = 8;

  const drawTerracottaGrid = (x0: number, y0: number, w: number, h: number) => {
    // Cream marble underlay (grout lines)
    ctx.fillStyle = '#eae4d9';
    ctx.fillRect(x0, y0, w, h);

    // Terracotta tiles
    ctx.fillStyle = '#b74931';
    for (let x = x0 + groutSize; x < x0 + w - groutSize; x += tileSize + groutSize) {
      for (let y = y0 + groutSize; y < y0 + h - groutSize; y += tileSize + groutSize) {
        const curW = Math.min(tileSize, x0 + w - x - groutSize);
        const curH = Math.min(tileSize, y0 + h - y - groutSize);
        if (curW > 4 && curH > 4) {
          ctx.fillRect(x, y, curW, curH);
        }
      }
    }
  };

  // 4 Quadrants
  drawTerracottaGrid(quadInset, quadInset, quadW, quadH); // Top-Left
  drawTerracottaGrid(cx + 80, quadInset, quadW, quadH); // Top-Right
  drawTerracottaGrid(quadInset, cy + 80, quadW, quadH); // Bottom-Left
  drawTerracottaGrid(cx + 80, cy + 80, quadW, quadH); // Bottom-Right

  // 3. Outer Black Granite Inner Border Frames around Quadrants
  ctx.strokeStyle = '#0f1115';
  ctx.lineWidth = 28;
  ctx.strokeRect(quadInset, quadInset, quadW, quadH);
  ctx.strokeRect(cx + 80, quadInset, quadW, quadH);
  ctx.strokeRect(quadInset, cy + 80, quadW, quadH);
  ctx.strokeRect(cx + 80, cy + 80, quadW, quadH);

  // 4. Corner Geometric Terracotta Outline Squares (as visible in reference photo)
  const drawCornerDeco = (x: number, y: number) => {
    ctx.strokeStyle = '#b74931';
    ctx.lineWidth = 7;
    ctx.strokeRect(x - 42, y - 42, 84, 84);
    ctx.strokeRect(x - 22, y - 22, 44, 44);
  };
  drawCornerDeco(quadInset / 2, quadInset / 2);
  drawCornerDeco(size - quadInset / 2, quadInset / 2);
  drawCornerDeco(quadInset / 2, size - quadInset / 2);
  drawCornerDeco(size - quadInset / 2, size - quadInset / 2);

  // 5. Cream Marble Radial Cross Pathways with Black Granite Bar Inserts
  const pathW = 120;
  ctx.fillStyle = '#eae4d9';

  // Horizontal pathway
  ctx.fillRect(0, cy - pathW / 2, size, pathW);
  // Vertical pathway
  ctx.fillRect(cx - pathW / 2, 0, pathW, size);

  // Inlaid Black Granite Bars (Rhythmic piano bar pattern along radial paths)
  ctx.fillStyle = '#121418';
  for (let d = 360; d < size - 360; d += 64) {
    if (Math.abs(d - cx) > 280) {
      // Horizontal bars
      const barW = (d % 128 === 0) ? 36 : 18;
      ctx.fillRect(d, cy - 40, barW, 80);
      // Vertical bars
      ctx.fillRect(cx - 40, d, 80, barW);
    }
  }

  // 6. Central Circular Inlay Medallion
  // Outer Black Granite Ring
  ctx.fillStyle = '#121418';
  ctx.beginPath();
  ctx.arc(cx, cy, 320, 0, Math.PI * 2);
  ctx.fill();

  // Outer Cream Marble Ring
  ctx.fillStyle = '#ede7dc';
  ctx.beginPath();
  ctx.arc(cx, cy, 300, 0, Math.PI * 2);
  ctx.fill();

  // Secondary Black Ring
  ctx.fillStyle = '#121418';
  ctx.beginPath();
  ctx.arc(cx, cy, 270, 0, Math.PI * 2);
  ctx.fill();

  // Inner Concentric Cream Marble Ring
  ctx.fillStyle = '#f4efe6';
  ctx.beginPath();
  ctx.arc(cx, cy, 250, 0, Math.PI * 2);
  ctx.fill();

  // Fine Concentric Circles
  ctx.strokeStyle = '#b74931';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, 200, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#121418';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 150, 0, Math.PI * 2);
  ctx.stroke();

  // Center core glass/tile floor (greenish-grey tint with light grid as in photo)
  ctx.fillStyle = '#9cb0a3';
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#7d9184';
  ctx.lineWidth = 2.5;
  for (let gx = cx - 110; gx <= cx + 110; gx += 22) {
    ctx.beginPath();
    ctx.moveTo(gx, cy - 110);
    ctx.lineTo(gx, cy + 110);
    ctx.stroke();
  }
  for (let gy = cy - 110; gy <= cy + 110; gy += 22) {
    ctx.beginPath();
    ctx.moveTo(cx - 110, gy);
    ctx.lineTo(cx + 110, gy);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 16;
  return texture;
}

// ---------------------------------------------------------------------------
// 3D Point Cloud Floor Segmentation (Downward start point cloud & upward end point cloud)
// ---------------------------------------------------------------------------
function createFloorSegmentationPointClouds(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'floorSegmentationGroup';

  for (let f = 1; f <= 5; f++) {
    const startDownY = (f - 1) * 4.20;
    const endUpY = f * 4.20;

    const createLevelPoints = (y: number, colorHex: number) => {
      const pts: number[] = [];
      // Outer building perimeter LiDAR returns
      for (let x = -17; x <= 17; x += 0.6) {
        pts.push(x, y, -27);
        pts.push(x, y, 7);
      }
      for (let z = -27; z <= 7; z += 0.6) {
        pts.push(-17, y, z);
        pts.push(17, y, z);
      }
      // Inner Atrium opening perimeter LiDAR returns
      for (let x = -8.5; x <= 8.5; x += 0.4) {
        pts.push(x, y, -21);
        pts.push(x, y, -4.2);
      }
      for (let z = -21; z <= -4.2; z += 0.4) {
        pts.push(-8.5, y, z);
        pts.push(8.5, y, z);
      }
      // Structural column intersection point cloud nodes
      const colXs = [-17, -11.47, -5.5, 0, 5.5, 11.47, 17];
      const colZs = [-27, -21, -12.6, -4.2, 7];
      for (const cx of colXs) {
        for (const cz of colZs) {
          for (let k = 0; k < 6; k++) {
            pts.push(cx + (Math.random() - 0.5) * 0.4, y + (Math.random() - 0.5) * 0.08, cz + (Math.random() - 0.5) * 0.4);
          }
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      const mat = new THREE.PointsMaterial({
        color: colorHex,
        size: 0.18,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
      });
      return new THREE.Points(geo, mat);
    };

    const floorGroup = new THREE.Group();
    floorGroup.name = `floor_seg_${f}`;
    // Downward start point cloud (Cyan #06b6d4)
    const downCloud = createLevelPoints(startDownY, 0x06b6d4);
    // Upward end point cloud (Emerald #10b981)
    const upCloud = createLevelPoints(endUpY, 0x10b981);
    floorGroup.add(downCloud);
    floorGroup.add(upCloud);
    group.add(floorGroup);
  }

  return group;
}

// ---------------------------------------------------------------------------
// 3D Door Bounding Volume Prism (1.80m x 2.44m x 0.22m) & Center Cloud Reticle
// ---------------------------------------------------------------------------
function createDoorVolumeMarker(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'doorVolumeMarker';

  // 1.80m W x 2.44m H x 0.22m D bounding volume
  const boxGeo = new THREE.BoxGeometry(1.80, 2.44, 0.22);
  const edges = new THREE.EdgesGeometry(boxGeo);
  const edgeLine = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })
  );
  group.add(edgeLine);

  const fillMesh = new THREE.Mesh(
    boxGeo,
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.14, depthWrite: false })
  );
  group.add(fillMesh);

  // Center Cloud Reticle: Glowing Center Point
  const centerDotGeo = new THREE.SphereGeometry(0.045, 12, 12);
  const centerDotMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const centerDot = new THREE.Mesh(centerDotGeo, centerDotMat);
  group.add(centerDot);

  // Mini 3D Axis crosshairs
  const crosshairGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.25, 0, 0), new THREE.Vector3(0.25, 0, 0),
    new THREE.Vector3(0, -0.25, 0), new THREE.Vector3(0, 0.25, 0),
    new THREE.Vector3(0, 0, -0.20), new THREE.Vector3(0, 0, 0.20)
  ]);
  const crosshair = new THREE.LineSegments(
    crosshairGeo,
    new THREE.LineBasicMaterial({ color: 0x4ade80 })
  );
  group.add(crosshair);

  // Local LiDAR Point Cloud Returns
  const lidarPts: number[] = [];
  for (let i = 0; i < 28; i++) {
    const rx = (Math.random() - 0.5) * 1.6;
    const ry = (Math.random() - 0.5) * 2.2;
    const rz = (Math.random() - 0.5) * 0.18;
    lidarPts.push(rx, ry, rz);
  }
  const lidarGeo = new THREE.BufferGeometry();
  lidarGeo.setAttribute('position', new THREE.Float32BufferAttribute(lidarPts, 3));
  const lidarPoints = new THREE.Points(
    lidarGeo,
    new THREE.PointsMaterial({ color: 0xa7f3d0, size: 0.08, transparent: true, opacity: 0.9 })
  );
  group.add(lidarPoints);

  return group;
}

// ---------------------------------------------------------------------------
// Procedural Micro-Cloud Points Builder (4,500+ luminous points stacked layer-by-layer)
// ---------------------------------------------------------------------------
function createMicroPointCloudMesh(): { points: THREE.Points; origPositions: Float32Array; pointCount: number } {
  const pts: number[] = [];
  const colors: number[] = [];
  const colCyan = new THREE.Color(0x38bdf8);
  const colEmerald = new THREE.Color(0x34d399);
  const colGold = new THREE.Color(0xfbbf24);

  // 1. Column vertical stacks (RCC Moment Columns)
  const colXs = [-17, -11.47, -5.5, 0, 5.5, 11.47, 17];
  const colZs = [-27, -21, -12.6, -4.2, 7];
  for (const cx of colXs) {
    for (const cz of colZs) {
      for (let y = 0; y <= 21; y += 0.35) {
        pts.push(cx + (Math.random() - 0.5) * 0.25, y, cz + (Math.random() - 0.5) * 0.25);
        const c = y % 4.2 < 0.35 ? colEmerald : colCyan;
        colors.push(c.r, c.g, c.b);
      }
    }
  }

  // 2. Floor slabs & gallery perimeter points (5 tiers)
  for (let f = 1; f <= 5; f++) {
    const fy = (f - 1) * 4.2;
    for (let x = -17; x <= 17; x += 0.9) {
      for (let z = -27; z <= 7; z += 0.9) {
        const inAtrium = (x > -8.5 && x < 8.5 && z > -21 && z < -4.2);
        if (!inAtrium || f === 1) {
          pts.push(x + (Math.random() - 0.5) * 0.2, fy + (Math.random() - 0.5) * 0.05, z + (Math.random() - 0.5) * 0.2);
          colors.push(colEmerald.r, colEmerald.g, colEmerald.b);
        }
      }
    }
  }

  // 3. Facade & room door portals
  for (let f = 1; f <= 5; f++) {
    const fy = (f - 1) * 4.2;
    for (let dy = 0; dy <= 2.44; dy += 0.3) {
      for (let r = 11; r <= 19; r++) {
        const geom = getRoomDoorGeometry(`A-${f}${r}`);
        pts.push(geom.doorMidPos.x + (Math.random() - 0.5) * 1.6, fy + dy, geom.doorMidPos.z + (Math.random() - 0.5) * 0.2);
        colors.push(colGold.r, colGold.g, colGold.b);
      }
    }
  }

  const origPositions = new Float32Array(pts);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(pts.length), 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geo, mat);
  points.name = 'microPointCloud';
  points.visible = false;
  return { points, origPositions, pointCount: pts.length / 3 };
}

// ---------------------------------------------------------------------------
// Glowing Laser Scanner Plane & Tile Wave Ring
// ---------------------------------------------------------------------------
function createLaserScannerPlane(): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(38, 38);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.visible = false;
  mesh.name = 'laserScannerPlane';
  return mesh;
}

function createTileWaveRing(): THREE.Mesh {
  const geo = new THREE.RingGeometry(0.1, 0.6, 64);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xfbbf24,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, 0.09, -12.6);
  mesh.visible = false;
  mesh.name = 'tileWaveRing';
  return mesh;
}

export const BuildingDigitalTwinViewer: React.FC<BuildingDigitalTwinViewerProps> = ({
  targetRoomNumber = 'A-101',
  isActive,
  modelUrl = '/h.glb',
  onConstructionComplete,
  onArrivedAtRoom,
  onRoomSelect,
  onProximityRoomChange,
  onExplorationModeChange
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);

  // Mesh & Room Tracking
  const meshesRef = useRef<{ mesh: THREE.Mesh; originalMat: any; origY: number; floor: number; isDoor: boolean; isExterior: boolean; name: string }[]>([]);
  const roomDoorsRef = useRef<RoomDoorRecord[]>([]);
  const atriumFloorMeshRef = useRef<THREE.Mesh | null>(null);
  // buildingGroundMeshRef removed (sky blue sheet removed per user request)
  const frontPillarsRef = useRef<THREE.Group[]>([]);
  const pottedPlantsRef = useRef<THREE.Group[]>([]);
  const floorSegmentationGroupRef = useRef<THREE.Group | null>(null);
  const doorVolumeMarkerRef = useRef<THREE.Group | null>(null);
  const microPointCloudRef = useRef<{ points: THREE.Points; origPositions: Float32Array; pointCount: number } | null>(null);
  const laserScannerPlaneRef = useRef<THREE.Mesh | null>(null);
  const tileWaveRingRef = useRef<THREE.Mesh | null>(null);
  const hasConstructedRef = useRef(false);
  const isFlyingRef = useRef(false);

  // States
  const [animStage, setAnimStage] = useState<'idle' | 'empty' | 'building' | 'entering' | 'at_room' | 'free_orbit'>('idle');
  const [telemetryText, setTelemetryText] = useState('');
  const [buildPercent, setBuildPercent] = useState(0);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('realistic');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [showPointCloudSegmentation, setShowPointCloudSegmentation] = useState(false); // Dots visible only after clicking
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [hasReachedRoom, setHasReachedRoom] = useState(false);

  // Dynamic Proximity Detection: shows room mark on door mid when near, hides when > 5.5m
  const [proximityRoom, setProximityRoom] = useState<{ 
    record: RoomCadastreRecord; 
    distance: number; 
    screenPos: { x: number; y: number } 
  } | null>(null);

  // -------------------------------------------------------------------------
  // 1. Initialize Daylight Scene, Lighting & Controls
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Architectural Overcast Sky (Slightly dark neutral studio overcast matching user reference image)
    scene.background = new THREE.Color('#949aa2');
    scene.fog = new THREE.FogExp2('#949aa2', 0.0024);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 15, 52); // Direct front facade eye level

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06; // Calm, slightly dark studio overcast exposure
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 + 0.02;
    controls.enabled = false;
    setViewerReady(true);

    // --- Studio Atmospheric Lighting Matching Architectural Overcast Reference ---
    const hemiLight = new THREE.HemisphereLight(0xcfd6de, 0x2b2f35, 1.45);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.75);
    sunLight.position.set(28, 48, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0001;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x94a3b8, 0.85);
    fillLight.position.set(-24, 25, 35);
    scene.add(fillLight);

    const bounceLight = new THREE.DirectionalLight(0xb0bec5, 0.45);
    bounceLight.position.set(0, -10, 20);
    scene.add(bounceLight);

    // Bright Multi-Level Atrium Lights (Centered at Atrium Center Z = -12.6)
    const atriumLight1 = new THREE.PointLight(0xfff8f0, 3.8, 45);
    atriumLight1.position.set(0, 3.5, -12.6);
    scene.add(atriumLight1);

    const atriumLight2 = new THREE.PointLight(0xfff8f0, 3.2, 45);
    atriumLight2.position.set(0, 11.0, -12.6);
    scene.add(atriumLight2);

    const atriumLight3 = new THREE.PointLight(0xfff8f0, 3.2, 50);
    atriumLight3.position.set(0, 18.0, -12.6);
    scene.add(atriumLight3);

    // --- Slightly Dark Ground (Charcoal/Dark Asphalt matching user reference image) ---
    const groundGeo = new THREE.PlaneGeometry(350, 350);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: 0x383c42, // Slightly dark charcoal asphalt matching reference photo
      roughness: 0.85, 
      metalness: 0.06 
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.88; // Placed at -0.88 so entrance steps & risers sit cleanly on top
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Sky blue building ground sheet removed per user request ("remove this sky blue sheet")

    // --- Visible Front Portico Small Round Pillars ---
    // User requirement: "the stares and round small piller is not village at front make it visible"
    const frontPillars: THREE.Group[] = [];
    const createFrontRoundPillar = (px: number, pz: number) => {
      const g = new THREE.Group();
      // Round Pillar Plinth
      const plinthGeo = new THREE.CylinderGeometry(0.36, 0.40, 0.28, 24);
      const plinthMat = new THREE.MeshStandardMaterial({ color: 0xd9a994, roughness: 0.65 });
      const plinth = new THREE.Mesh(plinthGeo, plinthMat);
      plinth.position.y = -0.85 + 0.14;
      plinth.castShadow = true;
      plinth.receiveShadow = true;
      g.add(plinth);

      // Round Pillar Shaft
      const shaftGeo = new THREE.CylinderGeometry(0.28, 0.30, 1.45, 24);
      const shaftMat = new THREE.MeshStandardMaterial({ color: 0xf4efe8, roughness: 0.55 });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      shaft.position.y = -0.85 + 0.28 + 0.725;
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      g.add(shaft);

      // Round Pillar Capital
      const capGeo = new THREE.CylinderGeometry(0.35, 0.30, 0.18, 24);
      const cap = new THREE.Mesh(capGeo, plinthMat);
      cap.position.y = -0.85 + 0.28 + 1.45 + 0.09;
      cap.castShadow = true;
      g.add(cap);

      // Spherical Finial
      const finialGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const finial = new THREE.Mesh(finialGeo, shaftMat);
      finial.position.y = -0.85 + 0.28 + 1.45 + 0.18 + 0.18;
      finial.castShadow = true;
      g.add(finial);

      g.position.set(px, 0, pz);
      g.visible = false;
      scene.add(g);
      frontPillars.push(g);
    };

    createFrontRoundPillar(-7.6, 9.2);
    createFrontRoundPillar(7.6, 9.2);
    frontPillarsRef.current = frontPillars;

    // -----------------------------------------------------------------------
    // ACCURATE ATRIUM FLOOR MESH (Terracotta Rust-Red + Black Granite + Inlay)
    // Matches the photograph provided by the user with high-gloss reflection!
    // Centered at the Atrium opening (0, 0.02, -12.6)
    // -----------------------------------------------------------------------
    const floorTexture = createAtriumFloorTexture();
    const atriumFloorGeo = new THREE.PlaneGeometry(23.2, 23.2);
    const atriumFloorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.22, // High-gloss polished stone reflectivity
      metalness: 0.12,
      envMapIntensity: 1.5
    });
    const atriumFloorMesh = new THREE.Mesh(atriumFloorGeo, atriumFloorMat);
    atriumFloorMesh.rotation.x = -Math.PI / 2;
    atriumFloorMesh.position.set(0, 0.07, -12.6); // Elevated at y=0.07 above the slab so it's fully visible and crisp
    atriumFloorMesh.receiveShadow = true;
    atriumFloorMesh.visible = false;
    atriumFloorMesh.scale.set(0.01, 0.01, 0.01);
    scene.add(atriumFloorMesh);
    atriumFloorMeshRef.current = atriumFloorMesh;

    // Add 4 Potted Plants around Central Circle as seen in reference photo
    const plants: THREE.Group[] = [];
    const createPottedPlant = (px: number, pz: number) => {
      const plantGroup = new THREE.Group();
      // Terracotta Pot
      const potGeo = new THREE.CylinderGeometry(0.25, 0.19, 0.38, 16);
      const potMat = new THREE.MeshStandardMaterial({ color: 0xba4530, roughness: 0.55 });
      const pot = new THREE.Mesh(potGeo, potMat);
      pot.position.y = 0.19;
      pot.castShadow = true;
      plantGroup.add(pot);

      // Dark Soil
      const soilGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.04, 16);
      const soilMat = new THREE.MeshStandardMaterial({ color: 0x2a1a12, roughness: 0.9 });
      const soil = new THREE.Mesh(soilGeo, soilMat);
      soil.position.y = 0.36;
      plantGroup.add(soil);

      // Green Leaves
      const foliageGeo = new THREE.SphereGeometry(0.30, 10, 10);
      foliageGeo.scale(1.1, 1.3, 1.1);
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x22543d, roughness: 0.65 });
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 0.54;
      foliage.castShadow = true;
      plantGroup.add(foliage);

      plantGroup.position.set(px, 0.07, pz);
      plantGroup.visible = false;
      scene.add(plantGroup);
      plants.push(plantGroup);
    };

    createPottedPlant(0, -12.6 + 1.8);
    createPottedPlant(0, -12.6 - 1.8);
    createPottedPlant(1.8, -12.6);
    createPottedPlant(-1.8, -12.6);
    pottedPlantsRef.current = plants;

    // -----------------------------------------------------------------------
    // 3D Point Cloud Floor Segmentation (Downward start & Upward end LiDAR bounds)
    // -----------------------------------------------------------------------
    const floorSegGroup = createFloorSegmentationPointClouds();
    floorSegmentationGroupRef.current = floorSegGroup;
    floorSegGroup.visible = false; // "dots should be visible only after clicking"
    scene.add(floorSegGroup);

    // -----------------------------------------------------------------------
    // 3D Door Bounding Volume Prism (1.80m x 2.44m x 0.22m) & Center Cloud Reticle
    // -----------------------------------------------------------------------
    const doorVolMarker = createDoorVolumeMarker();
    doorVolumeMarkerRef.current = doorVolMarker;
    doorVolMarker.visible = false;
    scene.add(doorVolMarker);

    // Micro Point Cloud Building Structure & Laser Scanner
    const microCloud = createMicroPointCloudMesh();
    microPointCloudRef.current = microCloud;
    microCloud.points.visible = false;
    scene.add(microCloud.points);

    const laserScanner = createLaserScannerPlane();
    laserScannerPlaneRef.current = laserScanner;
    laserScanner.visible = false;
    scene.add(laserScanner);

    const tileWave = createTileWaveRing();
    tileWaveRingRef.current = tileWave;
    tileWave.visible = false;
    scene.add(tileWave);

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (controls.enabled) {
        controls.update();
      }

      // Free vertical camera orbit: anti-mid-floor camera snap removed per user instruction.
      // Proximity auto-attraction removed per user instruction:
      // Details & markers ONLY show upon clicking on a room door or performing a search.

      // Keep active door reticle positioned on screen if a room was clicked
      if (proximityRoom && cameraRef.current && mountRef.current) {
        const centerPt = new THREE.Vector3(
          proximityRoom.record.centerCloud.x,
          proximityRoom.record.centerCloud.y,
          proximityRoom.record.centerCloud.z
        );
        const screenVector = centerPt.clone().project(cameraRef.current);
        const hw = mountRef.current.clientWidth / 2;
        const hh = mountRef.current.clientHeight / 2;
        const sx = screenVector.x * hw + hw;
        const sy = -screenVector.y * hh + hh;
        if (Math.abs(proximityRoom.screenPos.x - sx) > 1.5 || Math.abs(proximityRoom.screenPos.y - sy) > 1.5) {
          setProximityRoom(prev => prev ? { ...prev, screenPos: { x: sx, y: sy } } : null);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      setViewerReady(false);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onProximityRoomChange]);

  // -------------------------------------------------------------------------
  // 2. Load Model (/h.glb) & Apply Color Calibration to Match front_reconstruction.png
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    const loader = new GLTFLoader();
    loader.load(
      modelUrl || '/h.glb',
      (gltf) => {
        const root = gltf.scene;
        modelGroupRef.current = root;

        root.position.set(0, 0, 0);
        const collected: any[] = [];

        // Pre-defined Reference Color Materials matching front_reconstruction.png
        const matCream = new THREE.MeshStandardMaterial({ color: 0xf4efe8, roughness: 0.65, metalness: 0.05 });
        const matPeach = new THREE.MeshStandardMaterial({ color: 0xd9a994, roughness: 0.55, metalness: 0.05 });
        const matTerracotta = new THREE.MeshStandardMaterial({ color: 0xba4530, roughness: 0.60, metalness: 0.05 });
        const matStoneTread = new THREE.MeshStandardMaterial({ color: 0xede7df, roughness: 0.70, metalness: 0.05 });
        const matWoodBeech = new THREE.MeshStandardMaterial({ color: 0xd7ac7c, roughness: 0.45, metalness: 0.05 });
        const matStainless = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25, metalness: 0.85 });
        const matGlass = new THREE.MeshPhysicalMaterial({ color: 0x5f8099, transparent: true, opacity: 0.45, roughness: 0.1, transmission: 0.6 });
        const matFireRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3, metalness: 0.1 });
        const matGranite = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4, metalness: 0.1 });
        const matWindowFrame = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.65 });

        const toRemove: THREE.Object3D[] = [];

        root.traverse((child) => {
          const name = child.name || '';
          const parentName = child.parent ? child.parent.name || '' : '';
          const ln = (name + ' ' + parentName).toLowerCase();

          // Completely detach legacy procedural paving, platform, and planter meshes from scene graph
          const isLegacyGroundOrPlanter = 
            ln.includes('glossy tile') ||
            ln.includes('stone paving') ||
            ln.includes('planter') ||
            ln.includes('plant leaf') ||
            ln.includes('plant stem') ||
            ln.includes('concrete platform') ||
            ln.includes('circular platform') ||
            ln.includes('stone inlay') ||
            ln.includes('polished stone ground') ||
            ln.includes('atrium polished') ||
            ln.includes('burgundy planter') ||
            ln.includes('sparse low planting') ||
            ln.includes('planting');

          if (isLegacyGroundOrPlanter) {
            child.visible = false;
            child.scale.set(0, 0, 0);
            child.position.set(0, -9999, 0);
            toRemove.push(child);
            return;
          }

          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.castShadow = true;
            m.receiveShadow = true;
            const yPos = m.position.y;

            // Accurate Color Assignment (Ensure windows on left and right sides use glass & frame)
            if (ln.includes('glass')) {
              m.material = matGlass;
            } else if (
              ln.includes('mullion') || 
              ln.includes('transom') || 
              ln.includes('window frame') || 
              ln.includes('security grille') || 
              ln.includes('grille crossbar') ||
              ln.includes('perimeter seal') ||
              ln.includes('window latch') ||
              ln.includes('bay latch') ||
              ln.includes('bay horizontal transom') ||
              ln.includes('bay vertical mullion')
            ) {
              m.material = matWindowFrame;
            } else if (
              ln.includes('spandrel') || 
              ln.includes('bay sill') || 
              ln.includes('bay header') || 
              ln.includes('bay raised jamb')
            ) {
              m.material = matCream;
            } else if (name.includes('Peach') || name.includes('pediment') || name.includes('column') || name.includes('pier') || name.includes('balustrade') || name.includes('arch reveal') || name.includes('reveal rim')) {
              m.material = matPeach;
            } else if (name.includes('riser') || name.includes('Wide entrance stair riser')) {
              m.material = matTerracotta;
            } else if (name.includes('tread') || name.includes('stair tread') || name.includes('nosing') || name.includes('Cream worn stair nosing')) {
              m.material = matStoneTread;
            } else if (name.includes('Door_') || name.includes('Portal_') || name.includes('leaf')) {
              m.material = matWoodBeech;
            } else if (name.includes('Handle_') || name.includes('Closer_') || name.includes('Slide_Bolt') || name.includes('Padlock') || name.includes('railing')) {
              m.material = matStainless;
            } else if (name.includes('Fire_Alarm')) {
              m.material = matFireRed;
            } else if (name.includes('Skirting') || name.includes('concrete platform') || name.includes('landscape edging') || name.includes('mortar seam')) {
              m.material = matGranite;
            } else if (name.includes('bed soil')) {
              m.material = new THREE.MeshStandardMaterial({ color: 0x3a3028, roughness: 0.95 });
            } else if (name.includes('planting')) {
              m.material = new THREE.MeshStandardMaterial({ color: 0x48644e, roughness: 0.8 });
            } else if (name.includes('wall') || name.includes('Facade') || name.includes('Wing') || name.includes('coping')) {
              m.material = matCream;
            }

            let floor = 0;
            if (name.includes('51') || name.includes('Floor_4') || yPos > 16.8) floor = 4;
            else if (name.includes('41') || name.includes('Floor_3') || yPos > 12.6) floor = 3;
            else if (name.includes('31') || name.includes('Floor_2') || yPos > 8.4) floor = 2;
            else if (name.includes('21') || name.includes('Floor_1') || yPos > 4.2) floor = 1;
            else floor = 0;

            const isDoor = name.includes('Door') || name.includes('Placard') || name.includes('Closer') || name.includes('Handle');
            const isExterior = name.includes('Front') || name.includes('pediment') || name.includes('facade') || name.includes('Wing') || name.includes('parapet');

            collected.push({
              mesh: m,
              originalMat: Array.isArray(m.material) ? m.material.map(mat => mat.clone()) : m.material.clone(),
              origY: m.position.y,
              floor,
              isDoor,
              isExterior,
              name
            });

            m.visible = false;
          }
        });

        // Detach all legacy ground, paving, and planter meshes from the model
        toRemove.forEach((obj) => {
          obj.visible = false;
          obj.scale.set(0, 0, 0);
          obj.position.set(0, -9999, 0);
          if (obj.parent) {
            obj.parent.remove(obj);
          }
        });

        // Ensure all 45 rooms are accurately registered with exact door midpoint and outward normal
        const allDoors: RoomDoorRecord[] = [];
        for (let f = 1; f <= 5; f++) {
          for (let r = 11; r <= 19; r++) {
            const code = `A-${f}${r}`;
            const geom = getRoomDoorGeometry(code);
            allDoors.push({
              roomCode: code,
              floor: f,
              doorMidPos: geom.doorMidPos,
              normal: geom.normal,
              worldPos: geom.doorMidPos.clone(),
              cadastre: getRoomCadastre(code)
            });
          }
        }
        roomDoorsRef.current = allDoors;
        meshesRef.current = collected;
        root.visible = true;
        scene.add(root);
        setIsModelLoaded(true);
      },
      undefined,
      (err) => console.warn('Model load issue:', err)
    );

    return () => {
      if (modelGroupRef.current && sceneRef.current) {
        sceneRef.current.remove(modelGroupRef.current);
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // 3. Continuous Realistic Indoor Architectural Flight Path (No Cuts!)
  //    Traces realistic paths: Front Plaza -> Portico Colonnade -> Entrance Portal ->
  //    Atrium Foyer -> Central Atrium Medallion -> Open Light Well Ascent (for Upper Floors) ->
  //    Gallery Walkway Corridor -> Straight-on Door Center Lock at 3.20m Safe Distance!
  // -------------------------------------------------------------------------
  const executeContinuousIndoorPath = useCallback((roomCode: string) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    isFlyingRef.current = true;
    controls.enabled = false;
    setAnimStage('entering');
    setTelemetryText(`ENTERING MAIN PORTICO → REALISTIC PATH TO ROOM ${roomCode}`);

    const targetCad = getRoomCadastre(roomCode);
    const f = targetCad.floorNumber;
    const centerPoint = new THREE.Vector3(targetCad.centerCloud.x, targetCad.centerCloud.y, targetCad.centerCloud.z);
    const normal = new THREE.Vector3(targetCad.centerCloud.normalX, targetCad.centerCloud.normalY, targetCad.centerCloud.normalZ);

    if (doorVolumeMarkerRef.current) {
      doorVolumeMarkerRef.current.visible = true;
      doorVolumeMarkerRef.current.position.copy(centerPoint);
      if (targetCad.centerCloud.normalX !== 0) {
        doorVolumeMarkerRef.current.rotation.y = Math.PI / 2;
      } else {
        doorVolumeMarkerRef.current.rotation.y = 0;
      }
    }

    const targetElevation = centerPoint.y + 0.15;
    const endLook = new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z);
    const endPos = endLook.clone().add(normal.clone().multiplyScalar(3.20));

    const floorBaseY = (f - 1) * 4.20;
    const floorEyeY = floorBaseY + 1.65;

    // Ensure 100% unobstructed sightline: hide any railings, balustrades, or columns near this door's sightline
    meshesRef.current.forEach(item => {
      const ln = item.name.toLowerCase();
      if (ln.includes('railing') || ln.includes('balustrade') || ln.includes('column') || ln.includes('pier') || ln.includes('post')) {
        const itemPos = new THREE.Vector3();
        item.mesh.getWorldPosition(itemPos);
        const distToDoor = itemPos.distanceTo(endLook);
        const distToCam = itemPos.distanceTo(endPos);
        if (distToDoor < 4.8 || distToCam < 3.8) {
          item.mesh.visible = false;
        }
      }
    });

    // Build Architectural Path Waypoints (No clipping through solid floors or walls)
    const posPoints: THREE.Vector3[] = [];
    const lookPoints: THREE.Vector3[] = [];

    // WP 0: Front exterior plaza (matches exactly where circular orbit completed: NO CUT!)
    posPoints.push(new THREE.Vector3(0, 3.4, 32.0));
    lookPoints.push(new THREE.Vector3(0, 2.4, 4.0));

    // WP 1: Between front portico columns
    posPoints.push(new THREE.Vector3(0, 2.8, 16.0));
    lookPoints.push(new THREE.Vector3(0, 2.2, 2.0));

    // WP 2: Passing through main entrance portal
    posPoints.push(new THREE.Vector3(0, 2.2, 5.0));
    lookPoints.push(new THREE.Vector3(0, 2.0, -4.0));

    // WP 3: Entering ground-floor atrium foyer
    posPoints.push(new THREE.Vector3(0, 2.0, -2.0));
    lookPoints.push(new THREE.Vector3(0, 2.0, -12.6));

    // WP 4: Center of the open central atrium
    posPoints.push(new THREE.Vector3(0, 2.2, -9.5));
    lookPoints.push(new THREE.Vector3(0, 2.2, -12.6));

    if (f === 1) {
      // Level 1: Ground Atrium Floor
      posPoints.push(new THREE.Vector3(0, 1.8, -12.6));
      if (normal.x < -0.5) {
        // Right Gallery (East wing, e.g. A-119)
        lookPoints.push(new THREE.Vector3(8.27, 1.8, -12.6));

        posPoints.push(new THREE.Vector3(4.8, 1.8, -12.6));
        lookPoints.push(new THREE.Vector3(8.27, 1.8, centerPoint.z));

        posPoints.push(new THREE.Vector3(8.27, 1.8, -12.6));
        lookPoints.push(new THREE.Vector3(8.27, targetElevation, centerPoint.z));

        posPoints.push(new THREE.Vector3(8.27, targetElevation, (centerPoint.z + (-12.6)) * 0.5));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z));
      } else if (normal.x > 0.5) {
        // Left Gallery (West wing)
        lookPoints.push(new THREE.Vector3(-8.27, 1.8, -12.6));

        posPoints.push(new THREE.Vector3(-4.8, 1.8, -12.6));
        lookPoints.push(new THREE.Vector3(-8.27, 1.8, centerPoint.z));

        posPoints.push(new THREE.Vector3(-8.27, 1.8, -12.6));
        lookPoints.push(new THREE.Vector3(-8.27, targetElevation, centerPoint.z));

        posPoints.push(new THREE.Vector3(-8.27, targetElevation, (centerPoint.z + (-12.6)) * 0.5));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z));
      } else {
        // Rear Gallery (North wing)
        lookPoints.push(new THREE.Vector3(0, 1.8, -20.87));

        posPoints.push(new THREE.Vector3(0, 1.8, -16.5));
        lookPoints.push(new THREE.Vector3(centerPoint.x, 1.8, -20.87));

        posPoints.push(new THREE.Vector3(0, 1.8, -20.87));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, -24.07));

        posPoints.push(new THREE.Vector3(centerPoint.x * 0.6, targetElevation, -20.87));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, -24.07));
      }
    } else {
      // Upper Floors (Floors 2 to 5, e.g. Level 5 Room A-519)
      // Open central atrium light well base
      posPoints.push(new THREE.Vector3(0, 2.4, -12.6));
      lookPoints.push(new THREE.Vector3(0, floorEyeY * 0.6 + 2.0, -12.6));

      // Majestic ascent up through open central atrium void (no solid slabs in the atrium opening!)
      posPoints.push(new THREE.Vector3(0, floorEyeY * 0.55 + 1.2, -12.6));
      lookPoints.push(new THREE.Vector3(0, floorEyeY + 1.0, -12.6));

      // Arrive at target floor level in the atrium void
      posPoints.push(new THREE.Vector3(0, floorEyeY, -12.6));

      if (normal.x < -0.5) {
        // Right Gallery (East wing, e.g. Room A-519)
        lookPoints.push(new THREE.Vector3(8.27, floorEyeY, -12.6));

        posPoints.push(new THREE.Vector3(4.8, floorEyeY, -12.6));
        lookPoints.push(new THREE.Vector3(8.27, floorEyeY, centerPoint.z));

        posPoints.push(new THREE.Vector3(8.27, floorEyeY, -12.6));
        lookPoints.push(new THREE.Vector3(8.27, targetElevation, centerPoint.z));

        posPoints.push(new THREE.Vector3(8.27, targetElevation, (centerPoint.z + (-12.6)) * 0.5));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z));
      } else if (normal.x > 0.5) {
        // Left Gallery (West wing)
        lookPoints.push(new THREE.Vector3(-8.27, floorEyeY, -12.6));

        posPoints.push(new THREE.Vector3(-4.8, floorEyeY, -12.6));
        lookPoints.push(new THREE.Vector3(-8.27, floorEyeY, centerPoint.z));

        posPoints.push(new THREE.Vector3(-8.27, floorEyeY, -12.6));
        lookPoints.push(new THREE.Vector3(-8.27, targetElevation, centerPoint.z));

        posPoints.push(new THREE.Vector3(-8.27, targetElevation, (centerPoint.z + (-12.6)) * 0.5));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z));
      } else {
        // Rear Gallery (North wing)
        lookPoints.push(new THREE.Vector3(0, floorEyeY, -20.87));

        posPoints.push(new THREE.Vector3(0, floorEyeY, -16.5));
        lookPoints.push(new THREE.Vector3(centerPoint.x, floorEyeY, -20.87));

        posPoints.push(new THREE.Vector3(0, floorEyeY, -20.87));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, -24.07));

        posPoints.push(new THREE.Vector3(centerPoint.x * 0.6, targetElevation, -20.87));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, -24.07));
      }
    }

    // Final door framing waypoint
    posPoints.push(endPos.clone());
    lookPoints.push(endLook.clone());

    const posCurve = new THREE.CatmullRomCurve3(posPoints, false, 'centripetal');
    const lookCurve = new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal');

    const flyStart = performance.now();
    const flyDuration = 6200; // 6.2s continuous, cinematic indoor architectural flight
    const initialFov = camera.fov;
    const targetFov = 52;

    const animateIndoor = (now: number) => {
      const elapsed = Math.max(0, now - flyStart);
      const t = Math.min(Math.max(elapsed / flyDuration, 0), 1);
      // Smooth cubic ease-in-out
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const safeU = Math.min(Math.max(ease, 0.0), 0.99999);

      try {
        const curPos = t >= 1 ? endPos : posCurve.getPoint(safeU);
        const curLook = t >= 1 ? endLook : lookCurve.getPoint(safeU);

        camera.position.copy(curPos);
        camera.lookAt(curLook);
        if (controlsRef.current) {
          controlsRef.current.target.copy(curLook);
        }
        camera.fov = THREE.MathUtils.lerp(initialFov, targetFov, ease);
        camera.updateProjectionMatrix();
      } catch (err) {
        console.warn('Indoor flight interpolation fallback:', err);
        camera.position.lerpVectors(new THREE.Vector3(0, 3.4, 32.0), endPos, ease);
        camera.lookAt(new THREE.Vector3().lerpVectors(new THREE.Vector3(0, 2.4, 4.0), endLook, ease));
      }

      if (t < 1) {
        requestAnimationFrame(animateIndoor);
      } else {
        isFlyingRef.current = false;
        controls.enabled = true;
        controls.target.copy(endLook);
        setAnimStage('at_room');
        setHasReachedRoom(true);
        setTelemetryText(`TARGET LOCKED: ROOM ${targetCad.roomCode} • VOL: ${targetCad.doorVolume.volumeM3}m³ • CENTER CLOUD: [${targetCad.centerCloud.x}, ${targetCad.centerCloud.y}, ${targetCad.centerCloud.z}]`);

        // Set proximityRoom ONLY for targeted room
        const hw = (mountRef.current?.clientWidth || 800) / 2;
        const hh = (mountRef.current?.clientHeight || 600) / 2;
        const screenVector = centerPoint.clone().project(camera);
        setProximityRoom({
          record: targetCad,
          distance: 3.20,
          screenPos: { x: screenVector.x * hw + hw, y: -screenVector.y * hh + hh }
        });

        // Web Speech API Voice Telemetry
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try {
            window.speechSynthesis.cancel();
            const floorSpokenMap: Record<number, string> = {
              1: 'Level 1, Ground Floor Atrium Tier',
              2: 'Level 2, Second Floor Gallery',
              3: 'Level 3, Third Floor Gallery',
              4: 'Level 4, Fourth Floor Gallery',
              5: 'Level 5, Fifth Floor Gallery'
            };
            const floorSpoken = floorSpokenMap[targetCad.floorNumber] || `Level ${targetCad.floorNumber}`;
            const speechText = `Room ${targetCad.roomCode.replace('-', ' ')}. ${floorSpoken}. ${targetCad.roomName}. Center of door volume locked at elevation ${targetCad.centerCloud.elevationMsl} meters MSL.`;
            const utterance = new SpeechSynthesisUtterance(speechText);
            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
          } catch (e) {
            console.warn('SpeechSynthesis error:', e);
          }
        }

        if (onArrivedAtRoom) {
          onArrivedAtRoom(targetCad.roomCode);
        }
      }
    };

    requestAnimationFrame(animateIndoor);
  }, [onArrivedAtRoom]);

  // -------------------------------------------------------------------------
  // 4. Smooth Camera Zoom / Navigation to Specific Room Door
  // -------------------------------------------------------------------------
  const zoomToRoom = useCallback((roomCode: string) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    // If camera is outside the front entrance, execute full continuous indoor path!
    if (camera.position.z > 20 || camera.position.distanceTo(new THREE.Vector3(0, 0, -12.6)) > 30) {
      executeContinuousIndoorPath(roomCode);
      return;
    }

    isFlyingRef.current = true;
    controls.enabled = false;

    const cad = getRoomCadastre(roomCode);
    const centerPoint = new THREE.Vector3(cad.centerCloud.x, cad.centerCloud.y, cad.centerCloud.z);
    const normal = new THREE.Vector3(cad.centerCloud.normalX, cad.centerCloud.normalY, cad.centerCloud.normalZ);

    // Update 3D Door Volume Marker & Center Cloud Reticle
    if (doorVolumeMarkerRef.current) {
      doorVolumeMarkerRef.current.visible = true;
      doorVolumeMarkerRef.current.position.copy(centerPoint);
      if (cad.centerCloud.normalX !== 0) {
        doorVolumeMarkerRef.current.rotation.y = Math.PI / 2;
      } else {
        doorVolumeMarkerRef.current.rotation.y = 0;
      }
    }

    const targetElevation = centerPoint.y + 0.15;
    const endLook = new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z);
    const endPos = endLook.clone().add(normal.clone().multiplyScalar(3.20));

    const startPos = camera.position.clone();
    const startLook = controls.target.clone();

    const startFov = camera.fov;
    const endFov = 52;

    // Ensure 100% unobstructed view
    meshesRef.current.forEach(item => {
      const ln = item.name.toLowerCase();
      if (ln.includes('railing') || ln.includes('balustrade') || ln.includes('column') || ln.includes('pier') || ln.includes('post')) {
        const itemPos = new THREE.Vector3();
        item.mesh.getWorldPosition(itemPos);
        const distToDoor = itemPos.distanceTo(endLook);
        const distToCam = itemPos.distanceTo(endPos);
        if (distToDoor < 4.8 || distToCam < 3.8) {
          item.mesh.visible = false;
        }
      }
    });

    const isDiffFloor = Math.abs(startPos.y - endPos.y) > 2.0;

    if (isDiffFloor) {
      // Architectural multi-floor transit via the open central atrium void (no clipping through floor slabs!)
      const midPoints: THREE.Vector3[] = [
        startPos.clone(),
        new THREE.Vector3(0, startPos.y, -12.6),
        new THREE.Vector3(0, endPos.y, -12.6),
        endPos.clone()
      ];
      const lookPoints: THREE.Vector3[] = [
        startLook.clone(),
        new THREE.Vector3(0, startPos.y, -12.6),
        new THREE.Vector3(endLook.x * 0.5, endLook.y, -12.6),
        endLook.clone()
      ];

      const pCurve = new THREE.CatmullRomCurve3(midPoints, false, 'centripetal');
      const lCurve = new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal');

      const startTime = performance.now();
      const duration = 2800;

      const flyDiff = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        camera.position.copy(pCurve.getPoint(ease));
        camera.lookAt(lCurve.getPoint(ease));
        camera.fov = THREE.MathUtils.lerp(startFov, endFov, ease);
        camera.updateProjectionMatrix();

        if (t < 1) {
          requestAnimationFrame(flyDiff);
        } else {
          finishArrival();
        }
      };
      requestAnimationFrame(flyDiff);
    } else {
      // Same-floor corridor glide
      const startTime = performance.now();
      const duration = 2000;

      const flySame = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        camera.position.lerpVectors(startPos, endPos, ease);
        camera.lookAt(new THREE.Vector3().lerpVectors(startLook, endLook, ease));
        camera.fov = THREE.MathUtils.lerp(startFov, endFov, ease);
        camera.updateProjectionMatrix();

        if (t < 1) {
          requestAnimationFrame(flySame);
        } else {
          finishArrival();
        }
      };
      requestAnimationFrame(flySame);
    }

    const finishArrival = () => {
      isFlyingRef.current = false;
      controls.enabled = true;
      controls.target.copy(endLook);
      setAnimStage('at_room');
      setHasReachedRoom(true);
      setTelemetryText(`TARGET REACHED: ROOM ${cad.roomCode} • VOL: ${cad.doorVolume.volumeM3}m³ • CENTER CLOUD: [${cad.centerCloud.x}, ${cad.centerCloud.y}, ${cad.centerCloud.z}]`);

      const hw = (mountRef.current?.clientWidth || 800) / 2;
      const hh = (mountRef.current?.clientHeight || 600) / 2;
      const screenVector = centerPoint.clone().project(camera);
      setProximityRoom({
        record: cad,
        distance: 3.20,
        screenPos: { x: screenVector.x * hw + hw, y: -screenVector.y * hh + hh }
      });

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const floorSpokenMap: Record<number, string> = {
            1: 'Level 1, Ground Floor Atrium Tier',
            2: 'Level 2, Second Floor Gallery',
            3: 'Level 3, Third Floor Gallery',
            4: 'Level 4, Fourth Floor Gallery',
            5: 'Level 5, Fifth Floor Gallery'
          };
          const floorSpoken = floorSpokenMap[cad.floorNumber] || `Level ${cad.floorNumber}`;
          const text = `Room ${cad.roomCode.replace('-', ' ')}. ${floorSpoken}. ${cad.roomName}. Center of door volume locked at elevation ${cad.centerCloud.elevationMsl} meters MSL.`;
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.95;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          console.warn('SpeechSynthesis error:', e);
        }
      }

      if (onArrivedAtRoom) onArrivedAtRoom(cad.roomCode);
    };
  }, [executeContinuousIndoorPath, onArrivedAtRoom]);

  // Expose test helpers for automated headless verification
  useEffect(() => {
    (window as any).__twinViewer = {
      zoomToRoom,
      executeContinuousIndoorPath,
      setCamera: (px: number, py: number, pz: number, tx: number, ty: number, tz: number) => {
        if (cameraRef.current && controlsRef.current) {
          isFlyingRef.current = false;
          controlsRef.current.enabled = true;
          cameraRef.current.position.set(px, py, pz);
          controlsRef.current.target.set(tx, ty, tz);
          cameraRef.current.lookAt(tx, ty, tz);
          controlsRef.current.update();
        }
      },
      getControls: () => controlsRef.current,
      getCamera: () => cameraRef.current,
      getScene: () => sceneRef.current,
      togglePointCloud: (visible?: boolean) => {
        if (floorSegmentationGroupRef.current) {
          const v = visible !== undefined ? visible : !floorSegmentationGroupRef.current.visible;
          floorSegmentationGroupRef.current.visible = v;
          setShowPointCloudSegmentation(v);
        }
      }
    };
  }, [zoomToRoom, executeContinuousIndoorPath]);

  // -------------------------------------------------------------------------
  // 5. Interactive 3D Room Clicking (Raycasting)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerClick = (e: MouseEvent) => {
      if (!cameraRef.current || !sceneRef.current || isFlyingRef.current) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

      if (intersects.length > 0) {
        for (const hit of intersects) {
          let curr: THREE.Object3D | null = hit.object;
          let match: RegExpMatchArray | null = null;
          while (curr) {
            match = (curr.name || '').match(/A___?([1-5][0-9]{2})/);
            if (match) break;
            curr = curr.parent;
          }
          if (match) {
            const detectedCode = `A-${match[1]}`;
            zoomToRoom(detectedCode);
            if (onRoomSelect) onRoomSelect(detectedCode);
            break;
          }
        }
      }
    };

    const handleControlsStart = () => {
      // Restore all structural meshes when user freely orbits or zooms out
      meshesRef.current.forEach(item => {
        item.mesh.visible = true;
      });
    };
    const ctrl = controlsRef.current;
    if (ctrl) ctrl.addEventListener('start', handleControlsStart);

    container.addEventListener('click', handlePointerClick);
    return () => {
      container.removeEventListener('click', handlePointerClick);
      if (ctrl) ctrl.removeEventListener('start', handleControlsStart);
    };
  }, [zoomToRoom, onRoomSelect]);

  // -------------------------------------------------------------------------
  // 6. One-Time 14-Second Construction: Front Start -> High-Speed 360 Orbit -> Stop at Front -> Continuous Indoor Path
  // -------------------------------------------------------------------------
  const executeConstructionSequence = useCallback(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    controls.enabled = false;
    // Start directly from front at proper camera angle
    camera.position.set(0, 16, 52);
    camera.lookAt(0, 7.5, -6);

    if (modelGroupRef.current) {
      modelGroupRef.current.visible = true;
    }

    meshesRef.current.forEach(item => { item.mesh.visible = false; });
    if (atriumFloorMeshRef.current) {
      atriumFloorMeshRef.current.visible = false;
      atriumFloorMeshRef.current.scale.set(0.01, 0.01, 0.01);
    }
    // buildingGroundMesh removed
    frontPillarsRef.current.forEach(p => { p.visible = false; });
    pottedPlantsRef.current.forEach(p => { p.visible = false; });

    setAnimStage('building');
    setBuildPercent(0);
    setTelemetryText('[STAGE 1/5] MATERIALIZING AUTHENTIC ATRIUM TILES IN STYLE: 0%');

    const startTime = performance.now();
    const constructDuration = 13500;

      const animateBuild = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / constructDuration, 1);
        const percent = Math.round(progress * 100);
        setBuildPercent(percent);

        // Phase 1: Materialize Tiles in Style (0.00 to 0.20)
        if (progress < 0.20) {
          const tileP = progress / 0.20;
          setTelemetryText(`[STAGE 1/5] MATERIALIZING AUTHENTIC ATRIUM TILES IN STYLE: ${percent}%`);
          
          if (atriumFloorMeshRef.current) {
            atriumFloorMeshRef.current.visible = true;
            const scale = Math.min(tileP * 1.08, 1.0);
            atriumFloorMeshRef.current.scale.set(scale, scale, scale);
          }
          if (tileWaveRingRef.current) {
            tileWaveRingRef.current.visible = true;
            const radius = tileP * 16.5;
            tileWaveRingRef.current.scale.set(radius, radius, 1);
            (tileWaveRingRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - tileP) * 0.9;
          }
          if (microPointCloudRef.current) {
            microPointCloudRef.current.points.visible = false;
          }
          if (laserScannerPlaneRef.current) {
            laserScannerPlaneRef.current.visible = false;
          }
        } 
        // Phase 2-4: Micro-Cloud Points building construction (0.20 to 0.85)
        else if (progress < 0.85) {
          if (tileWaveRingRef.current) tileWaveRingRef.current.visible = false;
          if (atriumFloorMeshRef.current) atriumFloorMeshRef.current.scale.set(1, 1, 1);

          const cloudP = (progress - 0.20) / 0.65;
          const scanY = cloudP * 21.0;

          if (cloudP < 0.25) {
            setTelemetryText(`[STAGE 2/5] STACKING FLOOR 1 MICRO-CLOUD POINTS (COLUMNS & BEAMS): ${percent}%`);
          } else if (cloudP < 0.50) {
            setTelemetryText(`[STAGE 3/5] STACKING FLOOR 2 & 3 MICRO-CLOUD POINTS (GALLERIES): ${percent}%`);
          } else if (cloudP < 0.75) {
            setTelemetryText(`[STAGE 4/5] STACKING FLOOR 4 & 5 MICRO-CLOUD POINTS (UPPER TIER): ${percent}%`);
          } else {
            setTelemetryText(`[STAGE 5/5] ASSEMBLING PORTICO PEDIMENT & 45 NUMBERED DOORS: ${percent}%`);
          }

          // Update Laser Scanner Plane
          if (laserScannerPlaneRef.current) {
            laserScannerPlaneRef.current.visible = true;
            laserScannerPlaneRef.current.position.y = scanY;
          }

          // Update Micro Point Cloud: activate points with origY <= scanY
          if (microPointCloudRef.current) {
            const { points, origPositions, pointCount } = microPointCloudRef.current;
            points.visible = true;
            const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
            const posArray = posAttr.array as Float32Array;

            for (let i = 0; i < pointCount; i++) {
              const idx = i * 3;
              const oy = origPositions[idx + 1];
              if (oy <= scanY) {
                posArray[idx] = origPositions[idx];
                const jitter = Math.abs(oy - scanY) < 1.2 ? (Math.random() - 0.5) * 0.08 : 0;
                posArray[idx + 1] = oy + jitter;
                posArray[idx + 2] = origPositions[idx + 2];
              } else {
                posArray[idx + 1] = -9999;
              }
            }
            posAttr.needsUpdate = true;
          }

          // Meshes solidify behind the rising micro point cloud
          meshesRef.current.forEach(item => {
            const itemThreshold = 0.20 + (item.floor * 0.13) + (item.isDoor ? 0.08 : 0.01);
            if (progress >= itemThreshold) {
              item.mesh.visible = true;
              const localP = Math.min((progress - itemThreshold) / 0.12, 1);
              item.mesh.position.y = item.origY;
              item.mesh.scale.set(1, localP, 1);
            } else {
              item.mesh.visible = false;
            }
          });

          pottedPlantsRef.current.forEach(p => {
            p.visible = progress >= 0.75;
          });
        }
        // Phase 5: Final Crystallization (0.85 to 1.00)
        else {
          setTelemetryText(`[FINAL STAGE] SYNCHRONIZING BIM TELEMETRY & COLOR ACCURACY: ${percent}%`);
          if (laserScannerPlaneRef.current) laserScannerPlaneRef.current.visible = false;
          if (microPointCloudRef.current) {
            const fadeP = (progress - 0.85) / 0.15;
            (microPointCloudRef.current.points.material as THREE.PointsMaterial).opacity = (1 - fadeP) * 0.95;
            if (fadeP >= 1) microPointCloudRef.current.points.visible = false;
          }
          meshesRef.current.forEach(item => {
            item.mesh.visible = true;
            item.mesh.position.y = item.origY;
            item.mesh.scale.set(1, 1, 1);
          });
          pottedPlantsRef.current.forEach(p => { p.visible = true; });
        }

        // Camera Motion: High-speed 360-degree circle orbit during construction, then stop smoothly at front
        if (progress < 0.88) {
          const orbitP = progress / 0.88;
          // Full 360 circle around building center (0, 7.5, -6) starting at front (angle = PI/2)
          const angle = Math.PI / 2 + Math.PI * 2 * orbitP;
          const r = 50 - 4 * Math.sin(Math.PI * orbitP);
          camera.position.x = r * Math.cos(angle);
          camera.position.z = -6 + r * Math.sin(angle);
          camera.position.y = 15 + 4.5 * Math.sin(Math.PI * 2 * orbitP);
          camera.lookAt(0, 5 + 8 * orbitP, -6);
        } else {
          // When construction completes, stop smoothly at the front entrance
          const decelP = (progress - 0.88) / 0.12;
          const smoothP = decelP * decelP * (3 - 2 * decelP); // smoothstep
          const endOrbitPos = new THREE.Vector3(0, 15, 44);
          const frontStopPos = new THREE.Vector3(0, 3.4, 32.0);
          const endOrbitLook = new THREE.Vector3(0, 13, -6);
          const frontStopLook = new THREE.Vector3(0, 2.4, 4.0);
          camera.position.lerpVectors(endOrbitPos, frontStopPos, smoothP);
          camera.lookAt(new THREE.Vector3().lerpVectors(endOrbitLook, frontStopLook, smoothP));
        }

        if (progress < 1) {
          requestAnimationFrame(animateBuild);
        } else {
          if (microPointCloudRef.current) microPointCloudRef.current.points.visible = false;
          if (laserScannerPlaneRef.current) laserScannerPlaneRef.current.visible = false;
          if (tileWaveRingRef.current) tileWaveRingRef.current.visible = false;

          meshesRef.current.forEach(item => {
            item.mesh.visible = true;
            item.mesh.position.y = item.origY;
            item.mesh.scale.set(1, 1, 1);
          });
          if (atriumFloorMeshRef.current) atriumFloorMeshRef.current.visible = true;
          // buildingGroundMesh removed
          frontPillarsRef.current.forEach(p => { p.visible = true; });
          pottedPlantsRef.current.forEach(p => { p.visible = true; });

          setTelemetryText(`CONSTRUCTION 100% COMPLETE • ENTERING MAIN PORTICO`);
          if (onConstructionComplete) onConstructionComplete();

          // CONTINUOUS MASTER JOURNEY: Without frame cut, move inside and navigate realistic path to room
          executeContinuousIndoorPath(targetRoomNumber);
        }
      };

      requestAnimationFrame(animateBuild);
  }, [onConstructionComplete, targetRoomNumber, executeContinuousIndoorPath]);

  // Trigger one-time construction once model is fully loaded and active
  useEffect(() => {
    if (isActive && isModelLoaded && !hasConstructedRef.current) {
      hasConstructedRef.current = true;
      executeConstructionSequence();
    }
  }, [isActive, isModelLoaded, executeConstructionSequence]);

  useEffect(() => {
    if (animStage === 'at_room' || animStage === 'free_orbit') {
      zoomToRoom(targetRoomNumber);
    }
  }, [targetRoomNumber, zoomToRoom, animStage]);

  // -------------------------------------------------------------------------
  // 6. Interactive Shading Modes
  // -------------------------------------------------------------------------
  const applyDisplayMode = useCallback((mode: DisplayMode) => {
    setDisplayMode(mode);
    if (onExplorationModeChange) onExplorationModeChange(mode);

    meshesRef.current.forEach(item => {
      const m = item.mesh;
      if (mode === 'xray') {
        if (item.isExterior) {
          m.material = new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.18,
            roughness: 0.1,
            transmission: 0.75,
            thickness: 0.4
          });
        } else {
          m.material = item.originalMat;
        }
      } else if (mode === 'wireframe') {
        m.material = new THREE.MeshBasicMaterial({
          color: item.isDoor ? 0x22c55e : (item.isExterior ? 0x0284c7 : 0x64748b),
          wireframe: true
        });
      } else {
        m.material = item.originalMat;
      }
    });
  }, [onExplorationModeChange]);

  const applyFloorFilter = (floorKey: string) => {
    setSelectedFloor(floorKey);
    meshesRef.current.forEach(item => {
      if (floorKey === 'all') {
        item.mesh.visible = true;
      } else {
        const floorNum = parseInt(floorKey, 10);
        item.mesh.visible = item.floor === floorNum;
      }
    });
    const showGround = (floorKey === 'all' || floorKey === '0');
    if (atriumFloorMeshRef.current) atriumFloorMeshRef.current.visible = showGround;
    // buildingGroundMesh removed
    pottedPlantsRef.current.forEach(p => { p.visible = showGround; });

    // Synchronize 3D Point Cloud Floor Segmentation
    if (floorSegmentationGroupRef.current) {
      floorSegmentationGroupRef.current.children.forEach((fGroup) => {
        if (floorKey === 'all') {
          fGroup.visible = true;
        } else {
          // floorKey '0' corresponds to Floor 1 (Ground Tier)
          const targetF = parseInt(floorKey, 10) + 1;
          fGroup.visible = fGroup.name === `floor_seg_${targetF}`;
        }
      });
    }
  };

  const handleManualReplay = () => {
    hasConstructedRef.current = false;
    setHasReachedRoom(false);
    executeConstructionSequence();
  };

  useEffect(() => {
    if ((window as any).__twinViewer) {
      (window as any).__twinViewer.applyDisplayMode = applyDisplayMode;
      (window as any).__twinViewer.applyFloorFilter = applyFloorFilter;
      (window as any).__twinViewer.handleManualReplay = handleManualReplay;
      (window as any).__twinViewer.togglePointCloud = (visible?: boolean) => {
        if (floorSegmentationGroupRef.current) {
          const v = visible !== undefined ? visible : !floorSegmentationGroupRef.current.visible;
          floorSegmentationGroupRef.current.visible = v;
          setShowPointCloudSegmentation(v);
        }
      };
    }
  }, [applyDisplayMode]);

  return (
    <div 
      ref={mountRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#949aa2',
        overflow: 'hidden'
      }}
    >


      {/* 1. Top Telemetry & Precision GNSS Strip (Visible only during build, flight, and target lock) */}
      {animStage !== 'idle' && animStage !== 'empty' && Boolean(telemetryText) && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '70px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          pointerEvents: 'none',
          zIndex: 20
        }}>
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '8px',
            padding: '7px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 18px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: animStage === 'at_room' ? '#22c55e' : '#38bdf8',
              boxShadow: `0 0 10px ${animStage === 'at_room' ? '#22c55e' : '#38bdf8'}`
            }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', fontFamily: 'monospace' }}>
              {telemetryText}
            </span>
          </div>

          {animStage === 'building' && (
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '6px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#38bdf8',
              fontSize: '12px',
              fontFamily: 'monospace',
              fontWeight: 700
            }}>
              <span>15s QUANTUM BUILD:</span>
              <div style={{ width: '100px', height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${buildPercent}%`, height: '100%', backgroundColor: '#38bdf8', transition: 'width 0.1s linear' }} />
              </div>
              <span>{buildPercent}%</span>
            </div>
          )}
        </div>
      )}

      {/* 2. Detail Mark ON DOOR MID (Center of the Door Leaf, NOT Above/Upside!) */}
      {proximityRoom && (
        <div style={{
          position: 'absolute',
          left: `${proximityRoom.screenPos.x}px`,
          top: `${proximityRoom.screenPos.y}px`,
          transform: 'translate(-50%, -50%)', // Centered directly on door mid!
          pointerEvents: 'none',
          zIndex: 35,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          animation: 'fadeInScale 0.2s ease-out'
        }}>
          {/* Target Central Crosshair Marker on Door Mid */}
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid #38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.25)',
            boxShadow: '0 0 12px #38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
          </div>

          {/* Authoritative Mid-Door Volumetric & GNSS Tag */}
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #38bdf8',
            borderRadius: '8px',
            padding: '7px 12px',
            boxShadow: '0 4px 18px rgba(0,0,0,0.5)',
            color: '#ffffff',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
                ROOM {proximityRoom.record.roomCode}
              </span>
              <span style={{ fontSize: '10px', backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#34d399', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                VOL: {proximityRoom.record.doorVolume.volumeM3} m³
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#a7f3d0', fontFamily: 'monospace', marginTop: '2px' }}>
              CENTER CLOUD: [{proximityRoom.record.centerCloud.x}, {proximityRoom.record.centerCloud.y}, {proximityRoom.record.centerCloud.z}]
            </div>
            <div style={{ fontSize: '9.5px', color: '#cbd5e1', marginTop: '1px' }}>
              FLOOR SEG: {proximityRoom.record.floorSegmentation.startDownY.toFixed(1)}m ↓ → {proximityRoom.record.floorSegmentation.endUpY.toFixed(1)}m ↑ ({proximityRoom.record.floorSegmentation.heightM.toFixed(1)}m H)
            </div>
            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '1px' }}>
              ELEV: {proximityRoom.record.centerCloud.elevationMsl}m MSL • Safe Dist: {proximityRoom.record.centerCloud.safeDistanceM}m
            </div>
          </div>
        </div>
      )}

      {/* 3. MediaPipe Hand Gesture Controller (Activates and loads AFTER reaching target room) */}
      {viewerReady && (
        <HandGestureController
          isActive={isActive && hasReachedRoom}
          camera={cameraRef.current}
          controls={controlsRef.current}
        />
      )}

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.85);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
