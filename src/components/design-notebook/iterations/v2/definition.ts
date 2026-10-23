import type { IterationDefinition } from '@/design-notebooks/_harness/types'
import { Content } from './Content'

export type V2State = {
  status: 'default' | 'loading' | 'error'
  popupState: 'visible' | 'connected' | 'dismissed'
}

export const v2: IterationDefinition<V2State> = {
  config: {
    label: 'v2',
    summary: 'Added integration prompt — connect to act, not just advise',
    changes: ['+ integration pill', '+ connect popup', '− advice-only'],
  },
  defaultState: {
    status: 'default',
    popupState: 'visible',
  },
  presets: [
    { id: 'default', label: 'Default', hint: 'Integration prompt visible' },
    { id: 'connected', label: 'Connected', hint: 'Linear connected, ready to act' },
    { id: 'dismissed', label: 'Dismissed', hint: 'User dismissed the prompt' },
    { id: 'loading', label: 'Loading', hint: 'Thinking...' },
    { id: 'error', label: 'Error', hint: 'Failed to respond' },
  ],
  resolvePreset(id) {
    switch (id) {
      case 'connected': return { status: 'default' as const, popupState: 'connected' as const }
      case 'dismissed': return { status: 'default' as const, popupState: 'dismissed' as const }
      case 'loading': return { status: 'loading' as const, popupState: 'visible' as const }
      case 'error': return { status: 'error' as const, popupState: 'visible' as const }
      default: return { status: 'default' as const, popupState: 'visible' as const }
    }
  },
  Content,
}
