// NAKSHA V2.0 — Floating Voice AI Assistant (Operator Companion)
// User Specification:
// 1. Pure Voice: No text lines, no sound icons, no small status dots
// 2. Just the BIG ROUND MIC button
// 3. Active by voice saying "Naksha" OR single click
// 4. Stops immediately on double click
// 5. Immediate navigation on direct commands without asking permission
// 6. Speaks naturally like a human using Brian Neural voice, addressing user as "Operator"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mic } from 'lucide-react';
import { mockStore } from '../../data/mockStore';
import { voiceService, VoiceState } from '../../services/voiceService';
import { aiAssistantService } from '../../services/aiAssistantService';

export const FloatingAiAssistant: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [authUser, setAuthUser] = useState(() => mockStore.getAuthUser());
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const lastClickTimeRef = useRef<number>(0);

  // Sync authentication
  useEffect(() => {
    const handleStorage = () => {
      setAuthUser(mockStore.getAuthUser());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Process voice command immediately with Brian voice
  const handleProcessVoiceCommand = useCallback(async (command: string) => {
    if (!command || !command.trim()) return;

    setVoiceState('thinking');

    try {
      const response = await aiAssistantService.processOfficerInput(command.trim());

      // Immediate Navigation on direct commands
      if (response.action && response.action.type === 'navigate' && response.action.url) {
        navigate(response.action.url);
      }

      // Brian speaks response naturally
      voiceService.speak(response.text, () => {
        setVoiceState('idle');
      });
    } catch (err) {
      console.warn('Voice command processing error:', err);
      setVoiceState('idle');
    }
  }, [navigate]);

  // Configure Voice Engine listeners
  useEffect(() => {
    voiceService.setListeners({
      onStateChange: (state) => {
        setVoiceState(state);
      },
      onWakeWord: (commandText) => {
        if (commandText && commandText.trim()) {
          // Direct command with wake word: "Naksha open 3d identity of this property"
          handleProcessVoiceCommand(commandText.trim());
        } else {
          // User said "Naksha" alone
          const greeting = 'Yes, Operator? What can I do for you?';
          setVoiceState('speaking');
          voiceService.speak(greeting, () => {
            voiceService.activateListening();
          });
        }
      },
      onTranscript: (transcript, isFinal) => {
        if (isFinal && transcript.trim()) {
          handleProcessVoiceCommand(transcript.trim());
        }
      },
      onError: (err) => {
        console.warn('Speech engine:', err);
      }
    });

    return () => {
      voiceService.stopSpeaking();
      voiceService.stopListening();
    };
  }, [handleProcessVoiceCommand]);

  // Only visible post-login and outside /login
  const isLoginPage = location.pathname === '/login';
  const isLoggedIn = authUser?.isLoggedIn ?? true;

  if (!isLoggedIn || isLoginPage) {
    return null;
  }

  // Handle Single Click (Activate) & Double Click (Stop)
  const handleOrbClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    const timeDiff = now - lastClickTimeRef.current;
    lastClickTimeRef.current = now;

    // Double-click detected! (2 clicks within 350ms)
    if (timeDiff < 350) {
      voiceService.stopAll();
      setVoiceState('idle');
      return;
    }

    // Single-click: Synchronously activate listening
    if (voiceState === 'speaking') {
      voiceService.stopSpeaking();
    }

    if (voiceState === 'listening') {
      voiceService.stopAll();
      setVoiceState('idle');
    } else {
      voiceService.activateListening();
    }
  };

  const handleOrbDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    voiceService.stopAll();
    setVoiceState('idle');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '26px',
      right: '26px',
      zIndex: 9999,
      pointerEvents: 'auto'
    }}>
      {/* ========================================================================= */}
      {/* BIG ROUND MIC BUTTON                                                      */}
      {/* Clean circular orb with Mic icon. No text lines, no extra dots or icons   */}
      {/* Single-Click: Speak | Double-Click: Stop | Voice Wake: "Naksha"           */}
      {/* ========================================================================= */}
      <button
        onClick={handleOrbClick}
        onDoubleClick={handleOrbDoubleClick}
        className={`naksha-big-mic naksha-mic-state-${voiceState}`}
        style={{
          width: '66px',
          height: '66px',
          borderRadius: '50%',
          cursor: 'pointer',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          outline: 'none',
          userSelect: 'none',
          padding: 0,
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.45)',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        title="NAKSHA Voice AI (Brian) — Single click or say 'Naksha' to speak. Double click to stop."
      >
        {/* Animated wave ripples while listening */}
        {voiceState === 'listening' && (
          <>
            <div className="naksha-wave r1" />
            <div className="naksha-wave r2" />
            <div className="naksha-wave r3" />
          </>
        )}

        {/* Animated wave ripples while speaking */}
        {voiceState === 'speaking' && (
          <>
            <div className="naksha-speaking-wave sw1" />
            <div className="naksha-speaking-wave sw2" />
          </>
        )}

        {/* Halo spinner during thinking */}
        {voiceState === 'thinking' && (
          <div className="naksha-halo-spin" />
        )}

        {/* Clean, Prominent Microphone Icon */}
        <Mic 
          size={30} 
          color="#ffffff" 
          className={voiceState === 'listening' ? 'naksha-mic-listening' : ''} 
        />
      </button>

      {/* Embedded CSS for Big Round Mic */}
      <style>{`
        /* 1. Idle State: Celestial Cyan/Blue Glow */
        .naksha-mic-state-idle {
          background: radial-gradient(circle at 35% 35%, #38bdf8, #0284c7 60%, #0369a1 100%);
          box-shadow: 0 6px 24px rgba(2, 132, 199, 0.5), 0 0 18px rgba(56, 189, 248, 0.35);
          animation: floatMic 3.2s ease-in-out infinite;
        }
        .naksha-mic-state-idle:hover {
          transform: scale(1.06);
          box-shadow: 0 8px 30px rgba(2, 132, 199, 0.7), 0 0 24px rgba(56, 189, 248, 0.5);
        }

        /* 2. Listening State: Vibrant Red Pulse */
        .naksha-mic-state-listening {
          background: radial-gradient(circle at 35% 35%, #f87171, #ef4444 60%, #991b1b 100%);
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.8), 0 0 50px rgba(239, 68, 68, 0.45);
          transform: scale(1.08);
        }

        /* 3. Thinking State: Gold Spin */
        .naksha-mic-state-thinking {
          background: radial-gradient(circle at 35% 35%, #fde047, #eab308 60%, #854d0e 100%);
          box-shadow: 0 0 30px rgba(234, 179, 8, 0.75), 0 0 45px rgba(234, 179, 8, 0.4);
        }

        /* 4. Speaking State: Purple Brian Voice */
        .naksha-mic-state-speaking {
          background: radial-gradient(circle at 35% 35%, #c084fc, #9333ea 60%, #581c87 100%);
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.8), 0 0 50px rgba(168, 85, 247, 0.45);
          animation: speakPulse 1.2s ease-in-out infinite;
        }

        @keyframes floatMic {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes speakPulse {
          0%, 100% { transform: scale(1.04); }
          50% { transform: scale(1.1); }
        }

        /* Listening Concentric Ripples */
        .naksha-wave {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2.5px solid rgba(239, 68, 68, 0.65);
          animation: wavePulse 1.8s cubic-bezier(0, 0.2, 0.8, 1) infinite;
          pointer-events: none;
        }
        .naksha-wave.r2 { animation-delay: 0.55s; }
        .naksha-wave.r3 { animation-delay: 1.1s; }

        @keyframes wavePulse {
          0% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1.75); opacity: 0; }
        }

        /* Speaking Harmonic Ripples */
        .naksha-speaking-wave {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(168, 85, 247, 0.6);
          animation: speakWave 1.6s cubic-bezier(0, 0.2, 0.8, 1) infinite;
          pointer-events: none;
        }
        .naksha-speaking-wave.sw2 { animation-delay: 0.8s; }

        @keyframes speakWave {
          0% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1.65); opacity: 0; }
        }

        /* Thinking Halo */
        .naksha-halo-spin {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: #fde047;
          border-right-color: #38bdf8;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .naksha-mic-listening {
          animation: micBounce 0.9s ease-in-out infinite alternate;
        }
        @keyframes micBounce {
          from { transform: scale(0.94); }
          to { transform: scale(1.12); }
        }
      `}</style>
    </div>
  );
};
