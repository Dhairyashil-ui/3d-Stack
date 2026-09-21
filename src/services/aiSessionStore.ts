// NAKSHA V2.0 — AI Session Memory Store
// Step 5: Session Memory (Current ULPIN, Building, Floor, Property, Last Action, Recent Conversation)
// Retention Policy: Enforces configured limit of max 50 sessions & 30-day auto-purge

export interface WorkingSessionState {
  currentUlpin: string;
  building: string;
  floor: string;
  property: string;
  lastAction: string;
  updatedAt: number;
}

export interface ChatActionPayload {
  type: 'navigate' | 'verify' | 'permission_denied' | 'inspect';
  label: string;
  url?: string;
  details?: Record<string, any>;
  confirmed?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'officer' | 'assistant' | 'system';
  text: string;
  timestamp: number;
  action?: ChatActionPayload;
  isProposedAction?: boolean; // Step 4: "Shall I navigate you there?"
  suggestedFollowUps?: string[];
}

export interface AiSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  workingSession: WorkingSessionState;
  messages: ChatMessage[];
}

const STORAGE_KEYS = {
  ACTIVE_SESSION_ID: 'naksha_ai_active_session_id',
  SESSIONS_LIST: 'naksha_ai_sessions_archive',
  WORKING_CONTEXT: 'naksha_ai_working_context'
};

const MAX_SESSIONS = 50;
const MAX_RETENTION_MS = 30 * 24 * 60 * 60 * 1000; // 30 Days

export const DEFAULT_WORKING_CONTEXT: WorkingSessionState = {
  currentUlpin: '27250401420089',
  building: '0089 (I²IT Complex)',
  floor: 'Floor 1',
  property: 'A-119',
  lastAction: 'System Login Ready',
  updatedAt: Date.now()
};

class AiSessionStore {
  private activeSession: AiSession | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.pruneOldSessions();
    this.loadOrCreateActiveSession();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // Retention: Delete old chats after 50 sessions / 30 days
  public pruneOldSessions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS_LIST);
      if (!raw) return;

      const sessions: AiSession[] = JSON.parse(raw);
      const now = Date.now();

      // 1. Remove sessions older than 30 days
      let valid = sessions.filter(s => (now - (s.updatedAt || s.createdAt)) < MAX_RETENTION_MS);

      // 2. Limit to max 50 sessions (keep most recently updated)
      if (valid.length > MAX_SESSIONS) {
        valid.sort((a, b) => b.updatedAt - a.updatedAt);
        valid = valid.slice(0, MAX_SESSIONS);
      }

      localStorage.setItem(STORAGE_KEYS.SESSIONS_LIST, JSON.stringify(valid));
    } catch (e) {
      console.warn('Session pruning failed:', e);
    }
  }

  private loadOrCreateActiveSession(): AiSession {
    try {
      const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
      const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS_LIST);
      const sessions: AiSession[] = raw ? JSON.parse(raw) : [];

      if (activeId) {
        const found = sessions.find(s => s.id === activeId);
        if (found) {
          this.activeSession = found;
          return found;
        }
      }

      // Create initial fresh session
      const newSession: AiSession = {
        id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: 'NAKSHA Land Cadastre Session',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        workingSession: { ...DEFAULT_WORKING_CONTEXT, updatedAt: Date.now() },
        messages: [
          {
            id: `msg-welcome`,
            sender: 'assistant',
            text: 'Greetings, Officer. I am your NAKSHA Geospatial AI Assistant. I have active contextual awareness of this survey area, building units, and official 14-digit ULPINs.\n\nHow may I assist you today?',
            timestamp: Date.now(),
            suggestedFollowUps: [
              'Open the 3D identity of this property',
              'I want to verify this flat',
              'Check pending anomalies',
              'Navigate to 3D Viewer'
            ]
          }
        ]
      };

      sessions.unshift(newSession);
      localStorage.setItem(STORAGE_KEYS.SESSIONS_LIST, JSON.stringify(sessions));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION_ID, newSession.id);
      this.activeSession = newSession;
      return newSession;
    } catch (e) {
      console.warn('Load session error:', e);
      const fallback: AiSession = {
        id: `sess-${Date.now()}`,
        title: 'NAKSHA Land Cadastre Session',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        workingSession: { ...DEFAULT_WORKING_CONTEXT },
        messages: []
      };
      this.activeSession = fallback;
      return fallback;
    }
  }

  public getActiveSession(): AiSession {
    if (!this.activeSession) {
      return this.loadOrCreateActiveSession();
    }
    return this.activeSession;
  }

  public saveActiveSession(session: AiSession) {
    this.activeSession = session;
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION_ID, session.id);
      const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS_LIST);
      let sessions: AiSession[] = raw ? JSON.parse(raw) : [];

      const index = sessions.findIndex(s => s.id === session.id);
      if (index >= 0) {
        sessions[index] = session;
      } else {
        sessions.unshift(session);
      }

      // Enforce 50 max sessions
      if (sessions.length > MAX_SESSIONS) {
        sessions = sessions.slice(0, MAX_SESSIONS);
      }

      localStorage.setItem(STORAGE_KEYS.SESSIONS_LIST, JSON.stringify(sessions));
      this.notify();
    } catch (e) {
      console.warn('Failed to save session:', e);
    }
  }

  // Update working context (ULPIN, building, floor, property, last action)
  public updateWorkingContext(partial: Partial<WorkingSessionState>) {
    const session = this.getActiveSession();
    session.workingSession = {
      ...session.workingSession,
      ...partial,
      updatedAt: Date.now()
    };
    session.updatedAt = Date.now();
    this.saveActiveSession(session);
  }

  public addMessage(msg: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    const session = this.getActiveSession();
    const newMessage: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now()
    };

    // Keep recent conversation manageable (last 40 messages per session)
    session.messages.push(newMessage);
    if (session.messages.length > 40) {
      session.messages = session.messages.slice(-40);
    }
    session.updatedAt = Date.now();
    this.saveActiveSession(session);
    return newMessage;
  }

  public updateMessage(msgId: string, partial: Partial<ChatMessage>) {
    const session = this.getActiveSession();
    const index = session.messages.findIndex(m => m.id === msgId);
    if (index >= 0) {
      session.messages[index] = {
        ...session.messages[index],
        ...partial
      };
      session.updatedAt = Date.now();
      this.saveActiveSession(session);
    }
  }

  // Reset conversation in current session
  public clearCurrentSession(): void {
    const session = this.getActiveSession();
    session.messages = [
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Session reset. Context refreshed to default working state.',
        timestamp: Date.now(),
        suggestedFollowUps: [
          'Open the 3D identity of this property',
          'Check pending anomalies',
          'Navigate to 3D Viewer'
        ]
      }
    ];
    session.updatedAt = Date.now();
    this.saveActiveSession(session);
  }
}

export const aiSessionStore = new AiSessionStore();
