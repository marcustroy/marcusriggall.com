import type { IterationDefinition } from '@/design-notebooks/_harness/types'
import { Content } from './Content'

export type V3cState = {
  step: 'prompt' | 'connected'
}

export const v3c: IterationDefinition<V3cState> = {
  config: {
    label: 'v3c — Contextual',
    summary: 'Actions mapped to tools inline — connect woven into content',
    changes: ['+ inline tool badges', '+ action mapping', '+ contextual connect'],
  },
  defaultState: {
    step: 'prompt',
  },
  presets: [
    { id: 'default', label: 'Default', hint: 'Actions with tool mappings' },
    { id: 'connected', label: 'Connected', hint: 'Tools connected, actions ready' },
  ],
  resolvePreset(id) {
    switch (id) {
      case 'connected': return { step: 'connected' as const }
      default: return { step: 'prompt' as const }
    }
  },
  Content,
}
