import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { 
  Camera, 
  CameraOff, 
  Hand, 
  Minimize2, 
  Maximize2,
  AlertCircle
} from 'lucide-react';

export type RecognizedGesture = 
  | 'none' 
  | 'open_palm_zoom_in' 
  | 'closed_palm_zoom_out' 
  | 'index_move_left' 
  | 'two_fingers_move_right'
  | 'connected_palm_spin';

interface HandGestureControllerProps {
  isActive: boolean;
  camera: THREE.PerspectiveCamera | null;
  controls: OrbitControls | null;
  defaultCameraPos?: THREE.Vector3;
  defaultTargetPos?: THREE.Vector3;
  onResetView?: () => void;
}

// Landmark connectivity for cyber skeletal rendering
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],       // Index
  [9, 10], [10, 11], [11, 12],          // Middle
  [13, 14], [14, 15], [15, 16],         // Ring
  [0, 17], [17, 18], [18, 19], [19, 20],// Pinky
  [5, 9], [9, 13], [13, 17]             // Palm knuckles
];

export const HandGestureController: React.FC<HandGestureControllerProps> = ({
  isActive,
  camera,
  controls
}) => {
  // DOM References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Resource References for guaranteed cleanup on leaving viewer
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDestroyedRef = useRef<boolean>(false);

  // Gesture Tracking States
  const [cameraState, setCameraState] = useState<'idle' | 'starting' | 'active' | 'error' | 'stopped'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [handDetected, setHandDetected] = useState<boolean>(false);
  const [currentGesture, setCurrentGesture] = useState<RecognizedGesture>('none');
  const [gestureLabel, setGestureLabel] = useState<string>('Searching for Hand...');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [manualCameraEnabled, setManualCameraEnabled] = useState<boolean>(true);

  // Motion history for relative delta tracking and 2x 360 spin animation
  const prevHandPosRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const isSpinningRef = useRef<boolean>(false);
  const lastVideoTimeRef = useRef<number>(-1);

  // ---------------------------------------------------------------------------
  // 1. Guaranteed Cleanup Helper: Releases MediaPipe & Camera Hardware Resources
  // ---------------------------------------------------------------------------
  const releaseAllResources = useCallback(() => {
    isDestroyedRef.current = true;
    isSpinningRef.current = false;

    // 1. Cancel requestAnimationFrame loop
    if (animFrameIdRef.current !== null) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    // 2. Stop and release all video/camera hardware tracks immediately
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
          track.enabled = false;
        } catch (e) {
          console.warn('Error stopping video track:', e);
        }
      });
      streamRef.current = null;
    }

    // 3. Detach stream from video element
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch (e) {
        console.warn('Error detaching video srcObject:', e);
      }
    }

    // 4. Dispose MediaPipe HandLandmarker WebAssembly / WebGL instance
    if (landmarkerRef.current) {
      try {
        landmarkerRef.current.close();
      } catch (e) {
        console.warn('Error closing MediaPipe HandLandmarker:', e);
      }
      landmarkerRef.current = null;
    }

    // 5. Clear overlay canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    setHandDetected(false);
    setCurrentGesture('none');
    setGestureLabel('Camera Disconnected');
    setCameraState('stopped');
  }, []);

  // ---------------------------------------------------------------------------
  // 2. Smooth 2X Full (720-Degree) 360-Degree Building Rotation Animation
  // ---------------------------------------------------------------------------
  const triggerDoubleRotation = useCallback((direction: 'left' | 'right') => {
    if (!controls || isSpinningRef.current) return;
    isSpinningRef.current = true;

    const spinDuration = 2200; // 2.2s silky smooth 2x 360-degree rotation
    // 2 full rotations = 4 * Math.PI radians (720 degrees)
    const totalRotation = direction === 'left' ? (4 * Math.PI) : (-4 * Math.PI);
    let lastEase = 0;
    const startTime = performance.now();

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      // Majestic cubic in-out easing for cinematic deceleration
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const deltaAngle = (ease - lastEase) * totalRotation;
      lastEase = ease;

      controls.rotateLeft(deltaAngle);
      controls.update();

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        isSpinningRef.current = false;
      }
    };

    requestAnimationFrame(animateSpin);
  }, [controls]);

  // ---------------------------------------------------------------------------
  // 3. Gesture Classification & Navigation Action Engine
  // ---------------------------------------------------------------------------
  const processHandGesture = useCallback((landmarks: Array<{ x: number; y: number; z: number }>) => {
    if (!camera || !controls || landmarks.length < 21) return;

    // 3D Euclidean distance utility
    const pDist = (i: number, j: number) => {
      const dx = landmarks[i].x - landmarks[j].x;
      const dy = landmarks[i].y - landmarks[j].y;
      const dz = (landmarks[i].z || 0) - (landmarks[j].z || 0);
      return Math.hypot(dx, dy, dz);
    };

    // Finger extension checks:
    // 2nd finger = Index (tip 8, pip 6, mcp 5)
    // 3rd finger = Middle (tip 12, pip 10, mcp 9)
    // 4th finger = Ring (tip 16, pip 14, mcp 13)
    // 5th finger = Pinky (tip 20, pip 18, mcp 17)
    const isIndexExtended = pDist(8, 0) > pDist(6, 0) * 1.15 && pDist(8, 5) > pDist(6, 5) * 1.15;
    const isMiddleExtended = pDist(12, 0) > pDist(10, 0) * 1.15 && pDist(12, 9) > pDist(10, 9) * 1.15;
    const isRingExtended = pDist(16, 0) > pDist(14, 0) * 1.15 && pDist(16, 13) > pDist(14, 13) * 1.15;
    const isPinkyExtended = pDist(20, 0) > pDist(18, 0) * 1.15 && pDist(20, 17) > pDist(18, 17) * 1.15;

    // Adjacent fingertip distances to detect connected fingers (flat palm with fingers touching side-by-side)
    const distIndexMiddle = pDist(8, 12);
    const distMiddleRing = pDist(12, 16);
    const distRingPinky = pDist(16, 20);

    const areFingersConnected = (
      distIndexMiddle < 0.055 && 
      distMiddleRing < 0.055 && 
      distRingPinky < 0.055
    );

    // Hand Center (approximate palm midpoint, mirrored X)
    const handCenterX = 1.0 - (landmarks[0].x + landmarks[5].x + landmarks[17].x) / 3;
    const handCenterY = (landmarks[0].y + landmarks[5].y + landmarks[17].y) / 3;
    const handCenterZ = (landmarks[0].z + landmarks[5].z + landmarks[17].z) / 3;

    let detected: RecognizedGesture = 'none';
    let label = isSpinningRef.current ? '🌀 2X Full 360° Rotation Active' : 'Hand Control Active';

    // -------------------------------------------------------------------------
    // ACTION 1 / 5: ALL 4 FINGERS EXTENDED
    // -------------------------------------------------------------------------
    if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
      if (areFingersConnected) {
        // ---------------------------------------------------------------------
        // 5 FINGERS CONNECTED TO EACH OTHER (FLAT PALM)
        // Moving that full palm to left or right -> ROTATE 2 TIMES FULLY (720°)
        // ---------------------------------------------------------------------
        detected = 'connected_palm_spin';
        label = isSpinningRef.current ? '🌀 2X Full 360° Rotation Active' : '✋ 5 Fingers Connected: Move L/R';

        if (prevHandPosRef.current && !isSpinningRef.current) {
          const deltaX = handCenterX - prevHandPosRef.current.x;
          if (deltaX < -0.016) {
            triggerDoubleRotation('left');
            label = '🌀 2X Full Rotation: Left';
          } else if (deltaX > 0.016) {
            triggerDoubleRotation('right');
            label = '🌀 2X Full Rotation: Right';
          }
        }
      } else {
        // ---------------------------------------------------------------------
        // OPEN PALM (FINGERS SPREAD) = FAST ZOOM IN
        // ---------------------------------------------------------------------
        detected = 'open_palm_zoom_in';
        label = '🖐️ Open Palm: Fast Zoom In';

        const offset = camera.position.clone().sub(controls.target);
        const minDistance = 2.5;
        if (offset.length() > minDistance) {
          // Fast zoom in speed (4.8% per frame)
          offset.multiplyScalar(0.952);
          camera.position.copy(controls.target).add(offset);
          controls.update();
        }
      }
    }
    // -------------------------------------------------------------------------
    // ACTION 2: CLOSED PALM = FAST ZOOM OUT
    // All fingers curled closed into fist
    // -------------------------------------------------------------------------
    else if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      detected = 'closed_palm_zoom_out';
      label = '✊ Closed Palm: Fast Zoom Out';

      const offset = camera.position.clone().sub(controls.target);
      const maxDistance = 180.0;
      if (offset.length() < maxDistance) {
        // Fast zoom out speed (4.8% per frame)
        offset.multiplyScalar(1.048);
        camera.position.copy(controls.target).add(offset);
        controls.update();
      }
    }
    // -------------------------------------------------------------------------
    // ACTION 3: 2ND FINGER ALONE (INDEX) = MOVE LEFT
    // Only 2nd finger (Index) extended, 3rd/4th/5th curled
    // -------------------------------------------------------------------------
    else if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      detected = 'index_move_left';
      label = '☝️ 2nd Finger: Move Left';

      const rotSpeed = 0.026;
      controls.rotateLeft(rotSpeed);
      controls.update();
    }
    // -------------------------------------------------------------------------
    // ACTION 4: 2ND & 3RD FINGERS TOGETHER (INDEX + MIDDLE) = MOVE RIGHT
    // 2nd (Index) and 3rd (Middle) both extended, 4th/5th curled
    // -------------------------------------------------------------------------
    else if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      detected = 'two_fingers_move_right';
      label = '✌️ 2nd & 3rd: Move Right';

      const rotSpeed = 0.026;
      controls.rotateLeft(-rotSpeed);
      controls.update();
    }

    prevHandPosRef.current = { x: handCenterX, y: handCenterY, z: handCenterZ };
    setCurrentGesture(detected);
    setGestureLabel(label);
  }, [camera, controls, triggerDoubleRotation]);

  // ---------------------------------------------------------------------------
  // 4. Draw Futuristic Neon Skeleton on Canvas
  // ---------------------------------------------------------------------------
  const renderHandSkeleton = (
    landmarks: Array<{ x: number; y: number; z: number }>, 
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number,
    gesture: RecognizedGesture
  ) => {
    ctx.clearRect(0, 0, width, height);

    // Dynamic accent color based on active gesture
    let strokeColor = '#38bdf8'; // Cyan default
    if (gesture === 'open_palm_zoom_in') strokeColor = '#22c55e'; // Green Zoom In
    else if (gesture === 'closed_palm_zoom_out') strokeColor = '#f59e0b'; // Amber Zoom Out
    else if (gesture === 'index_move_left') strokeColor = '#38bdf8'; // Cyan Move Left
    else if (gesture === 'two_fingers_move_right') strokeColor = '#a855f7'; // Purple Move Right
    else if (gesture === 'connected_palm_spin') strokeColor = '#ec4899'; // Pink 2x 360 Spin

    // Draw skeletal bones
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = strokeColor;
    ctx.shadowColor = strokeColor;
    ctx.shadowBlur = 8;

    for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
      const p1 = landmarks[startIdx];
      const p2 = landmarks[endIdx];
      if (!p1 || !p2) continue;

      // Mirrored X for user comfort
      const x1 = (1 - p1.x) * width;
      const y1 = p1.y * height;
      const x2 = (1 - p2.x) * width;
      const y2 = p2.y * height;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw joint nodes
    landmarks.forEach((lm, idx) => {
      const x = (1 - lm.x) * width;
      const y = lm.y * height;
      const isFingertip = idx === 4 || idx === 8 || idx === 12 || idx === 16 || idx === 20;

      ctx.beginPath();
      ctx.arc(x, y, isFingertip ? 4.5 : 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = isFingertip ? '#ffffff' : strokeColor;
      ctx.shadowColor = isFingertip ? '#ffffff' : strokeColor;
      ctx.shadowBlur = 10;
      ctx.fill();
    });
  };

  // ---------------------------------------------------------------------------
  // 5. Initialize MediaPipe & Start Camera Feed
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isActive || !manualCameraEnabled) {
      releaseAllResources();
      return;
    }

    isDestroyedRef.current = false;
    let localStream: MediaStream | null = null;
    let isMounted = true;

    async function initializeVisionAndCamera() {
      setCameraState('starting');
      setGestureLabel('Initializing MediaPipe Vision...');

      try {
        // Step 1: Load MediaPipe Vision Task Resolver (Local wasm first, CDN fallback)
        let visionResolver;
        try {
          visionResolver = await FilesetResolver.forVisionTasks('/mediapipe/wasm');
        } catch (wasmErr) {
          console.warn('Local wasm resolver fallback to CDN:', wasmErr);
          visionResolver = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');
        }

        if (!isMounted || isDestroyedRef.current) return;

        // Step 2: Initialize HandLandmarker (Local task model first, fallback to CDN)
        let handLandmarker: HandLandmarker;
        try {
          handLandmarker = await HandLandmarker.createFromOptions(visionResolver, {
            baseOptions: {
              modelAssetPath: '/mediapipe/hand_landmarker.task',
              delegate: 'GPU'
            },
            runningMode: 'VIDEO',
            numHands: 1,
            minHandDetectionConfidence: 0.55,
            minHandPresenceConfidence: 0.55,
            minTrackingConfidence: 0.55
          });
        } catch (modelErr) {
          console.warn('Local model fallback to remote Google storage:', modelErr);
          handLandmarker = await HandLandmarker.createFromOptions(visionResolver, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
              delegate: 'CPU'
            },
            runningMode: 'VIDEO',
            numHands: 1,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5
          });
        }

        if (!isMounted || isDestroyedRef.current) {
          handLandmarker.close();
          return;
        }

        landmarkerRef.current = handLandmarker;

        // Step 3: Request Webcam Access
        setGestureLabel('Requesting Camera Access...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
            frameRate: { ideal: 30 }
          },
          audio: false
        });

        if (!isMounted || isDestroyedRef.current) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        localStream = stream;
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setCameraState('active');
        setGestureLabel('Searching for Hand...');

        // Step 4: Real-time detection loop
        const detectFrame = () => {
          if (isDestroyedRef.current || !isMounted) return;

          const video = videoRef.current;
          const landmarker = landmarkerRef.current;
          const canvas = canvasRef.current;

          if (video && video.readyState >= 2 && landmarker) {
            const now = performance.now();
            if (now > lastVideoTimeRef.current) {
              lastVideoTimeRef.current = now;

              try {
                const results = landmarker.detectForVideo(video, now);
                if (results && results.landmarks && results.landmarks.length > 0) {
                  const landmarks = results.landmarks[0];
                  setHandDetected(true);
                  processHandGesture(landmarks);

                  // Render skeleton preview on canvas
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      renderHandSkeleton(landmarks, ctx, canvas.width, canvas.height, currentGesture);
                    }
                  }
                } else {
                  setHandDetected(false);
                  setCurrentGesture('none');
                  setGestureLabel(isSpinningRef.current ? '🌀 2X Full Rotation Active' : 'Searching for Hand...');
                  prevHandPosRef.current = null;

                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                  }
                }
              } catch (e) {
                // Ignore transient frame dropping
              }
            }
          }

          animFrameIdRef.current = requestAnimationFrame(detectFrame);
        };

        animFrameIdRef.current = requestAnimationFrame(detectFrame);

      } catch (err: any) {
        console.error('Camera/MediaPipe Activation Error:', err);
        if (isMounted) {
          setCameraState('error');
          setErrorMessage(err?.message || 'Webcam permission denied or camera device unavailable');
          setGestureLabel('Camera Unavailable');
        }
      }
    }

    initializeVisionAndCamera();

    // Browser navigation / close listeners for instant release
    const handleUnload = () => {
      releaseAllResources();
    };
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      isMounted = false;
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      releaseAllResources();
    };
  }, [isActive, manualCameraEnabled, processHandGesture, releaseAllResources]);

  // If inactive or camera is stopped, show nothing
  if (!isActive) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      pointerEvents: 'auto'
    }}>
      {/* ------------------------------------------------------------------- */}
      {/* MAIN CYBER HUD CONTAINER                                            */}
      {/* ------------------------------------------------------------------- */}
      <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(56, 189, 248, 0.15)',
        overflow: 'hidden',
        width: isMinimized ? 'auto' : '265px',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Top Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: isMinimized ? 'none' : '1px solid rgba(56, 189, 248, 0.2)',
          backgroundColor: 'rgba(30, 41, 59, 0.75)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: handDetected 
                ? '#22c55e' 
                : cameraState === 'active' ? '#38bdf8' : '#ef4444',
              boxShadow: `0 0 8px ${handDetected ? '#22c55e' : cameraState === 'active' ? '#38bdf8' : '#ef4444'}`
            }} />
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 800, 
              color: '#f8fafc', 
              letterSpacing: '0.6px',
              fontFamily: 'monospace'
            }}>
              {handDetected ? 'HAND CONTROL ACTIVE' : '3D GESTURE ENGINE'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Toggle Camera On/Off */}
            <button
              onClick={() => {
                if (manualCameraEnabled) {
                  setManualCameraEnabled(false);
                  releaseAllResources();
                } else {
                  setManualCameraEnabled(true);
                }
              }}
              title={manualCameraEnabled ? 'Deactivate Camera & Release Resources' : 'Activate Camera'}
              style={{
                background: 'none',
                border: 'none',
                color: manualCameraEnabled ? '#38bdf8' : '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '4px',
                transition: 'color 0.15s'
              }}
            >
              {manualCameraEnabled ? <Camera size={14} /> : <CameraOff size={14} />}
            </button>

            {/* Minimize / Expand Toggle */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? 'Expand Gesture View' : 'Minimize Widget'}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '4px'
              }}
            >
              {isMinimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
            </button>
          </div>
        </div>

        {/* Expanded View: Video Feed + Gesture Telemetry */}
        {!isMinimized && (
          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Video & Canvas Viewport */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '140px',
              backgroundColor: '#020617',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #1e293b'
            }}>
              {/* Live Webcam Video Feed */}
              <video
                ref={videoRef}
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)', // Mirror video for natural movement
                  opacity: manualCameraEnabled && cameraState === 'active' ? 0.35 : 0,
                  filter: 'contrast(1.1) brightness(0.9)'
                }}
              />

              {/* Skeletal Landmarks Overlay Canvas */}
              <canvas
                ref={canvasRef}
                width={241}
                height={140}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none'
                }}
              />

              {/* Status Overlay when Camera starting or no hand */}
              {cameraState === 'starting' && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(2, 6, 23, 0.85)',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid #38bdf8',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <span style={{ fontSize: '10.5px', color: '#94a3b8', fontFamily: 'monospace' }}>
                    Activating MediaPipe...
                  </span>
                </div>
              )}

              {cameraState === 'error' && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  backgroundColor: 'rgba(2, 6, 23, 0.9)',
                  textAlign: 'center',
                  gap: '4px'
                }}>
                  <AlertCircle size={20} color="#ef4444" />
                  <span style={{ fontSize: '10px', color: '#f87171' }}>
                    {errorMessage || 'Camera access unavailable'}
                  </span>
                </div>
              )}

              {!handDetected && cameraState === 'active' && (
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  right: '8px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                  <Hand size={12} color="#94a3b8" />
                  <span style={{ fontSize: '10px', color: '#cbd5e1', fontFamily: 'monospace' }}>
                    Show hand to control
                  </span>
                </div>
              )}
            </div>

            {/* Gesture Feedback Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              border: `1px solid ${
                currentGesture === 'none' 
                  ? '#334155' 
                  : currentGesture === 'open_palm_zoom_in' 
                    ? '#22c55e' 
                    : currentGesture === 'closed_palm_zoom_out' 
                      ? '#f59e0b' 
                      : currentGesture === 'index_move_left'
                        ? '#38bdf8'
                        : currentGesture === 'two_fingers_move_right'
                          ? '#a855f7'
                          : '#ec4899'
              }`,
              borderRadius: '6px',
              padding: '6px 10px'
            }}>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 700, 
                color: currentGesture === 'none' ? '#94a3b8' : '#ffffff',
                fontFamily: 'monospace'
              }}>
                {gestureLabel}
              </span>
              {handDetected && (
                <span style={{
                  fontSize: '9.5px',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  color: '#4ade80',
                  padding: '2px 5px',
                  borderRadius: '3px',
                  fontWeight: 700
                }}>
                  TRACKING
                </span>
              )}
            </div>

            {/* Quick Gesture Legend */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4px 8px',
              fontSize: '9.5px',
              color: '#94a3b8',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              padding: '6px 8px',
              borderRadius: '5px',
              border: '1px solid #1e293b'
            }}>
              <div><strong style={{ color: '#22c55e' }}>🖐️ Open Palm:</strong> Fast Zoom In</div>
              <div><strong style={{ color: '#f59e0b' }}>✊ Closed Palm:</strong> Fast Zoom Out</div>
              <div><strong style={{ color: '#38bdf8' }}>☝️ 2nd Finger:</strong> Move Left</div>
              <div><strong style={{ color: '#a855f7' }}>✌️ 2nd & 3rd:</strong> Move Right</div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong style={{ color: '#ec4899' }}>✋ 5 Fingers Connected + Move L/R:</strong> 2x Full 360° Spin
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
