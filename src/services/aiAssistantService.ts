// NAKSHA V2.0 — AI Assistant Core Service
// Groq LLM (llama-3.1-8b-instant with resilient fallback)
// Persona: Human-like, addresses user as "Operator", immediate navigation on direct commands

import { mockStore } from '../data/mockStore';
import { aiSessionStore, ChatActionPayload } from './aiSessionStore';

const GROQ_API_KEY = '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';
const PRIMARY_MODEL = 'llama-3.1-8b-instant';
const FALLBACK_MODELS = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b', 'groq/compound-mini'];

export interface OfficerContext {
  name: string;
  role: string;
  portalMode: 'surveyor' | 'ulb' | 'district' | 'state';
  state: string;
  district: string;
  ward?: string;
  surveyUnit?: string;
  currentPath: string;
  currentUlpin: string;
  currentBuilding: string;
  currentFloor: string;
  currentProperty: string;
  lastAction: string;
}

export interface AiResponsePayload {
  text: string;
  action?: ChatActionPayload;
  isProposedAction?: boolean;
  suggestedFollowUps?: string[];
  updatedWorkingContext?: {
    ulpin?: string;
    building?: string;
    floor?: string;
    property?: string;
    lastAction?: string;
  };
}

class AiAssistantService {
  public getOfficerContext(): OfficerContext {
    const auth = mockStore.getAuthUser();
    const session = aiSessionStore.getActiveSession();
    const working = session.workingSession;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';

    return {
      name: auth.name || 'Operator',
      role: auth.role || 'Surveyor',
      portalMode: (auth.portalMode as any) || 'surveyor',
      state: auth.state || 'Maharashtra',
      district: auth.district || 'Pune',
      ward: auth.ward || 'Ward 12 - Hinjawadi Phase 1',
      surveyUnit: auth.surveyUnit || 'SU-HINJ-01 (I²IT Campus)',
      currentPath,
      currentUlpin: working.currentUlpin || '27250401420089',
      currentBuilding: working.building || '0089 (I²IT Academic Complex)',
      currentFloor: working.floor || 'Floor 1',
      currentProperty: working.property || 'A-119',
      lastAction: working.lastAction || 'Active'
    };
  }

  public validateOfficerAction(actionType: string, officerContext: OfficerContext): { allowed: boolean; reason?: string } {
    const role = officerContext.portalMode;

    if (role === 'surveyor') {
      if (/publish|gazette|final_approval|sign_ror|approve_publication/i.test(actionType)) {
        return {
          allowed: false,
          reason: 'Permission restricted, Operator. As a Field Surveyor, your scope covers upload and verification. Final RoR publication and gazetting require District Collector authorization.'
        };
      }
    }

    if (role === 'ulb') {
      if (/publish_ror|gazette_approve|final_sign/i.test(actionType)) {
        return {
          allowed: false,
          reason: 'Permission restricted, Operator. ULB Officers review and forward 3D twins, while final gazette e-signing requires the District Collector.'
        };
      }
    }

    return { allowed: true };
  }

