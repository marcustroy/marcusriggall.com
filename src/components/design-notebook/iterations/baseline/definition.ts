import type { IterationDefinition } from '@/design-notebooks/_harness/types'
import { Content } from './Content'

export type BaselineState = {
  status: 'default' | 'loading' | 'error'
}

export const baseline: IterationDefinition<BaselineState> = {
  config: {
    label: 'Baseline',
    summary: 'Structured chat response — headers, bullets, bold',
    changes: ['+ chat UI', '+ markdown-style response'],
  },
  defaultState: {
    status: 'default',
  },
  presets: [
    { id: 'default', label: 'Default', hint: 'Plan described in prose' },
    { id: 'loading', label: 'Loading', hint: 'Thinking...' },
    { id: 'error', label: 'Error', hint: 'Failed to plan' },
  ],
  resolvePreset(id) {
    switch (id) {
      case 'loading': return { status: 'loading' as const }
      case 'error': return { status: 'error' as const }
      default: return { status: 'default' as const }
    }
  },
  Content,
}
