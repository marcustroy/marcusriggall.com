import { create } from 'zustand'

export type GenerationStatus = 'idle' | 'generating' | 'complete' | 'error'
export type Version = 1 | 2
export type ViewMode = 'preview' | 'code'
export type MessageCount = 0 | 2 | 3 | 4

export type AgentPhase = 'idle' | 'running' | 'done'

export interface DemoState {
  activePreset: string | null
  generationStatus: GenerationStatus
  version: Version
  viewMode: ViewMode
  messageCount: MessageCount
  agentPhase: AgentPhase
}

export interface DemoActions {
  applyPreset: (preset: string) => void
  setVersion: (v: Version) => void
  setViewMode: (v: ViewMode) => void
  setGenerationStatus: (s: GenerationStatus) => void
  setMessageCount: (c: MessageCount) => void
  setGenerating: () => void
  runAgent: () => void
  autoPlay: () => void
}

export interface Preset {
  id: string
  label: string
  values: Partial<DemoState>
}

export const presets: Preset[] = [
  {
    id: 'latest-v2',
    label: 'Latest',
    values: {
      generationStatus: 'complete',
      version: 2,
      viewMode: 'preview',
      messageCount: 4,
    },
  },
  {
    id: 'past-version',
    label: 'Previous',
    values: {
      generationStatus: 'complete',
      version: 1,
      viewMode: 'preview',
      messageCount: 4,
    },
  },
  {
    id: 'generating',
    label: 'Generating',
    values: {
      generationStatus: 'generating',
      version: 1,
      viewMode: 'preview',
      messageCount: 3,
    },
  },
  {
    id: 'error',
    label: 'Error',
    values: {
      generationStatus: 'error',
      version: 1,
      viewMode: 'preview',
      messageCount: 3,
    },
  },
]

const d = presets[0].values

export const useDemoStore = create<DemoState & DemoActions>((set) => ({
  activePreset: 'latest-v2',
  generationStatus: d.generationStatus!,
  version: d.version!,
  viewMode: d.viewMode!,
  messageCount: d.messageCount!,
  agentPhase: 'idle',

  setVersion: (v) => set({ version: v, activePreset: null }),
  setViewMode: (v) => set({ viewMode: v, activePreset: null }),
  setGenerationStatus: (s) => set({ generationStatus: s, activePreset: null }),
  setMessageCount: (c) => set({ messageCount: c, activePreset: null }),
  setGenerating: () => set({ generationStatus: 'generating', activePreset: null }),

  applyPreset: (presetId) => {
    const preset = presets.find((p) => p.id === presetId)
    if (preset) {
      set((s) => ({ ...s, ...preset.values, activePreset: presetId }))
    }
  },

  runAgent: () => {
    set({ agentPhase: 'running' })
    setTimeout(() => set({ agentPhase: 'done' }), 4500)
  },

  autoPlay: () => {
    const { agentPhase } = useDemoStore.getState()
    if (agentPhase !== 'idle') return
    set({ agentPhase: 'running' })
    setTimeout(() => set({ agentPhase: 'done' }), 4500)
  },
}))
