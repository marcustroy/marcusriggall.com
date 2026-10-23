import type { IterationDefinition } from '@/design-notebooks/_harness/types'
import { Content } from './Content'

export type V3aState = {
  selected: number | null
}

export const v3a: IterationDefinition<V3aState> = {
  config: {
    label: 'v3a — Cards',
    summary: 'Integration marketplace — card per tool',
    changes: ['+ integration cards', '+ capability list', '+ connect CTA'],
  },
  defaultState: {
    selected: null,
  },
  presets: [
    { id: 'default', label: 'Default', hint: 'No selection' },
    { id: 'linear', label: 'Linear selected', hint: 'Linear card focused' },
    { id: 'jira', label: 'Jira selected', hint: 'Jira card focused' },
  ],
  resolvePreset(id) {
    switch (id) {
      case 'linear': return { selected: 0 }
      case 'jira': return { selected: 1 }
      default: return { selected: null }
    }
  },
  Content,
}