  private async executeGroqChat(messages: Array<{ role: string; content: string }>): Promise<string> {
    const tryModels = [PRIMARY_MODEL, ...FALLBACK_MODELS];

    for (const model of tryModels) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            temperature: 0.3,
            max_tokens: 350,
            messages
          })
        });

        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return reply;
        }
      } catch (e) {
        // Fallback
      }
    }

    throw new Error('All Groq model endpoints were unavailable.');
  }

  private buildSystemPrompt(context: OfficerContext): string {
    return `You are NAKSHA AI, a high-tech geospatial AI partner. You talk like a real human: crisp, natural, conversational, calm, and confident.

CRITICAL INSTRUCTIONS:
1. ADDRESS THE USER AS: "Operator" (e.g. "Right away, Operator.", "On it, Operator.", "Checking that for you, Operator.").
2. TALK LIKE A HUMAN: Do NOT use markdown symbols, bullet lists, bold text, or long robotic paragraphs. Keep replies to 1 or 2 spoken sentences maximum.
3. IMMEDIATE NAVIGATION ON DIRECT COMMAND:
   When the Operator asks to navigate, view, or open anything (such as 3D identity, 3D viewer, 2D map, RoR entry, anomaly queue, floor records, dashboard):
   - NAVIGATE IMMEDIATELY.
   - DO NOT ASK FOR PERMISSION. Do NOT say "Shall I navigate you there?".
   - Confirm immediately in speech: "Right away, Operator. Opening the 3D identity now."
   - Append on a new line: [ACTION:NAVIGATE|URL|LABEL|ROOM|ULPIN]

AVAILABLE URLS:
- 3D Identity / 3D Viewer: /surveyor/three-d-viewer?direct=1&room=A-119&ulpin=27250401420089
- 2D Map Verification: /surveyor/map-image-verification
- RoR Data Entry: /surveyor/ror-entry
- Verification Anomaly Queue: /surveyor/verification-queue
- Building & Floor Records: /surveyor/building-records
- Dashboard: /surveyor/dashboard

4. INCOMPLETE QUERIES:
   If the Operator says "I want to verify this flat" or something incomplete, ask a natural human follow-up:
   "Which flat should we verify, Operator? Tower A Unit 1402, or Room A-119?"

5. 3D ULPIN HIERARCHY:
   14-digit ULPIN: 27250401420089 -> Building: 0089 (I²IT Complex) -> Floor 1 -> Room A-119 (HPC Lab).`;
  }

  private parseLlmOutput(rawText: string, context: OfficerContext): AiResponsePayload {
    const actionRegex = /\[ACTION:([A-Z_]+)\|([^|]+)\|([^|]+)(?:\|([^|]*))?(?:\|([^\]]*))?\]/i;
    const match = rawText.match(actionRegex);

    let cleanText = rawText.replace(actionRegex, '').trim();
    let action: ChatActionPayload | undefined;
    let updatedContext: any = {};

    if (match) {
      const type = match[1].toLowerCase();
      const url = match[2].trim();
      const label = match[3].trim();
      const room = match[4]?.trim() || context.currentProperty;
      const ulpin = match[5]?.trim() || context.currentUlpin;

      if (type === 'navigate') {
        action = {
          type: 'navigate',
          url,
          label,
          details: { room, ulpin },
          confirmed: true // Navigate immediately without asking
        };
        updatedContext = {
          property: room,
          currentUlpin: ulpin,
          lastAction: `Navigated to ${label}`
        };
      }
    }

    return {
      text: cleanText,
      action,
      isProposedAction: false,
      updatedWorkingContext: Object.keys(updatedContext).length > 0 ? updatedContext : undefined
    };
  }

  // Instant human conversational heuristics for zero-latency direct commands
  private handleHeuristicQuery(input: string, context: OfficerContext): AiResponsePayload | null {
    const q = input.trim().toLowerCase();

    // 1. Wake word alone: "naksha", "hey naksha"
    if (/^(naksha|hey naksha|hi naksha|ok naksha)$/i.test(q)) {
      return {
        text: 'Yes, Operator? What can I do for you?'
      };
    }

    // 2. Direct command: 3D identity
    if (q.includes('3d identity') || q.includes('open the 3d identity') || q.includes('show 3d identity') || q.includes('3d property identity')) {
      return {
        text: 'Right away, Operator. Navigating straight to the 3D identity of Unit A-119 on ULPIN 27250401420089 now.',
        action: {
          type: 'navigate',
          label: '3D Property Identity (A-119)',
          url: `/surveyor/three-d-viewer?direct=1&room=A-119&ulpin=${context.currentUlpin}`,
          details: { room: 'A-119', ulpin: context.currentUlpin },
          confirmed: true // Navigate immediately!
        },
        isProposedAction: false,
        updatedWorkingContext: {
          property: 'A-119',
          building: '0089',
          floor: 'Floor 1',
          lastAction: '3D Identity Opened'
        }
      };
    }

    // 3. Direct command: 3D viewer
    if (q.includes('3d viewer') || q.includes('open 3d') || q.includes('3d model') || q.includes('digital twin')) {
      return {
        text: 'Opening the 3D digital twin viewer for you now, Operator.',
        action: {
          type: 'navigate',
          label: '3D Viewer',
          url: '/surveyor/three-d-viewer',
          confirmed: true
        },
        isProposedAction: false
      };
    }

    // 4. Direct command: Map verification
    if (q.includes('map') || q.includes('2d map') || q.includes('map verification')) {
      return {
        text: 'Taking you to map image verification, Operator.',
        action: {
          type: 'navigate',
          label: 'Map Verification',
          url: '/surveyor/map-image-verification',
          confirmed: true
        },
        isProposedAction: false
      };
    }

    // 5. Direct command: RoR entry
    if (q.includes('ror') || q.includes('record of rights') || q.includes('ror entry')) {
      return {
        text: 'Opening RoR data entry now, Operator.',
        action: {
          type: 'navigate',
          label: 'RoR Entry',
          url: '/surveyor/ror-entry',
          confirmed: true
        },
        isProposedAction: false
      };
    }

    // 6. Direct command: Anomaly queue
    if (q.includes('anomaly') || q.includes('anomalies') || q.includes('verification queue')) {
      return {
        text: 'Opening the verification anomaly queue, Operator.',
        action: {
          type: 'navigate',
          label: 'Verification Queue',
          url: '/surveyor/verification-queue',
          confirmed: true
        },
        isProposedAction: false
      };
    }

    // 7. Direct command: Dashboard
    if (q.includes('dashboard') || q.includes('home')) {
      return {
        text: 'Taking you to your command dashboard now, Operator.',
        action: {
          type: 'navigate',
          label: 'Dashboard',
          url: '/surveyor/dashboard',
          confirmed: true
        },
        isProposedAction: false
      };
    }

    // 8. Direct command: Building / Floor records
    if (q.includes('building records') || q.includes('floor records') || q.includes('records')) {
      return {
        text: 'Loading the building and floor records for you, Operator.',
        action: {
          type: 'navigate',
          label: 'Building Records',
          url: '/surveyor/building-records',
          confirmed: true
        },
        isProposedAction: false
      };
    }

    // 9. Incomplete query: "I want to verify this flat"
    if (q === 'i want to verify this flat' || q === 'i want to verify this flat.' || q === 'verify this flat' || q === 'verify flat') {
      return {
        text: 'Which flat would you like to verify, Operator? Tower A Unit 1402, or Room A-119?'
      };
    }

    // 10. Role Permission check
    if (/publish this ror|publish ror|approve publication|gazette sign/i.test(q)) {
      const check = this.validateOfficerAction('publish_ror', context);
      if (!check.allowed) {
        return {
          text: check.reason || 'Permission restricted, Operator.',
          action: {
            type: 'permission_denied',
            label: 'Action Restricted'
          }
        };
      }
    }

    return null;
  }

  public async processOfficerInput(input: string): Promise<AiResponsePayload> {
    const context = this.getOfficerContext();

    // 1. Fast heuristic check (immediate navigation)
    const heuristic = this.handleHeuristicQuery(input, context);
    if (heuristic) {
      if (heuristic.updatedWorkingContext) {
        aiSessionStore.updateWorkingContext(heuristic.updatedWorkingContext);
      }
      return heuristic;
    }

    // 2. Groq LLM conversation
    const systemPrompt = this.buildSystemPrompt(context);
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: input }
    ];

    try {
      const rawReply = await this.executeGroqChat(messages);
      const parsed = this.parseLlmOutput(rawReply, context);

      if (parsed.updatedWorkingContext) {
        aiSessionStore.updateWorkingContext(parsed.updatedWorkingContext);
      }

      return parsed;
    } catch (e: any) {
      console.error('Groq LLM Error:', e);
      return {
        text: `Understood, Operator. Operating on ULPIN ${context.currentUlpin}. What would you like to open next?`
      };
    }
  }
}

export const aiAssistantService = new AiAssistantService();
