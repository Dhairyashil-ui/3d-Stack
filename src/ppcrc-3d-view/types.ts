import * as THREE from 'three';

export type DisplayMode = 'realistic' | 'xray' | 'wireframe';

export type Ppcrc3DViewState = 'initial_map' | 'zooming_to_prop' | 'twin_active';

export interface RoomDoorGeometry {
  roomCode: string;
  floor: number;
  doorMidPos: THREE.Vector3;
  normal: THREE.Vector3;
}

export interface FloorSegmentation {
  floorNumber: number;          // 1 to 5
  startDownY: number;           // Starting elevation point from down (m)
  endUpY: number;               // Ending elevation point from up (m)
  heightM: number;              // 3.60 m
  startDownMsl: number;         // e.g. 562.40 m MSL
  endUpMsl: number;             // e.g. 566.00 m MSL
  downwardPointCloudPoints: number; // 2400 (number of base slab LiDAR returns)
  upwardPointCloudPoints: number;   // 2400 (number of ceiling slab LiDAR returns)
}

export interface DoorVolumeRecord {
  widthM: number;               // 1.80 m (double leaf)
  heightM: number;              // 2.44 m
  depthM: number;               // 0.22 m (jamb/wall thickness)
  volumeM3: number;             // 0.966 m³ (measured bounding volume)
}

export interface DoorCenterCloudRecord {
  x: number;                    // 3D coordinate X
  y: number;                    // 3D coordinate Y (exact center of door volume)
  z: number;                    // 3D coordinate Z
  heightAboveFloor: number;     // 1.22 m
  elevationMsl: number;         // MSL elevation of door center
  normalX: number;              // Outward normal X
  normalY: number;              // Outward normal Y
  normalZ: number;              // Outward normal Z
  safeDistanceM: number;        // 4.45 m (safe view distance where full door is visible)
  pointCloudCount: number;      // 1240 LiDAR return points
}

export interface RoomCadastreRecord {
  roomCode: string;             // e.g. "A-119"
  floorNumber: number;          // 1 to 5
  floorLabel: string;           // "Level 1 (Ground Atrium Tier)"
  
  // 14-Digit ULPIN strictly separated
  ulpin14: string;              // "27250401420089"
  ulpinFormatted: string;       // "27-25-04-0142-0089"
  stateCode: string;            // "27"
  districtCode: string;         // "25"
  talukaCode: string;           // "04"
  villageCode: string;          // "0142"
  buildingNum4: string;         // "0089"
  
  // Building & Unit Number (Building-Floor-Area-Room)
  buildingUnitId: string;       // "0089-01-01-119"
  floorNum2: string;            // "01"
  areaNum2: string;             // "01"
  roomNum3: string;             // "119"
  
  roomName: string;             // "High-Performance Computing Research Lab"
  wing: string;                 // "West Academic Wing"
  
  // High-Precision GNSS / DGPS Coordinates (EPSG:4326)
  latitude: number;             // 18.584892
  longitude: number;            // 73.737694
  elevationMsl: number;         // 562.40 m MSL
  heightAboveGround: number;    // 0.0 m, 3.6 m, etc.
  gnssFixQuality: string;       // "RTK Fixed (DGPS Station PMRDA-01, ±0.012m)"
  pdop: number;                 // 0.82
  crs: string;                  // "EPSG:4326 (WGS 84) / UTM Zone 43N"
  
  // Architectural Specs & Volumetric Measurements
  carpetAreaSqFt: number;       // 737
  carpetAreaSqM: number;        // 68.5
  ceilingHeightM: number;       // 3.40
  occupancyType: string;        // "Institutional / Research Lab"
  doorType: string;             // "Double Beech Leaf • Vision Glazing • Hydraulic Closer • Stainless Pull Handles"
  fireNocStatus: string;        // "Verified Active (Break-Glass Call Point + Sprinklers)"

  // Point Cloud Floor Segmentation & Door Volumetrics
  floorSegmentation: FloorSegmentation;
  doorVolume: DoorVolumeRecord;
  centerCloud: DoorCenterCloudRecord;
}

export interface Ppcrc3DViewProps {
  initialRoom?: string;               // e.g. "A-101" or "A-119" (default: "A-101")
  initialUlpin?: string;              // e.g. "27250401420089"
  initialBuildingId?: string;         // e.g. "0089-01-01-101"
  initialState?: Ppcrc3DViewState;    // default: "initial_map"
  modelUrl?: string;                  // Path to h.glb (default: "/h.glb")
  aerialImageUrl?: string;            // Path to aerial jpg (default: "/pccrc_building_centered_aerial.jpg")
  showSearchBox?: boolean;            // default: true
  enableGestureControl?: boolean;     // default: true
  onArrivedAtDoor?: (roomCode: string, cadastre: RoomCadastreRecord) => void;
  onRoomSelected?: (roomCode: string, cadastre: RoomCadastreRecord) => void;
  onDisplayModeChange?: (mode: DisplayMode) => void;
  onStateChange?: (state: Ppcrc3DViewState) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface BuildingDigitalTwinViewerProps {
  targetRoomNumber: string;           // e.g. "A-119"
  isActive: boolean;
  modelUrl?: string;                  // URL or path to 3D GLB model
  onConstructionComplete?: () => void;
  onArrivedAtRoom?: (room: string) => void;
  onRoomSelect?: (room: string) => void;
  onProximityRoomChange?: (room: string | null) => void;
  onExplorationModeChange?: (mode: DisplayMode) => void;
}

export interface IndiaToPropertyMapProps {
  isZoomed: boolean;
  aerialImageUrl?: string;            // URL or path to aerial satellite photo
  onZoomComplete?: () => void;
  targetCoords?: { lat: number; lng: number; name: string };
}

export interface PropertyDetailsPanelProps {
  ulpinId: string;
  buildingId: string;
  roomNumber: string;
  onRoomSelect: (newRoom: string) => void;
  onDisplayModeChange: (mode: DisplayMode) => void;
  currentDisplayMode: DisplayMode;
  onReturnToMap?: () => void;
  onFloorFilterChange?: (floor: string) => void;
  selectedFloor?: string;
  onTogglePointCloud?: (visible?: boolean) => void;
  showPointCloud?: boolean;
  onReplayConstruction?: () => void;
}
